"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Crown, Lock, AlertTriangle, FileText, Unlock, AlertCircle, ChevronLeft, Heart, Scale, UserX, MessageSquare, BookOpen, Zap, Shield, Target } from "lucide-react";
import { AnalysisResult } from "../api/analyze/route";
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

// ==================== 深度心理学组件 ====================

// 依恋人格分析卡片
function AttachmentCard({ profile }: { profile: AnalysisResult['psychological_profile'] }) {
  const getAttachmentColor = (type: string) => {
    const colors: Record<string, string> = {
      '焦虑型': '#D4A5A5',
      '回避型': '#A5B8D4',
      '安全型': '#A5D4B8',
      '恐惧型': '#B8A9C9',
    };
    return colors[type] || '#B8A9C9';
  };

  const color = getAttachmentColor(profile.attachment_type);

  return (
    <div className="bg-gradient-to-br from-[#F8F5FA] to-[#FDF8F8] rounded-2xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Heart className="w-4 h-4" style={{ color }} />
        <h3 className="text-xs font-semibold text-[#5A5A5A]">依恋人格画像</h3>
      </div>
      
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold"
          style={{ backgroundColor: color }}
        >
          {profile.attachment_type.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-bold text-[#4A4A4A]">{profile.attachment_type}</p>
          <p className="text-[10px] text-[#7A7A7A]">{profile.type_description}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="bg-white/60 rounded-lg p-2.5">
          <p className="text-[10px] text-[#9A7A8A] mb-1">典型行为模式</p>
          <ul className="text-xs text-[#5A4A5A] space-y-1">
            {profile.behavioral_patterns.map((pattern, i) => (
              <li key={i}>• {pattern}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white/60 rounded-lg p-2.5">
          <p className="text-[10px] text-[#9A7A8A] mb-1">压力反应</p>
          <p className="text-xs text-[#5A4A5A]">{profile.stress_response}</p>
        </div>
      </div>
    </div>
  );
}

// 权力动态分析
function PowerDynamics({ dynamics }: { dynamics: AnalysisResult['power_dynamics'] }) {
  const getPowerColor = (position: string) => {
    const colors: Record<string, string> = {
      '高位': '#D4A5A5',
      '低位': '#A5B8D4',
      '平衡': '#B8A9C9',
    };
    return colors[position] || '#B8A9C9';
  };

  return (
    <div className="bg-gradient-to-br from-[#F5F8FA] to-[#F8F5FA] rounded-2xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Scale className="w-4 h-4 text-[#A5B8D4]" />
        <h3 className="text-xs font-semibold text-[#5A5A5A]">权力动态分析</h3>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
          <span className="text-xs text-[#7A7A7A]">情感投资比</span>
          <span className="text-xs font-bold text-[#5A5A5A]">{dynamics.investment_ratio}</span>
        </div>
        <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
          <span className="text-xs text-[#7A7A7A]">权力位置</span>
          <span className="text-xs font-bold" style={{ color: getPowerColor(dynamics.power_position) }}>{dynamics.power_position}</span>
        </div>
        <div className="flex items-center justify-between p-2 bg-white/60 rounded-lg">
          <span className="text-xs text-[#7A7A7A]">沟通能耗</span>
          <span className="text-xs font-bold text-[#5A5A5A]">{dynamics.communication_cost}</span>
        </div>
      </div>

      <div className="bg-white/60 rounded-lg p-2.5">
        <p className="text-[10px] text-[#9A7A8A] mb-1">框架控制技巧</p>
        <ul className="text-xs text-[#5A4A5A] space-y-1">
          {dynamics.control_tactics.map((tactic, i) => (
            <li key={i}>• {tactic}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// 用户审计
function UserAudit({ audit }: { audit: AnalysisResult['user_audit'] }) {
  return (
    <div className="bg-gradient-to-br from-[#FAF8F5] to-[#FDF8F8] rounded-2xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <UserX className="w-4 h-4 text-[#D4A5A5]" />
        <h3 className="text-xs font-semibold text-[#5A5A5A]">你的情感盲区</h3>
      </div>

      <div className="space-y-2">
        <div className="bg-white/60 rounded-lg p-2.5">
          <p className="text-[10px] text-[#9A7A8A] mb-1">认知偏差</p>
          <p className="text-xs text-[#5A4A5A]">{audit.cognitive_bias}</p>
        </div>
        <div className="bg-white/60 rounded-lg p-2.5">
          <p className="text-[10px] text-[#9A7A8A] mb-1">情绪索取行为</p>
          <ul className="text-xs text-[#5A4A5A] space-y-1">
            {audit.emotional_demands.map((demand, i) => (
              <li key={i}>• {demand}</li>
            ))}
          </ul>
        </div>
        <div className="bg-white/60 rounded-lg p-2.5">
          <p className="text-[10px] text-[#9A7A8A] mb-1">自我价值投射</p>
          <p className="text-xs text-[#5A4A5A]">{audit.self_value_projection}</p>
        </div>
        <div className="bg-white/60 rounded-lg p-2.5">
          <p className="text-[10px] text-[#9A7A8A] mb-1">改进建议</p>
          <ul className="text-xs text-[#5A4A5A] space-y-1">
            {audit.improvement_suggestions.map((suggestion, i) => (
              <li key={i}>• {suggestion}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// 神回复剧本
function ScriptDeck({ scripts }: { scripts: AnalysisResult['reply_scripts'] }) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const scriptList = [
    { key: 'provocative', label: '拉扯反击版' },
    { key: 'graceful', label: '体面退场版' },
    { key: 'honest', label: '开诚布公版' },
  ] as const;

  return (
    <div className="bg-gradient-to-br from-[#F5FAF8] to-[#F8FAF5] rounded-2xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-4 h-4 text-[#A5D4B8]" />
        <h3 className="text-xs font-semibold text-[#5A5A5A]">神回复剧本</h3>
      </div>

      <div className="space-y-2">
        {scriptList.map(({ key, label }) => {
          const script = scripts[key];
          return (
            <div 
              key={key}
              className="bg-white/60 rounded-lg overflow-hidden cursor-pointer transition-all"
              onClick={() => setExpandedKey(expandedKey === key ? null : key)}
            >
              <div className="p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-white bg-[#A5D4B8] px-1.5 py-0.5 rounded">{label}</span>
                  <span className="text-xs text-[#5A5A5A]">{script.description}</span>
                </div>
                <span className="text-[10px] text-[#9A9A9A]">{expandedKey === key ? '收起' : '展开'}</span>
              </div>
              
              {expandedKey === key && (
                <div className="px-2.5 pb-2.5 space-y-2 border-t border-[#E8E0E8] pt-2">
                  <div className="bg-[#A5D4B8]/10 rounded p-2">
                    <p className="text-[10px] text-[#5A8A6A] mb-0.5">回复话术</p>
                    <p className="text-xs text-[#4A6A5A] font-medium">"{script.script}"</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#9A7A8A] mb-0.5">心理学原理</p>
                    <p className="text-xs text-[#5A4A5A]">{script.psychology_tip}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 法官低语
function JudgeWhisper({ whisper }: { whisper: AnalysisResult['judges_whisper'] }) {
  return (
    <div className="bg-gradient-to-br from-[#2D2A3E] to-[#3D3850] rounded-2xl p-4 text-white">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-4 h-4 text-[#D4A5A5]" />
        <h3 className="text-xs font-semibold text-white/90">法官的治愈寄语</h3>
      </div>

      <div className="bg-white/10 rounded-lg p-4">
        <p className="text-xs text-white/90 leading-relaxed italic">
          "{whisper}"
        </p>
      </div>
    </div>
  );
}

// ==================== 原有组件 ====================

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

// 模糊遮罩组件
function BlurOverlay({ onUnlock, hiddenCount }: { onUnlock: () => void; hiddenCount?: number }) {
  return (
    <div className="absolute inset-0 z-10 rounded-xl overflow-hidden flex flex-col justify-end">
      <div className="absolute inset-0 backdrop-blur-[6px]" />
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.55) 40%, rgba(255,255,255,0.92) 75%, rgba(255,255,255,0.98) 100%)',
        }}
      />
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
        pointRadius: 4,
      },
    ],
  };
}

const radarOptions = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    r: {
      beginAtZero: true,
      max: 100,
      min: 0,
      ticks: {
        display: false,
        stepSize: 20,
      },
      grid: {
        color: 'rgba(184, 169, 201, 0.2)',
      },
      angleLines: {
        color: 'rgba(184, 169, 201, 0.3)',
      },
      pointLabels: {
        font: {
          size: 11,
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

// 结果页面内容组件
function ResultContent() {
  const router = useRouter();
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showUnlockCeremony, setShowUnlockCeremony] = useState(false);
  const [revealedItems, setRevealedItems] = useState<Set<number>>(new Set());
  const [isRadarColored, setIsRadarColored] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 从 localStorage 获取分析结果
  useEffect(() => {
    try {
      const data = localStorage.getItem('analysisResult');
      if (data) {
        const parsed = JSON.parse(data);
        setAnalysisResult(parsed);
      }
    } catch (e) {
      console.error('解析分析结果失败:', e);
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F3E5F5] via-[#EDE7F6] to-[#E8EAF6] flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-[#B8A9C9] animate-pulse mx-auto" />
          <p className="text-[#7A6A8A] mt-2 text-sm">加载中...</p>
        </div>
      </div>
    );
  }

  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F3E5F5] via-[#EDE7F6] to-[#E8EAF6] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-[#B8A9C9] mx-auto mb-4" />
          <p className="text-[#6B5B7A]">未找到分析结果</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-[#B8A9C9] to-[#D4A5A5] text-white text-sm"
          >
            返回首页
          </button>
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

      {/* 固定头部区域 */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-br from-[#F3E5F5]/95 via-[#EDE7F6]/95 to-[#E8EAF6]/95 backdrop-blur-md border-b border-white/20">
        <div className="max-w-sm mx-auto px-4 py-3">
          {/* 返回按钮 */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-1 text-[#7A6A8A] hover:text-[#5A4A6A] transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-xs">返回重新分析</span>
          </button>
          
          {/* 标题 */}
          <div className="text-center">
            <h1 className="text-lg font-bold text-[#4A4A4A]">关系诊断报告</h1>
            <p className="text-[10px] text-[#9A9A9A]">
              ID: {analysisResult.analysis_id.slice(-8)}
            </p>
          </div>
        </div>
      </header>

      {/* 可滚动内容区域 */}
      <main className="relative pt-24 pb-24 px-4">
        <div className="max-w-sm mx-auto space-y-5">
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

            <div className="p-5 pb-8">
              {/* 扎心总结 */}
              <div className="text-center mb-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4A5A5]/10 mb-3">
                  <span className="text-xs text-[#8B5A5A]">闺蜜诊断</span>
                </div>
                <p className="text-base text-[#4A4A4A] font-medium leading-relaxed">
                  {analysisResult.relationship_summary}
                </p>
              </div>

              {/* 雷达图 */}
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

              {/* 潜台词对照表 - 左右排版 */}
              {analysisResult.translations.length > 0 && (
                <div className="mt-5">
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
                          {/* 左右对照布局 - 使用 flex 确保高度自适应 */}
                          <div className="flex divide-x divide-[#E8E0E8]">
                            {/* 左边：他说的 - 始终可见 */}
                            <div className="flex-1 p-3 bg-[#FAFAFA]">
                              <div className="flex items-center gap-1.5 mb-1.5">
                                <span className="text-[10px] font-medium text-[#9A9A9A] bg-[#E8E0E8] px-1.5 py-0.5 rounded">他说的</span>
                              </div>
                              <p className="text-sm text-[#4A4A4A] leading-relaxed">
                                {item.original_text}
                              </p>
                            </div>
                            
                            {/* 右边：实际上 - 第3条起模糊 */}
                            <div className="flex-1 p-3 bg-gradient-to-br from-[#FFF5F5] to-[#FFF0F5]">
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

              {/* 付费解锁提示 */}
              {!isUnlocked && (
                <div className="sticky bottom-4 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-[#B8A9C9]/20 mt-5">
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

          {/* ===== 付费解锁后的深度心理学内容 ===== */}
          {isUnlocked && (
            <>
              {/* 依恋人格分析 */}
              <AttachmentCard profile={analysisResult.psychological_profile} />

              {/* 权力动态分析 */}
              <PowerDynamics dynamics={analysisResult.power_dynamics} />

              {/* 用户审计 */}
              <UserAudit audit={analysisResult.user_audit} />

              {/* 神回复剧本 */}
              <ScriptDeck scripts={analysisResult.reply_scripts} />

              {/* 法官低语 */}
              <JudgeWhisper whisper={analysisResult.judges_whisper} />
            </>
          )}
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
                  <span>依恋人格 · 权力动态 · 情感盲区</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#5A5A5A]">
                  <span className="text-green-500">✓</span>
                  <span>神回复剧本 · 法官判决书</span>
                </div>
              </div>

              {/* 按钮 */}
              <div className="space-y-2">
                <button
                  onClick={() => {
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
            const allIndices = new Set(analysisResult?.translations.map((_, i) => i) || []);
            setRevealedItems(allIndices);
          }}
        />
      )}
    </div>
  );
}

// 主页面组件（添加 Suspense 边界）
export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#F3E5F5] via-[#EDE7F6] to-[#E8EAF6] flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-[#B8A9C9] animate-pulse mx-auto" />
          <p className="text-[#7A6A8A] mt-2 text-sm">加载中...</p>
        </div>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
