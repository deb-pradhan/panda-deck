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
  variant = "light"
}: { 
  size?: "small" | "default" | "large" | "hero",
  showText?: boolean,
  showSubtext?: boolean,
  variant?: "light" | "dark"
}) => {
  // For large/hero sizes with subtext, use full logo (includes PANDA TERMINAL text)
  // For smaller sizes, use icon + text
  const useFullLogo = (size === "large" || size === "hero") && showSubtext;
  
  const sizes = {
    small: { icon: 28, logoHeight: 28, text: "text-base", gap: "gap-2" },
    default: { icon: 36, logoHeight: 36, text: "text-lg", gap: "gap-3" },
    large: { icon: 56, logoHeight: 80, text: "text-2xl", gap: "gap-4" },
    hero: { icon: 96, logoHeight: 120, text: "text-5xl", gap: "gap-6" },
  };
  
  const s = sizes[size];
  const textColor = variant === "light" ? "text-[#F0F1F4]" : "text-[#12141A]";
  
  // Full logo includes text, so just render the image
  if (useFullLogo) {
    const logoSrc = variant === "light" ? "/panda-logo-light.svg" : "/panda-logo-dark.svg";
    return (
      <img 
        src={logoSrc} 
        alt="PANDA Terminal" 
        style={{ height: s.logoHeight }}
        className="w-auto"
      />
    );
  }
  
  // Icon + optional text for smaller sizes
  const iconSrc = variant === "light" ? "/panda-icon.svg" : "/panda-icon-dark.svg";
  
  return (
    <div className={cn("flex items-center", s.gap)}>
      <img 
        src={iconSrc} 
        alt="PANDA" 
        width={s.icon} 
        height={s.icon}
        className="object-contain"
      />
      
      {showText && (
        <div className="flex flex-col">
          <span className={cn("font-light tracking-[0.1em]", s.text, textColor)}>
            PANDA
          </span>
          {showSubtext && (
            <span className={cn("text-sm tracking-[0.3em] opacity-60", textColor)}>
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
    className={cn("absolute text-[#2D7AFF] font-mono text-base font-medium z-10 hidden md:block", className)}
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
  const valueClass = size === "large" ? "text-3xl md:text-4xl" : size === "small" ? "text-xl" : "text-2xl md:text-3xl";
  
  return (
    <div className="p-4 md:p-5">
      <div className="label-micro text-[#5C626D] mb-2">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className={cn("font-mono tabular-nums text-[#F0F1F4]", valueClass)}>
          {value}
        </span>
        {suffix && <span className="text-sm text-[#9BA1AB]">{suffix}</span>}
      </div>
      {change && (
        <div className={cn(
          "flex items-center gap-1.5 mt-2 text-sm font-mono",
          change.positive ? "text-[#12B76A]" : "text-[#F04438]"
        )}>
          {change.positive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
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
          <th key={i} className="label-micro text-[#9BA1AB] text-left px-3 md:px-4 py-3 bg-[#1A1D24] border-b border-[#2A2D35]">
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
                  "font-mono text-sm md:text-base tabular-nums px-3 md:px-4 py-3",
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
      <div className="w-28 label-micro text-[#9BA1AB] shrink-0">{label}</div>
      <div className="flex-1 h-7 md:h-8 bg-[#1A1D24] relative">
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
        <div className="w-20 font-mono text-sm md:text-base tabular-nums text-right text-[#F0F1F4]">
          {value.toLocaleString()}
        </div>
      )}
    </div>
  );
};

// Donut Chart
const DonutChart = ({ 
  segments, 
  size = 140 
}: { 
  segments: { value: number, label: string, color: string }[],
  size?: number
}) => {
  const total = segments.reduce((acc, s) => acc + s.value, 0);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
      <svg width={size} height={size} className="transform -rotate-90 shrink-0">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1F2229"
          strokeWidth="14"
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
              strokeWidth="14"
              strokeDasharray={`${dashLength} ${circumference - dashLength}`}
              strokeDashoffset={-offset}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            />
          );
        })}
      </svg>
      <div className="space-y-2.5">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-3.5 h-3.5" style={{ background: seg.color }} />
            <span className="text-sm text-[#9BA1AB]">{seg.label}</span>
            <span className="font-mono text-sm text-[#F0F1F4]">{seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Live Status Indicator
const LiveIndicator = ({ label = "LIVE" }: { label?: string }) => (
  <div className="flex items-center gap-2.5">
    <div className="relative">
      <div className="w-2.5 h-2.5 rounded-full bg-[#12B76A]" />
      <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-[#12B76A] animate-ping opacity-75" />
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
    <span className={cn("inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider", variants[variant])}>
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
  <div className="flex flex-col items-center gap-3">
    <div className="w-14 h-14 md:w-16 md:h-16 border border-[#2D7AFF] flex items-center justify-center">
      <Icon className="w-6 h-6 md:w-7 md:h-7 text-[#2D7AFF]" strokeWidth={1.5} />
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

// --- Slide Data (Sequoia Format) ---
const slides = [
  { id: "purpose", type: "purpose" },      // 1. Company Purpose
  { id: "problem", type: "problem" },       // 2. Problem
  { id: "solution", type: "solution" },     // 3. Solution
  { id: "why-now", type: "why-now" },       // 4. Why Now
  { id: "market", type: "market" },         // 5. Market Potential
  { id: "competition", type: "competition" }, // 6. Competition
  { id: "product", type: "product" },       // 7. Product
  { id: "model", type: "model" },           // 8. Business Model
  { id: "team", type: "team" },             // 9. Team
  { id: "financials", type: "financials" }, // 10. Financials
  { id: "ask", type: "ask" },               // The Ask
  { id: "closing", type: "closing" },       // Closing CTA
];

// --- Slide Components ---

// SLIDE 1: Company Purpose (Sequoia)
const PurposeSlide = ({ onNext }: { onNext: () => void }) => (
  <div className="h-full flex flex-col lg:grid lg:grid-cols-12 gap-0 overflow-y-auto lg:overflow-hidden">
    {/* Left Panel - Title + Image */}
    <div className="lg:col-span-8 flex flex-col bg-[#0A0B0E] lg:border-r border-[#2A2D35]">
      <div className="p-4 md:p-6 border-b border-[#1F2229]">
        <div className="label-micro text-[#2D7AFF]">01 / COMPANY PURPOSE</div>
      </div>
      
      <div className="px-5 md:px-8 pt-6 md:pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 md:mb-6">
            <PandaLogo size="large" showSubtext={true} />
          </div>
          
          <p className="text-xl md:text-2xl text-[#F0F1F4] font-light leading-relaxed mb-4 md:mb-6">
            We turn retail crypto traders into <span className="text-[#2D7AFF]">institutional-grade operators</span> — in one platform.
          </p>

          <div className="flex flex-wrap gap-3 mb-6">
            <button onClick={onNext} className="bp-btn-primary flex items-center gap-2">
              View Deck <ArrowRight className="w-5 h-5" />
            </button>
            <a 
              href="https://www.app.pandaterminal.com/?referral=5caf965d339c" 
              target="_blank"
              rel="noopener noreferrer"
              className="bp-btn-secondary flex items-center gap-2"
            >
              Launch App <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>

      {/* Image with padding */}
      <div className="flex-1 p-4 md:p-6">
        <motion.img 
          src="/Attached_image.png" 
          alt="PANDA Terminal Interface"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full h-full object-contain object-top rounded-lg border border-[#2A2D35]"
        />
      </div>
    </div>

    {/* Right Panel - Stacked Stats */}
    <div className="lg:col-span-4 flex flex-col bg-[#12141A]">
      <div className="flex-1 flex flex-col">
        {[
          { value: "12.7K", label: "ACTIVE USERS", desc: "Growing 40% MoM" },
          { value: "$50B", label: "TRADING VOLUME", desc: "Cumulative volume" },
          { value: "50+", label: "PROPRIETARY METRICS", desc: "Institutional-grade signals" },
          { value: "$342K", label: "ARR", desc: "Recurring revenue" },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.1 }}
            className="flex-1 px-5 md:px-8 py-6 flex flex-col justify-center items-end text-right border-b border-[#2A2D35] last:border-b-0"
          >
            <div className="text-xs text-[#5C626D] tracking-wider mb-2">{stat.label}</div>
            <div className="font-mono text-3xl md:text-4xl text-[#2D7AFF] mb-1">{stat.value}</div>
            <div className="text-sm text-[#9BA1AB]">{stat.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
);

// SLIDE 2: Problem (Sequoia - sharper, more concrete)
const ProblemSlide = () => (
  <div className="h-full flex flex-col lg:grid lg:grid-cols-12 gap-0 overflow-y-auto lg:overflow-hidden">
    <div className="lg:col-span-5 flex flex-col lg:border-r border-[#2A2D35]">
      <div className="p-4 md:p-6 border-b border-[#1F2229] bg-[#1A1D24]">
        <div className="label-micro text-[#2D7AFF]">02 / THE PROBLEM</div>
      </div>
      
      <div className="flex-1 flex flex-col justify-start px-5 md:px-8 py-5 md:py-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl md:text-3xl font-light text-[#F0F1F4] mb-4 leading-tight">
            Crypto traders lose billions to information asymmetry
          </h2>
          <p className="text-base text-[#9BA1AB] leading-relaxed mb-5 md:mb-6">
            92% of traders are dissatisfied with their current tool stack. Every platform switch is a missed opportunity.
          </p>
          <div className="space-y-3">
            {[
              { pain: 'Fragmented tools', detail: '5-10 platforms daily' },
              { pain: 'No actionable intelligence', detail: "85% of 'signals' lose money" },
              { pain: 'Institutional lock-out', detail: '$24K/yr for Bloomberg' },
              { pain: 'Experience moat', detail: '3-5 years to profitability' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 md:p-4 bg-[rgba(240,68,56,0.08)] border-l-2 border-[#F04438]">
                <div className="flex-1">
                  <div className="text-base text-[#F0F1F4]">{item.pain}</div>
                  <div className="text-sm text-[#5C626D]">{item.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="p-4 md:p-6 border-t border-[#1F2229] bg-[rgba(240,68,56,0.15)]">
        <div className="label-micro text-[#F04438] mb-1">ESTIMATED ANNUAL LOSS</div>
        <div className="font-mono text-2xl md:text-3xl text-[#F04438]">$2.4B</div>
        <div className="text-sm text-[#F04438]/70">retail traders making uninformed decisions</div>
      </div>
    </div>

    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 lg:grid-rows-2 gap-0">
      <GridCell className="p-5 md:p-6 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <Database className="w-6 h-6 text-[#2D7AFF]" strokeWidth={1.5} />
          <span className="font-mono text-2xl md:text-3xl text-[#F04438]">1000+</span>
        </div>
        <div className="label-micro text-[#9BA1AB] mb-2">DATA SOURCES</div>
        <p className="text-sm text-[#5C626D] flex-1">Scattered across exchanges, aggregators, social — no single source of truth</p>
        <div className="mt-auto pt-4">
          <div className="h-3 bg-[#1A1D24] rounded-full overflow-hidden">
            <div className="h-full w-[85%] bg-[#F04438]" />
          </div>
          <div className="text-sm text-[#5C626D] mt-2">85% noise ratio</div>
        </div>
      </GridCell>

      <GridCell className="p-5 md:p-6 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <Layers className="w-6 h-6 text-[#2D7AFF]" strokeWidth={1.5} />
          <span className="font-mono text-2xl md:text-3xl text-[#F5B800]">5-10</span>
        </div>
        <div className="label-micro text-[#9BA1AB] mb-2">PLATFORMS JUGGLED</div>
        <p className="text-sm text-[#5C626D] flex-1">TradingView + Glassnode + Exchange + Discord + ...</p>
        <div className="mt-auto pt-4 flex gap-1">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={cn("flex-1 h-8 border", i < 5 ? "bg-[#F5B800]/20 border-[#F5B800]" : "bg-[#1A1D24] border-[#1F2229]")} />
          ))}
        </div>
      </GridCell>

      <GridCell className="p-5 md:p-6 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <Lock className="w-6 h-6 text-[#2D7AFF]" strokeWidth={1.5} />
          <span className="font-mono text-2xl md:text-3xl text-[#F0F1F4]">$24K</span>
        </div>
        <div className="label-micro text-[#9BA1AB] mb-2">ANNUAL TERMINAL COST</div>
        <p className="text-sm text-[#5C626D] flex-1">Bloomberg pricing excludes 99% of traders from professional tools</p>
        <div className="mt-auto pt-4 flex items-end gap-2 h-16">
          {[
            { v: 24, label: "BBG", color: "#F04438" },
            { v: 3, label: "PANDA", color: "#12B76A" },
            { v: 0.5, label: "Free", color: "#2D7AFF" },
          ].map((item, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div className="w-full" style={{ height: `${(item.v / 24) * 100}%`, background: item.color }} />
              <span className="text-xs text-[#5C626D] mt-1">{item.label}</span>
            </div>
          ))}
        </div>
      </GridCell>

      <GridCell className="p-5 md:p-6 flex flex-col" showCrosshair={false}>
        <div className="flex items-start justify-between mb-3">
          <TrendingUp className="w-6 h-6 text-[#2D7AFF]" strokeWidth={1.5} />
          <span className="font-mono text-2xl md:text-3xl text-[#9BA1AB]">3-5 yrs</span>
        </div>
        <div className="label-micro text-[#9BA1AB] mb-2">EXPERIENCE GAP</div>
        <p className="text-sm text-[#5C626D] flex-1">Years to develop pattern recognition that separates winners from losers</p>
        <div className="mt-auto pt-4">
          <div className="flex justify-between text-xs text-[#5C626D] mb-2">
            <span>BEGINNER</span>
            <span>PROFITABLE</span>
          </div>
          <div className="h-4 bg-gradient-to-r from-[#F04438] via-[#F5B800] to-[#12B76A] relative">
            <div className="absolute left-[20%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#12141A] border-2 border-[#F04438]" />
          </div>
        </div>
      </GridCell>
    </div>
  </div>
);

// SLIDE 3: Solution (Sequoia - transformation focused)
const SolutionSlide = () => (
  <div className="h-full flex flex-col lg:grid lg:grid-cols-12 gap-0 overflow-y-auto lg:overflow-hidden">
    <div className="lg:col-span-5 flex flex-col lg:border-r border-[#2A2D35]">
      <div className="p-4 md:p-6 border-b border-[#1F2229] bg-[#1A1D24]">
        <div className="label-micro text-[#2D7AFF]">03 / THE SOLUTION</div>
      </div>
      
      <div className="flex-1 flex flex-col justify-start px-5 md:px-8 py-5 md:py-6">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2 className="text-2xl md:text-3xl font-light text-[#F0F1F4] mb-4 leading-tight">
            The Bloomberg Terminal for Crypto
          </h2>
          <p className="text-base text-[#9BA1AB] leading-relaxed mb-5 md:mb-6">
            PANDA unifies research, proprietary analytics, and execution — making institutional-grade trading accessible to everyone.
          </p>
          
          {/* Transformation Table */}
          <div className="space-y-2 mb-6">
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="label-micro text-[#5C626D]">BEFORE</div>
              <div className="label-micro text-[#2D7AFF]">AFTER</div>
            </div>
            {[
              { before: "5-10 fragmented tools", after: "One unified terminal" },
              { before: "Raw data overload", after: "50+ actionable metrics" },
              { before: "Platform hopping", after: "CEX + DEX in one click" },
              { before: "Years to develop edge", after: "AI-powered signals day one" },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="grid grid-cols-2 gap-2"
              >
                <div className="p-3 bg-[rgba(240,68,56,0.08)] border-l-2 border-[#F04438] text-sm text-[#9BA1AB]">{item.before}</div>
                <div className="p-3 bg-[rgba(18,183,106,0.08)] border-l-2 border-[#12B76A] text-sm text-[#F0F1F4]">{item.after}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="p-4 md:p-6 border-t border-[#1F2229] bg-[#1A2A44]">
        <div className="label-micro text-[#2D7AFF] mb-2">STARTING AT</div>
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-2xl md:text-3xl text-[#2D7AFF]">$29</span>
          <span className="text-base text-[#9BA1AB]">/month</span>
        </div>
        <div className="text-sm text-[#9BA1AB] mt-2">vs $24,000/yr for Bloomberg (824x cheaper)</div>
      </div>
    </div>

    <div className="lg:col-span-7 flex flex-col bg-[#0F1115] min-h-[400px] lg:min-h-0">
      <div className="flex-1 flex flex-col justify-center items-center px-5 md:px-8 py-6 md:py-8 relative overflow-hidden">
        {/* Subtle radial gradient behind the center */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[500px] h-[500px] rounded-full bg-gradient-radial from-[#2D7AFF]/10 via-transparent to-transparent" />
        </div>

        {/* Flow Diagram - Hub and Spoke Design */}
        <div className="relative w-full max-w-xl">
          {/* Center Hub - PANDA Terminal */}
          <motion.div 
            className="relative z-20 mx-auto w-fit"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              {/* Glowing ring */}
              <div className="absolute -inset-3 rounded-lg bg-gradient-to-r from-[#2D7AFF]/20 via-[#2D7AFF]/10 to-[#2D7AFF]/20 blur-xl" />
              <div className="relative flex items-center justify-center w-32 h-32 md:w-40 md:h-40 bg-[#12141A] border-2 border-[#2D7AFF] rounded-lg shadow-lg shadow-[#2D7AFF]/20">
                <div className="text-center flex flex-col items-center">
                  <img src="/panda-icon.svg" alt="PANDA" className="w-12 h-12 md:w-16 md:h-16 mb-1 [filter:brightness(0)_saturate(100%)_invert(36%)_sepia(94%)_saturate(1357%)_hue-rotate(201deg)_brightness(100%)_contrast(101%)]" />
                  <div className="text-sm text-[#2D7AFF] font-medium tracking-wider">PANDA</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Input Nodes (Left side - flowing INTO PANDA) */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-5">
            {[
              { label: "RESEARCH", icon: Database, desc: "1000+ sources" },
              { label: "DATA", icon: Layers, desc: "Real-time feeds" },
            ].map((node, i) => (
              <motion.div 
                key={i}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <div className="flex flex-col items-end">
                  <span className="text-xs text-[#9BA1AB] font-medium tracking-wider">{node.label}</span>
                  <span className="text-xs text-[#5C626D]">{node.desc}</span>
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-[#1A1D24] border border-[#2A2D35] rounded-lg">
                  <node.icon className="w-6 h-6 text-[#9BA1AB]" strokeWidth={1.5} />
                </div>
                {/* Arrow pointing to center */}
                <div className="flex items-center gap-1">
                  <div className="w-10 h-[2px] bg-gradient-to-r from-[#2A2D35] to-[#2D7AFF]/50" />
                  <ChevronRight className="w-4 h-4 text-[#2D7AFF]/50" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Output Nodes (Right side - flowing OUT of PANDA) */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-5">
            {[
              { label: "SIGNALS", icon: Sparkles, desc: "50+ metrics", color: "#12B76A" },
              { label: "EXECUTION", icon: Zap, desc: "One-click trade", color: "#12B76A" },
            ].map((node, i) => (
              <motion.div 
                key={i}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                {/* Arrow coming from center */}
                <div className="flex items-center gap-1">
                  <ChevronRight className="w-4 h-4 text-[#12B76A]/70" />
                  <div className="w-10 h-[2px] bg-gradient-to-r from-[#12B76A]/50 to-[#12B76A]" />
                </div>
                <div className="flex items-center justify-center w-12 h-12 bg-[#12B76A]/10 border border-[#12B76A]/30 rounded-lg">
                  <node.icon className="w-6 h-6 text-[#12B76A]" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-[#12B76A] font-medium tracking-wider">{node.label}</span>
                  <span className="text-xs text-[#5C626D]">{node.desc}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tagline */}
        <motion.div className="mt-12 md:mt-16 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <h3 className="text-xl md:text-2xl font-light text-[#F0F1F4] mb-2">
            From fragmented data to <span className="text-[#12B76A]">confident execution</span>
          </h3>
          <p className="text-base text-[#9BA1AB]">Everything flows through one terminal.</p>
        </motion.div>

        {/* Stats Row */}
        <motion.div className="mt-6 md:mt-8 flex flex-wrap justify-center gap-6 md:gap-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          {[
            { value: "50+", label: "Proprietary Metrics", color: "#2D7AFF" },
            { value: "6", label: "Markets (CEX+DEX)", color: "#2D7AFF" },
            { value: "<50ms", label: "Latency", color: "#12B76A" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-mono text-xl md:text-2xl" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs text-[#9BA1AB] uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </div>
);

// SLIDE 4: Why Now (Sequoia - critical timing slide)
const WhyNowSlide = () => {
  const trends = [
    { 
      num: "01", 
      title: "Crypto Market Maturity", 
      points: ["562M global crypto holders (6.8% of world)", "Daily DEX volume exceeds $2.1B", "ETF approvals & corporate treasury adoption"],
      icon: Globe,
      color: "#2D7AFF"
    },
    { 
      num: "02", 
      title: "Retail Sophistication", 
      points: ["Post-2021 traders demand pro tools", "TradingView hit 60M users proving demand", "Gen Z expects Bloomberg at SaaS prices"],
      icon: Users,
      color: "#12B76A"
    },
    { 
      num: "03", 
      title: "Infrastructure Convergence", 
      points: ["CEX/DEX lines blurring — unified view needed", "Real-time on-chain data now feasible at scale", "API standardization enables multi-exchange"],
      icon: Layers,
      color: "#5294FF"
    },
    { 
      num: "04", 
      title: "AI/ML Inflection", 
      points: ["Proprietary signals now computationally viable", "NLP interfaces lowering complexity barriers", "Predictive analytics moving consumer-ready"],
      icon: Cpu,
      color: "#F5B800"
    },
    { 
      num: "05", 
      title: "Regulatory Tailwind", 
      points: ["SEC crypto ETF approvals signal mainstream legitimacy", "MiCA in Europe creating compliance-first opportunities", "Clearer rules = institutional money → retail needs better tools"],
      icon: Shield,
      color: "#A855F7"
    },
  ];

  return (
    <div className="h-full flex flex-col lg:grid lg:grid-cols-12 gap-0 overflow-y-auto lg:overflow-hidden">
      <div className="lg:col-span-4 flex flex-col lg:border-r border-[#2A2D35]">
        <div className="p-4 md:p-6 border-b border-[#1F2229] bg-[#1A1D24]">
          <div className="label-micro text-[#2D7AFF]">04 / WHY NOW</div>
        </div>
        
        <div className="flex-1 flex flex-col justify-start px-5 md:px-6 py-4 md:py-5">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h2 className="text-2xl md:text-3xl font-light text-[#F0F1F4] mb-4 leading-tight">
              Five forces converging
            </h2>
            <p className="text-base text-[#9BA1AB] mb-5 md:mb-6">
              The "Bloomberg of crypto" moment is here. Market, tech, and regulation aligned.
            </p>
            
            {/* Visual timeline */}
            <div className="relative pl-5 border-l-2 border-[#2A2D35] space-y-4 mb-6">
              {trends.map((t, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative"
                >
                  <div 
                    className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full" 
                    style={{ background: t.color }}
                  />
                  <div className="text-sm text-[#9BA1AB]">
                    <span style={{ color: t.color }} className="font-mono">{t.num}</span>
                    <span className="mx-2 text-[#2A2D35]">—</span>
                    {t.title}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="p-4 md:p-6 border-t border-[#1F2229] bg-gradient-to-r from-[#1A2A44] to-transparent">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-mono text-xl md:text-2xl text-[#12B76A]">562M</div>
              <div className="text-xs text-[#5C626D]">CRYPTO HOLDERS</div>
            </div>
            <div>
              <div className="font-mono text-xl md:text-2xl text-[#12B76A]">6.8%</div>
              <div className="text-xs text-[#5C626D]">GLOBAL POP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - staggered cards with visual flair */}
      <div className="lg:col-span-8 relative overflow-hidden">
        {/* Background decorative element */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-[#2D7AFF]/5 via-transparent to-transparent" />
        </div>
        
        <div className="h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2 gap-0 relative z-10">
          {trends.slice(0, 3).map((trend, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className={cn(
                "p-5 md:p-6 flex flex-col border-b border-[#1F2229]",
                i < 2 && "lg:border-r"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `${trend.color}15` }}
                >
                  <trend.icon className="w-5 h-5" style={{ color: trend.color }} strokeWidth={1.5} />
                </div>
                <span className="font-mono text-sm" style={{ color: trend.color }}>{trend.num}</span>
              </div>
              <h3 className="text-base font-medium text-[#F0F1F4] mb-3">{trend.title}</h3>
              <div className="flex-1 space-y-2">
                {trend.points.map((point, pi) => (
                  <div key={pi} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: trend.color }} />
                    <span className="text-sm text-[#9BA1AB] leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
          
          {/* Bottom row - 2 larger cards */}
          {trends.slice(3).map((trend, i) => (
            <motion.div
              key={i + 3}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className={cn(
                "p-5 md:p-6 flex flex-col",
                i === 0 ? "lg:col-span-1 lg:border-r border-[#1F2229]" : "lg:col-span-2",
                trend.num === "05" && "bg-gradient-to-br from-[#A855F7]/5 to-transparent"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `${trend.color}15` }}
                >
                  <trend.icon className="w-5 h-5" style={{ color: trend.color }} strokeWidth={1.5} />
                </div>
                <span className="font-mono text-sm" style={{ color: trend.color }}>{trend.num}</span>
              </div>
              <h3 className="text-base font-medium text-[#F0F1F4] mb-3">{trend.title}</h3>
              <div className="flex-1 space-y-2">
                {trend.points.map((point, pi) => (
                  <div key={pi} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: trend.color }} />
                    <span className="text-sm text-[#9BA1AB] leading-relaxed">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// SLIDE 7: Product (Fresh visual approach - The Trading Stack)
const ProductSlide = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const features = [
    { 
      id: 'workbench',
      title: 'Workbench', 
      subtitle: 'Your command center',
      desc: 'Multi-chart layouts, 50+ proprietary indicators, orderbook & orderflow analytics. Real-time data across Binance, Bybit & Hyperliquid.',
      color: '#2D7AFF',
      icon: Grid3X3,
      metrics: ['50+ indicators', '3 exchanges', 'Mobile PWA'],
      image: '/workbench.png'
    },
    { 
      id: 'divine-dip',
      title: 'Divine Dip™', 
      subtitle: 'Know when to buy',
      desc: 'Proprietary signal fires when fear peaks but price is bottoming. Combined with Token Ratings for 10-dimension asset health scores.',
      color: '#12B76A',
      icon: Sparkles,
      metrics: ['84% accuracy', '+8.2% return', '+ Token Ratings'],
      image: '/divinedip.png'
    },
    { 
      id: 'screener',
      title: 'Screener', 
      subtitle: 'Find opportunities',
      desc: 'Scan thousands of tokens across CEX & DEX. Filter by price change, volume, market cap, and custom metrics.',
      color: '#F5B800',
      icon: Target,
      metrics: ['2,300+ tokens', 'CEX + DEX', 'Custom filters'],
      image: '/screener.png'
    },
    { 
      id: 'community',
      title: 'Community', 
      subtitle: 'Learn from the best',
      desc: 'Explore published trade ideas, clone winning strategies, and share your own setups with the PANDA community.',
      color: '#A855F7',
      icon: Users,
      metrics: ['Trade ideas', 'Clone setups', 'Communities'],
      image: '/community.png'
    },
    { 
      id: 'backtesting',
      title: 'Backtesting', 
      subtitle: 'Test before you trade',
      desc: 'Backtest any indicator or strategy on historical data. See real P&L, win rate, and drawdown before risking capital.',
      color: '#F04438',
      icon: BarChart3,
      metrics: ['Historical data', 'P&L tracking', 'Strategy validation'],
      image: '/backtesting.png'
    },
  ];

  // Auto-cycle through features every 4 seconds
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isPaused, features.length]);

  return (
    <div className="h-full flex flex-col lg:grid lg:grid-cols-12 gap-0 overflow-y-auto lg:overflow-hidden">
      {/* Left - Feature Selector */}
      <div className="lg:col-span-4 flex flex-col bg-[#0A0B0E] lg:border-r border-[#2A2D35]">
        <div className="p-4 md:p-6 border-b border-[#1F2229]">
          <div className="label-micro text-[#2D7AFF] mb-3">07 / PRODUCT</div>
          <h2 className="text-2xl md:text-3xl font-light text-[#F0F1F4] leading-tight">
            Research.<br/>
            <span className="text-[#2D7AFF]">Signal.</span><br/>
            Execute.
          </h2>
        </div>
        
        {/* Feature tabs */}
        <div 
          className="flex-1 flex flex-col"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {features.map((feature, i) => (
            <motion.button
              key={feature.id}
              onClick={() => {
                setActiveFeature(i);
                setIsPaused(true);
                // Resume auto-scroll after 8 seconds of inactivity
                setTimeout(() => setIsPaused(false), 8000);
              }}
              className={cn(
                "flex items-start gap-4 p-4 md:p-5 text-left border-b border-[#1F2229] transition-all",
                activeFeature === i 
                  ? "bg-[#12141A]" 
                  : "hover:bg-[#12141A]/50"
              )}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <div 
                className={cn(
                  "w-10 h-10 flex items-center justify-center transition-colors",
                  activeFeature === i ? "bg-opacity-20" : "bg-[#1A1D24]"
                )}
                style={{ 
                  backgroundColor: activeFeature === i ? `${feature.color}20` : undefined 
                }}
              >
                <feature.icon 
                  className="w-5 h-5 transition-colors" 
                  style={{ color: activeFeature === i ? feature.color : '#5C626D' }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-sm font-medium transition-colors",
                    activeFeature === i ? "text-[#F0F1F4]" : "text-[#9BA1AB]"
                  )}>
                    {feature.title}
                  </span>
                  {activeFeature === i && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: feature.color }}
                    />
                  )}
                </div>
                <span className="text-xs text-[#5C626D]">{feature.subtitle}</span>
              </div>
              <ChevronRight 
                className={cn(
                  "w-4 h-4 transition-all",
                  activeFeature === i ? "opacity-100" : "opacity-0"
                )}
                style={{ color: feature.color }}
              />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Right - Feature Detail */}
      <div className="lg:col-span-8 flex flex-col bg-[#12141A]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFeature}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex flex-col"
          >
            {/* Feature header */}
            <div className="p-5 md:p-6 border-b border-[#2A2D35]">
              <div className="flex items-center gap-3 mb-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: features[activeFeature].color }}
                />
                <h3 className="text-xl md:text-2xl font-light text-[#F0F1F4]">
                  {features[activeFeature].title}
                </h3>
              </div>
              <p className="text-[#9BA1AB] text-sm md:text-base max-w-xl">
                {features[activeFeature].desc}
              </p>
            </div>

            {/* Feature visualization */}
            <div className="flex-1 p-4 md:p-5 relative overflow-hidden">
              <motion.div 
                className="h-full flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={features[activeFeature].image}
                  alt={`${features[activeFeature].title} - ${features[activeFeature].subtitle}`}
                  className="w-full h-full object-contain rounded border border-[#2A2D35]"
                />
              </motion.div>
              
              {/* Ambient glow */}
              <div 
                className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500"
                style={{ backgroundColor: features[activeFeature].color }}
              />
            </div>

            {/* Feature metrics footer */}
            <div className="grid grid-cols-3 border-t border-[#2A2D35]">
              {features[activeFeature].metrics.map((metric, i) => (
                <motion.div 
                  key={metric}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className={cn(
                    "p-4 text-center",
                    i < 2 && "border-r border-[#2A2D35]"
                  )}
                >
                  <div className="text-sm font-mono" style={{ color: features[activeFeature].color }}>
                    {metric}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};


// SLIDE 5: Market Potential (Sequoia)
const MarketSlide = () => {
  const funnelSteps = [
    { label: "Crypto Holders", value: "560M+", percent: 100, color: "#2D7AFF" },
    { label: "Active Traders (5-10%)", value: "30-60M", percent: 70, color: "#5294FF" },
    { label: "Seek Pro Tools (10%)", value: "5M", percent: 45, color: "#12B76A" },
    { label: "1% Conversion", value: "50K", percent: 25, color: "#F5B800" },
  ];

  return (
    <div className="h-full flex flex-col lg:grid lg:grid-cols-12 gap-0 overflow-y-auto lg:overflow-hidden">
      <div className="lg:col-span-4 flex flex-col lg:border-r border-[#2A2D35]">
        <div className="p-4 md:p-6 border-b border-[#1F2229] bg-[#1A1D24]">
          <div className="label-micro text-[#2D7AFF]">05 / MARKET POTENTIAL</div>
        </div>
        
        <div className="flex-1 flex flex-col px-5 md:px-6 py-4 md:py-5">
          <h2 className="text-2xl md:text-3xl font-light text-[#F0F1F4] mb-3">
            A massive, underserved market
          </h2>
          <p className="text-base text-[#9BA1AB] mb-5">
            No dominant "Bloomberg of crypto" has emerged. 92% of traders dissatisfied with fragmentation.
          </p>
          
          <div className="flex-1">
            <DataTable
              headers={["SEGMENT", "SIZE", "CAGR"]}
              rows={[
                ["Global Crypto", "$3.4T+", { value: "12.8%", positive: true }],
                ["Trading Tools", "$50B+", { value: "18.4%", positive: true }],
                [{ value: "Pro Terminals", highlight: true }, { value: "$500M+", highlight: true }, { value: "24.2%", positive: true, highlight: true }],
              ]}
              highlightLast
            />
          </div>
          
          {/* Sources */}
          <div className="mt-4 pt-4 border-t border-[#1F2229]">
            <div className="text-xs text-[#5C626D] space-y-1">
              <div>Sources: Triple-A (2024), a16z State of Crypto,</div>
              <div>CryptoProsperity, Market.us</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 border-t border-[#1F2229]">
          <div className="p-4 md:p-5 border-r border-[#1F2229]">
            <div className="font-mono text-xl md:text-2xl text-[#2D7AFF]">562M</div>
            <div className="text-xs text-[#5C626D]">CRYPTO HOLDERS</div>
          </div>
          <div className="p-4 md:p-5">
            <div className="font-mono text-xl md:text-2xl text-[#12B76A]">+42%</div>
            <div className="text-xs text-[#5C626D]">YOY GROWTH</div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-8 grid grid-rows-2 gap-0">
        {/* Top: TAM/SAM/SOM */}
        <div className="flex flex-col border-b border-[#2A2D35]">
          <div className="px-5 md:px-6 py-3 border-b border-[#1F2229] bg-[#1A1D24]">
            <span className="label-micro text-[#9BA1AB]">TAM / SAM / SOM</span>
          </div>
          
          <div className="flex-1 p-4 md:p-5 flex flex-col justify-center space-y-3">
            {[
              { label: "TAM", value: "$3.4T+", desc: "Global crypto market cap (2025)", width: 100, color: "#2D7AFF" },
              { label: "SAM", value: "$50B+", desc: "Active traders seeking pro tools (30-60M users)", width: 65, color: "#5294FF" },
              { label: "SOM", value: "$500M+", desc: "Premium trading terminal market", width: 35, color: "#12B76A" }
            ].map((tier, i) => (
              <motion.div
                key={i}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: `${tier.width}%`, opacity: 1 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
              >
                <div 
                  className="p-3 md:p-4 flex justify-between items-center"
                  style={{ 
                    background: `repeating-linear-gradient(90deg, ${tier.color}15, ${tier.color}15 4px, transparent 4px, transparent 8px)`,
                    borderLeft: `3px solid ${tier.color}`
                  }}
                >
                  <div>
                    <div className="label-micro" style={{ color: tier.color }}>{tier.label}</div>
                    <div className="text-sm text-[#9BA1AB] mt-1">{tier.desc}</div>
                  </div>
                  <div className="font-mono text-xl md:text-2xl" style={{ color: tier.color }}>{tier.value}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom: Path to $50M ARR */}
        <div className="flex flex-col">
          <div className="px-5 md:px-6 py-3 border-b border-[#1F2229] bg-[#1A1D24] flex flex-wrap justify-between items-center gap-2">
            <span className="label-micro text-[#9BA1AB]">PATH TO $50M ARR</span>
            <span className="font-mono text-sm md:text-base text-[#12B76A]">$1,000 ARPU × 50K = $50M</span>
          </div>
          
          <div className="flex-1 p-4 md:p-5 flex items-center overflow-x-auto">
            {/* Funnel visualization */}
            <div className="flex-1 flex items-center justify-center gap-3 md:gap-4 min-w-max">
              {funnelSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.15 }}
                  className="flex flex-col items-center"
                >
                  <div 
                    className="relative flex items-center justify-center"
                    style={{ 
                      width: `${Math.max(step.percent * 1.2, 60)}px`,
                      height: `${Math.max(step.percent * 1.2, 60)}px`,
                    }}
                  >
                    <div 
                      className="absolute inset-0 rounded-lg opacity-20"
                      style={{ background: step.color }}
                    />
                    <div 
                      className="absolute inset-2 rounded-md opacity-30"
                      style={{ background: step.color }}
                    />
                    <span className="font-mono text-sm md:text-base text-[#F0F1F4] z-10">{step.value}</span>
                  </div>
                  <div className="text-xs text-[#9BA1AB] mt-2 text-center max-w-[90px]">{step.label}</div>
                  {i < funnelSteps.length - 1 && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2">
                      <ChevronRight className="w-5 h-5 text-[#2A2D35]" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {/* Arrow to result */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-3 ml-4 pl-4 border-l border-[#2A2D35]"
              >
                <div className="text-center">
                  <div className="font-mono text-2xl md:text-3xl text-[#12B76A]">$50M</div>
                  <div className="text-xs text-[#9BA1AB]">ARR TARGET</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// SLIDE 6: Competition (Sequoia)
const CompetitionSlide = () => {
  const competitors = [
    { name: "TradingView", charting: true, metrics: false, execution: false, defi: false },
    { name: "Glassnode", charting: false, metrics: true, execution: false, defi: false },
    { name: "Dune", charting: false, metrics: true, execution: false, defi: true },
    { name: "Nansen", charting: false, metrics: true, execution: false, defi: true },
    { name: "Messari", charting: false, metrics: true, execution: false, defi: false },
    { name: "Kaiko", charting: false, metrics: true, execution: false, defi: false },
    { name: "3commas", charting: true, metrics: false, execution: true, defi: false },
    { name: "Dexscreener", charting: true, metrics: false, execution: false, defi: true },
    { name: "Exchange Native", charting: true, metrics: false, execution: true, defi: false },
    { name: "PANDA", charting: true, metrics: true, execution: true, defi: true },
  ];

  // 2x2 positioning data
  const positioningData = [
    { name: "TradingView", x: 12, y: 28, color: "#9BA1AB" },
    { name: "Glassnode", x: 18, y: 88, color: "#9BA1AB" },
    { name: "Dune", x: 12, y: 78, color: "#9BA1AB" },
    { name: "Nansen", x: 28, y: 82, color: "#9BA1AB" },
    { name: "Messari", x: 22, y: 68, color: "#9BA1AB" },
    { name: "BitQuery", x: 8, y: 72, color: "#9BA1AB" },
    { name: "Kaiko", x: 35, y: 75, color: "#9BA1AB" },
    { name: "3commas", x: 78, y: 32, color: "#9BA1AB" },
    { name: "Exchange Native", x: 88, y: 18, color: "#9BA1AB" },
    { name: "PANDA", x: 82, y: 88, color: "#12B76A", highlight: true },
  ];

  return (
    <div className="h-full flex flex-col lg:grid lg:grid-cols-12 gap-0 overflow-y-auto lg:overflow-hidden">
      <div className="lg:col-span-4 flex flex-col lg:border-r border-[#2A2D35]">
        <div className="p-4 md:p-6 border-b border-[#1F2229] bg-[#1A1D24]">
          <div className="label-micro text-[#2D7AFF]">06 / COMPETITION</div>
        </div>
        
        <div className="flex-1 flex flex-col justify-start px-5 md:px-6 py-4 md:py-5 overflow-y-auto">
          <h2 className="text-2xl md:text-3xl font-light text-[#F0F1F4] mb-3">
            Fragmented landscape = opportunity
          </h2>
          <p className="text-base text-[#9BA1AB] mb-5">
            No competitor combines analytics depth with execution capability.
          </p>
          
          <div className="space-y-3 mb-5">
            {[
              { text: "Proprietary metrics (Divine Dip, CARI, ROSI)", detail: "3+ years of quant development" },
              { text: "Orderflow aggregation from 15+ sources", detail: "18+ months to replicate" },
              { text: "Full-stack integration moat", detail: "CEX + DEX + Analytics" },
            ].map((moat, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-[#2D7AFF] mt-1.5 flex-shrink-0" />
                <div>
                  <span className="text-sm text-[#F0F1F4]">{moat.text}</span>
                  <span className="text-sm text-[#5C626D] ml-2">— {moat.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 md:p-5 border-t border-[#1F2229] bg-gradient-to-r from-[#12B76A]/10 to-transparent">
          <div className="text-sm text-[#12B76A] font-medium">PANDA is the only full-stack terminal</div>
          <div className="text-sm text-[#9BA1AB] mt-1">4/4 capabilities • 100% coverage</div>
        </div>
      </div>

      <div className="lg:col-span-8 grid grid-rows-[1fr_auto] gap-0 min-h-[350px] lg:min-h-0">
        {/* Top: 2x2 Positioning Map */}
        <div className="flex flex-col border-b border-[#2A2D35]">
          <div className="px-5 md:px-6 py-3 border-b border-[#1F2229] bg-[#1A1D24]">
            <span className="label-micro text-[#9BA1AB]">COMPETITIVE POSITIONING</span>
          </div>
          
          <div className="flex-1 p-4 md:p-6 relative">
            {/* 2x2 Grid */}
            <div className="relative w-full h-full min-h-[220px]">
              {/* Axis labels */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 text-xs text-[#5C626D] hidden md:block">FULL ANALYTICS</div>
              <div className="absolute left-1/2 -translate-x-1/2 bottom-0 text-xs text-[#5C626D] hidden md:block">BASIC TOOLS</div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 text-xs text-[#5C626D] -rotate-90 origin-center whitespace-nowrap hidden md:block">CHARTING ONLY</div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-[#5C626D] rotate-90 origin-center whitespace-nowrap hidden md:block">EXECUTION</div>
              
              {/* Grid lines */}
              <div className="absolute inset-4 md:inset-8">
                <div className="w-full h-full border border-[#2A2D35] relative">
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#2A2D35]" />
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-[#2A2D35]" />
                  
                  {/* Quadrant labels */}
                  <div className="absolute top-2 left-2 text-xs text-[#5C626D]/50 hidden md:block">Analytics Only</div>
                  <div className="absolute top-2 right-2 text-xs text-[#5C626D]/50 hidden md:block">Full Platform</div>
                  <div className="absolute bottom-2 left-2 text-xs text-[#5C626D]/50 hidden md:block">Charting</div>
                  <div className="absolute bottom-2 right-2 text-xs text-[#5C626D]/50 hidden md:block">Exchange</div>
                  
                  {/* Positioned competitors */}
                  {positioningData.map((comp, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="absolute flex flex-col items-center"
                      style={{ 
                        left: `${comp.x}%`, 
                        top: `${100 - comp.y}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div 
                        className={cn(
                          "w-4 h-4 rounded-full",
                          comp.highlight && "ring-2 ring-[#12B76A]/30 ring-offset-2 ring-offset-[#0A0B0E]"
                        )}
                        style={{ background: comp.color }}
                      />
                      <span 
                        className={cn(
                          "text-xs mt-1 whitespace-nowrap hidden md:block",
                          comp.highlight ? "text-[#12B76A] font-medium" : "text-[#9BA1AB]"
                        )}
                      >
                        {comp.name}{comp.highlight && " ★"}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Compact Feature Matrix */}
        <div className="bg-[#0F1115]">
          <div className="px-5 md:px-6 py-3 border-b border-[#1F2229] bg-[#1A1D24]">
            <span className="label-micro text-[#9BA1AB]">FEATURE MATRIX</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#1A1D24]/50">
                  {["", "CHART", "METRICS", "TRADE", "DEFI"].map((h, i) => (
                    <th key={i} className="label-micro text-[#5C626D] p-3 text-center border-b border-[#1F2229]">
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
                      "border-b border-[#1F2229]/50",
                      ri === competitors.length - 1 && "bg-[#12B76A]/10"
                    )}
                  >
                    <td className={cn(
                      "p-3 text-sm",
                      ri === competitors.length - 1 ? "text-[#12B76A] font-medium" : "text-[#9BA1AB]"
                    )}>
                      {c.name}
                    </td>
                    {[c.charting, c.metrics, c.execution, c.defi].map((has, ci) => (
                      <td key={ci} className="p-3 text-center">
                        {has ? (
                          <div className="w-3.5 h-3.5 rounded-full bg-[#12B76A] mx-auto" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-[#2A2D35] mx-auto" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// SLIDE 8: Business Model (Sequoia - Visual funnel + economics)
const ModelSlide = () => {
  const funnelData = [
    { stage: "Free Signup", users: "10,000", week: "Week 1", color: "#2D7AFF", width: 100 },
    { stage: "Use Basic Charts", users: "7,500", week: "Week 1-2", color: "#5294FF", width: 85 },
    { stage: "Hit Metric Paywall", users: "3,200", week: "Week 2-3", color: "#F5B800", width: 65 },
    { stage: "Start Free Trial", users: "1,600", week: "Week 3", color: "#12B76A", width: 45 },
    { stage: "Convert to Paid", users: "800", week: "Week 4", color: "#12B76A", width: 30 },
  ];

  return (
    <div className="h-full flex flex-col lg:grid lg:grid-cols-12 gap-0 overflow-y-auto lg:overflow-hidden">
      {/* Left - Conversion Funnel */}
      <div className="lg:col-span-5 flex flex-col lg:border-r border-[#2A2D35]">
        <div className="p-4 md:p-6 border-b border-[#1F2229] bg-[#1A1D24]">
          <div className="label-micro text-[#2D7AFF]">08 / BUSINESS MODEL</div>
        </div>
        
        <div className="flex-1 flex flex-col px-5 md:px-6 py-4 md:py-5">
          <h2 className="text-xl md:text-2xl font-light text-[#F0F1F4] mb-2">
            How free users become paid
          </h2>
          <p className="text-sm text-[#9BA1AB] mb-4">
            Conversion funnel from signup to subscription
          </p>
          
          {/* Visual Funnel */}
          <div className="flex-1 flex flex-col justify-center space-y-2">
            {funnelData.map((step, i) => (
              <motion.div
                key={i}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "100%", opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative"
              >
                <div 
                  className="h-10 flex items-center justify-between px-3 transition-all"
                  style={{ 
                    width: `${step.width}%`,
                    background: `linear-gradient(90deg, ${step.color}30 0%, ${step.color}10 100%)`,
                    borderLeft: `3px solid ${step.color}`
                  }}
                >
                  <span className="text-sm text-[#F0F1F4] truncate">{step.stage}</span>
                  <span className="font-mono text-sm" style={{ color: step.color }}>{step.users}</span>
                </div>
                <span className="absolute right-0 top-1/2 -translate-y-1/2 text-xs text-[#5C626D] ml-2 pl-2">
                  {step.week}
                </span>
              </motion.div>
            ))}
          </div>
          
          {/* Key Insight */}
          <div className="mt-4 p-4 bg-[#12B76A]/10 border border-[#12B76A]/30">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[#12B76A]" />
              <span className="label-micro text-[#12B76A]">KEY INSIGHT</span>
            </div>
            <div className="text-sm text-[#F0F1F4]">
              Users who see <span className="text-[#12B76A] font-medium">Divine Dip fire once</span> convert at <span className="font-mono text-[#12B76A]">23%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 border-t border-[#1F2229]">
          <div className="p-4 md:p-5 border-r border-[#1F2229]">
            <div className="font-mono text-2xl text-[#2D7AFF]">8%</div>
            <div className="text-xs text-[#5C626D]">BASE CONV. RATE</div>
          </div>
          <div className="p-4 md:p-5">
            <div className="font-mono text-2xl text-[#12B76A]">23%</div>
            <div className="text-xs text-[#5C626D]">POST-SIGNAL CONV.</div>
          </div>
        </div>
      </div>

      {/* Right - Revenue Streams + Economics */}
      <div className="lg:col-span-7 flex flex-col">
        {/* Pricing Tiers - Compact */}
        <div className="border-b border-[#2A2D35]">
          <div className="px-5 md:px-6 py-3 border-b border-[#1F2229] bg-[#1A1D24]">
            <span className="label-micro text-[#9BA1AB]">SUBSCRIPTION TIERS</span>
          </div>
          <div className="grid grid-cols-4 divide-x divide-[#2A2D35]">
            {[
              { tier: "Free", price: "$0", highlight: false },
              { tier: "Pro", price: "$29", highlight: true },
              { tier: "Elite", price: "$99", highlight: false },
              { tier: "Enterprise", price: "$299", highlight: false },
            ].map((item, i) => (
              <div 
                key={i} 
                className={cn(
                  "p-3 md:p-4 text-center",
                  item.highlight && "bg-[#2D7AFF]/10"
                )}
              >
                <div className={cn(
                  "font-mono text-xl md:text-2xl mb-1",
                  item.highlight ? "text-[#2D7AFF]" : "text-[#F0F1F4]"
                )}>{item.price}</div>
                <div className={cn(
                  "text-xs",
                  item.highlight ? "text-[#2D7AFF]" : "text-[#5C626D]"
                )}>{item.tier}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Trading Fee Economics */}
        <div className="border-b border-[#2A2D35]">
          <div className="px-5 md:px-6 py-3 border-b border-[#1F2229] bg-[#1A1D24]">
            <span className="label-micro text-[#9BA1AB]">TRADING REVENUE MODEL</span>
          </div>
          <div className="p-4 md:p-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#1A1D24] border border-[#2A2D35]">
                <div className="text-xs text-[#5C626D] mb-2">AVERAGE TRADER</div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-mono text-xl text-[#F0F1F4]">$5K</span>
                  <span className="text-xs text-[#5C626D]">vol/mo</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 text-[#5C626D]" />
                  <span className="text-sm text-[#9BA1AB]">$15 fees</span>
                  <ChevronRight className="w-3 h-3 text-[#5C626D]" />
                  <span className="font-mono text-sm text-[#2D7AFF]">$4.50</span>
                  <span className="text-xs text-[#5C626D]">to PANDA</span>
                </div>
              </div>
              <div className="p-4 bg-[#12B76A]/10 border border-[#12B76A]/30">
                <div className="text-xs text-[#12B76A] mb-2">ELITE TRADER</div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-mono text-xl text-[#F0F1F4]">$50K</span>
                  <span className="text-xs text-[#5C626D]">vol/mo</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChevronRight className="w-3 h-3 text-[#5C626D]" />
                  <span className="text-sm text-[#9BA1AB]">$150 fees</span>
                  <ChevronRight className="w-3 h-3 text-[#5C626D]" />
                  <span className="font-mono text-sm text-[#12B76A]">$45</span>
                  <span className="text-xs text-[#5C626D]">to PANDA</span>
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-[#5C626D] text-center">
              Partner exchanges pay 20-40% of trading fees as referral commission
            </div>
          </div>
        </div>

        {/* Land & Expand */}
        <div className="flex-1 flex flex-col">
          <div className="px-5 md:px-6 py-3 border-b border-[#1F2229] bg-[#1A1D24]">
            <span className="label-micro text-[#9BA1AB]">LAND & EXPAND</span>
          </div>
          <div className="flex-1 p-4 md:p-5 grid grid-cols-3 gap-4">
            {[
              { metric: "12%", label: "Pro → Elite", desc: "upgrade after 6mo", color: "#2D7AFF" },
              { metric: "$199/mo", label: "API Upsell", desc: "15% of Elite users", color: "#5294FF" },
              { metric: "115%", label: "Net Revenue Retention", desc: "expansion > churn", color: "#12B76A" },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="p-4 bg-[#1A1D24] border border-[#2A2D35] flex flex-col"
              >
                <div className="font-mono text-2xl md:text-3xl mb-2" style={{ color: item.color }}>
                  {item.metric}
                </div>
                <div className="text-sm text-[#F0F1F4]">{item.label}</div>
                <div className="text-xs text-[#5C626D] mt-auto">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom metrics */}
        <div className="grid grid-cols-4 border-t border-[#2A2D35] bg-[#1A1D24]">
          {[
            { label: "MRR", value: "$28.5K" },
            { label: "LTV:CAC", value: "4.2x" },
            { label: "CHURN", value: "2.4%" },
            { label: "NPS", value: "72" },
          ].map((item, i) => (
            <div key={i} className={cn("p-3 md:p-4 text-center", i < 3 && "border-r border-[#2A2D35]")}>
              <div className="font-mono text-lg text-[#F0F1F4]">{item.value}</div>
              <div className="text-xs text-[#5C626D]">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// SLIDE 9: Team (Sequoia)
const TeamSlide = () => {
  const teamMembers = [
    {
      name: "Ben Lilly",
      initials: "BL",
      role: "MANAGING PARTNER",
      title: "Head of Research",
      color: "#2D7AFF",
      points: ["Ex-Commodity Economist", "Finance & Gov Affairs", "Macro economics focus"]
    },
    {
      name: "Benjamin",
      initials: "B",
      role: "MANAGING PARTNER",
      title: "Head of Quant",
      color: "#12B76A",
      points: ["Medical research background", "AI trading since 2018", "Built J-AI system"]
    },
    {
      name: "Amit",
      initials: "A",
      role: "SR. ASSOCIATE",
      title: "Infra & Execution Lead",
      color: "#5294FF",
      points: ["Ex-Commercial Bank Eng.", "Low-latency systems", "Order execution"]
    },
    {
      name: "Krishna",
      initials: "K",
      role: "SR. ASSOCIATE",
      title: "Big Data & Web3 Lead",
      color: "#F5B800",
      points: ["Mathematician + Engineer", "Data infrastructure", "Web3 architecture"]
    },
  ];

  return (
    <div className="h-full flex flex-col lg:grid lg:grid-cols-12 gap-0 overflow-y-auto lg:overflow-hidden">
      <div className="lg:col-span-3 flex flex-col lg:border-r border-[#2A2D35]">
        <div className="p-4 md:p-6 border-b border-[#1F2229] bg-[#1A1D24]">
          <div className="label-micro text-[#2D7AFF]">09 / TEAM</div>
        </div>
        
        <div className="flex-1 flex flex-col justify-start px-5 py-4 md:py-5">
          <h2 className="text-xl md:text-2xl font-light text-[#F0F1F4] mb-3">
            JLabs Digital
          </h2>
          <p className="text-base text-[#9BA1AB] mb-5">
            Research-driven team blending macro economics, quant trading, and engineering.
          </p>
          
          <div className="space-y-2.5">
            {[
              { label: "Digital Assets Exp.", value: "10+" },
              { label: "Team Size", value: "24+" },
              { label: "AI Trading Since", value: "2018" },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-[#1A1D24]">
                <span className="text-sm text-[#9BA1AB]">{item.label}</span>
                <span className="font-mono text-base text-[#2D7AFF]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 md:p-5 border-t border-[#1F2229] bg-[#1A1D24]">
          <div className="text-sm text-[#F0F1F4] italic leading-relaxed mb-2">
            "We build the tools we wish existed when we started trading."
          </div>
          <div className="text-xs text-[#5C626D]">— PANDA Terminal</div>
        </div>
      </div>

      <div className="lg:col-span-9 flex flex-col">
        <div className="px-5 md:px-6 py-3 border-b border-[#1F2229] bg-[#1A1D24]">
          <span className="label-micro text-[#9BA1AB]">LEADERSHIP TEAM</span>
        </div>
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-rows-2 gap-0">
          {teamMembers.map((member, i) => (
            <div 
              key={i} 
              className={cn(
                "p-5 md:p-6 flex flex-col border-[#1F2229]",
                "border-b md:border-b-0",
                i % 2 === 0 && "md:border-r",
                i < 2 && "lg:border-b"
              )}
            >
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center"
                  style={{ background: `${member.color}20`, border: `2px solid ${member.color}` }}
                >
                  <span className="text-base font-medium" style={{ color: member.color }}>{member.initials}</span>
                </div>
                <div>
                  <div className="text-base text-[#F0F1F4] font-medium">{member.name}</div>
                  <div className="text-sm" style={{ color: member.color }}>{member.role}</div>
                </div>
              </div>
              <div className="text-sm text-[#9BA1AB] mb-3">{member.title}</div>
              <div className="space-y-2 flex-1">
                {member.points.map((point, pi) => (
                  <div key={pi} className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 mt-2 flex-shrink-0" style={{ background: member.color }} />
                    <span className="text-sm text-[#5C626D]">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[#2A2D35] bg-[#1A1D24] p-4 md:p-5 flex items-center justify-center gap-4">
          <div className="font-mono text-3xl md:text-4xl text-[#2D7AFF]">20+</div>
          <div className="text-base text-[#9BA1AB]">
            Senior analysts, support staff & interns that help make PANDA Terminal possible
          </div>
        </div>
      </div>
    </div>
  );
};

// SLIDE 10: Financials (Sequoia - traction + projections combined)
const FinancialsSlide = () => (
  <div className="h-full flex flex-col lg:grid lg:grid-cols-12 gap-0 overflow-y-auto lg:overflow-hidden">
    <div className="lg:col-span-4 flex flex-col lg:border-r border-[#2A2D35]">
      <div className="p-4 md:p-6 border-b border-[#1F2229] bg-[#1A1D24]">
        <div className="label-micro text-[#2D7AFF]">10 / FINANCIALS</div>
      </div>
      
      <div className="flex-1 flex flex-col justify-start px-5 md:px-6 py-4 md:py-5">
        <h2 className="text-2xl md:text-3xl font-light text-[#F0F1F4] mb-3">
          Traction + Projections
        </h2>
        <div className="flex items-center gap-2 mb-5">
          <LiveIndicator label="CURRENT METRICS" />
        </div>
        
        <div className="space-y-2.5">
          {[
            { label: "Community", value: "12,700", change: "+127% MoM" },
            { label: "MAU", value: "4,200", change: "+85% MoM" },
            { label: "Volume", value: "$50B", change: "Cumulative" },
            { label: "ARR", value: "$342K", change: "+200% YoY" },
          ].map((item, i) => (
            <div key={i} className="flex justify-between items-center p-3 bg-[#1A1D24]">
              <span className="text-sm text-[#9BA1AB]">{item.label}</span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-base text-[#F0F1F4]">{item.value}</span>
                <span className="font-mono text-sm text-[#12B76A]">{item.change}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-6 border-t border-[#1F2229] bg-[rgba(18,183,106,0.1)]">
        <div className="label-micro text-[#12B76A] mb-2">ARR TRAJECTORY</div>
        <div className="font-mono text-2xl md:text-3xl text-[#12B76A]">$342K → $18M</div>
        <div className="text-sm text-[#12B76A]/70">3-year target</div>
      </div>
    </div>

    <div className="lg:col-span-8 grid grid-rows-[auto_1fr_auto] gap-0">
      <div className="px-5 md:px-6 py-3 border-b border-[#1F2229] bg-[#1A1D24]">
        <span className="label-micro text-[#9BA1AB]">3-YEAR PROJECTIONS</span>
      </div>
      
      <GridCell className="p-4 md:p-6 overflow-x-auto" showCrosshair={false}>
        <div className="h-full flex flex-col min-w-[400px]">
          {/* Projection Table */}
          <table className="w-full mb-4">
            <thead>
              <tr className="bg-[#1A1D24]">
                {["YEAR", "USERS", "ARR", "VOLUME"].map((h, i) => (
                  <th key={i} className="label-micro text-[#9BA1AB] p-3 md:p-4 text-left border-b border-[#2A2D35]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { year: "2024 (Now)", users: "12.7K", arr: "$342K", volume: "$58M" },
                { year: "2025", users: "50K", arr: "$1.2M", volume: "$250M" },
                { year: "2026", users: "200K", arr: "$6M", volume: "$1.2B" },
                { year: "2027", users: "500K", arr: "$18M", volume: "$4B" },
              ].map((row, i) => (
                <tr key={i} className={cn("border-b border-[#1F2229]", i === 0 && "bg-[rgba(45,122,255,0.1)]")}>
                  <td className={cn("p-3 md:p-4 text-base", i === 0 ? "text-[#2D7AFF] font-medium" : "text-[#F0F1F4]")}>{row.year}</td>
                  <td className="p-3 md:p-4 font-mono text-base text-[#F0F1F4]">{row.users}</td>
                  <td className="p-3 md:p-4 font-mono text-base text-[#12B76A]">{row.arr}</td>
                  <td className="p-3 md:p-4 font-mono text-base text-[#9BA1AB]">{row.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Bar Chart */}
          <div className="flex-1 flex items-end gap-4 md:gap-6 pt-4">
            {[
              { year: "2024", arr: 342, users: 12.7 },
              { year: "2025", arr: 1200, users: 50 },
              { year: "2026", arr: 6000, users: 200 },
              { year: "2027", arr: 18000, users: 500 },
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full flex gap-1.5 items-end h-28 md:h-32">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.arr / 18000) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="flex-1 bg-[#12B76A]"
                  />
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(d.users / 500) * 100}%` }}
                    transition={{ duration: 0.6, delay: i * 0.1 + 0.05 }}
                    className="flex-1 bg-[#2D7AFF]"
                  />
                </div>
                <span className="text-sm text-[#5C626D] mt-2">{d.year}</span>
              </div>
            ))}
          </div>
        </div>
      </GridCell>
      
      <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[#2A2D35]">
        {[
          { label: "15% MoM Growth", desc: "(current: 18%)" },
          { label: "8% Conversion", desc: "(industry: 5-7%)" },
          { label: "2.5% Churn", desc: "(current: 2.4%)" },
        ].map((item, i) => (
          <div key={i} className={cn("p-4 md:p-5 text-center", i < 2 && "md:border-r border-b md:border-b-0 border-[#1F2229]")}>
            <div className="text-base text-[#F0F1F4]">{item.label}</div>
            <div className="text-sm text-[#5C626D]">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// SLIDE 11: The Ask
const AskSlide = () => (
  <div className="h-full flex flex-col lg:grid lg:grid-cols-12 gap-0 overflow-y-auto lg:overflow-hidden">
    <div className="lg:col-span-5 flex flex-col lg:border-r border-[#2A2D35]">
      <div className="p-4 md:p-6 border-b border-[#1F2229] bg-[#1A1D24]">
        <div className="label-micro text-[#2D7AFF]">11 / THE ASK</div>
      </div>
      
      <div className="flex-1 flex flex-col justify-start px-5 md:px-8 py-5 md:py-6">
        <h2 className="text-2xl md:text-3xl font-light text-[#F0F1F4] mb-4">
          Raising Seed Round
        </h2>
        <p className="text-base text-[#9BA1AB] mb-6">
          Accelerating product development and market expansion.
        </p>
        
        <div className="p-5 md:p-6 bg-[#1A2A44] border-l-2 border-[#2D7AFF]">
          <div className="label-micro text-[#2D7AFF] mb-2">TARGET RAISE</div>
          <div className="font-mono text-4xl md:text-5xl text-[#2D7AFF]">$2-4M</div>
          <div className="text-base text-[#9BA1AB] mt-2">Seed / Series A</div>
        </div>
      </div>

      <div className="grid grid-cols-3 border-t border-[#1F2229]">
        {[
          { label: "RUNWAY", value: "18mo" },
          { label: "HIRES", value: "8-12" },
          { label: "BREAK-EVEN", value: "Q4'26" }
        ].map((item, i) => (
          <div key={i} className={cn("p-3 md:p-4 text-center", i < 2 && "border-r border-[#1F2229]")}>
            <div className="font-mono text-lg md:text-xl text-[#F0F1F4]">{item.value}</div>
            <div className="text-xs text-[#5C626D]">{item.label}</div>
          </div>
        ))}
      </div>
    </div>

    <div className="lg:col-span-7 flex flex-col">
      <div className="px-5 md:px-6 py-3 border-b border-[#1F2229] bg-[#1A1D24]">
        <span className="label-micro text-[#9BA1AB]">USE OF FUNDS</span>
      </div>
      
      <GridCell className="flex-1 p-5 md:p-6" showCrosshair={false}>
        <div className="space-y-5">
          {[
            { label: "Engineering", value: 40, amount: "$1.2M", desc: "Core platform & infrastructure" },
            { label: "Growth", value: 25, amount: "$750K", desc: "Marketing & user acquisition" },
            { label: "Operations", value: 20, amount: "$600K", desc: "Team expansion & compliance" },
            { label: "Research", value: 15, amount: "$450K", desc: "New metrics & analytics R&D" }
          ].map((item, i) => (
            <div key={i}>
              <div className="flex flex-col md:flex-row justify-between md:items-baseline mb-2 gap-1">
                <div>
                  <span className="text-base text-[#F0F1F4]">{item.label}</span>
                  <span className="text-sm text-[#5C626D] ml-2 hidden md:inline">{item.desc}</span>
                </div>
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-base text-[#9BA1AB]">{item.amount}</span>
                  <span className="font-mono text-lg text-[#2D7AFF]">{item.value}%</span>
                </div>
              </div>
              <div className="h-3 bg-[#1A1D24] relative">
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[#2A2D35]">
        {[
          { label: "18-Month Runway", icon: Shield },
          { label: "Key Hires: 8-12", icon: Users },
          { label: "Break-even: Q4 2026", icon: Target }
        ].map((item, i) => (
          <div key={i} className={cn("p-4 md:p-5 flex items-center gap-3", i < 2 && "md:border-r border-b md:border-b-0 border-[#1F2229]")}>
            <item.icon className="w-5 h-5 text-[#2D7AFF]" strokeWidth={1.5} />
            <span className="text-sm text-[#9BA1AB]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// SLIDE 12: Closing
const ClosingSlide = () => (
  <div className="h-full flex flex-col lg:grid lg:grid-cols-12 gap-0 overflow-y-auto lg:overflow-hidden">
    <div className="lg:col-span-7 flex flex-col lg:border-r border-[#2A2D35]">
      <div className="p-4 md:p-6 border-b border-[#1F2229]">
        <div className="label-micro text-[#2D7AFF]">12 / GET STARTED</div>
      </div>
      
      <div className="flex-1 flex flex-col justify-center px-5 md:px-12 py-5 md:py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-[56px] font-light text-[#F0F1F4] mb-2 leading-tight">
            Don't just trade<span className="text-[#2D7AFF]">.</span>
          </h1>
          <h1 className="text-3xl md:text-[56px] font-light text-[#2D7AFF] mb-6 leading-tight">
            Dominate.
          </h1>
          <p className="text-lg md:text-xl text-[#9BA1AB] mb-8">
            Your edge is waiting.
          </p>
          
          <div className="flex flex-wrap gap-3 mb-10">
            <a 
              href="https://www.app.pandaterminal.com/?referral=5caf965d339c" 
              target="_blank"
              rel="noopener noreferrer"
              className="bp-btn-primary flex items-center gap-2"
            >
              Launch Terminal <ArrowRight className="w-5 h-5" />
            </a>
            <a 
              href="https://docs.pandaterminal.com/docs/introduction/getting-started"
              target="_blank"
              rel="noopener noreferrer"
              className="bp-btn-secondary flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Documentation
            </a>
          </div>

          {/* Social Links */}
          <div className="border-t border-[#2A2D35] pt-6">
            <div className="label-micro text-[#5C626D] mb-4">CONNECT WITH US</div>
            <div className="flex gap-4">
              <a 
                href="https://x.com/pandaterminal" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-4 py-2.5 bg-[#1A1D24] hover:bg-[#1F2229] transition-colors rounded"
              >
                <svg className="w-5 h-5 text-[#9BA1AB] group-hover:text-[#F0F1F4] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span className="text-sm text-[#9BA1AB] group-hover:text-[#F0F1F4] transition-colors">@pandaterminal</span>
              </a>
              <a 
                href="https://www.youtube.com/@pandaterminalmetrics" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-4 py-2.5 bg-[#1A1D24] hover:bg-[#1F2229] transition-colors rounded"
              >
                <svg className="w-5 h-5 text-[#9BA1AB] group-hover:text-[#FF0000] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span className="text-sm text-[#9BA1AB] group-hover:text-[#F0F1F4] transition-colors">YouTube</span>
              </a>
              <a 
                href="https://t.me/+w8kQSxHOdkEyMmJk" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-4 py-2.5 bg-[#1A1D24] hover:bg-[#1F2229] transition-colors rounded"
              >
                <svg className="w-5 h-5 text-[#9BA1AB] group-hover:text-[#0088cc] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                <span className="text-sm text-[#9BA1AB] group-hover:text-[#F0F1F4] transition-colors">Telegram</span>
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="p-4 md:p-6 border-t border-[#1F2229] bg-[#1A1D24]">
        <div className="flex flex-wrap items-center justify-between gap-4 text-base text-[#9BA1AB]">
          <div className="flex items-center gap-4">
            <a href="https://www.pandaterminal.com" target="_blank" rel="noopener noreferrer" className="hover:text-[#F0F1F4] transition-colors">pandaterminal.com</a>
            <span className="text-[#2A2D35] hidden md:inline">•</span>
            <span className="hidden md:inline">hello@pandaterminal.com</span>
          </div>
          <a 
            href="https://www.app.pandaterminal.com/workbench?referral=5caf965d339c" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2D7AFF] hover:text-[#5A9CFF] transition-colors flex items-center gap-1"
          >
            Open Workbench <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>

    <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 lg:grid-rows-3 gap-0">
      <GridCell className="p-5 md:p-6 flex flex-col justify-center">
        <div className="label-micro text-[#5C626D] mb-3">PLATFORM STATUS</div>
        <div className="flex items-center gap-3 mb-4">
          <LiveIndicator label="OPERATIONAL" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 md:p-4 bg-[#1A1D24]">
            <div className="text-sm text-[#5C626D]">UPTIME</div>
            <div className="font-mono text-xl text-[#F0F1F4]">99.97%</div>
          </div>
          <div className="p-3 md:p-4 bg-[#1A1D24]">
            <div className="text-sm text-[#5C626D]">LATENCY</div>
            <div className="font-mono text-xl text-[#F0F1F4]">&lt;50ms</div>
          </div>
        </div>
      </GridCell>

      <GridCell className="p-5 md:p-6 flex flex-col justify-center">
        <div className="label-micro text-[#5C626D] mb-3">QUICK LINKS</div>
        <div className="space-y-2">
          <a 
            href="https://www.app.pandaterminal.com/explore?referral=5caf965d339c" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-[#1A1D24] hover:bg-[#1F2229] transition-colors group"
          >
            <span className="text-sm text-[#9BA1AB] group-hover:text-[#F0F1F4]">Explore Ideas</span>
            <ArrowRight className="w-4 h-4 text-[#5C626D] group-hover:text-[#2D7AFF] transition-colors" />
          </a>
          <a 
            href="https://www.app.pandaterminal.com/workbench?referral=5caf965d339c" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-[#1A1D24] hover:bg-[#1F2229] transition-colors group"
          >
            <span className="text-sm text-[#9BA1AB] group-hover:text-[#F0F1F4]">Workbench</span>
            <ArrowRight className="w-4 h-4 text-[#5C626D] group-hover:text-[#2D7AFF] transition-colors" />
          </a>
          <a 
            href="https://docs.pandaterminal.com/docs/introduction/getting-started" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 bg-[#1A1D24] hover:bg-[#1F2229] transition-colors group"
          >
            <span className="text-sm text-[#9BA1AB] group-hover:text-[#F0F1F4]">Documentation</span>
            <ArrowRight className="w-4 h-4 text-[#5C626D] group-hover:text-[#2D7AFF] transition-colors" />
          </a>
        </div>
      </GridCell>

      <GridCell className="p-5 md:p-6 flex flex-col justify-center" showCrosshair={false}>
        <div className="label-micro text-[#5C626D] mb-3">KEY METRICS</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 md:p-4 bg-[#1A1D24]">
            <div className="font-mono text-2xl md:text-3xl text-[#F0F1F4]">12.7K</div>
            <div className="text-sm text-[#5C626D]">USERS</div>
          </div>
          <div className="p-3 md:p-4 bg-[rgba(18,183,106,0.15)]">
            <div className="font-mono text-2xl md:text-3xl text-[#12B76A]">$58.6M</div>
            <div className="text-sm text-[#5C626D]">VOLUME</div>
          </div>
        </div>
      </GridCell>
    </div>
  </div>
);

// --- Slide Renderer (Sequoia Format) ---
const SlideRenderer = ({ slideId, onNext }: { slideId: string, onNext: () => void }) => {
  const components: Record<string, React.ReactNode> = {
    "purpose": <PurposeSlide onNext={onNext} />,  // 1. Company Purpose
    "problem": <ProblemSlide />,                   // 2. Problem
    "solution": <SolutionSlide />,                 // 3. Solution
    "why-now": <WhyNowSlide />,                    // 4. Why Now
    "market": <MarketSlide />,                     // 5. Market Potential
    "competition": <CompetitionSlide />,           // 6. Competition
    "product": <ProductSlide />,                   // 7. Product
    "model": <ModelSlide />,                       // 8. Business Model
    "team": <TeamSlide />,                         // 9. Team
    "financials": <FinancialsSlide />,             // 10. Financials
    "ask": <AskSlide />,                           // The Ask
    "closing": <ClosingSlide />,                   // Closing CTA
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
      <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-6 py-3 md:py-4 flex justify-between items-center bg-[#12141A] border-b border-[#2A2D35]">
        <div className="flex items-center gap-3 md:gap-4">
          <PandaLogo size="small" showSubtext={false} />
          <div className="w-px h-4 bg-[#2A2D35] hidden md:block" />
          <span className="text-sm text-[#5C626D] hidden md:block">Investor Deck 2025</span>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          {/* Progress bar */}
          <div className="hidden lg:flex items-center gap-1 w-48">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => jumpToSlide(i)}
                className={cn(
                  "flex-1 h-1.5 transition-all duration-200",
                  currentSlide === i ? "bg-[#2D7AFF]" : currentSlide > i ? "bg-[#2D7AFF]/40" : "bg-[#1F2229]"
                )}
              />
            ))}
          </div>

          {/* Slide counter */}
          <span className="font-mono text-sm md:text-base text-[#9BA1AB]">
            {String(currentSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
          </span>

          {/* Menu */}
          <button 
            onClick={() => setIsIndexOpen(!isIndexOpen)} 
            className="p-2.5 md:p-3 border border-[#2A2D35] hover:border-[#2D7AFF] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            {isIndexOpen ? <X className="w-5 h-5 text-[#F0F1F4]" strokeWidth={1.5} /> : <Menu className="w-5 h-5 text-[#F0F1F4]" strokeWidth={1.5} />}
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
            className="fixed inset-0 z-40 bg-[#12141A] flex items-center justify-center p-4 md:p-8 overflow-y-auto"
          >
            <div className="max-w-3xl w-full">
              <div className="label-micro text-[#2D7AFF] mb-4 md:mb-6">DECK INDEX</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-[#2A2D35]">
                {slides.map((s, i) => (
                  <motion.button
                    key={s.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    onClick={() => { jumpToSlide(i); setIsIndexOpen(false); }}
                    className={cn(
                      "flex items-center gap-4 p-4 md:p-5 text-left border-b md:border-r border-[#1F2229] transition-colors min-h-[56px]",
                      currentSlide === i ? "bg-[#1A2A44]" : "hover:bg-[#1A1D24]"
                    )}
                  >
                    <span className="font-mono text-sm text-[#2D7AFF] w-8">{String(i + 1).padStart(2, '0')}</span>
                    <span className={cn(
                      "text-base",
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
          className="absolute inset-0 top-[52px] md:top-[61px] bottom-[56px] md:bottom-[64px]"
        >
          <SlideRenderer slideId={slides[currentSlide].id} onNext={nextSlide} />
        </motion.section>
      </AnimatePresence>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-30 px-4 md:px-6 py-2.5 md:py-3.5 flex justify-between items-center bg-[#12141A] border-t border-[#2A2D35]">
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="p-2.5 md:p-3 border border-[#2A2D35] hover:border-[#2D7AFF] transition-colors disabled:opacity-30 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-[#F0F1F4]" strokeWidth={1.5} />
          </button>
          <button
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="p-2.5 md:p-3 border border-[#2A2D35] hover:border-[#2D7AFF] transition-colors disabled:opacity-30 disabled:cursor-not-allowed min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 text-[#F0F1F4]" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex items-center gap-4 md:gap-6 text-sm text-[#5C626D]">
          <span className="hidden md:block">← → Navigate</span>
          <div className="hidden md:flex items-center gap-3">
            <a href="https://x.com/pandaterminal" target="_blank" rel="noopener noreferrer" className="hover:text-[#F0F1F4] transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://www.youtube.com/@pandaterminalmetrics" target="_blank" rel="noopener noreferrer" className="hover:text-[#F0F1F4] transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
            </a>
            <a href="https://t.me/+w8kQSxHOdkEyMmJk" target="_blank" rel="noopener noreferrer" className="hover:text-[#F0F1F4] transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            </a>
          </div>
          <span>© 2025 PANDA Terminal</span>
        </div>
      </nav>
    </main>
  );
}
