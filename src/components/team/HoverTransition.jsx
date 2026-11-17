import React, { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * HoverTransition — JSX adaptation of the Componentry "Hover Transition"
 * registry component (componentry.dev/r/hover-transition), ported from the
 * original TypeScript for this JavaScript (JSX) project.
 *
 * Adaptations for text-heavy team cards:
 *  - The default and hover layers are stacked in the SAME CSS grid cell
 *    (`grid-area: 1 / 1`) instead of absolutely positioned overlays, so the
 *    card always sizes to the tallest layer. Card dimensions therefore never
 *    change on hover and sibling cards keep equal heights in the grid.
 *  - Touch devices toggle the reveal on tap (pointer-type gated so mouse
 *    clicks don't toggle), keyboard users get focus/blur + Enter/Space, and
 *    `prefers-reduced-motion` collapses every effect to a plain cross-fade.
 *  - Exactly one layer is exposed to assistive tech at a time via aria-hidden.
 */

export const HOVER_TRANSITION_EFFECTS = [
  'wipe',
  'slide',
  'ripple',
  'curtain',
  'parallax',
  'strips',
  'morph',
  'diagonal',
];

export const HOVER_TRANSITION_DIRECTIONS = [
  'top',
  'right',
  'bottom',
  'left',
  'top-left',
  'top-right',
  'bottom-right',
  'bottom-left',
  'center',
];

const DIRECTION_VECTORS = {
  top: [0, -1],
  right: [1, 0],
  bottom: [0, 1],
  left: [-1, 0],
  'top-left': [-1, -1],
  'top-right': [1, -1],
  'bottom-right': [1, 1],
  'bottom-left': [-1, 1],
  center: [0, 0],
};

const RIPPLE_ORIGINS = {
  top: '50% 0%',
  right: '100% 50%',
  bottom: '50% 100%',
  left: '0% 50%',
  'top-left': '0% 0%',
  'top-right': '100% 0%',
  'bottom-right': '100% 100%',
  'bottom-left': '0% 100%',
  center: '50% 50%',
};

/* Fully-hidden clip-path inset anchored to the entering edge, plus the
   matching content slide offset for the wipe effect. */
function wipeHidden(direction) {
  switch (direction) {
    case 'top':
      return { clipPath: 'inset(0% 0% 100% 0%)', shift: 'translateY(-30%)' };
    case 'bottom':
      return { clipPath: 'inset(100% 0% 0% 0%)', shift: 'translateY(30%)' };
    case 'left':
      return { clipPath: 'inset(0% 100% 0% 0%)', shift: 'translateX(-30%)' };
    case 'right':
      return { clipPath: 'inset(0% 0% 0% 100%)', shift: 'translateX(30%)' };
    case 'top-left':
      return { clipPath: 'inset(0% 100% 100% 0%)', shift: 'translate(-30%, -30%)' };
    case 'top-right':
      return { clipPath: 'inset(0% 0% 100% 100%)', shift: 'translate(30%, -30%)' };
    case 'bottom-right':
      return { clipPath: 'inset(100% 0% 0% 100%)', shift: 'translate(30%, 30%)' };
    case 'bottom-left':
      return { clipPath: 'inset(100% 100% 0% 0%)', shift: 'translate(-30%, 30%)' };
    default:
      return { clipPath: 'inset(50% 0% 50% 0%)', shift: 'translateY(12%)' };
  }
}

/* Diagonal sweep: all four polygon vertices collapse onto the anchor corner. */
const DIAGONAL_VISIBLE = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)';

function diagonalHidden(direction) {
  const anchors = {
    top: '50% 0%',
    bottom: '50% 100%',
    left: '0% 50%',
    right: '100% 50%',
    'top-left': '0% 0%',
    'top-right': '100% 0%',
    'bottom-right': '100% 100%',
    'bottom-left': '0% 100%',
    center: '50% 50%',
  };
  const anchor = anchors[direction] || '50% 50%';
  return `polygon(${anchor}, ${anchor}, ${anchor}, ${anchor})`;
}

/* Curtain opens from the center line, along the travel axis. */
function curtainHidden(direction) {
  const [dx, dy] = DIRECTION_VECTORS[direction] || [0, 1];
  return Math.abs(dy) >= Math.abs(dx)
    ? 'inset(50% 0% 50% 0%)'
    : 'inset(0% 50% 0% 50%)';
}

/* Effects whose hover layer relies on an opaque masked surface rather than
   fading in — the default layer stays visible beneath them until covered. */
const MASK_EFFECTS = new Set(['wipe', 'strips', 'diagonal', 'curtain']);

const STRIP_COUNT = 5;

function transitionFor(properties, duration, easing) {
  return properties.map((p) => `${p} ${duration}s ${easing}`).join(', ');
}

function hoverLayerStyle({ effect, direction, active, duration, easing, reduced }) {
  if (reduced) {
    return {
      transition: `opacity ${Math.min(duration, 0.3)}s ease`,
      opacity: active ? 1 : 0,
      pointerEvents: active ? 'auto' : 'none',
    };
  }

  switch (effect) {
    case 'wipe': {
      const hidden = wipeHidden(direction);
      return {
        transition: transitionFor(['clip-path', 'transform'], duration, easing),
        clipPath: active ? 'inset(0% 0% 0% 0%)' : hidden.clipPath,
        transform: active ? 'translate(0, 0)' : hidden.shift,
        pointerEvents: active ? 'auto' : 'none',
      };
    }
    case 'slide': {
      const [dx, dy] = DIRECTION_VECTORS[direction] || [0, 1];
      return {
        transition: transitionFor(['transform', 'opacity'], duration, easing),
        opacity: active ? 1 : 0,
        transform: active
          ? 'translate(0, 0)'
          : `translate(${dx * 24}%, ${dy * 24}%)`,
        pointerEvents: active ? 'auto' : 'none',
      };
    }
    case 'ripple': {
      const origin = RIPPLE_ORIGINS[direction] || RIPPLE_ORIGINS.center;
      return {
        transition: transitionFor(['clip-path', 'transform', 'opacity'], duration, easing),
        clipPath: active ? `circle(140% at ${origin})` : `circle(0% at ${origin})`,
        transform: active ? 'scale(1)' : 'scale(1.06)',
        opacity: active ? 1 : 0,
        pointerEvents: active ? 'auto' : 'none',
      };
    }
    case 'curtain':
      return {
        transition: transitionFor(['clip-path', 'opacity'], duration, easing),
        clipPath: active ? 'inset(0% 0% 0% 0%)' : curtainHidden(direction),
        opacity: active ? 1 : 0,
        pointerEvents: active ? 'auto' : 'none',
      };
    case 'parallax': {
      const [dx, dy] = DIRECTION_VECTORS[direction] || [0, 1];
      return {
        transition: transitionFor(['transform', 'opacity'], duration, easing),
        opacity: active ? 1 : 0,
        transform: active
          ? 'translate(0, 0) scale(1)'
          : `translate(${dx * 8}%, ${dy * 8}%) scale(0.985)`,
        pointerEvents: active ? 'auto' : 'none',
      };
    }
    case 'morph':
      return {
        transition: transitionFor(['clip-path', 'opacity', 'transform'], duration, easing),
        clipPath: active
          ? 'inset(0% 0% 0% 0% round 0px)'
          : 'inset(24% 18% 24% 18% round 48px)',
        opacity: active ? 1 : 0,
        transform: active ? 'scale(1)' : 'scale(0.97)',
        pointerEvents: active ? 'auto' : 'none',
      };
    case 'diagonal':
      return {
        transition: transitionFor(['clip-path'], duration, easing),
        clipPath: active ? DIAGONAL_VISIBLE : diagonalHidden(direction),
        pointerEvents: active ? 'auto' : 'none',
      };
    default:
      return {
        transition: transitionFor(['opacity'], duration, easing),
        opacity: active ? 1 : 0,
        pointerEvents: active ? 'auto' : 'none',
      };
  }
}

function defaultLayerStyle({ effect, active, duration, easing, reduced }) {
  const isMask = MASK_EFFECTS.has(effect);
  const shouldFade = reduced || !isMask;
  if (!shouldFade) return {};
  return {
    transition: `opacity ${(reduced ? Math.min(duration, 0.3) : duration).toString()}s ${
      reduced ? 'ease' : easing
    }`,
    opacity: active ? 0 : 1,
  };
}

export default function HoverTransition({
  effect = 'wipe',
  direction = 'bottom',
  duration = 0.6,
  easing = 'cubic-bezier(0.22, 1, 0.36, 1)',
  maxTilt = 2.4,
  glare = true,
  defaultComponent,
  hoverComponent,
  overlayClassName,
  className,
  style,
  ...rest
}) {
  const [active, setActive] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const rootRef = useRef(null);
  const tiltRef = useRef(null);
  const glareRef = useRef(null);
  const pointerTypeRef = useRef(null);

  /* ------------------------- activation handlers ------------------------ */

  const activate = useCallback(() => setActive(true), []);
  const deactivate = useCallback(() => setActive(false), []);

  const handlePointerEnter = (e) => {
    if (e.pointerType === 'mouse') activate();
  };

  const handlePointerLeave = (e) => {
    if (e.pointerType === 'mouse') {
      deactivate();
      resetTilt();
    }
  };

  const handlePointerDown = (e) => {
    pointerTypeRef.current = e.pointerType;
  };

  const handlePointerUp = (e) => {
    // Touch tap toggles the reveal; mouse clicks never toggle (hover does).
    if (e.pointerType !== 'mouse') {
      setActive((prev) => !prev);
    }
  };

  const handleFocus = () => {
    // Touch taps also focus — don't force the reveal open for them.
    if (pointerTypeRef.current === 'touch') return;
    activate();
  };

  const handleBlur = () => {
    deactivate();
    resetTilt();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActive((prev) => !prev);
    }
  };

  /* Close when tapping outside the card on touch devices. */
  useEffect(() => {
    if (!active) return undefined;
    const onDocPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setActive(false);
      }
    };
    document.addEventListener('pointerdown', onDocPointerDown);
    return () => document.removeEventListener('pointerdown', onDocPointerDown);
  }, [active]);

  /* --------------------------- tilt + glare ----------------------------- */

  const resetTilt = useCallback(() => {
    const el = tiltRef.current;
    if (el) {
      el.style.transition = `transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1)`;
      el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    }
    if (glareRef.current) glareRef.current.style.opacity = '0';
  }, [duration]);

  const handlePointerMove = (e) => {
    if (reducedMotion || !maxTilt || e.pointerType !== 'mouse') return;
    const root = rootRef.current;
    if (!root) return;
    const rect = root.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const el = tiltRef.current;
    if (el) {
      el.style.transition = 'transform 120ms ease-out';
      el.style.transform = `perspective(900px) rotateX(${(-py * maxTilt).toFixed(
        2
      )}deg) rotateY(${(px * maxTilt).toFixed(2)}deg)`;
    }
    if (glareRef.current) {
      glareRef.current.style.setProperty('--glare-x', `${(px + 0.5) * 100}%`);
      glareRef.current.style.setProperty('--glare-y', `${(py + 0.5) * 100}%`);
      glareRef.current.style.opacity = '1';
    }
  };

  /* ------------------------------ markup -------------------------------- */

  const hoverStyle = hoverLayerStyle({
    effect,
    direction,
    active,
    duration,
    easing,
    reduced: reducedMotion,
  });
  const baseStyle = defaultLayerStyle({
    effect,
    active,
    duration,
    easing,
    reduced: reducedMotion,
  });

  return (
    <div
      ref={rootRef}
      role="button"
      tabIndex={0}
      aria-pressed={active}
      data-active={active || undefined}
      className={cn('relative outline-none', className)}
      style={{ display: 'grid', ...style }}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {/* Tilt wrapper — both content layers share one grid cell so the card
          always sizes to the tallest layer (no layout shift on hover). */}
      <div
        ref={tiltRef}
        style={{
          gridArea: '1 / 1',
          display: 'grid',
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
      >
        {/* Default layer: name + PRN */}
        <div style={{ gridArea: '1 / 1' }} aria-hidden={active}>
          {defaultComponent}
        </div>

        {/* Hover layer: role + contributions */}
        <div
          aria-hidden={!active}
          className={cn('z-[1] overflow-hidden', overlayClassName)}
          style={{ gridArea: '1 / 1', ...hoverStyle }}
        >
          {effect === 'strips' && !reducedMotion ? (
            Array.from({ length: STRIP_COUNT }).map((_, i) => (
              <div
                key={i}
                className={cn('absolute inset-y-0 overflow-hidden', overlayClassName)}
                style={{
                  left: `${(i * 100) / STRIP_COUNT}%`,
                  width: `${100 / STRIP_COUNT}%`,
                  transition: `clip-path ${duration}s ${easing} ${i * 45}ms`,
                  clipPath: active
                    ? 'inset(0% 0% 0% 0%)'
                    : i % 2 === 0
                      ? 'inset(0% 0% 100% 0%)'
                      : 'inset(100% 0% 0% 0%)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: `${-i * 100}%`,
                    width: `${STRIP_COUNT * 100}%`,
                    height: '100%',
                  }}
                >
                  {hoverComponent}
                </div>
              </div>
            ))
          ) : (
            hoverComponent
          )}
        </div>
      </div>

      {/* Pointer-following glare */}
      {glare && !reducedMotion && (
        <div
          ref={glareRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[2] rounded-[inherit] opacity-0 transition-opacity duration-300"
          style={{
            background:
              'radial-gradient(420px circle at var(--glare-x, 50%) var(--glare-y, 30%), rgba(255, 255, 255, 0.16), transparent 55%)',
          }}
        />
      )}
    </div>
  );
}
