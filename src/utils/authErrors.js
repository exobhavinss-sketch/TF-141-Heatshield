/**
 * HeatShield (TF-141) — Supabase Auth Error Mapper
 * Maps raw backend/GoTrue error objects and messages into clear, user-friendly guidance.
 */

export function mapAuthError(err) {
  if (!err) return '';

  const message = typeof err === 'string' ? err : (err.message || '');
  const status = err.status || err.code;
  const lowerMsg = message.toLowerCase();

  // 1. Email Rate Limit Exceeded
  if (
    status === 429 ||
    status === 'over_email_send_rate_limit' ||
    lowerMsg.includes('rate limit') ||
    lowerMsg.includes('over_email_send_rate_limit') ||
    lowerMsg.includes('too many requests')
  ) {
    return 'Email rate limit exceeded. Supabase has temporarily restricted outgoing verification emails. Please wait a few minutes before trying again.';
  }

  // 2. User Already Registered / Existing Account
  if (
    lowerMsg.includes('user already registered') ||
    lowerMsg.includes('already registered') ||
    lowerMsg.includes('already exists') ||
    lowerMsg.includes('identity already exists')
  ) {
    return 'An account with this email address already exists. Please sign in instead, or request a password reset if you forgot your credentials.';
  }

  // 3. Invalid Email Format
  if (
    lowerMsg.includes('invalid email') ||
    lowerMsg.includes('email address is invalid') ||
    lowerMsg.includes('unable to validate email') ||
    lowerMsg.includes('invalid format')
  ) {
    return 'Please enter a valid institutional or research email address (e.g. researcher@mitvpu.ac.in).';
  }

  // 4. Weak Password
  if (
    lowerMsg.includes('password should be at least') ||
    lowerMsg.includes('weak password') ||
    lowerMsg.includes('password is too weak') ||
    lowerMsg.includes('pwned')
  ) {
    return 'Password is too weak. Please use at least 8 characters with a mix of letters and numbers.';
  }

  // 5. Invalid Login Credentials
  if (lowerMsg.includes('invalid login credentials') || lowerMsg.includes('invalid credentials')) {
    return 'Invalid email or password. Please verify your credentials or reset your password.';
  }

  // 6. Email Not Confirmed
  if (lowerMsg.includes('email not confirmed')) {
    return 'Your email address has not been confirmed yet. Please check your inbox for the verification link.';
  }

  // 7. Network / Connection Errors
  if (
    lowerMsg.includes('failed to fetch') ||
    lowerMsg.includes('network') ||
    lowerMsg.includes('offline') ||
    lowerMsg.includes('fetch failed') ||
    lowerMsg.includes('timeout')
  ) {
    return 'Unable to connect to the authentication server. Please check your network connection and verify Supabase is reachable.';
  }

  // 8. Expired OTP / Link
  if (
    lowerMsg.includes('otp_expired') ||
    lowerMsg.includes('token has expired') ||
    lowerMsg.includes('link is invalid or has expired')
  ) {
    return 'This verification link has expired or has already been used. Please request a new confirmation email.';
  }

  // 9. Signups Disabled
  if (lowerMsg.includes('signup is disabled') || lowerMsg.includes('signups not allowed')) {
    return 'New researcher registration is temporarily restricted by project administration.';
  }

  // Fallback to original message if reasonably readable, or friendly generic message
  return message || 'An unexpected authentication error occurred. Please try again.';
}
