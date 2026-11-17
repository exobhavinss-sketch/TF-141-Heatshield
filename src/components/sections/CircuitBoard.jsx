/* eslint-disable react/no-unknown-property */

/**
 * CircuitBoard — JSX adaptation of the Componentry "Circuit Board" registry
 * component (componentry.dev/r/circuit-board), ported from TypeScript for
 * this JavaScript (JSX) project and extended for HeatShield's System
 * Architecture page.
 *
 * Kept from the reference: right-angle SVG trace routing, glow filter,
 * grid-dot background, animated electricity pulses (stroke-dash offset),
 * bidirectional reverse pulses, theme auto-detection via MutationObserver,
 * and framer-motion entry animations.
 *
 * Adapted for HeatShield:
 *  - Nodes are labelled architecture cards (title + subtitle) instead of
 *    icon-only squares, rendered as real <button> elements for keyboard
 *    and touch access.
 *  - Selection highlighting: the active node's connections and neighbours
 *    are emphasised; unrelated nodes and traces are dimmed.
 *  - Connections support a "mode": live (runtime HTTPS) or offline
 *    (build-time / offline pipeline), drawn dashed with a slower pulse.
 *  - Connection labels appear for the active node's paths only, so the
 *    board never overloads with text.
 *  - prefers-reduced-motion disables pulse and entry animation.
 *  - The fixed logical canvas scales down responsively via ResizeObserver,
 *    so node geometry never breaks across viewports.
 */

import React, {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const TRACE_PULSE_LENGTH = 640;

function useTheme() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => {
      setIsDark(
        document.documentElement.classList.contains('dark') ||
          document.body.classList.contains('dark'),
      );
    };
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    if (document.body) {
      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener?.('change', check);
    return () => {
      observer.disconnect();
      media.removeEventListener?.('change', check);
    };
  }, []);
  return isDark;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);
  return reduced;
}

/* Status palettes — HeatShield accent (#0071e3 / #2997ff) for implemented
   layers, amber for planned / optional work, matching the site's disclosure
   banner colouring. */
function statusPalette(isDark) {
  return {
    implemented: isDark ? '#2997ff' : '#0071e3',
    planned: isDark ? '#f59e0b' : '#b45309',
  };
}

export default function CircuitBoard({
  nodes,
  connections,
  width = 1180,
  height = 640,
  gridSize = 24,
  activeId = null,
  onNodeClick,
  className,
}) {
  const isDark = useTheme();
  const reducedMotion = useReducedMotion();
  const uid = useId().replace(/[:]/g, '');
  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(1);

  const palette = useMemo(() => statusPalette(isDark), [isDark]);
  const traceColor = isDark ? 'rgba(163, 163, 163, 0.28)' : 'rgba(64, 64, 64, 0.35)';
  const gridColor = isDark ? 'rgba(163, 163, 163, 0.09)' : 'rgba(64, 64, 64, 0.12)';
  const idlePulseColor = isDark ? 'rgba(163, 163, 163, 0.55)' : 'rgba(64, 64, 64, 0.6)';
  const cardBg = isDark ? 'rgba(25, 27, 32, 0.92)' : 'rgba(255, 255, 255, 0.94)';
  const dimText = isDark ? '#a5a9b4' : '#86868b';

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setScale(Math.min(1, entry.contentRect.width / width));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [width]);

  const nodeMap = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  const connectedIds = useMemo(() => {
    if (!activeId) return null;
    const set = new Set([activeId]);
    connections.forEach((conn) => {
      if (conn.from === activeId) set.add(conn.to);
      if (conn.to === activeId) set.add(conn.from);
    });
    return set;
  }, [activeId, connections]);

  const getNodeSize = useCallback((node) => ({ w: node.w ?? 176, h: node.h ?? 64 }), []);

  const calculatePath = useCallback(
    (from, to) => {
      const fromSize = getNodeSize(from);
      const toSize = getNodeSize(to);
      const dx = to.x - from.x;
      const dy = to.y - from.y;

      let startX = from.x;
      let startY = from.y;
      let endX = to.x;
      let endY = to.y;

      if (Math.abs(dx) > Math.abs(dy)) {
        startX = from.x + (dx > 0 ? fromSize.w / 2 + 4 : -(fromSize.w / 2 + 4));
        endX = to.x + (dx > 0 ? -(toSize.w / 2 + 4) : toSize.w / 2 + 4);
        const midX = from.x + dx / 2;
        return { d: `M ${startX} ${startY} H ${midX} V ${endY} H ${endX}`, midX, midY: startY };
      }
      startY = from.y + (dy > 0 ? fromSize.h / 2 + 4 : -(fromSize.h / 2 + 4));
      endY = to.y + (dy > 0 ? -(toSize.h / 2 + 4) : toSize.h / 2 + 4);
      const midY = from.y + dy / 2;
      return { d: `M ${startX} ${startY} V ${midY} H ${endX} V ${endY}`, midX: startX, midY };
    },
    [getNodeSize],
  );

  return (
    <div
      ref={wrapperRef}
      className={cn('relative w-full overflow-hidden', className)}
      style={{ height: Math.round(height * scale) }}
    >
      <div
        className="relative origin-top-left"
        style={{ width, height, transform: `scale(${scale})` }}
      >
        <svg
          width={width}
          height={height}
          className="absolute inset-0"
          style={{ overflow: 'visible' }}
          aria-hidden="true"
        >
          <defs>
            <filter id={`${uid}-glow`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <pattern
              id={`${uid}-grid`}
              width={gridSize}
              height={gridSize}
              patternUnits="userSpaceOnUse"
            >
              <circle cx={gridSize / 2} cy={gridSize / 2} r="0.6" fill={gridColor} />
            </pattern>
          </defs>

          {/* Grid background */}
          <rect width={width} height={height} fill={`url(#${uid}-grid)`} />

          {/* Connection traces */}
          {connections.map((conn) => {
            const fromNode = nodeMap.get(conn.from);
            const toNode = nodeMap.get(conn.to);
            if (!fromNode || !toNode) return null;

            const { d, midX, midY } = calculatePath(fromNode, toNode);
            const isHorizontal = Math.abs(toNode.x - fromNode.x) > Math.abs(toNode.y - fromNode.y);
            // Horizontal labels float above the node band so they never
            // collide with neighbouring cards; vertical labels sit beside
            // the corner of the trace.
            const labelY = isHorizontal
              ? Math.min(fromNode.y, toNode.y) -
                Math.max(getNodeSize(fromNode).h, getNodeSize(toNode).h) / 2 -
                38
              : midY - 26;
            const isActive = activeId !== null && (conn.from === activeId || conn.to === activeId);
            const isDimmed = activeId !== null && !isActive;
            const accent = palette[fromNode.status] ?? palette.implemented;
            const pulseColor = isActive ? accent : idlePulseColor;
            const speed = conn.mode === 'offline' ? 3.4 : 2;
            const opacity = isDimmed ? 0.18 : 1;
            const dash = `${TRACE_PULSE_LENGTH * 0.09} ${TRACE_PULSE_LENGTH * 0.91}`;

            return (
              <g key={`${conn.from}-${conn.to}`} opacity={opacity}>
                {/* Base trace */}
                <path
                  d={d}
                  fill="none"
                  stroke={isActive ? accent : traceColor}
                  strokeWidth={isActive ? 2.4 : 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={conn.mode === 'offline' ? '6 5' : undefined}
                  opacity={isActive ? 0.9 : 0.75}
                />

                {/* Animated electricity pulse */}
                {!reducedMotion && conn.animated !== false && (
                  <>
                    <motion.path
                      d={d}
                      fill="none"
                      stroke={pulseColor}
                      strokeWidth={4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter={`url(#${uid}-glow)`}
                      strokeDasharray={dash}
                      initial={{ strokeDashoffset: TRACE_PULSE_LENGTH }}
                      animate={{ strokeDashoffset: -TRACE_PULSE_LENGTH }}
                      transition={{
                        duration: speed,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    />
                    {conn.bidirectional && (
                      <motion.path
                        d={d}
                        fill="none"
                        stroke={pulseColor}
                        strokeWidth={4}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter={`url(#${uid}-glow)`}
                        strokeDasharray={dash}
                        initial={{ strokeDashoffset: -TRACE_PULSE_LENGTH }}
                        animate={{ strokeDashoffset: TRACE_PULSE_LENGTH }}
                        transition={{
                          duration: speed,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                    )}
                  </>
                )}

                {/* Directional label — only while related to the active node */}
                {isActive && conn.label && (
                  <g>
                    <rect
                      x={midX}
                      y={labelY}
                      width={Math.max(120, conn.label.length * 6.4 + 20)}
                      height={22}
                      rx={11}
                      fill={isDark ? 'rgba(16, 17, 20, 0.95)' : 'rgba(255, 255, 255, 0.97)'}
                      stroke={accent}
                      strokeOpacity={0.35}
                    />
                    <text
                      x={midX + Math.max(120, conn.label.length * 6.4 + 20) / 2}
                      y={labelY + 15}
                      textAnchor="middle"
                      fontSize="10.5"
                      fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                      fill={isDark ? '#f5f5f7' : '#1d1d1f'}
                    >
                      {conn.label}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node, index) => {
          const size = getNodeSize(node);
          const color = palette[node.status] ?? palette.implemented;
          const isActive = activeId === node.id;
          const isConnected = connectedIds?.has(node.id) ?? false;
          const isDimmed = activeId !== null && !isConnected;

          return (
            <motion.button
              key={node.id}
              type="button"
              onClick={() => onNodeClick?.(node.id)}
              aria-pressed={isActive}
              aria-label={`${node.title} — ${node.status === 'planned' ? 'planned' : 'implemented'}. View details`}
              className={cn(
                'absolute flex flex-col items-start justify-center rounded-[14px] border-2 px-4 text-left outline-none',
                'focus-visible:ring-2 focus-visible:ring-offset-2',
                isDark ? 'focus-visible:ring-[#2997ff] focus-visible:ring-offset-[#101114]' : 'focus-visible:ring-[#0071e3] focus-visible:ring-offset-[#fafafc]',
                isDimmed && 'opacity-30',
              )}
              style={{
                left: node.x - size.w / 2,
                top: node.y - size.h / 2,
                width: size.w,
                height: size.h,
                borderColor: color,
                backgroundColor: cardBg,
                boxShadow: isActive
                  ? `0 0 0 4px ${color}26, 0 8px 28px rgba(0,0,0,${isDark ? 0.4 : 0.1})`
                  : isConnected
                    ? `0 0 0 3px ${color}1c`
                    : `0 2px 10px rgba(0,0,0,${isDark ? 0.3 : 0.05})`,
                transition: 'box-shadow 250ms ease, opacity 250ms ease',
              }}
              initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: isDimmed ? 0.3 : 1 }}
              whileHover={reducedMotion ? undefined : { scale: 1.04 }}
              whileTap={reducedMotion ? undefined : { scale: 0.97 }}
              transition={{ delay: reducedMotion ? 0 : index * 0.07 + 0.2, type: 'spring', stiffness: 260, damping: 22 }}
            >
              {/* Status dot */}
              <span
                aria-hidden="true"
                className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}` }}
              />

              <span className="flex items-baseline gap-2">
                <span
                  className="font-mono text-[10px] font-semibold"
                  style={{ color }}
                >
                  {node.num}
                </span>
                <span
                  className="text-[13px] font-semibold leading-tight tracking-tight"
                  style={{ color: isDark ? '#f5f5f7' : '#1d1d1f' }}
                >
                  {node.title}
                </span>
              </span>
              <span
                className="mt-0.5 font-mono text-[9.5px] uppercase tracking-wider"
                style={{ color: dimText }}
              >
                {node.subtitle}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
