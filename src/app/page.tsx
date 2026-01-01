"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronRight, ChevronLeft, Menu, X, ArrowRight, ArrowUpRight,
  Activity, TrendingUp, TrendingDown, Zap, Shield, BarChart3, 
  Globe, Users, Target, Wallet, Bell, LineChart, Box,
  Layers, Database, Lock, Cpu, Sparkles, Radio, Grid3X3
} from "lucide-react";

// --- Utility ---
const cn = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

// --- Design System Components ---

// Panda Terminal Logo
const PandaLogo = ({ 
  size = "default",
  showText = true,
  showSubtext = false,
  color = "dark"
}: { 
  size?: "small" | "default" | "large" | "hero",
  showText?: boolean,
  showSubtext?: boolean,
  color?: "dark" | "light"
}) => {
  const sizes = {
    small: { icon: 24, text: "text-sm", gap: "gap-2" },
    default: { icon: 32, text: "text-base", gap: "gap-3" },
    large: { icon: 48, text: "text-xl", gap: "gap-4" },
    hero: { icon: 80, text: "text-4xl", gap: "gap-6" },
  };
  
  const s = sizes[size];
  const textColor = color === "dark" ? "text-[#F0F1F4]" : "text-[#F0F1F4]";
  const strokeColor = color === "dark" ? "#F0F1F4" : "#F0F1F4";
  
  return (
    <div className={cn("flex items-center", s.gap)}>
      {/* Terminal Icon */}
      <svg 
        width={s.icon} 
        height={s.icon} 
        viewBox="0 0 80 80" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="2" y="2" width="76" height="76" stroke={strokeColor} strokeWidth="3" fill="none" />
        <path d="M20 28L36 44L20 60" stroke={strokeColor} strokeWidth="4" strokeLinecap="square" />
        <line x1="42" y1="60" x2="60" y2="60" stroke={strokeColor} strokeWidth="4" strokeLinecap="square" />
      </svg>
      
      {showText && (
        <div className="flex flex-col">
          <span className={cn("font-light tracking-[0.1em]", s.text, textColor)}>
            PANDA
          </span>
          {showSubtext && (
            <span className={cn("text-xs tracking-[0.3em] opacity-60", textColor)}>
              TERMINAL
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Crosshair artifact for grid intersections
const Crosshair = ({ className = "" }: { className?: string }) => (
  <span 
    className={cn("absolute text-[#2D7AFF] font-mono text-sm font-medium z-10", className)}
    style={{ fontFamily: 'var(--font-mono)' }}
  >
    +
  </span>
);

// Grid Cell with crosshair
const GridCell = ({ children, className = "", showCrosshair = true }: { 
  children: React.ReactNode, 
  className?: string,
  showCrosshair?: boolean 
}) => (
  <div className={cn("relative bg-[#12141A] border border-[#2A2D35]", className)}>
    {showCrosshair && <Crosshair className="-top-2 -right-2" />}
    {children}
  </div>
);

// Metric Display Block
const MetricBlock = ({ 
  label, 
  value, 
  change, 
  suffix = "",
  size = "default" 
}: { 
  label: string, 
  value: string, 
  change?: { value: string, positive: boolean },
  suffix?: string,
  size?: "default" | "large" | "small"
}) => {
  const valueClass = size === "large" ? "text-[32px]" : size === "small" ? "text-lg" : "text-2xl";
  
  return (
    <div className="p-4">
      <div className="label-micro text-[#5C626D] mb-2">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className={cn("font-mono tabular-nums text-[#F0F1F4]", valueClass)}>
          {value}
        </span>
        {suffix && <span className="text-xs text-[#9BA1AB]">{suffix}</span>}
      </div>
      {change && (
        <div className={cn(
          "flex items-center gap-1 mt-1 text-xs font-mono",
          change.positive ? "text-[#12B76A]" : "text-[#F04438]"
        )}>
          {change.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {change.value}
        </div>
      )}
    </div>
  );
};

// Data Table
const DataTable = ({ 
  headers, 
  rows,
  highlightLast = false 
}: { 
  headers: string[], 
  rows: (string | { value: string, highlight?: boolean, positive?: boolean })[][],
  highlightLast?: boolean
}) => (
  <table className="w-full border-collapse">
    <thead>
      <tr>
        {headers.map((h, i) => (
          <th key={i} className="label-micro text-[#9BA1AB] text-left px-3 py-2 bg-[#1A1D24] border-b border-[#2A2D35]">
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, ri) => (
        <tr 
          key={ri} 
          className={cn(
            "border-b border-[#1F2229]",
            highlightLast && ri === rows.length - 1 && "bg-[#1A2A44]"
          )}
        >
          {row.map((cell, ci) => {
            const cellData = typeof cell === 'string' ? { value: cell } : cell;
            return (
              <td 
                key={ci} 
                className={cn(
                  "font-mono text-[13px] tabular-nums px-3 py-2.5",
                  cellData.highlight && "text-[#2D7AFF] font-medium",
                  cellData.positive === true && "text-[#12B76A]",
                  cellData.positive === false && "text-[#F04438]"
                )}
              >
                {cellData.value}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  </table>
);

// Spark Line Chart (Blueprint style - 1px stroke)
const SparkLine = ({ 
  data, 
  width = 120, 
  height = 40, 
  color = "#2D7AFF",
  showArea = false 
}: { 
  data: number[], 
  width?: number, 
  height?: number, 
  color?: string,
  showArea?: boolean
}) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width={width} height={height} className="overflow-visible">
      {showArea && (
        <defs>
          <pattern id={`hatch-${color.replace('#', '')}`} patternUnits="userSpaceOnUse" width="4" height="4">
            <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke={color} strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>
      )}
      {showArea && (
        <polygon
          fill={`url(#hatch-${color.replace('#', '')})`}
          points={areaPoints}
        />
      )}
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1"
        points={points}
      />
      <circle 
        cx={(data.length - 1) / (data.length - 1) * width} 
        cy={height - ((data[data.length - 1] - min) / range) * (height - 8) - 4}
        r="3"
        fill={color}
      />
    </svg>
  );
};

// Bar Chart (Horizontal)
const HorizontalBar = ({ 
  label, 
  value, 
  maxValue, 
  showValue = true,
  color = "#2D7AFF"
}: { 
  label: string, 
  value: number, 
  maxValue: number,
  showValue?: boolean,
  color?: string
}) => {
  const percentage = (value / maxValue) * 100;
  
  return (
    <div className="flex items-center gap-4">
      <div className="w-24 label-micro text-[#9BA1AB] shrink-0">{label}</div>
      <div className="flex-1 h-6 bg-[#1A1D24] relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: [0.2, 0, 0.2, 1] }}
          className="h-full"
          style={{ 
            background: `repeating-linear-gradient(90deg, ${color}, ${color} 2px, transparent 2px, transparent 4px)`,
          }}
        />
      </div>
      {showValue && (
        <div className="w-16 font-mono text-[13px] tabular-nums text-right text-[#F0F1F4]">
          {value.toLocaleString()}
        </div>
      )}
    </div>
  );
};

// Donut Chart
const DonutChart = ({ 
  segments, 
  size = 120 
}: { 
  segments: { value: number, label: string, color: string }[],
  size?: number
}) => {
  const total = segments.reduce((acc, s) => acc + s.value, 0);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  return (
    <div className="flex items-center gap-6">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1F2229"
          strokeWidth="12"
        />
        {segments.map((seg, i) => {
          const dashLength = (seg.value / total) * circumference;
          const offset = currentOffset;
          currentOffset += dashLength;
          
          return (
            <motion.circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="12"
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={-offset}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            />
          );
        })}
      </svg>
      <div className="space-y-2">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-3 h-3" style={{ background: seg.color }} />
            <span className="text-xs text-[#9BA1AB]">{seg.label}</span>
            <span className="font-mono text-xs text-[#F0F1F4]">{seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Live Status Indicator
const LiveIndicator = ({ label = "LIVE" }: { label?: string }) => (
  <div className="flex items-center gap-2">
    <div className="relative">
      <div className="w-2 h-2 rounded-full bg-[#12B76A]" />
      <div className="absolute inset-0 w-2 h-2 rounded-full bg-[#12B76A] animate-ping opacity-75" />
    </div>
    <span className="label-micro text-[#12B76A]">{label}</span>
  </div>
);

// Tag/Badge
const Tag = ({ 
  children, 
  variant = "default" 
}: { 
  children: React.ReactNode, 
  variant?: "default" | "success" | "warning" | "error" 
}) => {
  const variants = {
    default: "bg-[#1A2A44] text-[#2D7AFF]",
    success: "bg-[rgba(18, 183, 106, 0.15)] text-[#12B76A]",
    warning: "bg-[rgba(245, 184, 0, 0.15)] text-[#B8860B]",
    error: "bg-[rgba(240, 68, 56, 0.15)] text-[#F04438]"
  };
  
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider", variants[variant])}>
      {children}
    </span>
  );
};

// Icon Button
const IconBox = ({ 
  icon: Icon, 
  label 
}: { 
  icon: React.ElementType, 
  label: string 
}) => (
  <div className="flex flex-col items-center gap-2">
    <div className="w-12 h-12 border border-[#2D7AFF] flex items-center justify-center">
      <Icon className="w-5 h-5 text-[#2D7AFF]" strokeWidth={1.5} />
    </div>
    <span className="label-micro text-[#9BA1AB]">{label}</span>
  </div>
);

// --- Demo Data ---
const marketData = {
  btc: { price: "97,842.50", change: "+2.41%", volume: "42.8B", high: "98,120.00", low: "95,640.00" },
  eth: { price: "3,456.78", change: "+1.87%", volume: "18.2B", high: "3,520.00", low: "3,380.00" },
  sol: { price: "198.45", change: "+4.23%", volume: "4.2B", high: "202.50", low: "190.20" }
};

const performanceData = [
  { month: "JUL", users: 1200, volume: 8.5, revenue: 42 },
  { month: "AUG", users: 2800, volume: 15.2, revenue: 78 },
  { month: "SEP", users: 4200, volume: 22.8, revenue: 124 },
  { month: "OCT", users: 6500, volume: 35.4, revenue: 186 },
  { month: "NOV", users: 8900, volume: 42.1, revenue: 248 },
  { month: "DEC", users: 12700, volume: 58.6, revenue: 342 }
];

// --- Slide Data ---
const slides = [
  { id: "title", type: "hero" },
  { id: "problem", type: "problem" },
  { id: "solution", type: "solution" },
  { id: "product", type: "product" },
  { id: "intelligence", type: "intelligence" },
  { id: "divine-dip", type: "flagship" },
  { id: "trading", type: "trading" },
  { id: "market", type: "market" },
  { id: "traction", type: "traction" },
  { id: "competition", type: "competition" },
  { id: "model", type: "model" },
  { id: "team", type: "team" },
  { id: "ask", type: "ask" },
  { id: "closing", type: "closing" },
];

// --- Slide Components ---

const HeroSlide = ({ onNext }: { onNext: () => void }) => (
  <div className="h-full grid grid-cols-12 gap-0">
    {/* Left Panel - Title */}
    <div className="col-span-5 flex flex-col bg-[#12141A] border-r border-[#2A2D35]">
      {/* Top section with label */}
      <div className="p-6 border-b border-[#1F2229]">
        <div className="label-micro text-[#2D7AFF]">INSTITUTIONAL TRADING TERMINAL</div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col justify-center px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6">
            <PandaLogo size="hero" showSubtext={true} />
          </div>
          <p className="text-lg text-[#9BA1AB] font-light mb-8 leading-relaxed">
            The Bloomberg Terminal for Crypto — proprietary intelligence, unified execution, institutional grade.
          </p>
          <div className="flex gap-3">
            <button onClick={onNext} className="bp-btn-primary flex items-center gap-2">
              View Deck <ArrowRight className="w-4 h-4" />
            </button>
            <button className="bp-btn-secondary">
              Try Demo
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom stats row */}
      <div className="grid grid-cols-3 border-t border-[#1F2229]">
        <div className="p-4 border-r border-[#1F2229]">
          <div className="label-micro text-[#5C626D] mb-1">USERS</div>
          <div className="font-mono text-xl text-[#F0F1F4]">12.7K</div>
        </div>
        <div className="p-4 border-r border-[#1F2229]">
          <div className="label-micro text-[#5C626D] mb-1">VOLUME</div>
          <div className="font-mono text-xl text-[#F0F1F4]">$58M</div>
        </div>
        <div className="p-4">
          <div className="label-micro text-[#5C626D] mb-1">METRICS</div>
          <div className="font-mono text-xl text-[#2D7AFF]">50+</div>
        </div>
      </div>
    </div>

    {/* Right Panel - Product Preview */}
    <div className="col-span-7 flex flex-col bg-[#12141A] relative overflow-hidden">
      {/* Product Screenshot */}
      <div className="flex-1 relative">
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="heroGrid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#ffffff" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#heroGrid)" />
          </svg>
        </div>
        
        {/* Product image container */}
        <div className="absolute inset-4 md:inset-8 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl border border-[#2a2a2f]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/Attached_image.png" 
              alt="PANDA Terminal Interface"
              className="w-full h-full object-contain object-center"
            />
            {/* Gradient overlay at bottom */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#12141A] to-transparent" />
          </motion.div>
        </div>
      </div>

      {/* Bottom Stats Bar */}
      <div className="border-t border-[#2a2a2f] bg-[#0a0a0c]">
        <div className="grid grid-cols-4 divide-x divide-[#2a2a2f]">
          {[
            { value: "50+", label: "PROPRIETARY METRICS" },
            { value: "3", label: "CEX INTEGRATIONS" },
            { value: "<100ms", label: "EXECUTION SPEED" },
            { value: "24/7", label: "REAL-TIME DATA" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="p-4 text-center"
            >
              <div className="font-mono text-lg md:text-xl text-[#2D7AFF]">{stat.value}</div>
              <div className="text-[9px] md:text-[10px] text-[#9BA1AB] tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const ProblemSlide = () => (
  <div className="h-full grid grid-cols-12 gap-0">
    {/* Left - Problem Statement */}
    <div className="col-span-5 flex flex-col border-r border-[#2A2D35]">
      <div className="p-6 border-b border-[#1F2229] bg-[#1A1D24]">
        <div className="label-micro text-[#2D7AFF]">01 / THE PROBLEM</div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center px-8 py-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-3xl font-light text-[#F0F1F4] mb-6 leading-tight">
            Crypto traders are flying blind in a $1.5T market
          </h2>
          <p className="text-[#9BA1AB] leading-relaxed mb-6">
            Institutional tools cost $24K/year. Retail traders juggle 5-10 fragmented platforms.
          </p>
          <div className="space-y-3">
            {['Information overload without intelligence', 'No unified view of the market', 'Slow execution & missed opportunities'].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-[#9BA1AB]">
                <span className="w-5 h-5 rounded-full bg-[rgba(240, 68, 56, 0.15)] flex items-center justify-center text-[#F04438] text-xs">✕</span>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="p-6 border-t border-[#1F2229] bg-[rgba(240, 68, 56, 0.15)]">
        <div className="label-micro text-[#F04438] mb-1">ESTIMATED ANNUAL LOSS</div>
        <div className="font-mono text-2xl text-[#F04438]">$2.4B</div>
        <div className="text-xs text-[#F04438]/70">from market fragmentation</div>
      </div>
    </div>

    {/* Right - Data Visualization */}
    <div className="col-span-7 grid grid-cols-2 grid-rows-2 gap-0">
      <GridCell className="p-5 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <Database className="w-5 h-5 text-[#2D7AFF]" strokeWidth={1.5} />
          <span className="font-mono text-2xl text-[#F04438]">1000+</span>
        </div>
        <div className="label-micro text-[#9BA1AB] mb-1">DATA SOURCES</div>
        <p className="text-xs text-[#5C626D] flex-1">Scattered across exchanges, aggregators, social</p>
        <div className="mt-auto pt-3">
          <div className="h-2 bg-[#1A1D24] rounded-full overflow-hidden">
            <div className="h-full w-[85%] bg-[#F04438]" />
          </div>
          <div className="text-[10px] text-[#5C626D] mt-1">85% noise ratio</div>
        </div>
      </GridCell>

      <GridCell className="p-5 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <Layers className="w-5 h-5 text-[#2D7AFF]" strokeWidth={1.5} />
          <span className="font-mono text-2xl text-[#F5B800]">5-10</span>
        </div>
        <div className="label-micro text-[#9BA1AB] mb-1">PLATFORMS JUGGLED</div>
        <p className="text-xs text-[#5C626D] flex-1">No unified view means missed opportunities</p>
        <div className="mt-auto pt-3 flex gap-0.5">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={cn("flex-1 h-6 border", i < 5 ? "bg-[#F5B800]/20 border-[#F5B800]" : "bg-[#1A1D24] border-[#1F2229]")} />
          ))}
        </div>
      </GridCell>

      <GridCell className="p-5 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <Lock className="w-5 h-5 text-[#2D7AFF]" strokeWidth={1.5} />
          <span className="font-mono text-2xl text-[#F0F1F4]">$24K</span>
        </div>
        <div className="label-micro text-[#9BA1AB] mb-1">ANNUAL TERMINAL COST</div>
        <p className="text-xs text-[#5C626D] flex-1">Bloomberg pricing excludes 99% of traders</p>
        <div className="mt-auto pt-3 flex items-end gap-2 h-14">
          {[
            { v: 24, label: "BBG" },
            { v: 3, label: "Pro" },
            { v: 0.5, label: "Free" },
          ].map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-[#2D7AFF]" style={{ height: `${(item.v / 24) * 100}%`, opacity: 1 - i * 0.25 }} />
              <span className="text-[9px] text-[#5C626D] mt-1">{item.label}</span>
            </div>
          ))}
        </div>
      </GridCell>

      <GridCell className="p-5 flex flex-col" showCrosshair={false}>
        <div className="flex items-start justify-between mb-3">
          <TrendingUp className="w-5 h-5 text-[#2D7AFF]" strokeWidth={1.5} />
          <span className="font-mono text-2xl text-[#9BA1AB]">3-5 yrs</span>
        </div>
        <div className="label-micro text-[#9BA1AB] mb-1">EXPERIENCE GAP</div>
        <p className="text-xs text-[#5C626D] flex-1">Years to develop pattern recognition</p>
        <div className="mt-auto pt-3">
          <div className="flex justify-between text-[10px] text-[#5C626D] mb-1">
            <span>BEGINNER</span>
            <span>PROFITABLE</span>
          </div>
          <div className="h-3 bg-gradient-to-r from-[#F04438] via-[#F5B800] to-[#12B76A] relative">
            <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#12141A] border-2 border-[#F04438]" />
          </div>
        </div>
      </GridCell>
    </div>
  </div>
);

const SolutionSlide = () => (
  <div className="h-full grid grid-cols-12 gap-0">
    <div className="col-span-5 flex flex-col border-r border-[#2A2D35]">
      <div className="p-6 border-b border-[#1F2229] bg-[#1A1D24]">
        <div className="label-micro text-[#2D7AFF]">02 / THE SOLUTION</div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center px-8 py-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-3xl font-light text-[#F0F1F4] mb-4 leading-tight">
            One terminal.<br/>All the intelligence.
          </h2>
          <p className="text-[#9BA1AB] leading-relaxed mb-6">
            PANDA unifies research, proprietary analytics, and execution into a single institutional-grade platform.
          </p>
          
          <div className="space-y-2">
            {[
              { icon: LineChart, text: "Reveals real market moves" },
              { icon: Cpu, text: "50+ proprietary metrics" },
              { icon: Zap, text: "CEX + DEX unified execution" },
              { icon: Users, text: "Built for all levels" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-center gap-3 p-3 border border-[#1F2229] hover:border-[#2D7AFF] transition-colors"
              >
                <item.icon className="w-4 h-4 text-[#2D7AFF]" strokeWidth={1.5} />
                <span className="text-sm text-[#F0F1F4]">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="p-6 border-t border-[#1F2229] bg-[#1A2A44]">
        <div className="label-micro text-[#2D7AFF] mb-1">STARTING AT</div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-2xl text-[#2D7AFF]">$29</span>
          <span className="text-sm text-[#9BA1AB]">/month</span>
        </div>
        <div className="text-xs text-[#9BA1AB] mt-1">vs $24,000/yr for Bloomberg</div>
      </div>
    </div>

    <div className="col-span-7 flex flex-col bg-[#1A1D24]">
      {/* Workflow Infographic */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 py-12 relative overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-30">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="lightGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2A2D35" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#lightGrid)" />
          </svg>
        </div>

        {/* Workflow diagram */}
        <div className="relative w-full max-w-2xl">
          {/* Main flow container */}
          <div className="flex items-center justify-between relative">
            {/* Connecting line - positioned behind nodes */}
            <div className="absolute top-1/2 left-[60px] right-[60px] h-[2px] bg-[#2A2D35] -translate-y-1/2 z-0" />
            
            {/* Flow nodes */}
            {[
              { label: "RESEARCH", icon: Database, active: false },
              { label: "INTELLIGENCE", icon: Sparkles, active: false },
              { label: "TERMINAL", icon: null, active: true, center: true },
              { label: "EXECUTION", icon: Zap, active: false },
              { label: "CONVICTION", icon: Target, active: true },
            ].map((node, i) => (
              <motion.div 
                key={i}
                className="relative z-10 flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
              >
                {/* Node circle */}
                <div className={cn(
                  "flex items-center justify-center bg-[#12141A] border-2 shadow-sm",
                  node.center 
                    ? "w-20 h-20 md:w-24 md:h-24 border-[#2D7AFF]" 
                    : "w-12 h-12 md:w-14 md:h-14",
                  node.active ? "border-[#2D7AFF]" : "border-[#2A2D35]"
                )}>
                  {node.center ? (
                    <div className="font-mono text-xl md:text-2xl text-[#2D7AFF]">&gt;_</div>
                  ) : node.icon && (
                    <node.icon className={cn(
                      "w-5 h-5",
                      node.active ? "text-[#2D7AFF]" : "text-[#9BA1AB]"
                    )} strokeWidth={1.5} />
                  )}
                </div>
                
                {/* Label */}
                <span className={cn(
                  "mt-3 text-[9px] md:text-[10px] font-medium tracking-wider",
                  node.active ? "text-[#2D7AFF]" : "text-[#9BA1AB]"
                )}>
                  {node.label}
                </span>
                
                {/* Arrow (except for last node) */}
                {i < 4 && (
                  <ArrowRight className={cn(
                    "absolute -right-4 md:-right-6 top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4",
                    node.active || i === 2 ? "text-[#2D7AFF]" : "text-[#2A2D35]"
                  )} strokeWidth={2} />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Central Message */}
        <motion.div 
          className="mt-12 md:mt-16 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-xl md:text-2xl font-light text-[#F0F1F4] mb-2">
            Trade faster, and more confidently
          </h3>
          <p className="text-sm text-[#9BA1AB]">
            with a terminal built for every experience level.
          </p>
        </motion.div>

        {/* Bottom Stats */}
        <motion.div 
          className="mt-8 md:mt-12 flex gap-8 md:gap-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {[
            { value: "50+", label: "Metrics" },
            { value: "3", label: "Exchanges" },
            { value: "<1s", label: "Latency" },
          ].map((stat, i) => (
            <div key={i} className="text-center bg-[#12141A] px-6 py-4 border border-[#1F2229]">
              <div className="font-mono text-lg md:text-xl text-[#2D7AFF]">{stat.value}</div>
              <div className="text-[10px] text-[#9BA1AB] uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </div>
);

const ProductSlide = () => (
  <div className="h-full grid grid-cols-12 gap-0">
    <div className="col-span-4 flex flex-col border-r border-[#2A2D35]">
      <div className="p-6 border-b border-[#1F2229] bg-[#1A1D24]">
        <div className="label-micro text-[#2D7AFF]">03 / PRODUCT</div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center px-8 py-6">
        <h2 className="text-2xl font-light text-[#F0F1F4] mb-4">
          Research & Analysis Hub
        </h2>
        <p className="text-sm text-[#9BA1AB] mb-6">
          All data types unified in one professional interface.
        </p>
        <div className="space-y-3">
          {[
            { type: 'On-chain', desc: 'Wallet, gas, staking data' },
            { type: 'Orderflow', desc: 'Trade volume, whale detection' },
            { type: 'Orderbook', desc: 'Bid/ask, liquidity depth' },
            { type: 'Exchange', desc: 'Funding, OI, premium' },
          ].map((item, i) => (
            <div key={item.type} className="flex items-start gap-3 p-3 bg-[#1A1D24]">
              <div className="w-2 h-2 mt-1.5 bg-[#2D7AFF]" style={{ opacity: 1 - i * 0.15 }} />
              <div>
                <div className="text-sm text-[#F0F1F4]">{item.type}</div>
                <div className="text-[10px] text-[#5C626D]">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-[#1F2229]">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-mono text-xl text-[#2D7AFF]">50+</div>
            <div className="text-[10px] text-[#5C626D]">METRICS</div>
          </div>
          <div>
            <div className="font-mono text-xl text-[#F0F1F4]">3</div>
            <div className="text-[10px] text-[#5C626D]">EXCHANGES</div>
          </div>
        </div>
      </div>
    </div>

    <div className="col-span-8 grid grid-cols-3 grid-rows-2 gap-0">
      {[
        { num: "01", title: "Workbench", desc: "Customizable multi-chart layouts with professional tools", icon: Grid3X3 },
        { num: "02", title: "Studies", desc: "Overlay 50+ proprietary metrics on any chart", icon: Activity },
        { num: "03", title: "Screener", desc: "Filter by on-chain, off-chain, DEX metrics", icon: Target },
        { num: "04", title: "Dashboard", desc: "Personalized command center", icon: Box },
        { num: "05", title: "Alerts", desc: "Multi-channel smart notifications", icon: Bell },
        { num: "06", title: "Sharing", desc: "Publish and clone analysis setups", icon: Users }
      ].map((module, i) => (
        <GridCell key={i} className="p-5 group hover:bg-[#1A1D24] transition-colors flex flex-col" showCrosshair={i < 3}>
          <div className="flex justify-between items-start mb-3">
            <span className="font-mono text-xs text-[#2D7AFF]">{module.num}</span>
            <module.icon className="w-5 h-5 text-[#5C626D] group-hover:text-[#2D7AFF] transition-colors" strokeWidth={1.5} />
          </div>
          <h3 className="text-base text-[#F0F1F4] mb-2">{module.title}</h3>
          <p className="text-xs text-[#9BA1AB] leading-relaxed flex-1">{module.desc}</p>
          <div className="mt-auto pt-3">
            <div className="h-1 bg-[#1A1D24] group-hover:bg-[#1A2A44]">
              <div className="h-full bg-[#2D7AFF] transition-all" style={{ width: `${100 - i * 12}%` }} />
            </div>
          </div>
        </GridCell>
      ))}
    </div>
  </div>
);

const IntelligenceSlide = () => (
  <div className="h-full grid grid-cols-12 gap-0">
    <div className="col-span-4 flex flex-col border-r border-[#2A2D35]">
      <div className="p-6 border-b border-[#1F2229] bg-[#1A1D24]">
        <div className="label-micro text-[#2D7AFF]">04 / INTELLIGENCE</div>
      </div>
      
      <div className="flex-1 flex flex-col px-6 py-4">
        <h2 className="text-2xl font-light text-[#F0F1F4] mb-3">
          Proprietary Analytics Engine
        </h2>
        <p className="text-sm text-[#9BA1AB] mb-4">
          50+ metrics developed by JLabs Research — unavailable anywhere else.
        </p>
        
        <div className="flex-1">
          <DataTable 
            headers={["METRIC", "TYPE", "STATUS"]}
            rows={[
              ["CARI", "Risk", { value: "LIVE", highlight: true }],
              ["ROSI", "Momentum", { value: "LIVE", highlight: true }],
              ["Divine Dip", "Signal", { value: "LIVE", highlight: true }],
              ["Token Rating", "Score", { value: "LIVE", highlight: true }],
              ["Whale Flow", "On-chain", { value: "LIVE", highlight: true }],
            ]}
          />
        </div>
      </div>

      <div className="p-4 border-t border-[#1F2229] bg-[#1A2A44]">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-[#2D7AFF]" strokeWidth={1.5} />
          <span className="text-xs text-[#2D7AFF]">Powered by JLabs Research</span>
        </div>
      </div>
    </div>

    <div className="col-span-8 grid grid-cols-3 gap-0">
      <GridCell className="p-5 flex flex-col">
        <div className="label-micro text-[#9BA1AB] mb-2">JLABS ANALYTICS</div>
        <div className="flex-1 space-y-3 mt-4">
          {[
            { name: "CARI", value: 0.42, desc: "Risk Indicator" },
            { name: "ROSI", value: 0.68, desc: "Momentum" },
            { name: "DXY Risk", value: -0.15, desc: "Dollar Correlation" }
          ].map((metric, i) => (
            <div key={i} className="p-3 bg-[#1A1D24]">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-[#9BA1AB]">{metric.name}</span>
                <span className="font-mono text-lg tabular-nums text-[#F0F1F4]">{metric.value}</span>
              </div>
              <div className="text-[10px] text-[#5C626D]">{metric.desc}</div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <SparkLine data={[0.3, 0.35, 0.32, 0.4, 0.38, 0.42]} width={180} height={40} />
        </div>
      </GridCell>

      <GridCell className="p-5 flex flex-col">
        <div className="label-micro text-[#9BA1AB] mb-2">ON-CHAIN INTEL</div>
        <div className="flex-1 space-y-3 mt-4">
          {[
            { name: "Wallet Activity", value: "+12.4K", positive: true },
            { name: "Gas Metrics", value: "24 gwei", positive: null },
            { name: "Staking Yield", value: "4.2%", positive: true },
            { name: "Flow Analysis", value: "+$8.2M", positive: true }
          ].map((metric, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-[#1F2229]">
              <span className="text-xs text-[#9BA1AB]">{metric.name}</span>
              <span className={cn(
                "font-mono text-sm",
                metric.positive === true && "text-[#12B76A]",
                metric.positive === false && "text-[#F04438]",
                metric.positive === null && "text-[#F0F1F4]"
              )}>{metric.value}</span>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <SparkLine data={[45, 52, 48, 58, 55, 62, 60, 68]} width={180} height={40} color="#12B76A" />
        </div>
      </GridCell>

      <GridCell className="p-5 flex flex-col" showCrosshair={false}>
        <div className="label-micro text-[#9BA1AB] mb-2">ORDERFLOW</div>
        <div className="flex-1 space-y-3 mt-4">
          {[
            { name: "Whale Detection", value: "3 alerts", variant: "warning" as const },
            { name: "CVD", value: "+2.4M", variant: "success" as const },
            { name: "Bid/Ask Ratio", value: "1.24", variant: "default" as const },
            { name: "Liquidity", value: "High", variant: "success" as const }
          ].map((metric, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-[#1F2229]">
              <span className="text-xs text-[#9BA1AB]">{metric.name}</span>
              <Tag variant={metric.variant}>{metric.value}</Tag>
            </div>
          ))}
        </div>
        <div className="mt-4 h-10 flex items-end gap-0.5">
          {[65, 72, 58, 80, 75, 85, 70, 90, 82, 78].map((v, i) => (
            <div 
              key={i} 
              className="flex-1" 
              style={{ 
                height: `${v}%`, 
                background: i < 5 ? '#F04438' : '#12B76A',
                opacity: 0.7
              }} 
            />
          ))}
        </div>
      </GridCell>
    </div>
  </div>
);

const FlagshipSlide = () => (
  <div className="h-full grid grid-cols-12 gap-0">
    <div className="col-span-5 flex flex-col border-r border-[#2A2D35]">
      <div className="p-6 border-b border-[#1F2229] bg-[rgba(18, 183, 106, 0.15)]">
        <Tag variant="success">FLAGSHIP METRIC</Tag>
      </div>
      
      <div className="flex-1 flex flex-col justify-center px-8 py-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-4xl font-light text-[#F0F1F4] mb-2">
            Divine Dip™
          </h2>
          <p className="text-base text-[#9BA1AB] mb-6">
            Spots market bottoms at peak fear — the perfect moment to enter.
          </p>
          
          <div className="space-y-3 mb-6">
            {[
              "Volatility pattern analysis",
              "Multi-timeframe confirmation", 
              "Binary signal: 1 = buy, 0 = hold"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-[#1A1D24]">
                <Sparkles className="w-4 h-4 text-[#12B76A]" />
                <span className="text-sm text-[#F0F1F4]">{feature}</span>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#1A2A44] border-l-2 border-[#2D7AFF]">
            <p className="text-sm text-[#2D7AFF] italic">
              "Tools that predict Chaos & Opportunity"
            </p>
          </div>
        </motion.div>
      </div>

      <div className="p-6 border-t border-[#1F2229]">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-mono text-2xl text-[#12B76A]">84%</div>
            <div className="text-[10px] text-[#5C626D]">WIN RATE (BT)</div>
          </div>
          <div>
            <div className="font-mono text-2xl text-[#F0F1F4]">4H/1D</div>
            <div className="text-[10px] text-[#5C626D]">TIMEFRAMES</div>
          </div>
        </div>
      </div>
    </div>

    <div className="col-span-7 flex flex-col">
      <div className="px-6 py-3 border-b border-[#1F2229] bg-[#1A1D24] flex justify-between items-center">
        <span className="label-micro text-[#9BA1AB]">BTC/USDT • 4H TIMEFRAME</span>
        <LiveIndicator />
      </div>
      
      <GridCell className="flex-1 p-6" showCrosshair={false}>
        <div className="h-44 relative mb-4">
          <svg width="100%" height="100%" viewBox="0 0 500 160" preserveAspectRatio="none">
            <defs>
              <pattern id="chartGrid" width="50" height="32" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 32" fill="none" stroke="#1F2229" strokeWidth="0.5"/>
              </pattern>
              <pattern id="hatchGreen" width="4" height="4" patternUnits="userSpaceOnUse">
                <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="#12B76A" strokeWidth="0.5" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#chartGrid)" />
            
            {/* Price path */}
            <path 
              d="M0,50 L50,60 L100,80 L150,110 L200,100 L250,70 L300,50 L350,35 L400,25 L450,28 L500,15" 
              fill="none" 
              stroke="#2D7AFF" 
              strokeWidth="1.5"
            />
            
            {/* Divine Dip zone */}
            <rect x="130" y="85" width="40" height="50" fill="url(#hatchGreen)" />
            
            {/* Signal point */}
            <circle cx="150" cy="110" r="8" fill="#12B76A" />
            <circle cx="150" cy="110" r="4" fill="white" />
            
            {/* Annotation */}
            <line x1="150" y1="110" x2="150" y2="140" stroke="#12B76A" strokeWidth="1" strokeDasharray="2" />
            <rect x="110" y="140" width="80" height="16" fill="#12B76A" />
            <text x="150" y="151" fontSize="9" fill="white" textAnchor="middle" fontFamily="monospace">DIVINE DIP</text>
          </svg>
        </div>

        <div className="grid grid-cols-4 gap-0 border border-[#2A2D35]">
          {[
            { label: "SIGNAL", value: "1", status: "active" },
            { label: "ENTRY PRICE", value: "$91,500" },
            { label: "CURRENT", value: "$97,842" },
            { label: "P&L", value: "+6.93%", positive: true }
          ].map((item, i) => (
            <div key={i} className={cn(
              "p-3 text-center",
              i < 3 && "border-r border-[#1F2229]"
            )}>
              <div className="label-micro text-[#5C626D] mb-1">{item.label}</div>
              <div className={cn(
                "font-mono text-lg tabular-nums",
                item.status === "active" && "text-[#12B76A]",
                item.positive && "text-[#12B76A]",
                !item.status && !item.positive && "text-[#F0F1F4]"
              )}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </GridCell>
      
      <div className="grid grid-cols-3 border-t border-[#2A2D35]">
        {[
          { label: "LAST SIGNAL", value: "Dec 18", desc: "2 days ago" },
          { label: "SIGNALS YTD", value: "24", desc: "avg 2/month" },
          { label: "AVG RETURN", value: "+8.2%", desc: "per signal" }
        ].map((item, i) => (
          <div key={i} className={cn("p-4", i < 2 && "border-r border-[#1F2229]")}>
            <div className="label-micro text-[#5C626D] mb-1">{item.label}</div>
            <div className="font-mono text-base text-[#F0F1F4]">{item.value}</div>
            <div className="text-[10px] text-[#5C626D]">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TradingSlide = () => (
  <div className="h-full grid grid-cols-12 gap-0">
    <div className="col-span-4 flex flex-col border-r border-[#2A2D35]">
      <div className="p-6 border-b border-[#1F2229] bg-[#1A1D24]">
        <div className="label-micro text-[#2D7AFF]">06 / UNIFIED TRADING</div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center px-8 py-6">
        <h2 className="text-2xl font-light text-[#F0F1F4] mb-4">
          DEX + CEX<br/>One Platform
        </h2>
        <p className="text-sm text-[#9BA1AB] mb-6">
          Research → Intelligence → Execution<br/>
          Complete trading flow in one place.
        </p>
        
        <div className="space-y-3">
          {[
            { step: "01", label: "Research", desc: "Charts & data" },
            { step: "02", label: "Analyze", desc: "Proprietary metrics" },
            { step: "03", label: "Execute", desc: "Cross-exchange" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 border border-[#1F2229]">
              <span className="font-mono text-xs text-[#2D7AFF]">{item.step}</span>
              <div className="flex-1">
                <div className="text-sm text-[#F0F1F4]">{item.label}</div>
                <div className="text-[10px] text-[#5C626D]">{item.desc}</div>
              </div>
              {i < 2 && <ArrowRight className="w-3 h-3 text-[#2A2D35]" />}
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-[#1F2229] bg-[#1A2A44]">
        <div className="label-micro text-[#2D7AFF] mb-1">MONTHLY VOLUME</div>
        <div className="font-mono text-2xl text-[#2D7AFF]">$50M+</div>
      </div>
    </div>

    <div className="col-span-8 grid grid-cols-2 grid-rows-[auto_1fr_auto] gap-0">
      <div className="col-span-2 grid grid-cols-2 border-b border-[#1F2229]">
        <div className="p-4 border-r border-[#1F2229] bg-[#1A1D24] flex items-center gap-3">
          <Globe className="w-5 h-5 text-[#2D7AFF]" strokeWidth={1.5} />
          <div>
            <div className="text-sm text-[#F0F1F4]">Centralized (CEX)</div>
            <div className="text-[10px] text-[#9BA1AB]">Direct API integration</div>
          </div>
        </div>
        <div className="p-4 bg-[#1A1D24] flex items-center gap-3">
          <Wallet className="w-5 h-5 text-[#12B76A]" strokeWidth={1.5} />
          <div>
            <div className="text-sm text-[#F0F1F4]">Decentralized (DEX)</div>
            <div className="text-[10px] text-[#9BA1AB]">Smart routing enabled</div>
          </div>
        </div>
      </div>
      
      <GridCell className="p-5">
        <div className="space-y-2">
          {[
            { name: "Binance", type: "Spot & Futures" },
            { name: "Bybit", type: "Spot & Futures" },
            { name: "Hyperliquid", type: "Perpetuals" }
          ].map((exchange, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-[#1A1D24]">
              <div>
                <div className="text-sm text-[#F0F1F4]">{exchange.name}</div>
                <div className="text-[10px] text-[#5C626D]">{exchange.type}</div>
              </div>
              <Tag variant="success">LIVE</Tag>
            </div>
          ))}
        </div>
      </GridCell>

      <GridCell className="p-5" showCrosshair={false}>
        <div className="space-y-2">
          {[
            { name: "Ethereum", tokens: "1000+ tokens" },
            { name: "Base", tokens: "500+ tokens" },
            { name: "Solana", tokens: "800+ tokens" }
          ].map((chain, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-[#1A1D24]">
              <div>
                <div className="text-sm text-[#F0F1F4]">{chain.name}</div>
                <div className="text-[10px] text-[#5C626D]">{chain.tokens}</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#5C626D]" />
            </div>
          ))}
        </div>
      </GridCell>
      
      <div className="col-span-2 p-4 bg-[#1A1D24] border-t border-[#1F2229] flex items-center justify-between">
        <div className="text-xs text-[#9BA1AB]">+ Custom token support via contract address</div>
        <div className="flex gap-6">
          <div className="text-center">
            <div className="font-mono text-lg text-[#F0F1F4]">3</div>
            <div className="text-[10px] text-[#5C626D]">CEX</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-lg text-[#F0F1F4]">3</div>
            <div className="text-[10px] text-[#5C626D]">CHAINS</div>
          </div>
          <div className="text-center">
            <div className="font-mono text-lg text-[#12B76A]">2300+</div>
            <div className="text-[10px] text-[#5C626D]">TOKENS</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const MarketSlide = () => (
  <div className="h-full grid grid-cols-12 gap-0">
    <div className="col-span-4 flex flex-col border-r border-[#2A2D35]">
      <div className="p-6 border-b border-[#1F2229] bg-[#1A1D24]">
        <div className="label-micro text-[#2D7AFF]">07 / MARKET</div>
      </div>
      
      <div className="flex-1 flex flex-col px-6 py-4">
        <h2 className="text-2xl font-light text-[#F0F1F4] mb-3">
          The Crypto Trading Market
        </h2>
        <p className="text-sm text-[#9BA1AB] mb-4">
          Massive and growing. Underserved by current tools.
        </p>
        
        <div className="flex-1">
          <DataTable
            headers={["SEGMENT", "SIZE", "CAGR"]}
            rows={[
              ["Global Crypto", "$1.5T+", "12.8%"],
              ["Trading Tools", "$50B+", "18.4%"],
              ["Pro Terminals", "$500M+", "24.2%"],
            ]}
            highlightLast
          />
        </div>
      </div>

      <div className="grid grid-cols-2 border-t border-[#1F2229]">
        <div className="p-4 border-r border-[#1F2229]">
          <div className="font-mono text-xl text-[#2D7AFF]">580M+</div>
          <div className="text-[10px] text-[#5C626D]">CRYPTO HOLDERS</div>
        </div>
        <div className="p-4">
          <div className="font-mono text-xl text-[#12B76A]">+42%</div>
          <div className="text-[10px] text-[#5C626D]">YOY GROWTH</div>
        </div>
      </div>
    </div>

    <div className="col-span-8 flex flex-col">
      <div className="px-6 py-3 border-b border-[#1F2229] bg-[#1A1D24]">
        <span className="label-micro text-[#9BA1AB]">MARKET OPPORTUNITY FUNNEL</span>
      </div>
      
      <GridCell className="flex-1 p-6" showCrosshair={false}>
        <div className="h-full flex flex-col justify-center space-y-4">
          {[
            { label: "TAM", value: "$1.5T+", desc: "Total Addressable Market", width: 100, color: "#2D7AFF" },
            { label: "SAM", value: "$50B+", desc: "Serviceable Addressable Market", width: 65, color: "#5294FF" },
            { label: "SOM", value: "$500M+", desc: "Serviceable Obtainable Market", width: 35, color: "#12B76A" }
          ].map((tier, i) => (
            <motion.div
              key={i}
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: `${tier.width}%`, opacity: 1 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
            >
              <div 
                className="p-4 flex justify-between items-center"
                style={{ 
                  background: `repeating-linear-gradient(90deg, ${tier.color}15, ${tier.color}15 4px, transparent 4px, transparent 8px)`,
                  borderLeft: `3px solid ${tier.color}`
                }}
              >
                <div>
                  <div className="label-micro" style={{ color: tier.color }}>{tier.label}</div>
                  <div className="text-xs text-[#9BA1AB] mt-1">{tier.desc}</div>
                </div>
                <div className="font-mono text-2xl" style={{ color: tier.color }}>{tier.value}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </GridCell>
      
      <div className="grid grid-cols-4 border-t border-[#2A2D35]">
        {[
          { value: "580M+", label: "Crypto holders" },
          { value: "42%", label: "Trader growth YoY" },
          { value: "$2.1B", label: "Daily DEX volume" },
          { value: "24.2%", label: "Terminal CAGR" }
        ].map((stat, i) => (
          <div key={i} className={cn("p-4 text-center", i < 3 && "border-r border-[#1F2229]")}>
            <div className="font-mono text-lg text-[#2D7AFF]">{stat.value}</div>
            <div className="text-[10px] text-[#5C626D]">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TractionSlide = () => (
  <div className="h-full grid grid-cols-12 gap-0">
    <div className="col-span-4 flex flex-col border-r border-[#2A2D35]">
      <div className="p-6 border-b border-[#1F2229] bg-[#1A1D24]">
        <div className="label-micro text-[#2D7AFF]">08 / TRACTION</div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center px-6 py-4">
        <h2 className="text-2xl font-light text-[#F0F1F4] mb-3">
          Growth Across Every Metric
        </h2>
        <LiveIndicator label="LIVE METRICS" />
        
        <div className="mt-6 space-y-3">
          {[
            { label: "Community", value: "12,700", change: "+127%" },
            { label: "MAU", value: "4,200", change: "+85%" },
            { label: "Volume", value: "$58.6M", change: "+200%" },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-[#1A1D24]">
              <span className="text-sm text-[#9BA1AB]">{item.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base text-[#F0F1F4]">{item.value}</span>
                <span className="font-mono text-xs text-[#12B76A]">{item.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-[#1F2229] bg-[rgba(18, 183, 106, 0.15)]">
        <div className="label-micro text-[#12B76A] mb-1">ARR TRAJECTORY</div>
        <div className="font-mono text-2xl text-[#12B76A]">$342K</div>
        <div className="text-xs text-[#12B76A]/70">+200% YoY growth</div>
      </div>
    </div>

    <div className="col-span-8 grid grid-rows-[1fr_1fr] gap-0">
      <GridCell className="p-5 grid grid-cols-3 gap-4">
        <div className="flex flex-col">
          <div className="label-micro text-[#5C626D] mb-1">COMMUNITY</div>
          <div className="font-mono text-2xl tabular-nums text-[#F0F1F4]">12,700</div>
          <div className="flex items-center gap-1 text-[#12B76A] text-xs font-mono mt-1">
            <TrendingUp className="w-3 h-3" /> +127% MoM
          </div>
          <div className="mt-auto pt-3">
            <SparkLine data={performanceData.map(d => d.users)} width={140} height={40} showArea />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="label-micro text-[#5C626D] mb-1">MONTHLY ACTIVE</div>
          <div className="font-mono text-2xl tabular-nums text-[#F0F1F4]">4,200</div>
          <div className="flex items-center gap-1 text-[#12B76A] text-xs font-mono mt-1">
            <TrendingUp className="w-3 h-3" /> +85% MoM
          </div>
          <div className="mt-auto pt-3">
            <SparkLine data={[800, 1200, 1800, 2400, 3200, 4200]} width={140} height={40} color="#12B76A" showArea />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="label-micro text-[#5C626D] mb-1">TRADING VOLUME</div>
          <div className="font-mono text-2xl tabular-nums text-[#F0F1F4]">$58.6M</div>
          <div className="flex items-center gap-1 text-[#12B76A] text-xs font-mono mt-1">
            <TrendingUp className="w-3 h-3" /> +200% QoQ
          </div>
          <div className="mt-auto pt-3">
            <SparkLine data={performanceData.map(d => d.volume)} width={140} height={40} color="#9BA1AB" showArea />
          </div>
        </div>
      </GridCell>

      <GridCell className="p-5" showCrosshair={false}>
        <div className="flex justify-between items-center mb-3">
          <span className="label-micro text-[#9BA1AB]">USER GROWTH (2024)</span>
          <div className="flex gap-4">
            {[
              { color: "#2D7AFF", label: "Users" },
              { color: "#12B76A", label: "Revenue ($K)" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2" style={{ background: item.color }} />
                <span className="text-[10px] text-[#9BA1AB]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="h-28 flex items-end gap-2">
          {performanceData.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex gap-0.5 items-end h-20">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.users / 12700) * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="flex-1 bg-[#2D7AFF]"
                />
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.revenue / 342) * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1 + 0.05 }}
                  className="flex-1 bg-[#12B76A]"
                />
              </div>
              <span className="text-[9px] text-[#5C626D]">{d.month}</span>
            </div>
          ))}
        </div>
      </GridCell>
    </div>
  </div>
);

const CompetitionSlide = () => {
  const competitors = [
    { name: "TradingView", charting: true, metrics: false, execution: false, defi: false },
    { name: "Glassnode", charting: false, metrics: true, execution: false, defi: false },
    { name: "Nansen", charting: false, metrics: true, execution: false, defi: true },
    { name: "Dexscreener", charting: true, metrics: false, execution: false, defi: true },
    { name: "PANDA", charting: true, metrics: true, execution: true, defi: true },
  ];

  return (
    <div className="h-full grid grid-cols-12 gap-0">
      <div className="col-span-4 flex flex-col border-r border-[#2A2D35]">
        <div className="p-6 border-b border-[#1F2229] bg-[#1A1D24]">
          <div className="label-micro text-[#2D7AFF]">09 / LANDSCAPE</div>
        </div>
        
        <div className="flex-1 flex flex-col justify-center px-6 py-4">
          <h2 className="text-2xl font-light text-[#F0F1F4] mb-3">
            Competitive Analysis
          </h2>
          <p className="text-sm text-[#9BA1AB] mb-6">
            Fragmented tools force traders to use 5-10 platforms. PANDA unifies everything.
          </p>
          
          <div className="p-4 bg-[#1A2A44] border-l-2 border-[#2D7AFF]">
            <p className="text-sm text-[#2D7AFF] font-medium">
              PANDA is the only full-stack terminal
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-[#1F2229]">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-mono text-xl text-[#2D7AFF]">4/4</div>
              <div className="text-[10px] text-[#5C626D]">FEATURES</div>
            </div>
            <div>
              <div className="font-mono text-xl text-[#12B76A]">100%</div>
              <div className="text-[10px] text-[#5C626D]">COVERAGE</div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-8 flex flex-col">
        <div className="px-6 py-3 border-b border-[#1F2229] bg-[#1A1D24]">
          <span className="label-micro text-[#9BA1AB]">FEATURE COMPARISON MATRIX</span>
        </div>
        
        <GridCell className="flex-1 p-0" showCrosshair={false}>
          <table className="w-full">
            <thead>
              <tr className="bg-[#1A1D24]">
                {["PLATFORM", "CHARTING", "METRICS", "EXECUTION", "DEFI"].map((h, i) => (
                  <th key={i} className="label-micro text-[#9BA1AB] p-4 text-left border-b border-[#2A2D35]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {competitors.map((c, ri) => (
                <tr 
                  key={ri} 
                  className={cn(
                    "border-b border-[#1F2229]",
                    ri === competitors.length - 1 && "bg-[#1A2A44]"
                  )}
                >
                  <td className={cn(
                    "p-4 text-sm",
                    ri === competitors.length - 1 ? "text-[#2D7AFF] font-medium" : "text-[#F0F1F4]"
                  )}>
                    {c.name}
                  </td>
                  {[c.charting, c.metrics, c.execution, c.defi].map((has, ci) => (
                    <td key={ci} className="p-4 text-center">
                      {has ? (
                        <div className="w-4 h-4 rounded-full bg-[#12B76A] mx-auto" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-[#1F2229] mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </GridCell>
      </div>
    </div>
  );
};

const ModelSlide = () => (
  <div className="h-full grid grid-cols-12 gap-0">
    <div className="col-span-4 flex flex-col border-r border-[#2A2D35]">
      <div className="p-6 border-b border-[#1F2229] bg-[#1A1D24]">
        <div className="label-micro text-[#2D7AFF]">10 / REVENUE</div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center px-6 py-4">
        <h2 className="text-2xl font-light text-[#F0F1F4] mb-3">
          Business Model
        </h2>
        <p className="text-sm text-[#9BA1AB] mb-6">
          Multiple revenue streams for sustainable growth.
        </p>
        
        <div className="space-y-3">
          {[
            { tier: "Free", price: "$0", features: "Basic charts, limited metrics" },
            { tier: "Pro", price: "$29", features: "Full metrics, alerts" },
            { tier: "Elite", price: "$99", features: "Priority support, API" },
            { tier: "Enterprise", price: "$299", features: "Custom, dedicated" },
          ].map((item, i) => (
            <div key={i} className={cn("flex justify-between items-center p-3", i === 1 ? "bg-[#1A2A44] border border-[#2D7AFF]" : "bg-[#1A1D24]")}>
              <div>
                <div className="text-sm text-[#F0F1F4]">{item.tier}</div>
                <div className="text-[10px] text-[#5C626D]">{item.features}</div>
              </div>
              <span className={cn("font-mono text-base", i === 1 ? "text-[#2D7AFF]" : "text-[#F0F1F4]")}>{item.price}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-[#1F2229]">
        <div className="label-micro text-[#5C626D] mb-1">LTV:CAC RATIO</div>
        <div className="font-mono text-2xl text-[#12B76A]">4.2x</div>
      </div>
    </div>

    <div className="col-span-8 grid grid-rows-[1fr_auto] gap-0">
      <GridCell className="p-6 grid grid-cols-2 gap-6">
        <div className="flex flex-col justify-center">
          <DonutChart 
            segments={[
              { value: 40, label: "Freemium SaaS", color: "#2D7AFF" },
              { value: 30, label: "Trading Fees", color: "#5294FF" },
              { value: 20, label: "Data/API", color: "#12B76A" },
              { value: 10, label: "Community", color: "#9BA1AB" }
            ]}
            size={120}
          />
        </div>

        <div>
          <div className="label-micro text-[#9BA1AB] mb-4">REVENUE BREAKDOWN</div>
          <div className="space-y-3">
            {[
              { name: "Freemium SaaS", value: 40, desc: "Subscription tiers" },
              { name: "Trading Fees", value: 30, desc: "Execution commissions" },
              { name: "Data/API", value: 20, desc: "Enterprise access" },
              { name: "Community", value: 10, desc: "Premium features" }
            ].map((stream, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-[#F0F1F4]">{stream.name}</span>
                  <span className="font-mono text-sm text-[#2D7AFF]">{stream.value}%</span>
                </div>
                <div className="h-1.5 bg-[#1A1D24]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stream.value}%` }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="h-full bg-[#2D7AFF]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </GridCell>
      
      <div className="grid grid-cols-4 border-t border-[#2A2D35]" >
        {[
          { label: "MRR", value: "$28.5K" },
          { label: "CHURN", value: "2.4%" },
          { label: "NPS", value: "72" },
          { label: "ARPU", value: "$47" }
        ].map((item, i) => (
          <div key={i} className={cn("p-4 text-center", i < 3 && "border-r border-[#1F2229]")}>
            <div className="font-mono text-lg text-[#F0F1F4]">{item.value}</div>
            <div className="text-[10px] text-[#5C626D]">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const TeamSlide = () => (
  <div className="h-full grid grid-cols-12 gap-0">
    <div className="col-span-4 flex flex-col border-r border-[#2A2D35]">
      <div className="p-6 border-b border-[#1F2229] bg-[#1A1D24]">
        <div className="label-micro text-[#2D7AFF]">11 / TEAM</div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center px-6 py-4">
        <h2 className="text-2xl font-light text-[#F0F1F4] mb-3">
          Team & Partners
        </h2>
        <p className="text-sm text-[#9BA1AB] mb-6">
          Domain experts in fintech, crypto markets, and quantitative research.
        </p>
        
        <div className="space-y-3">
          {[
            { label: "Years in Crypto", value: "7+" },
            { label: "Combined Trading", value: "$500M+" },
            { label: "Products Built", value: "12+" },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-[#1A1D24]">
              <span className="text-sm text-[#9BA1AB]">{item.label}</span>
              <span className="font-mono text-base text-[#2D7AFF]">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-[#1F2229]">
        <div className="label-micro text-[#5C626D] mb-2">HIRING</div>
        <div className="flex gap-2">
          {['ENG', 'DATA', 'GROWTH'].map((role, i) => (
            <span key={i} className="px-2 py-1 bg-[#1A2A44] text-[10px] text-[#2D7AFF]">{role}</span>
          ))}
        </div>
      </div>
    </div>

    <div className="col-span-8 grid grid-cols-2 grid-rows-[auto_1fr] gap-0">
      <div className="col-span-2 px-6 py-3 border-b border-[#1F2229] bg-[#1A1D24]">
        <span className="label-micro text-[#9BA1AB]">CORE TEAM & PARTNERS</span>
      </div>
      
      <GridCell className="p-6 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 border-2 border-[#2D7AFF] flex items-center justify-center mb-4">
          <Users className="w-7 h-7 text-[#2D7AFF]" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg text-[#F0F1F4] mb-2">Founding Team</h3>
        <p className="text-sm text-[#9BA1AB] mb-4">Fintech & Crypto Veterans</p>
        <div className="space-y-2 text-xs text-[#5C626D]">
          <div className="p-2 bg-[#1A1D24]">Ex-Trading Desk Experience</div>
          <div className="p-2 bg-[#1A1D24]">Technical Product Background</div>
          <div className="p-2 bg-[#1A1D24]">Crypto Native Since 2017</div>
        </div>
      </GridCell>

      <GridCell className="p-6 flex flex-col items-center justify-center text-center" showCrosshair={false}>
        <div className="w-16 h-16 border-2 border-[#12B76A] flex items-center justify-center mb-4">
          <Cpu className="w-7 h-7 text-[#12B76A]" strokeWidth={1.5} />
        </div>
        <h3 className="text-lg text-[#F0F1F4] mb-2">JLabs Research</h3>
        <p className="text-sm text-[#9BA1AB] mb-4">Analytics Partner</p>
        <div className="space-y-2 text-xs text-[#5C626D]">
          <div className="p-2 bg-[#1A1D24]">Quantitative Research</div>
          <div className="p-2 bg-[#1A1D24]">Proprietary Indicators</div>
          <div className="p-2 bg-[#1A1D24]">Market Microstructure</div>
        </div>
      </GridCell>
    </div>
  </div>
);

const AskSlide = () => (
  <div className="h-full grid grid-cols-12 gap-0">
    <div className="col-span-5 flex flex-col border-r border-[#2A2D35]">
      <div className="p-6 border-b border-[#1F2229] bg-[#1A1D24]">
        <div className="label-micro text-[#2D7AFF]">12 / THE ASK</div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center px-8 py-6">
        <h2 className="text-3xl font-light text-[#F0F1F4] mb-4">
          Raising Seed Round
        </h2>
        <p className="text-[#9BA1AB] mb-6">
          Accelerating product development and market expansion.
        </p>
        
        <div className="p-5 bg-[#1A2A44] border-l-2 border-[#2D7AFF]">
          <div className="label-micro text-[#2D7AFF] mb-2">TARGET RAISE</div>
          <div className="font-mono text-4xl text-[#2D7AFF]">$2-4M</div>
          <div className="text-sm text-[#9BA1AB] mt-2">Seed / Series A</div>
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-[#1F2229]">
        {[
          { label: "RUNWAY", value: "18mo" },
          { label: "HIRES", value: "8-12" },
          { label: "BREAK-EVEN", value: "Q4'26" }
        ].map((item, i) => (
          <div key={i} className={cn("p-4 text-center", i < 2 && "border-r border-[#1F2229]")}>
            <div className="font-mono text-lg text-[#F0F1F4]">{item.value}</div>
            <div className="text-[10px] text-[#5C626D]">{item.label}</div>
          </div>
        ))}
      </div>
    </div>

    <div className="col-span-7 flex flex-col">
      <div className="px-6 py-3 border-b border-[#1F2229] bg-[#1A1D24]">
        <span className="label-micro text-[#9BA1AB]">USE OF FUNDS</span>
      </div>
      
      <GridCell className="flex-1 p-6" showCrosshair={false}>
        <div className="space-y-4">
          {[
            { label: "Engineering", value: 40, amount: "$1.2M", desc: "Core platform & infrastructure" },
            { label: "Growth", value: 25, amount: "$750K", desc: "Marketing & user acquisition" },
            { label: "Operations", value: 20, amount: "$600K", desc: "Team expansion & compliance" },
            { label: "Research", value: 15, amount: "$450K", desc: "New metrics & analytics R&D" }
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between items-baseline mb-2">
                <div>
                  <span className="text-sm text-[#F0F1F4]">{item.label}</span>
                  <span className="text-xs text-[#5C626D] ml-2">{item.desc}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-sm text-[#9BA1AB]">{item.amount}</span>
                  <span className="font-mono text-base text-[#2D7AFF]">{item.value}%</span>
                </div>
              </div>
              <div className="h-2 bg-[#1A1D24] relative">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 0.8, delay: i * 0.15 }}
                  className="h-full"
                  style={{ 
                    background: `repeating-linear-gradient(90deg, #2D7AFF, #2D7AFF 3px, transparent 3px, transparent 6px)`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </GridCell>
      
      <div className="grid grid-cols-3 border-t border-[#2A2D35]">
        {[
          { label: "18-Month Runway", icon: Shield },
          { label: "Key Hires: 8-12", icon: Users },
          { label: "Break-even: Q4 2026", icon: Target }
        ].map((item, i) => (
          <div key={i} className={cn("p-4 flex items-center gap-3", i < 2 && "border-r border-[#1F2229]")}>
            <item.icon className="w-4 h-4 text-[#2D7AFF]" strokeWidth={1.5} />
            <span className="text-xs text-[#9BA1AB]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ClosingSlide = () => (
  <div className="h-full grid grid-cols-12 gap-0">
    <div className="col-span-7 flex flex-col border-r border-[#2A2D35]">
      <div className="p-6 border-b border-[#1F2229]">
        <div className="label-micro text-[#2D7AFF]">13 / GET STARTED</div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center px-12 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-[48px] font-light text-[#F0F1F4] mb-2 leading-tight">
            Don't just trade<span className="text-[#2D7AFF]">.</span>
          </h1>
          <h1 className="text-[48px] font-light text-[#2D7AFF] mb-6 leading-tight">
            Dominate.
          </h1>
          <p className="text-lg text-[#9BA1AB] mb-8">
            Your edge is waiting.
          </p>
          
          <div className="flex gap-3">
            <a href="https://pandaterminal.com" className="bp-btn-primary flex items-center gap-2">
              Try Free <ArrowRight className="w-4 h-4" />
            </a>
            <button className="bp-btn-secondary">
              Schedule Demo
            </button>
          </div>
        </motion.div>
      </div>

      <div className="p-6 border-t border-[#1F2229] bg-[#1A1D24]">
        <div className="flex items-center gap-6 text-sm text-[#9BA1AB]">
          <span>pandaterminal.com</span>
          <span className="text-[#2A2D35]">•</span>
          <span>hello@pandaterminal.com</span>
        </div>
      </div>
    </div>

    <div className="col-span-5 grid grid-rows-3 gap-0">
      <GridCell className="p-5 flex flex-col justify-center">
        <div className="label-micro text-[#5C626D] mb-3">PLATFORM STATUS</div>
        <div className="flex items-center gap-3 mb-4">
          <LiveIndicator label="OPERATIONAL" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-[#1A1D24]">
            <div className="text-[10px] text-[#5C626D]">UPTIME</div>
            <div className="font-mono text-lg text-[#F0F1F4]">99.97%</div>
          </div>
          <div className="p-3 bg-[#1A1D24]">
            <div className="text-[10px] text-[#5C626D]">LATENCY</div>
            <div className="font-mono text-lg text-[#F0F1F4]">&lt;50ms</div>
          </div>
        </div>
      </GridCell>

      <GridCell className="p-5 flex flex-col justify-center">
        <div className="label-micro text-[#5C626D] mb-3">KEY METRICS</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-[#1A1D24]">
            <div className="font-mono text-2xl text-[#F0F1F4]">12.7K</div>
            <div className="text-[10px] text-[#5C626D]">USERS</div>
          </div>
          <div className="p-3 bg-[rgba(18, 183, 106, 0.15)]">
            <div className="font-mono text-2xl text-[#12B76A]">$58.6M</div>
            <div className="text-[10px] text-[#5C626D]">VOLUME</div>
          </div>
        </div>
      </GridCell>

      <GridCell className="p-5 flex flex-col justify-center" showCrosshair={false}>
        <div className="label-micro text-[#5C626D] mb-3">LIVE MARKET</div>
        <div className="space-y-2">
          {[
            { pair: "BTC/USDT", price: "$97,842", change: "+2.41%" },
            { pair: "ETH/USDT", price: "$3,456", change: "+1.87%" },
            { pair: "SOL/USDT", price: "$198.45", change: "+4.23%" }
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center p-2 bg-[#1A1D24]">
              <span className="text-xs text-[#9BA1AB]">{item.pair}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-[#F0F1F4]">{item.price}</span>
                <span className="font-mono text-xs text-[#12B76A]">{item.change}</span>
              </div>
            </div>
          ))}
        </div>
      </GridCell>
    </div>
  </div>
);

// --- Slide Renderer ---
const SlideRenderer = ({ slideId, onNext }: { slideId: string, onNext: () => void }) => {
  const components: Record<string, React.ReactNode> = {
    "title": <HeroSlide onNext={onNext} />,
    "problem": <ProblemSlide />,
    "solution": <SolutionSlide />,
    "product": <ProductSlide />,
    "intelligence": <IntelligenceSlide />,
    "divine-dip": <FlagshipSlide />,
    "trading": <TradingSlide />,
    "market": <MarketSlide />,
    "traction": <TractionSlide />,
    "competition": <CompetitionSlide />,
    "model": <ModelSlide />,
    "team": <TeamSlide />,
    "ask": <AskSlide />,
    "closing": <ClosingSlide />,
  };

  return components[slideId] || null;
};

// --- Main Component ---
export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isIndexOpen, setIsIndexOpen] = useState(false);

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(prev => prev + 1);
    }
  }, [currentSlide]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(prev => prev - 1);
    }
  }, [currentSlide]);

  const jumpToSlide = useCallback((index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  }, [currentSlide]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isIndexOpen) {
        if (e.key === "Escape") setIsIndexOpen(false);
        return;
      }

      switch (e.key) {
        case "ArrowDown":
        case "ArrowRight":
        case " ":
        case "PageDown":
          e.preventDefault();
          nextSlide();
          break;
        case "ArrowUp":
        case "ArrowLeft":
        case "PageUp":
          e.preventDefault();
          prevSlide();
          break;
        case "Escape":
          setIsIndexOpen(false);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, isIndexOpen]);

  return (
    <main className="relative h-screen w-full bg-[#0A0B0E] overflow-hidden select-none">
      {/* Navigation Header */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-[#12141A] border-b border-[#2A2D35]">
        <div className="flex items-center gap-4">
          <PandaLogo size="small" showSubtext={false} />
          <div className="w-px h-4 bg-[#2A2D35]" />
          <span className="text-xs text-[#5C626D]">Investor Deck 2025</span>
        </div>

        <div className="flex items-center gap-6">
          {/* Progress bar */}
          <div className="hidden md:flex items-center gap-1 w-48">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => jumpToSlide(i)}
                className={cn(
                  "flex-1 h-1 transition-all duration-200",
                  currentSlide === i ? "bg-[#2D7AFF]" : currentSlide > i ? "bg-[#2D7AFF]/40" : "bg-[#1F2229]"
                )}
              />
            ))}
          </div>

          {/* Slide counter */}
          <span className="font-mono text-sm text-[#9BA1AB]">
            {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </span>

          {/* Menu */}
          <button 
            onClick={() => setIsIndexOpen(!isIndexOpen)} 
            className="p-2 border border-[#2A2D35] hover:border-[#2D7AFF] transition-colors"
          >
            {isIndexOpen ? <X className="w-4 h-4 text-[#F0F1F4]" strokeWidth={1.5} /> : <Menu className="w-4 h-4 text-[#F0F1F4]" strokeWidth={1.5} />}
          </button>
        </div>
      </nav>

      {/* Index Overlay */}
      <AnimatePresence>
        {isIndexOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#12141A] flex items-center justify-center p-8"
          >
            <div className="max-w-3xl w-full">
              <div className="label-micro text-[#2D7AFF] mb-6">DECK INDEX</div>
              <div className="grid grid-cols-2 gap-0 border border-[#2A2D35]">
                {slides.map((s, i) => (
                  <motion.button
                    key={s.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => { jumpToSlide(i); setIsIndexOpen(false); }}
                    className={cn(
                      "flex items-center gap-4 p-4 text-left border-b border-r border-[#1F2229] transition-colors",
                      currentSlide === i ? "bg-[#1A2A44]" : "hover:bg-[#1A1D24]"
                    )}
                  >
                    <span className="font-mono text-xs text-[#2D7AFF] w-6">{String(i + 1).padStart(2, '0')}</span>
                    <span className={cn(
                      "text-sm",
                      currentSlide === i ? "text-[#2D7AFF]" : "text-[#F0F1F4]"
                    )}>
                      {s.id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slide Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.section
          key={currentSlide}
          custom={direction}
          initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
          transition={{ duration: 0.4, ease: [0.2, 0, 0.2, 1] }}
          className="absolute inset-0 top-[57px] bottom-[57px]"
        >
          <SlideRenderer slideId={slides[currentSlide].id} onNext={nextSlide} />
        </motion.section>
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-30 px-6 py-3 flex justify-between items-center bg-[#12141A] border-t border-[#2A2D35]">
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="p-2 border border-[#2A2D35] hover:border-[#2D7AFF] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 text-[#F0F1F4]" strokeWidth={1.5} />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="p-2 border border-[#2A2D35] hover:border-[#2D7AFF] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4 text-[#F0F1F4]" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex items-center gap-6 text-xs text-[#5C626D]">
          <span className="hidden md:block">← → Navigate</span>
          <span>© 2025 PANDA Terminal</span>
        </div>
      </nav>
    </main>
  );
}
