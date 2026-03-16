"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Upload, ImageIcon, X, Sparkles, Brain, Filter, Database, AlertCircle, Lock, Crown, QrCode, Heart, Scale, UserX, MessageSquare, BookOpen, Zap, Shield, Target, AlertTriangle, FileText, Unlock } from "lucide-react";
import { AnalysisResult } from "./api/analyze/route";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

// 注册 Chart.js 组件
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// 解锁仪式感动画组件
function UnlockCeremony({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'scanning' | 'decrypting' | 'complete'>('scanning');
  
  useEffect(() => {
    const timer1 = setTimeout(() => setPhase('decrypting'), 2000);
    const timer2 = setTimeout(() => {
      setPhase('complete');
      setTimeout(onComplete, 500);
    }, 3500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-80 h-80">
        {/* 扫描光束 */}
        {phase === 'scanning' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 rounded-full border-2 border-[#B8A9C9]/30 relative overflow-hidden">
              <div className="absolute inset-0 animate-scan-beam bg-gradient-to-b from-transparent via-[#B8A9C9]/50 to-transparent h-20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="w-16 h-16 text-[#B8A9C9]/50" />
              </div>
            </div>
            <p className="absolute bottom-0 text-white/80 text-sm">正在扫描档案...</p>
          </div>
        )}
        
        {/* 解密动画 */}
        {phase === 'decrypting' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-64 h-40 bg-gradient-to-br from-[#2D2A3E] to-[#3D3850] rounded-lg p-4 relative overflow-hidden animate-folder-open">
              <div className="absolute inset-0 animate-decrypt-shine" />
              <div className="flex items-center gap-2 mb-3">
                <Unlock className="w-5 h-5 text-[#D4A5A5]" />
                <span className="text-white/80 text-xs">档案解密中</span>
              </div>
              <div className="space-y-2">
                <div className="h-2 bg-white/10 rounded animate-pulse" style={{ width: '80%' }} />
                <div className="h-2 bg-white/10 rounded animate-pulse" style={{ width: '60%', animationDelay: '0.1s' }} />
                <div className="h-2 bg-white/10 rounded animate-pulse" style={{ width: '90%', animationDelay: '0.2s' }} />
              </div>
            </div>
            <p className="text-white/80 text-sm mt-4">解密深层动机...</p>
          </div>
        )}
        
        {/* 完成 */}
        {phase === 'complete' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#B8A9C9] to-[#D4A5A5] flex items-center justify-center mb-4">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <p className="text-white text-lg font-bold">解锁成功</p>
            <p className="text-white/60 text-sm">完整报告已生成</p>
          </div>
        )}
      </div>
    </div>
  );
}

// 风险预警组件
function RiskAlert({ ghostingRisk }: { ghostingRisk: number }) {
  const getRiskLevel = () => {
    if (ghostingRisk >= 80) return { level: '极高', color: 'text-red-500', bgColor: 'bg-red-500' };
    if (ghostingRisk >= 60) return { level: '高', color: 'text-orange-500', bgColor: 'bg-orange-500' };
    if (ghostingRisk >= 40) return { level: '中等', color: 'text-yellow-500', bgColor: 'bg-yellow-500' };
    return { level: '低', color: 'text-green-500', bgColor: 'bg-green-500' };
  };
  
  const { level, color, bgColor } = getRiskLevel();
  
  return (
    <div className={`rounded-xl p-4 border ${ghostingRisk >= 60 ? 'border-red-200 bg-red-50 animate-pulse-glow' : 'border-orange-200 bg-orange-50'}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center animate-breathe`}>
          <AlertTriangle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#4A4A4A]">冷暴力风险预警</h4>
          <p className={`text-xs ${color} font-medium`}>风险等级：{level} ({ghostingRisk}%)</p>
        </div>
      </div>
      <p className="text-xs text-[#5A5A5A] leading-relaxed">
        {ghostingRisk >= 80 
          ? "⚠️ 危险！对方正在使用冷暴力手段操控你的情绪，建议立即止损！"
          : ghostingRisk >= 60
          ? "⚡ 警告！冷暴力风险较高，对方可能在逐步抽离，请保持警惕。"
          : ghostingRisk >= 40
          ? "📊 注意！存在一定冷暴力倾向，建议观察后续发展。"
          : "✅ 风险较低，但仍需关注对方的沟通模式。"
        }
      </p>
    </div>
  );
}

// 模糊遮罩组件 - 渐变感版本（可见不可读）
function BlurOverlay({ onUnlock, hiddenCount }: { onUnlock: () => void; hiddenCount?: number; index?: number }) {
  return (
    <div className="absolute inset-0 z-10 rounded-xl overflow-hidden flex flex-col justify-end">
      {/* 顶部轻微模糊，底部深色渐变 */}
      <div className="absolute inset-0 backdrop-blur-[6px]" />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.55) 40%, rgba(255,255,255,0.92) 75%, rgba(255,255,255,0.98) 100%)',
        }}
      />
      {/* 底部文案 + 按钮 */}
      <div className="relative z-10 flex flex-col items-center pb-3 pt-6">
        <div className="flex items-center gap-1.5 mb-2 px-3 py-1 rounded-full bg-[#B8A9C9]/10 border border-[#B8A9C9]/20">
          <Lock className="w-3 h-3 text-[#8B7AA8]" />
          <p className="text-[10px] text-[#6B5B7A] font-medium">
            {hiddenCount ? `此处隐藏了 ${hiddenCount} 条致命潜台词分析` : '深层动机已隐藏'}
          </p>
        </div>
        <button
          onClick={onUnlock}
          className="btn-shine animate-btn-breathe px-4 py-1.5 rounded-full bg-gradient-to-r from-[#B8A9C9] to-[#D4A5A5] text-white text-[10px] font-medium flex items-center gap-1 shadow-md shadow-[#B8A9C9]/30"
        >
          <Sparkles className="w-3 h-3" />
          点击解锁深层动机
        </button>
      </div>
    </div>
  );
}

// 打字机效果组件
function TypewriterText({ text, isActive }: { text: string; isActive: boolean }) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  useEffect(() => {
    if (!isActive) {
      setDisplayText('');
      setIsComplete(false);
      return;
    }
    
    let index = 0;
    const timer = setInterval(() => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, 30);
    
    return () => clearInterval(timer);
  }, [text, isActive]);
  
  return (
    <span className="relative">
      {displayText}
      {isActive && !isComplete && (
        <span className="inline-block w-0.5 h-4 bg-[#D4A5A5] ml-0.5 animate-pulse" />
      )}
    </span>
  );
}

// 依恋人格卡片组件
function AttachmentCard({ profile, isLocked, onUnlock }: { 
  profile: AnalysisResult['psychological_profile']; 
  isLocked: boolean;
  onUnlock: () => void;
}) {
  return (
    <div className="relative bg-gradient-to-br from-[#F0E8F5] to-[#F8F0F5] rounded-2xl p-4 overflow-hidden">
      {isLocked && <BlurOverlay onUnlock={onUnlock} />}
      
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-[#B8A9C9] flex items-center justify-center">
          <Heart className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#4A4A4A]">依恋人格诊断</h3>
          <p className="text-[10px] text-[#8B7AA8]">基于 Bowlby 依恋理论</p>
        </div>
      </div>
      
      <div className="bg-white/70 rounded-xl p-3 mb-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-0.5 rounded-full bg-[#D4A5A5]/20 text-[#8B5A5A] text-xs font-bold">
            {profile.attachment_type}
          </span>
        </div>
        <p className="text-xs text-[#5A5A5A] leading-relaxed">{profile.type_description}</p>
      </div>
      
      <div className="space-y-2">
        <p className="text-[10px] font-semibold text-[#7A7A7A] uppercase">典型行为模式</p>
        <div className="flex flex-wrap gap-1.5">
          {profile.behavioral_patterns.map((pattern, i) => (
            <span key={i} className="px-2 py-1 rounded-lg bg-white/50 text-[10px] text-[#5A5A5A]">
              {pattern}
            </span>
          ))}
        </div>
      </div>
      
      <div className="mt-3 p-2.5 rounded-lg bg-[#FFF5F5]/50 border border-[#D4A5A5]/20">
        <p className="text-[10px] text-[#8B5A5A]">
          <span className="font-semibold">压力反应：</span>{profile.stress_response}
        </p>
      </div>
    </div>
  );
}

// 权力动力学组件
function PowerDynamics({ dynamics, isLocked, onUnlock }: { 
  dynamics: AnalysisResult['power_dynamics']; 
  isLocked: boolean;
  onUnlock: () => void;
}) {
  // 解析投资比
  const ratioMatch = dynamics.investment_ratio.match(/(\d+)%.*?(\d+)%/);
  const theirRatio = ratioMatch ? parseInt(ratioMatch[1]) : 30;
  const userRatio = ratioMatch ? parseInt(ratioMatch[2]) : 70;
  
  return (
    <div className="relative bg-gradient-to-br from-[#E8F0F5] to-[#F0F8F5] rounded-2xl p-4 overflow-hidden">
      {isLocked && <BlurOverlay onUnlock={onUnlock} />}
      
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-[#A5B8D4] flex items-center justify-center">
          <Scale className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#4A4A4A]">权力动力学分析</h3>
          <p className="text-[10px] text-[#7A8BA8]">情感投资与沟通能耗</p>
        </div>
      </div>
      
      {/* 天平可视化 */}
      <div className="bg-white/70 rounded-xl p-3 mb-3">
        <p className="text-[10px] text-[#7A7A7A] mb-2 text-center">情感投资比</p>
        <div className="flex items-center gap-3">
          <div className="flex-1 text-center">
            <p className="text-xs text-[#9A9A9A] mb-1">对方</p>
            <div className="h-2 rounded-full bg-[#E8E8E8] overflow-hidden">
              <div 
                className="h-full bg-[#A5B8D4] rounded-full transition-all duration-1000"
                style={{ width: `${theirRatio}%` }}
              />
            </div>
            <p className="text-xs font-bold text-[#A5B8D4] mt-1">{theirRatio}%</p>
          </div>
          <span className="text-[#9A9A9A] text-xs">vs</span>
          <div className="flex-1 text-center">
            <p className="text-xs text-[#9A9A9A] mb-1">你</p>
            <div className="h-2 rounded-full bg-[#E8E8E8] overflow-hidden">
              <div 
                className="h-full bg-[#D4A5A5] rounded-full transition-all duration-1000"
                style={{ width: `${userRatio}%` }}
              />
            </div>
            <p className="text-xs font-bold text-[#D4A5A5] mt-1">{userRatio}%</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-white/50 rounded-lg p-2.5">
          <p className="text-[10px] text-[#7A7A7A] mb-1">权力位置</p>
          <p className="text-xs font-bold text-[#4A4A4A]">{dynamics.power_position}</p>
        </div>
        <div className="bg-white/50 rounded-lg p-2.5">
          <p className="text-[10px] text-[#7A7A7A] mb-1">沟通能耗</p>
          <p className="text-xs font-bold text-[#4A4A4A]">{dynamics.communication_cost.split(' ')[0]}</p>
        </div>
      </div>
      
      <div>
        <p className="text-[10px] font-semibold text-[#7A7A7A] mb-1.5">框架控制技巧</p>
        <div className="space-y-1">
          {dynamics.control_tactics.map((tactic, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-[#D4A5A5]/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-[8px] text-[#8B5A5A]">{i + 1}</span>
              </span>
              <p className="text-[10px] text-[#5A5A5A] leading-relaxed">{tactic}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 用户行为审计组件
function UserAudit({ audit, isLocked, onUnlock }: { 
  audit: AnalysisResult['user_audit']; 
  isLocked: boolean;
  onUnlock: () => void;
}) {
  return (
    <div className="relative bg-gradient-to-br from-[#F5F0E8] to-[#F8F5F0] rounded-2xl p-4 overflow-hidden">
      {isLocked && <BlurOverlay onUnlock={onUnlock} />}
      
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-[#D4C4A5] flex items-center justify-center">
          <UserX className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#4A4A4A]">用户行为审计</h3>
          <p className="text-[10px] text-[#9A8A7A]">认知偏差与改进建议</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="bg-white/70 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Target className="w-3.5 h-3.5 text-[#D4A5A5]" />
            <p className="text-[10px] font-semibold text-[#7A7A7A]">认知偏差</p>
          </div>
          <p className="text-xs text-[#5A5A5A] leading-relaxed">{audit.cognitive_bias}</p>
        </div>
        
        <div className="bg-white/70 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Zap className="w-3.5 h-3.5 text-[#D4A5A5]" />
            <p className="text-[10px] font-semibold text-[#7A7A7A]">情绪索取行为</p>
          </div>
          <ul className="space-y-1">
            {audit.emotional_demands.map((demand, i) => (
              <li key={i} className="text-xs text-[#5A5A5A] flex items-start gap-1.5">
                <span className="text-[#D4A5A5] mt-0.5">•</span>
                {demand}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-[#FFF5F5]/50 rounded-xl p-3 border border-[#D4A5A5]/20">
          <p className="text-[10px] text-[#8B5A5A] mb-1.5">
            <span className="font-semibold">自我价值感：</span>{audit.self_value_projection}
          </p>
        </div>
        
        <div>
          <p className="text-[10px] font-semibold text-[#7A7A7A] mb-2 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            改进建议
          </p>
          <div className="space-y-1.5">
            {audit.improvement_suggestions.map((suggestion, i) => (
              <div key={i} className="flex items-start gap-2 bg-white/50 rounded-lg p-2">
                <span className="w-5 h-5 rounded-full bg-[#A5D4B8]/20 flex items-center justify-center shrink-0 text-[10px] text-[#5A8B6A] font-bold">
                  {i + 1}
                </span>
                <p className="text-[10px] text-[#5A5A5A] leading-relaxed">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// 神回复剧本组件
function ScriptDeck({ scripts, isLocked, onUnlock }: { 
  scripts: AnalysisResult['reply_scripts']; 
  isLocked: boolean;
  onUnlock: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'provocative' | 'graceful' | 'honest'>('provocative');
  
  const tabs = [
    { key: 'provocative' as const, label: '拉扯', icon: Zap, color: '#D4A5A5' },
    { key: 'graceful' as const, label: '退场', icon: Shield, color: '#A5B8D4' },
    { key: 'honest' as const, label: '对质', icon: MessageSquare, color: '#A5D4B8' },
  ];
  
  const activeScript = scripts[activeTab];
  
  return (
    <div className="relative bg-gradient-to-br from-[#F8F5FA] to-[#FAF8FC] rounded-2xl p-4 overflow-hidden">
      {isLocked && <BlurOverlay onUnlock={onUnlock} />}
      
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-[#B8A9C9] flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-[#4A4A4A]">神回复剧本</h3>
          <p className="text-[10px] text-[#8B7AA8]">三种策略，任君选择</p>
        </div>
      </div>
      
      {/* 标签切换 */}
      <div className="flex gap-2 mb-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                isActive 
                  ? 'text-white shadow-md' 
                  : 'bg-white/50 text-[#7A7A7A] hover:bg-white'
              }`}
              style={{ 
                backgroundColor: isActive ? tab.color : undefined 
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>
      
      {/* 剧本内容 */}
      <div className="bg-white rounded-xl p-3 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-bold" style={{ color: tabs.find(t => t.key === activeTab)?.color }}>
            {activeScript.name}
          </h4>
          <span className="text-[10px] text-[#9A9A9A]">{activeScript.description}</span>
        </div>
        
        <div className="bg-[#F8F8F8] rounded-lg p-3 mb-2">
          <p className="text-sm text-[#4A4A4A] leading-relaxed italic">
            &ldquo;{activeScript.script}&rdquo;
          </p>
        </div>
        
        <div className="flex items-start gap-1.5">
          <span className="text-[10px] font-semibold text-[#8B7AA8]">心理学原理：</span>
          <p className="text-[10px] text-[#7A7A7A] leading-relaxed">{activeScript.psychology_tip}</p>
        </div>
      </div>
    </div>
  );
}

// 法官的耳语组件
function JudgeWhisper({ whisper, isLocked, onUnlock }: { 
  whisper: string; 
  isLocked: boolean;
  onUnlock: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      {isLocked && <BlurOverlay onUnlock={onUnlock} />}
      
      {/* 深色沉浸式背景 */}
      <div className="bg-gradient-to-br from-[#2D2A3E] via-[#3D3850] to-[#4A4560] p-5">
        {/* 装饰元素 */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#B8A9C9]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#D4A5A5]/10 rounded-full blur-3xl" />
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <Heart className="w-4 h-4 text-[#D4A5A5]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">法官的耳语</h3>
              <p className="text-[10px] text-white/60">给你的心，一个拥抱</p>
            </div>
          </div>
          
          <div className="relative">
            {/* 引号装饰 */}
            <span className="absolute -top-2 -left-1 text-4xl text-white/10 font-serif">&ldquo;</span>
            
            <p className="text-sm text-white/90 leading-relaxed pl-4 border-l-2 border-[#D4A5A5]/50">
              {whisper}
            </p>
            
            <span className="absolute -bottom-4 right-0 text-4xl text-white/10 font-serif">&rdquo;</span>
          </div>
          
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[10px] text-white/40">— 你的AI闺蜜</span>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D4A5A5]/60" />
              <span className="text-[10px] text-white/40">愿你得遇良人</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 加载状态轮播文案
const LOADING_MESSAGES = [
  { icon: Database, text: "正在比对海王话术库..." },
  { icon: Brain, text: "正在检测情绪不对等指数..." },
  { icon: Filter, text: "正在识别冷暴力隐性信号..." },
  { icon: Target, text: "正在分析权力动力学结构..." },
  { icon: Zap, text: "正在根据依恋人格推演后续走向..." },
  { icon: Shield, text: "正在评估情感操控风险等级..." },
  { icon: Sparkles, text: "正在生成深度心理分析报告..." },
];

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showUnlockCeremony, setShowUnlockCeremony] = useState(false);
  const [revealedItems, setRevealedItems] = useState<Set<number>>(new Set());
  const [isRadarColored, setIsRadarColored] = useState(false);

  // 轮播文案效果
  useEffect(() => {
    if (!isAnalyzing) return;
    
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [isAnalyzing]);

  // 处理拖拽进入
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  // 处理拖拽离开
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  // 处理文件
  const handleFiles = useCallback((files: File[]) => {
    if (files.length === 0) return;

    // 限制最多3张图片
    const remainingSlots = 3 - uploadedImages.length;
    const filesToProcess = files.slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImages((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  }, [uploadedImages.length]);

  // 处理拖拽悬停
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // 处理文件拖放
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(
      (file) => file.type.startsWith("image/")
    );

    handleFiles(files);
  }, [handleFiles]);

  // 处理文件选择
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(
      (file) => file.type.startsWith("image/")
    );

    handleFiles(files);
  }, [handleFiles]);

  // 删除图片
  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  // 开始分析
  const startAnalysis = async () => {
    if (uploadedImages.length === 0) return;
    
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          images: uploadedImages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "分析失败，请稍后重试");
      }

      setAnalysisResult(data);
    } catch (err) {
      console.error("分析错误:", err);
      setError(err instanceof Error ? err.message : "分析失败，请稍后重试");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 加载状态组件
  if (isAnalyzing) {
    const CurrentIcon = LOADING_MESSAGES[currentMessageIndex].icon;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F3E5F5] via-[#EDE7F6] to-[#E8EAF6] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {/* 动画区域 */}
          <div className="relative flex items-center justify-center mb-12">
            {/* 外圈脉冲 */}
            <div className="absolute w-32 h-32 rounded-full bg-[#B8A9C9]/20 animate-pulse-ring" />
            <div className="absolute w-32 h-32 rounded-full bg-[#B8A9C9]/10 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
            
            {/* 中心旋转图标 */}
            <div className="relative w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#B8A9C9]/30 border-t-[#B8A9C9] animate-spin-slow" />
              <CurrentIcon className="w-10 h-10 text-[#8B7AA8]" />
            </div>
          </div>

          {/* 轮播文案 */}
          <div className="text-center h-16">
            <p 
              key={currentMessageIndex}
              className="text-lg font-medium text-[#6B5B7A] animate-fade-in-up"
            >
              {LOADING_MESSAGES[currentMessageIndex].text}
            </p>
          </div>

          {/* 进度条 */}
          <div className="mt-8">
            <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#B8A9C9] to-[#D4A5A5] rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${((currentMessageIndex + 1) / LOADING_MESSAGES.length) * 100}%`,
                  transition: 'width 2s ease-out'
                }}
              />
            </div>
            <p className="text-center text-sm text-[#9B8BA8] mt-3">
              已完成 {Math.round(((currentMessageIndex + 1) / LOADING_MESSAGES.length) * 100)}%
            </p>
          </div>

          {/* 提示文字 */}
          <p className="text-center text-xs text-[#A89BA8] mt-8">
            深度心理学模型正在解码语言背后的权力结构...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3E5F5] via-[#EDE7F6] to-[#E8EAF6]">
      {/* 装饰背景元素 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-[#B8A9C9]/10 blur-3xl animate-float" />
        <div className="absolute bottom-40 right-10 w-40 h-40 rounded-full bg-[#D4A5A5]/10 blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-[#A5B8D4]/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      {/* 主内容 */}
      <main className="relative min-h-screen flex flex-col items-center justify-center px-6 py-12">
        {/* 标题区域 */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4 text-[#B8A9C9]" />
            <span className="text-sm text-[#7A6A8A]">AI 潜台词分析专家</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold text-[#4A4A4A] mb-4 leading-tight">
            潜台词翻译机
          </h1>
          <p className="text-base sm:text-lg text-[#7A7A7A] max-w-xs mx-auto leading-relaxed">
            上传聊天记录，听听TA没说出口的真心话
          </p>
        </div>

        {/* 上传区域 */}
        <div className="w-full max-w-sm">
          {/* 拖拽上传区域 */}
          {uploadedImages.length < 3 && (
            <div
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`
                relative rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer
                ${isDragging 
                  ? 'border-[#B8A9C9] bg-[#B8A9C9]/10 scale-[1.02]' 
                  : 'border-[#D4C4D9] bg-white/50 hover:bg-white/70 hover:border-[#B8A9C9]/50'
                }
              `}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="flex flex-col items-center justify-center py-12 px-6">
                <div className={`
                  w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300
                  ${isDragging ? 'bg-[#B8A9C9] scale-110' : 'bg-[#B8A9C9]/20'}
                `}>
                  <Upload className={`w-8 h-8 transition-colors duration-300 ${isDragging ? 'text-white' : 'text-[#8B7AA8]'}`} />
                </div>
                
                <p className="text-[#5A5A5A] font-medium mb-2">
                  点击或拖拽上传截图
                </p>
                <p className="text-sm text-[#9A9A9A]">
                  支持 1-3 张聊天记录截图
                </p>
                
                {isDragging && (
                  <p className="mt-3 text-sm text-[#8B7AA8] font-medium animate-fade-in-up">
                    松开即可上传
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 已上传图片预览 */}
          {uploadedImages.length > 0 && (
            <div className="mt-6 space-y-3">
              <p className="text-sm text-[#7A7A7A] font-medium">
                已上传 {uploadedImages.length}/3 张
              </p>
              
              <div className="grid grid-cols-3 gap-3">
                {uploadedImages.map((img, index) => (
                  <div 
                    key={index} 
                    className="relative aspect-square rounded-xl overflow-hidden bg-white/50 shadow-sm group"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={img} 
                      alt={`上传图片 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
                
                {/* 占位符 - 还可以上传 */}
                {uploadedImages.length < 3 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-[#D4C4D9] bg-white/30 flex flex-col items-center justify-center cursor-pointer hover:bg-white/50 hover:border-[#B8A9C9]/50 transition-all">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <ImageIcon className="w-6 h-6 text-[#B8A9C9] mb-1" />
                    <span className="text-xs text-[#9A9A9A]">继续添加</span>
                  </label>
                )}
              </div>
            </div>
          )}

          {/* 开始分析按钮 */}
          {uploadedImages.length > 0 && !analysisResult && (
            <button
              onClick={startAnalysis}
              disabled={isAnalyzing}
              className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-[#B8A9C9] to-[#D4A5A5] text-white font-medium text-lg shadow-lg shadow-[#B8A9C9]/30 hover:shadow-xl hover:shadow-[#B8A9C9]/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? "分析中..." : "开始深度分析"}
            </button>
          )}

          {/* 错误提示 */}
          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* 分析结果 */}
          {analysisResult && (
            <div className="mt-6 space-y-5 animate-fade-in-up">
              {/* 报告卡片 */}
              <div className="bg-white rounded-[28px] shadow-xl shadow-[#B8A9C9]/10 overflow-hidden">
                {/* 顶部标签 */}
                <div className="bg-gradient-to-r from-[#B8A9C9] to-[#D4A5A5] px-5 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-white text-sm font-medium">关系诊断报告</span>
                    </div>
                    <span className="text-white/80 text-xs">ID: {analysisResult.analysis_id.slice(-8)}</span>
                  </div>
                </div>

                <div className="p-5">
                  {/* 扎心总结 */}
                  <div className="text-center mb-5">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A5A5]/10 mb-3">
                      <span className="text-xs text-[#8B5A5A]">闺蜜诊断</span>
                    </div>
                    <p className="text-base text-[#4A4A4A] font-medium leading-relaxed">
                      {analysisResult.relationship_summary}
                    </p>
                  </div>

                  {/* 雷达图 - 灰阶/彩色过渡 */}
                  <div className={`bg-gradient-to-br from-[#F8F5FA] to-[#FDF8F8] rounded-2xl p-4 mb-3 ${!isRadarColored && !isUnlocked ? 'grayscale-transition' : 'grayscale-transition colored'}`}>
                    <h3 className="text-xs font-semibold text-[#7A7A7A] text-center mb-3 uppercase tracking-wider">
                      多维人格分析
                    </h3>
                    <div className="w-full max-w-[200px] mx-auto">
                      <Radar 
                        data={getRadarData(analysisResult.flag_scores)} 
                        options={radarOptions} 
                      />
                    </div>
                    {/* 图例说明 */}
                    <div className="flex justify-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#A5D4B8]" />
                        <span className="text-[10px] text-[#7A7A7A]">真诚度</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#D4A5A5]" />
                        <span className="text-[10px] text-[#7A7A7A]">冷暴力风险</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#A5B8D4]" />
                        <span className="text-[10px] text-[#7A7A7A]">PUA指数</span>
                      </div>
                    </div>
                  </div>

                  {/* 风险预警组件 */}
                  <RiskAlert ghostingRisk={analysisResult.flag_scores.ghosting_risk} />

                  {/* 潜台词对照表 - 左右排版（半遮半掩策略） */}
                  {analysisResult.translations.length > 0 && (
                    <div className="mb-5">
                      <h3 className="text-xs font-semibold text-[#5A5A5A] uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span>🔪</span> 扎心翻译
                        <span className="text-[10px] text-[#9A9A9A] font-normal normal-case">
                          （前2条免费，{analysisResult.translations.length - 2}条待解锁）
                        </span>
                      </h3>
                      
                      <div className="space-y-3">
                        {analysisResult.translations.map((item, index) => {
                          const isLocked = index >= 2 && !isUnlocked;
                          const isRevealed = revealedItems.has(index) || isUnlocked;
                          
                          return (
                            <div 
                              key={index}
                              className="relative bg-white rounded-xl border border-[#E8E0E8] overflow-hidden"
                            >
                              {/* 左右对照布局 */}
                              <div className="grid grid-cols-2 divide-x divide-[#E8E0E8]">
                                {/* 左边：他说的 - 始终可见 */}
                                <div className="p-3 bg-[#FAFAFA]">
                                  <div className="flex items-center gap-1.5 mb-1.5">
                                    <span className="text-[10px] font-medium text-[#9A9A9A] bg-[#E8E0E8] px-1.5 py-0.5 rounded">他说的</span>
                                  </div>
                                  <p className="text-sm text-[#4A4A4A] leading-relaxed">
                                    {item.original_text}
                                  </p>
                                </div>
                                
                                {/* 右边：实际上 - 第3条起模糊 */}
                                <div className="p-3 bg-gradient-to-br from-[#FFF5F5] to-[#FFF0F5] relative">
                                  <div className="flex items-center gap-1.5 mb-1.5">
                                    <span className="text-[10px] font-medium text-white bg-[#D4A5A5] px-1.5 py-0.5 rounded">实际上</span>
                                  </div>
                                  <p className={`text-sm text-[#8B4A4A] font-medium leading-relaxed italic transition-all duration-800 ${isLocked && !isRevealed ? 'blur-[10px] opacity-50' : 'blur-0 opacity-100'}`}>
                                    {isRevealed ? (
                                      <TypewriterText 
                                        text={item.subtext_translation} 
                                        isActive={isUnlocked && !revealedItems.has(index)} 
                                      />
                                    ) : (
                                      item.subtext_translation
                                    )}
                                  </p>
                                  
                                  {/* 心理学原理 - 解锁后显示 */}
                                  {(isRevealed || isUnlocked) && (
                                    <p className="text-[10px] text-[#9A7A7A] mt-2 pt-2 border-t border-[#D4A5A5]/20">
                                      <span className="font-medium">💡</span> {item.psychology_note}
                                    </p>
                                  )}
                                </div>
                              </div>
                              
                              {/* 锁定遮罩 - 仅第3条起，叠在整个翻译块上方，只显示一次 */}
                              {isLocked && !isRevealed && index === 2 && (
                                <BlurOverlay 
                                  onUnlock={() => setShowPaymentModal(true)}
                                  hiddenCount={analysisResult.translations.length - 2}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 新增：依恋人格诊断 - 付费解锁 */}
                  <AttachmentCard 
                    profile={analysisResult.psychological_profile}
                    isLocked={!isUnlocked}
                    onUnlock={() => setShowPaymentModal(true)}
                  />

                  {/* 新增：权力动力学分析 - 付费解锁 */}
                  <PowerDynamics 
                    dynamics={analysisResult.power_dynamics}
                    isLocked={!isUnlocked}
                    onUnlock={() => setShowPaymentModal(true)}
                  />

                  {/* 新增：用户行为审计 - 付费解锁 */}
                  <UserAudit 
                    audit={analysisResult.user_audit}
                    isLocked={!isUnlocked}
                    onUnlock={() => setShowPaymentModal(true)}
                  />

                  {/* 红旗/绿旗 - 免费显示 */}
                  <div className="grid grid-cols-2 gap-3">
                    {analysisResult.red_flags.length > 0 && (
                      <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                        <h4 className="text-xs font-bold text-red-600 mb-2 flex items-center gap-1.5">
                          <span>🚩</span> 危险信号
                        </h4>
                        <ul className="space-y-1.5">
                          {analysisResult.red_flags.slice(0, 3).map((flag, i) => (
                            <li key={i} className="text-[10px] text-red-700 flex items-start gap-1.5">
                              <span className="text-red-400 mt-0.5">•</span>
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {analysisResult.green_flags.length > 0 && (
                      <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                        <h4 className="text-xs font-bold text-green-600 mb-2 flex items-center gap-1.5">
                          <span>✅</span> 勉强算好的
                        </h4>
                        <ul className="space-y-1.5">
                          {analysisResult.green_flags.map((flag, i) => (
                            <li key={i} className="text-[10px] text-green-700 flex items-start gap-1.5">
                              <span className="text-green-400 mt-0.5">•</span>
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* 新增：神回复剧本 - 付费解锁 */}
                  <ScriptDeck 
                    scripts={analysisResult.reply_scripts}
                    isLocked={!isUnlocked}
                    onUnlock={() => setShowPaymentModal(true)}
                  />

                  {/* 新增：法官的耳语 - 付费解锁 */}
                  <JudgeWhisper 
                    whisper={analysisResult.judges_whisper}
                    isLocked={!isUnlocked}
                    onUnlock={() => setShowPaymentModal(true)}
                  />

                  {/* 付费解锁提示 */}
                  {!isUnlocked && (
                    <div className="sticky bottom-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-[#B8A9C9]/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-[#4A4A4A]">解锁完整深度报告</p>
                          <p className="text-xs text-[#7A7A7A]">依恋人格 · 权力分析 · 神回复剧本</p>
                        </div>
                        <button
                          onClick={() => setShowPaymentModal(true)}
                          className="btn-shine animate-btn-breathe px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B8A9C9] to-[#D4A5A5] text-white text-sm font-medium flex items-center gap-2 shadow-lg shadow-[#B8A9C9]/30 hover:shadow-xl active:scale-[0.98] transition-shadow"
                        >
                          <Crown className="w-4 h-4" />
                          ¥9.9
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 重新分析按钮 */}
              <button
                onClick={() => {
                  setAnalysisResult(null);
                  setUploadedImages([]);
                  setError(null);
                  setIsUnlocked(false);
                }}
                className="w-full py-3.5 rounded-xl border-2 border-[#B8A9C9] text-[#8B7AA8] font-medium hover:bg-[#B8A9C9]/10 transition-all"
              >
                分析新的聊天记录
              </button>
            </div>
          )}
        </div>

        {/* 底部提示 */}
        <div className="mt-10 text-center">
          <p className="text-xs text-[#A0A0A0]">
            支持 JPG、PNG 格式 · 单张最大 10MB
          </p>
        </div>
      </main>

      {/* 支付弹窗 */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden animate-fade-in-up">
            {/* 弹窗头部 */}
            <div className="bg-gradient-to-r from-[#B8A9C9] to-[#D4A5A5] p-5 text-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">解锁完整深度报告</h3>
              <p className="text-white/80 text-sm mt-1">仅需 ¥9.9，永久查看</p>
            </div>
            
            {/* 弹窗内容 */}
            <div className="p-5">
              {/* 解锁内容列表 */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2 text-sm text-[#5A5A5A]">
                  <span className="text-green-500">✓</span>
                  <span>全部 {analysisResult?.translations.length || 0} 条潜台词深度分析</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#5A5A5A]">
                  <span className="text-green-500">✓</span>
                  <span>红旗/绿旗信号详细解读</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#5A5A5A]">
                  <span className="text-green-500">✓</span>
                  <span>闺蜜专属行动建议</span>
                </div>
              </div>

              {/* 二维码区域 */}
              <div className="bg-[#F8F5FA] rounded-xl p-4 text-center mb-4">
                <div className="w-40 h-40 mx-auto bg-white rounded-xl flex items-center justify-center mb-3 border border-[#E8E0E8]">
                  <QrCode className="w-24 h-24 text-[#B8A9C9]" />
                </div>
                <p className="text-xs text-[#7A7A7A] mb-1">扫码支付 ¥9.9</p>
                <p className="text-[10px] text-[#A0A0A0]">支持微信/支付宝</p>
              </div>

              {/* 操作提示 */}
              <div className="bg-[#FFF5F5] rounded-xl p-3 mb-4">
                <p className="text-xs text-[#8B4A4A] text-center leading-relaxed">
                  💡 支付后截图，发送给客服<span className="font-bold">极速解锁</span>
                </p>
              </div>

              {/* 按钮 */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    // 触发解锁仪式感动画
                    setShowPaymentModal(false);
                    setShowUnlockCeremony(true);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B8A9C9] to-[#D4A5A5] text-white font-medium hover:shadow-lg transition-all"
                >
                  我已支付，立即解锁
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full py-3 rounded-xl text-[#9A9A9A] text-sm hover:bg-[#F5F5F5] transition-colors"
                >
                  稍后再说
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 解锁仪式感动画 */}
      {showUnlockCeremony && (
        <UnlockCeremony 
          onComplete={() => {
            setShowUnlockCeremony(false);
            setIsUnlocked(true);
            setIsRadarColored(true);
            // 标记所有项目为已揭示，触发打字机效果
            const allIndices = new Set(analysisResult?.translations.map((_, i) => i) || []);
            setRevealedItems(allIndices);
          }}
        />
      )}
    </div>
  );
}

// 雷达图数据生成
function getRadarData(scores: { sincerity_level: number; ghosting_risk: number; manipulation_index: number }) {
  return {
    labels: ['真诚度', '冷暴力风险', 'PUA指数'],
    datasets: [
      {
        label: '人格画像',
        data: [scores.sincerity_level, scores.ghosting_risk, scores.manipulation_index],
        backgroundColor: 'rgba(184, 169, 201, 0.2)',
        borderColor: 'rgba(184, 169, 201, 0.8)',
        borderWidth: 2,
        pointBackgroundColor: [
          'rgba(165, 212, 184, 1)',
          'rgba(212, 165, 165, 1)',
          'rgba(165, 184, 212, 1)',
        ],
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ],
  };
}

// 雷达图配置
const radarOptions = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    r: {
      beginAtZero: true,
      max: 100,
      min: 0,
      ticks: {
        stepSize: 25,
        display: false,
      },
      grid: {
        color: 'rgba(200, 200, 200, 0.3)',
      },
      angleLines: {
        color: 'rgba(200, 200, 200, 0.3)',
      },
      pointLabels: {
        font: {
          size: 11,
          weight: 'bold' as const,
        },
        color: '#7A7A7A',
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};
