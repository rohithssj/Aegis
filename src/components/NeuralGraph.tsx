"use client";

import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { MetricPoint } from "@/lib/mockData";

interface NeuralGraphProps {
  data: MetricPoint[];
  isEmergency?: boolean;
}

export const NeuralGraph = ({ data, isEmergency }: NeuralGraphProps) => {
  const chartData = useMemo(() => {
    // Ensure we only show the last 20-30 points for performance and "sliding window" effect
    return data.slice(-20);
  }, [data]);

  return (
    <div className="w-full h-full min-h-[180px] md:min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="neuralGradient" x1="0" y1="0" x2="0" y2="1">
              <stop 
                offset="5%" 
                stopColor={isEmergency ? "#ef4444" : "#5B4CF0"} 
                stopOpacity={0.3} 
              />
              <stop 
                offset="95%" 
                stopColor={isEmergency ? "#ef4444" : "#5B4CF0"} 
                stopOpacity={0} 
              />
            </linearGradient>
          </defs>
          <CartesianGrid 
            strokeDasharray="3 3" 
            vertical={false} 
            stroke="rgba(255,255,255,0.03)" 
          />
          <XAxis 
            dataKey="time" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 9, fontFamily: 'var(--font-mono)' }}
            interval="preserveStartEnd"
            minTickGap={30}
          />
          <YAxis 
            hide 
            domain={[0, 'auto']} 
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0F172A',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              fontSize: '10px',
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
            }}
            itemStyle={{ color: isEmergency ? "#ef4444" : "#5B4CF0" }}
            cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={isEmergency ? "#ef4444" : "#5B4CF0"}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#neuralGradient)"
            isAnimationActive={true}
            animationDuration={1000}
            activeDot={{ r: 4, strokeWidth: 0, fill: isEmergency ? "#ef4444" : "#5B4CF0" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
