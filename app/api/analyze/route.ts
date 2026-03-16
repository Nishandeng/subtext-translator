import { NextRequest, NextResponse } from "next/server";

// System Prompt 定义 - 深度心理学分析版
const SYSTEM_PROMPT = `你是一位精通依恋理论、权力动力学和情感博弈的心理学专家。你的任务是对用户上传的聊天记录进行深度心理学剖析，帮助用户看清关系本质，实现情感觉醒。

【分析框架】
1. **依恋人格诊断**（基于Bowlby依恋理论）
   - 分析对方的依恋类型：安全型、焦虑型、回避型、恐惧型
   - 解读其亲密关系模式的历史成因
   - 预判对方在压力情境下的行为反应

2. **权力动力学分析**
   - 量化对话中的"情感投资比"（谁更主动、谁更在意）
   - 识别"框架控制"技巧（让对方自我怀疑、情绪依赖）
   - 评估沟通能耗：这段对话让用户消耗了多少心理能量

3. **用户行为审计**
   - 指出用户在对话中的认知偏差（过度解读、合理化对方行为）
   - 识别用户的情绪索取行为（寻求确认、过度解释）
   - 分析用户的自我价值感投射

4. **话术解构与翻译**
   - 逐句拆解对方的潜台词和真实意图
   - 标注话术背后的心理操控技巧

【输出要求】
- 保持专业但共情的语气，像一位睿智的闺蜜
- 所有分析必须有心理学理论支撑
- 自动脱敏：人名替换为"对方"，隐藏隐私信息
- 无论如何必须返回合法JSON

请严格按照以下 JSON 格式返回分析结果：
{
  "analysis_id": "唯一标识符",
  "relationship_summary": "一句话关系定性（如：典型的回避型依恋者在进行情感抽离）",
  "flag_scores": {
    "sincerity_level": 0-100,
    "ghosting_risk": 0-100,
    "manipulation_index": 0-100
  },
  "psychological_profile": {
    "attachment_type": "依恋类型（安全型/焦虑型/回避型/恐惧型）",
    "type_description": "该依恋类型的核心特征（50字左右）",
    "behavioral_patterns": ["典型行为模式1", "典型行为模式2", "典型行为模式3"],
    "stress_response": "压力下该依恋类型的典型反应"
  },
  "power_dynamics": {
    "investment_ratio": "情感投资比（如：对方30% vs 你70%）",
    "power_position": "权力位置（高位/低位/平衡）",
    "communication_cost": "沟通能耗评级（低/中/高）及说明",
    "control_tactics": ["识别出的框架控制技巧1", "技巧2"]
  },
  "user_audit": {
    "cognitive_bias": "用户的认知偏差（如：过度解读对方的敷衍为忙碌）",
    "emotional_demands": ["情绪索取行为1", "情绪索取行为2"],
    "self_value_projection": "用户在对话中暴露的低自我价值感表现",
    "improvement_suggestions": ["改进建议1", "改进建议2"]
  },
  "translations": [
    {
      "original_text": "对方原话",
      "subtext_translation": "潜台词翻译",
      "psychology_note": "背后的心理学原理"
    }
  ],
  "red_flags": ["危险信号1", "危险信号2"],
  "green_flags": ["加分信号1"],
  "reply_scripts": {
    "provocative": {
      "name": "拉扯反击版",
      "description": "以退为进，夺回主动权",
      "script": "具体回复话术（100字左右）",
      "psychology_tip": "此回复的心理学原理"
    },
    "graceful": {
      "name": "体面退场版", 
      "description": "优雅止损，保留尊严",
      "script": "具体回复话术（100字左右）",
      "psychology_tip": "此回复的心理学原理"
    },
    "honest": {
      "name": "开诚布公版",
      "description": "真诚沟通，直面问题",
      "script": "具体回复话术（100字左右）",
      "psychology_tip": "此回复的心理学原理"
    }
  },
  "judges_whisper": "一段100字左右、极具共情力与文学感的治愈寄语。像一位走过风雨的姐姐，在用户耳边轻声说：'我懂你的委屈，但你要记得...'"
}`;

// 分析结果类型定义 - 深度心理学版
export interface AnalysisResult {
  analysis_id: string;
  relationship_summary: string;
  flag_scores: {
    sincerity_level: number;
    ghosting_risk: number;
    manipulation_index: number;
  };
  psychological_profile: {
    attachment_type: string;
    type_description: string;
    behavioral_patterns: string[];
    stress_response: string;
  };
  power_dynamics: {
    investment_ratio: string;
    power_position: string;
    communication_cost: string;
    control_tactics: string[];
  };
  user_audit: {
    cognitive_bias: string;
    emotional_demands: string[];
    self_value_projection: string;
    improvement_suggestions: string[];
  };
  translations: {
    original_text: string;
    subtext_translation: string;
    psychology_note: string;
  }[];
  red_flags: string[];
  green_flags: string[];
  reply_scripts: {
    provocative: {
      name: string;
      description: string;
      script: string;
      psychology_tip: string;
    };
    graceful: {
      name: string;
      description: string;
      script: string;
      psychology_tip: string;
    };
    honest: {
      name: string;
      description: string;
      script: string;
      psychology_tip: string;
    };
  };
  judges_whisper: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { images } = body;

    // 验证请求
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: "请上传至少一张图片" },
        { status: 400 }
      );
    }

    if (images.length > 3) {
      return NextResponse.json(
        { error: "最多支持3张图片" },
        { status: 400 }
      );
    }

    // 获取 API Key（从环境变量读取）
    const apiKey = process.env.DASHSCOPE_API_KEY;
    if (!apiKey) {
      console.error("DASHSCOPE_API_KEY 未配置");
      // 开发模式下返回模拟数据
      if (process.env.NODE_ENV === "development") {
        return NextResponse.json(getMockResult());
      }
      return NextResponse.json(
        { error: "服务配置错误，请联系管理员" },
        { status: 500 }
      );
    }

    // 构建消息内容 - 官方格式：每项是 {"text": "..."} 或 {"image": "..."}
    const content: Array<{ text?: string; image?: string }> = [
      {
        text: "请分析以下聊天记录截图，按照系统提示词的格式返回 JSON 分析结果。",
      },
    ];

    // 添加图片 - 官方格式：{"image": "url或base64"}
    images.forEach((imageBase64: string) => {
      // 确保有正确的 data URI 前缀
      let imageData = imageBase64;
      if (!imageBase64.startsWith('data:image')) {
        imageData = `data:image/jpeg;base64,${imageBase64}`;
      }
      content.push({
        image: imageData,
      });
    });

    // 调用 Qwen-VL API (官方 HTTP API)
    const response = await fetch(
      "https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "qwen-vl-plus",
          input: {
            messages: [
              {
                role: "system",
                content: SYSTEM_PROMPT,
              },
              {
                role: "user",
                content: content,
              },
            ],
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Qwen API 错误:", errorData);
      throw new Error(`API 请求失败: ${response.status}`);
    }

    const data = await response.json();
    
    // 解析 AI 返回的内容
    let aiContent = data.output?.choices?.[0]?.message?.content;
    
    // 处理 content 可能是数组的情况（官方格式返回的是数组）
    if (Array.isArray(aiContent)) {
      // 找到 text 类型的内容
      const textItem = aiContent.find((item: { text?: string }) => item.text);
      aiContent = textItem?.text || "";
    }
    
    if (!aiContent || typeof aiContent !== "string") {
      throw new Error("AI 返回内容为空或格式错误");
    }

    // 提取 JSON（AI 可能返回 markdown 格式的 JSON）
    let analysisResult: AnalysisResult;
    try {
      // 尝试直接解析
      analysisResult = JSON.parse(aiContent);
    } catch {
      // 尝试从 markdown 代码块中提取
      const jsonMatch = aiContent.match(/```json\n?([\s\S]*?)\n?```/) || 
                        aiContent.match(/```\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[1].trim());
      } else {
        // 尝试查找花括号包裹的内容
        const braceMatch = aiContent.match(/\{[\s\S]*\}/);
        if (braceMatch) {
          analysisResult = JSON.parse(braceMatch[0]);
        } else {
          throw new Error("无法解析 AI 返回的 JSON");
        }
      }
    }

    // 验证返回结果结构
    if (!analysisResult.analysis_id || !analysisResult.relationship_summary) {
      throw new Error("AI 返回结果格式不完整");
    }

    return NextResponse.json(analysisResult);

  } catch (error) {
    console.error("分析接口错误:", error);
    
    // 无论任何错误，都返回统一格式的错误响应
    const errorResponse: AnalysisResult = {
      analysis_id: `error_${Date.now()}`,
      relationship_summary: `分析失败：${error instanceof Error ? error.message : "未知错误"}`,
      flag_scores: {
        sincerity_level: 0,
        ghosting_risk: 0,
        manipulation_index: 0
      },
      psychological_profile: {
        attachment_type: "未知",
        type_description: "无法分析依恋类型",
        behavioral_patterns: [],
        stress_response: "未知"
      },
      power_dynamics: {
        investment_ratio: "无法评估",
        power_position: "未知",
        communication_cost: "无法评估",
        control_tactics: []
      },
      user_audit: {
        cognitive_bias: "无法分析",
        emotional_demands: [],
        self_value_projection: "无法分析",
        improvement_suggestions: []
      },
      translations: [],
      red_flags: [],
      green_flags: [],
      reply_scripts: {
        provocative: {
          name: "拉扯反击版",
          description: "以退为进，夺回主动权",
          script: "请重新上传清晰的聊天记录截图以获取完整分析",
          psychology_tip: "清晰的沟通材料是准确分析的基础"
        },
        graceful: {
          name: "体面退场版",
          description: "优雅止损，保留尊严",
          script: "请重新上传清晰的聊天记录截图以获取完整分析",
          psychology_tip: "清晰的沟通材料是准确分析的基础"
        },
        honest: {
          name: "开诚布公版",
          description: "真诚沟通，直面问题",
          script: "请重新上传清晰的聊天记录截图以获取完整分析",
          psychology_tip: "清晰的沟通材料是准确分析的基础"
        }
      },
      judges_whisper: "亲爱的，分析遇到了一些问题。但请记住，无论结果如何，你都值得被温柔以待。请重新上传清晰的截图，让我为你解读这段关系。"
    };
    
    // 开发模式下返回模拟数据
    if (process.env.NODE_ENV === "development") {
      console.log("开发模式：返回模拟数据");
      return NextResponse.json(getMockResult());
    }

    return NextResponse.json(errorResponse);
  }
}

// 生成唯一 ID
function generateId(): string {
  return `ana_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// 模拟数据（用于开发和测试）- 深度心理学版
function getMockResult(): AnalysisResult {
  return {
    analysis_id: generateId(),
    relationship_summary: "典型的回避型依恋者在进行情感抽离，你正在经历'间歇性强化'的操控",
    flag_scores: {
      sincerity_level: 25,
      ghosting_risk: 85,
      manipulation_index: 70
    },
    psychological_profile: {
      attachment_type: "回避型依恋（Dismissive-Avoidant）",
      type_description: "对亲密关系感到不适，习惯用疏离来保护自己，害怕被束缚",
      behavioral_patterns: [
        "在关系升温时突然冷淡",
        "回避深入的情感交流",
        "用'忙'作为情感隔离的借口",
        "对承诺和规划未来感到恐惧"
      ],
      stress_response: "当感受到亲密压力时，会本能地退缩、逃避，需要大量独处空间"
    },
    power_dynamics: {
      investment_ratio: "对方20% vs 你80%",
      power_position: "绝对低位",
      communication_cost: "极高 - 每次对话都像在解谜，消耗大量情绪劳动",
      control_tactics: [
        "间歇性强化：偶尔热情让你产生希望",
        "煤气灯效应：让你怀疑自己的需求是否合理",
        "冷暴力惩罚：用沉默让你自我反省"
      ]
    },
    user_audit: {
      cognitive_bias: "过度解读对方的敷衍，将其合理化为'他真的很忙'",
      emotional_demands: [
        "频繁寻求确认：反复查看对方是否已读",
        "过度解释：为自己的正常需求找理由",
        "情绪绑架：用生气来换取关注"
      ],
      self_value_projection: "在对话中过度道歉、过度迁就，暴露出不配得感",
      improvement_suggestions: [
        "停止追逐，把注意力拉回自己身上",
        "建立'情感止损线'，超过三次不回复就放弃",
        "练习'延迟满足'，不要秒回消息"
      ]
    },
    translations: [
      {
        original_text: "在忙，晚点聊",
        subtext_translation: "你对我来说优先级很低，我想回就回，不想回你就等着吧",
        psychology_note: "典型的回避型依恋者的情感抽离策略，用模糊承诺维持最低限度的联系"
      },
      {
        original_text: "哈哈哈真的吗",
        subtext_translation: "完全没兴趣聊下去，用笑声敷衍你，希望你识趣点闭嘴",
        psychology_note: "情感回避的表现，用表面的轻松掩盖内心的疏离"
      },
      {
        original_text: "你挺好的，就是我现在不想谈恋爱",
        subtext_translation: "经典好人卡收好！翻译：我对你没感觉，但还想吊着你当备胎",
        psychology_note: "回避型依恋者的经典话术，既不想承诺又不想完全断绝"
      }
    ],
    red_flags: [
      "已读不回超过24小时是常态，且从不解释",
      "永远你在主动找话题，对方从不分享生活",
      "回避所有关于未来的讨论，一提到就转移话题",
      "只在深夜或无聊时找你，把你当情绪垃圾桶",
      "从不公开你们的关系，社交圈完全隔离"
    ],
    green_flags: [
      "偶尔会点赞你的朋友圈（但仅此而已，不要过度解读）"
    ],
    reply_scripts: {
      provocative: {
        name: "拉扯反击版",
        description: "以退为进，夺回主动权，让对方感受到失去你的焦虑",
        script: "好的，那你先忙。我最近也挺忙的，有空再聊吧。",
        psychology_tip: "运用'稀缺性原理'，停止过度供给，让对方意识到你的价值"
      },
      graceful: {
        name: "体面退场版",
        description: "优雅止损，保留尊严，不给对方继续消耗你的机会",
        script: "我觉得我们之间的节奏不太一致，也许做朋友会更舒服。祝你一切顺利。",
        psychology_tip: "运用'认知闭合'技巧，主动结束暧昧，避免沉没成本继续增加"
      },
      honest: {
        name: "开诚布公版",
        description: "真诚沟通，直面问题，适合还想给彼此一次机会的情况",
        script: "我感觉到我们之间的互动有些不对等，这让我有些困惑。你觉得我们现在的关系是怎样的？",
        psychology_tip: "运用'非暴力沟通'，表达感受而非指责，给对方解释的机会"
      }
    },
    judges_whisper: "亲爱的，我知道你现在心里很难受，那种忽冷忽热的感觉就像被人攥住了心脏。但请你记住，一个人对你的态度，从来都不是你的价值体现。他的回避、他的敷衍，反映的是他自己内心的空洞，而不是你不够好。你值得一个愿意为你花时间、愿意走进你内心的人。在那个人出现之前，请先好好爱自己。"
  };
}
