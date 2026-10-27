import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured, getSupabaseConfigStatus } from '../services/supabaseClient';
import { getAuthRedirectUrl } from '../utils/authRedirect';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [configStatus, setConfigStatus] = useState(getSupabaseConfigStatus());

  // Helper to load user profile and settings from database
  const loadUserData = useCallback(async (userId) => {
    if (!supabase || !userId) return;

    try {
      const [profileResult, settingsResult] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase.from('user_settings').select('*').eq('user_id', userId).maybeSingle(),
      ]);

      if (!profileResult.error && profileResult.data) {
        setProfile(profileResult.data);
      }

      if (!settingsResult.error && settingsResult.data) {
        setSettings(settingsResult.data);
      }
    } catch (err) {
      console.warn('[HeatShield Auth] Failed to load auxiliary user data:', err.message);
    }
  }, []);

  // Initialize Auth state listener
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (!isMounted) return;

      setSession(currentSession);
      setUser(currentSession?.user || null);

      if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        const userId = currentSession?.user?.id;
        if (userId) window.setTimeout(() => {
          if (isMounted) void loadUserData(userId);
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        setSettings(null);
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [loadUserData]);

  /**
   * User Registration with Full Name metadata and Email Confirmation
   */
  const signUp = async ({ email, password, fullName }) => {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase is not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to your .env file.');
    }

    const emailRedirectTo = getAuthRedirectUrl('/auth/callback');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
        emailRedirectTo,
      },
    });

    if (error) throw error;
    return data;
  };

  /**
   * Resend Verification Email with Cooldown Support
   */
  const resendVerificationEmail = async (email) => {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase is not configured. Please check your .env settings.');
    }

    const emailRedirectTo = getAuthRedirectUrl('/auth/callback');

    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim(),
      options: {
        emailRedirectTo,
      },
    });

    if (error) throw error;
    return data;
  };

  /**
   * User Login with Email & Password
   */
  const signIn = async ({ email, password }) => {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase is not configured. Please check your .env settings.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  /**
   * User Logout
   */
  const signOut = async () => {
    if (!isSupabaseConfigured() || !supabase) {
      setUser(null);
      setSession(null);
      setProfile(null);
      setSettings(null);
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    setUser(null);
    setSession(null);
    setProfile(null);
    setSettings(null);
  };

  /**
   * Password Recovery Request
   */
  const resetPasswordForEmail = async (email) => {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase is not configured.');
    }

    const redirectTo = getAuthRedirectUrl('/reset-password');

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) throw error;
    return data;
  };

  /**
   * Update Password after recovery session established
   */
  const updatePassword = async (newPassword) => {
    if (!isSupabaseConfigured() || !supabase) {
      throw new Error('Supabase is not configured.');
    }

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return data;
  };

  /**
   * Update Profile data
   */
  const updateProfile = async (updates) => {
    if (!isSupabaseConfigured() || !supabase || !user) {
      throw new Error('User not authenticated or database not configured.');
    }

    const editableFields = ['full_name', 'avatar_url', 'affiliation'];
    const safeUpdates = Object.fromEntries(
      Object.entries(updates || {}).filter(([field]) => editableFields.includes(field))
    );
    if (Object.keys(safeUpdates).length === 0) {
      throw new Error('No editable profile fields were provided.');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(safeUpdates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) throw error;
    setProfile(data);
    return data;
  };

  /**
   * Update User Settings
   */
  const updateSettings = async (updates) => {
    if (!isSupabaseConfigured() || !supabase || !user) {
      throw new Error('User not authenticated or database not configured.');
    }

    const { data, error } = await supabase
      .from('user_settings')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    setSettings(data);
    return data;
  };

  const value = {
    user,
    session,
    profile,
    settings,
    loading,
    isConfigured: isSupabaseConfigured(),
    configStatus,
    signUp,
    signIn,
    signOut,
    resendVerificationEmail,
    resetPasswordForEmail,
    updatePassword,
    updateProfile,
    updateSettings,
    refreshUserData: () => (user ? loadUserData(user.id) : Promise.resolve()),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
