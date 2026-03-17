"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, ImageIcon, X, Sparkles, Brain, Filter, Database, AlertCircle, Target, Zap, Shield } from "lucide-react";
import { AnalysisResult } from "./api/analyze/route";

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
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

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

  // 处理拖拽悬停
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // 处理文件选择
  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const remainingSlots = 3 - uploadedImages.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);

    filesToProcess.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setError('请上传图片文件（JPG、PNG）');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('单张图片不能超过 10MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImages((prev) => [...prev, result]);
        setError(null);
      };
      reader.readAsDataURL(file);
    });
  }, [uploadedImages.length]);

  // 处理拖拽放下
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  // 处理点击上传
  const handleClick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    e.target.value = '';
  }, [handleFileSelect]);

  // 删除图片
  const removeImage = useCallback((index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // 开始分析
  const startAnalysis = useCallback(async () => {
    if (uploadedImages.length === 0) return;

    setIsAnalyzing(true);
    setError(null);

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

      // 存储分析结果到 localStorage，然后跳转到结果页
      localStorage.setItem('analysisResult', JSON.stringify(data));
      router.push('/result');
    } catch (err) {
      console.error("分析错误:", err);
      setError(err instanceof Error ? err.message : "分析失败，请稍后重试");
      setIsAnalyzing(false);
    }
  }, [uploadedImages, router]);

  // 加载状态
  if (isAnalyzing) {
    const CurrentIcon = LOADING_MESSAGES[currentMessageIndex].icon;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F3E5F5] via-[#EDE7F6] to-[#E8EAF6] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="relative flex items-center justify-center mb-12">
            <div className="absolute w-32 h-32 rounded-full bg-[#B8A9C9]/20 animate-pulse-ring" />
            <div className="absolute w-32 h-32 rounded-full bg-[#B8A9C9]/10 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
            
            <div className="relative w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#B8A9C9]/30 border-t-[#B8A9C9] animate-spin-slow" />
              <CurrentIcon className="w-10 h-10 text-[#8B7AA8]" />
            </div>
          </div>

          <div className="text-center h-16">
            <p 
              key={currentMessageIndex}
              className="text-lg font-medium text-[#6B5B7A] animate-fade-in-up"
            >
              {LOADING_MESSAGES[currentMessageIndex].text}
            </p>
          </div>

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
                onChange={handleClick}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-[#B8A9C9]/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8 text-[#8B7AA8]" />
                </div>
                <p className="text-[#5A5A5A] font-medium mb-2">
                  点击或拖拽上传聊天记录
                </p>
                <p className="text-sm text-[#9A9A9A]">
                  支持 JPG、PNG 格式，最多 3 张
                </p>
              </div>
            </div>
          )}

          {/* 已上传图片预览 */}
          {uploadedImages.length > 0 && (
            <div className="mt-4 space-y-3">
              {uploadedImages.map((image, index) => (
                <div 
                  key={index}
                  className="relative bg-white rounded-2xl p-3 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#F5F0F5] flex items-center justify-center overflow-hidden">
                      <img 
                        src={image} 
                        alt={`上传图片 ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#5A5A5A] font-medium">图片 {index + 1}</p>
                      <p className="text-xs text-[#9A9A9A]">已上传</p>
                    </div>
                    <button
                      onClick={() => removeImage(index)}
                      className="w-8 h-8 rounded-full bg-[#F5F0F5] flex items-center justify-center hover:bg-[#E8E0E8] transition-colors"
                    >
                      <X className="w-4 h-4 text-[#8B7AA8]" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 开始分析按钮 */}
          {uploadedImages.length > 0 && (
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
        </div>

        {/* 底部提示 */}
        <div className="mt-10 text-center">
          <p className="text-xs text-[#A0A0A0]">
            支持 JPG、PNG 格式 · 单张最大 10MB
          </p>
        </div>
      </main>
    </div>
  );
}
