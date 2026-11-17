import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { NavLink } from 'react-router-dom';

/**
 * MagneticNav — dependency-free magnetic dock interaction for text-only
 * navigation links.
 *
 * Inspired by the Componentry `magnetic-dock` registry component's
 * interaction model (container-level pointer tracking, per-item distance
 * falloff, scale curve and spring physics), reimplemented here with
 * requestAnimationFrame and direct `transform` writes so no extra
 * dependency (framer-motion) is required.
 *
 * Behaviour:
 * - Container tracks the horizontal pointer position; each link computes
 *   its distance to the cursor and derives a smoothstep influence curve.
 * - Influence drives: subtle horizontal attraction, a tiny vertical lift
 *   and a slight scale increase (closest item reacts the most; neighbours
 *   react less, producing a connected dock-like feel).
 * - Values are integrated with a near-critically damped spring so motion
 *   is fluid and never bouncy.
 * - Transform-only animation: no layout, width or height changes, so no
 *   reflow, no layout shift and no horizontal overflow.
 * - Desktop only (hover-capable device with a fine pointer). Touch
 *   devices, coarse pointers and `prefers-reduced-motion: reduce` are
 *   fully disabled and fall back to the original static links.
 * - Zero React re-renders during interaction: all motion happens through
 *   refs and direct style writes on a single rAF loop that stops as soon
 *   as every spring has settled.
 */

// Tuned to mirror the reference component's spring feel
// (damping: 20, stiffness: 300, mass: 0.5) without overshoot.
const SPRING_STIFFNESS = 260;
const SPRING_DAMPING = 24;

const MAGNETIC_RADIUS = 110; // px of cursor influence around each item
const MAX_SCALE = 1.12; // scale directly under the cursor (subtle)
const MAX_SHIFT = 5; // px of horizontal attraction (controlled)
const MAX_LIFT = 2.5; // px of vertical lift at full influence

const SETTLE_EPSILON_PX = 0.05;
const SETTLE_EPSILON_SCALE = 0.0005;
const SETTLE_EPSILON_VEL = 0.05;

const MagneticContext = createContext(null);

/** True when the device has a hover-capable fine pointer and the user has not requested reduced motion. */
function useMagneticCapable() {
  const [capable, setCapable] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return undefined;
    }
    const fineHover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const update = () => setCapable(fineHover.matches && !reducedMotion.matches);
    update();

    const onChange = () => update();
    if (fineHover.addEventListener) fineHover.addEventListener('change', onChange);
    if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', onChange);

    return () => {
      if (fineHover.removeEventListener) fineHover.removeEventListener('change', onChange);
      if (reducedMotion.removeEventListener) reducedMotion.removeEventListener('change', onChange);
    };
  }, []);

  return capable;
}

/** Smoothstep easing: 0 outside the radius, 1 at the item's centre. */
function influenceCurve(edgeDistance, radius) {
  const t = 1 - edgeDistance / radius;
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return t * t * (3 - 2 * t);
}

/**
 * Magnetic wrapper around the existing `<nav>` element. Renders a plain
 * <nav> with the exact same className — appearance is untouched.
 */
export function MagneticNav({ className, children, ...rest }) {
  const capable = useMagneticCapable();
  const capableRef = useRef(capable);
  capableRef.current = capable;

  const itemsRef = useRef(new Map()); // state objects keyed by identity
  const pointerXRef = useRef(Infinity); // Infinity = no active pointer
  const rafRef = useRef(0);
  const runningRef = useRef(false);
  const lastTimeRef = useRef(0);

  const resetItem = useCallback((state) => {
    state.x = 0;
    state.y = 0;
    state.s = 1;
    state.vx = 0;
    state.vy = 0;
    state.vs = 0;
    if (state.el) {
      state.el.style.transform = '';
      state.el.style.willChange = '';
    }
  }, []);

  const stopLoop = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    runningRef.current = false;
  }, []);

  /** Single rAF loop: read layout once per frame, then write transforms. */
  const step = useCallback(
    (time) => {
      const dt = Math.min(Math.max((time - lastTimeRef.current) / 1000, 0.001), 0.032);
      lastTimeRef.current = time;

      const items = itemsRef.current;
      const pointerX = pointerXRef.current;
      const hasPointer = pointerX !== Infinity;

      // Phase 1 — batch all layout reads before any writes.
      const measured = [];
      items.forEach((state) => {
        measured.push([state, state.el.getBoundingClientRect()]);
      });

      // Phase 2 — integrate springs and write transforms.
      let settled = true;

      measured.forEach(([state, rect]) => {
        const width = rect.width / state.s || 1;
        // getBoundingClientRect includes the applied translate/scale;
        // undo the horizontal shift so the base centre never drifts.
        const centerX = rect.left + rect.width / 2 - state.x;
        const dx = hasPointer ? pointerX - centerX : 0;

        // Influence: 0 far away, 1 while the cursor is within the item
        // bounds, smoothstep falloff between — neighbours react subtly.
        const edgeDistance = Math.max(0, Math.abs(dx) - width / 2);
        const influence = hasPointer ? influenceCurve(edgeDistance, MAGNETIC_RADIUS) : 0;

        const targetX = Math.max(-MAX_SHIFT * 2, Math.min(MAX_SHIFT * 2, dx * 0.2)) * influence;
        const targetY = -MAX_LIFT * influence;
        const targetS = 1 + (MAX_SCALE - 1) * influence;

        // Near-critically damped spring integration (smooth, no bounce).
        const ax = (targetX - state.x) * SPRING_STIFFNESS - state.vx * SPRING_DAMPING;
        state.vx += ax * dt;
        state.x += state.vx * dt;

        const ay = (targetY - state.y) * SPRING_STIFFNESS - state.vy * SPRING_DAMPING;
        state.vy += ay * dt;
        state.y += state.vy * dt;

        const as = (targetS - state.s) * SPRING_STIFFNESS - state.vs * SPRING_DAMPING;
        state.vs += as * dt;
        state.s += state.vs * dt;

        const settledNow =
          Math.abs(targetX - state.x) < SETTLE_EPSILON_PX &&
          Math.abs(targetY - state.y) < SETTLE_EPSILON_PX &&
          Math.abs(targetS - state.s) < SETTLE_EPSILON_SCALE &&
          Math.abs(state.vx) < SETTLE_EPSILON_VEL &&
          Math.abs(state.vy) < SETTLE_EPSILON_VEL &&
          Math.abs(state.vs) < SETTLE_EPSILON_VEL;

        if (!settledNow) {
          settled = false;
          state.el.style.willChange = 'transform';
          state.el.style.transform =
            `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, 0) ` +
            `scale(${state.s.toFixed(4)})`;
        }
      });

      if (settled) {
        // Park or clear each item.
        items.forEach((state) => {
          if (!hasPointer) {
            resetItem(state);
            return;
          }
          // Recompute the settled target once more for a deterministic park.
          const rectNow = state.el.getBoundingClientRect();
          const width = rectNow.width / state.s || 1;
          const centerX = rectNow.left + rectNow.width / 2 - state.x;
          const dx = pointerX - centerX;
          const edgeDistance = Math.max(0, Math.abs(dx) - width / 2);
          const influence = influenceCurve(edgeDistance, MAGNETIC_RADIUS);
          const targetX = Math.max(-MAX_SHIFT * 2, Math.min(MAX_SHIFT * 2, dx * 0.2)) * influence;
          const targetY = -MAX_LIFT * influence;
          const targetS = 1 + (MAX_SCALE - 1) * influence;

          state.x = targetX;
          state.y = targetY;
          state.s = targetS;
          state.vx = 0;
          state.vy = 0;
          state.vs = 0;
          state.el.style.willChange = '';
          state.el.style.transform =
            `translate3d(${targetX.toFixed(2)}px, ${targetY.toFixed(2)}px, 0) ` +
            `scale(${targetS.toFixed(4)})`;
        });
        stopLoop();
        return;
      }

      rafRef.current = requestAnimationFrame(step);
    },
    [resetItem, stopLoop]
  );

  const ensureLoop = useCallback(() => {
    if (!capableRef.current || runningRef.current || itemsRef.current.size === 0) return;
    runningRef.current = true;
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(step);
  }, [step]);

  const handlePointerMove = useCallback(
    (event) => {
      if (!capableRef.current) return;
      // Touch/scroll-generated pointer events never drive the effect.
      if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') {
        return;
      }
      pointerXRef.current = event.clientX;
      ensureLoop();
    },
    [ensureLoop]
  );

  const handlePointerLeave = useCallback(() => {
    pointerXRef.current = Infinity;
    ensureLoop(); // animate everything back to rest, then the loop stops
  }, [ensureLoop]);

  // Cleanup on unmount: stop the loop and release inline styles.
  useEffect(() => {
    return () => {
      stopLoop();
      itemsRef.current.forEach((state) => {
        if (state.el) {
          state.el.style.transform = '';
          state.el.style.willChange = '';
        }
      });
      itemsRef.current.clear();
    };
  }, [stopLoop]);

  const register = useCallback((state) => {
    itemsRef.current.set(state, state);
  }, []);

  const unregister = useCallback(
    (state) => {
      itemsRef.current.delete(state);
      resetItem(state);
    },
    [resetItem]
  );

  const contextValue = useMemo(
    () => ({ enabled: capable, register, unregister }),
    [capable, register, unregister]
  );

  return (
    <nav
      className={className}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerCancel={handlePointerLeave}
      {...rest}
    >
      <MagneticContext.Provider value={contextValue}>{children}</MagneticContext.Provider>
    </nav>
  );
}

/**
 * Drop-in replacement for `NavLink` inside `MagneticNav`. Renders the
 * exact same link (same className API, same ref behaviour); when the
 * magnetic effect is active it registers itself with the container and
 * receives transform-driven motion. When inactive it is a plain NavLink.
 */
export function MagneticNavLink(props) {
  const context = useContext(MagneticContext);
  const linkRef = useRef(null);

  useEffect(() => {
    const el = linkRef.current;
    if (!context || !context.enabled || !el) return undefined;

    const state = { el, x: 0, y: 0, s: 1, vx: 0, vy: 0, vs: 0 };
    context.register(state);
    return () => context.unregister(state);
  }, [context]);

  return <NavLink ref={linkRef} {...props} />;
}
