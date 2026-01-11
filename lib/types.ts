// 核心类型定义

export interface Strength {
  id: string;
  name: string;
  domain: 'executing' | 'influencing' | 'relationship' | 'strategic';
}

export interface Scenario {
  id: string;
  title: string;
}

export interface ResultData {
  // 高光词条（方案名称）- 给方案起一个酷的名字
  highlight: string;
  
  // 系统判断（结论先行）
  judgment: string;
  
  // 优势配比逻辑
  strengthConflicts?: string[]; // 哪些优势在"打架"
  strengthBasement?: string; // 哪个优势掉进"地下室"
  
  // 盲区提醒（1条）- 优势误区
  blindspot: string;
  
  // 行动建议（最多3条，包含反直觉建议）- 替代性行动
  actions: string[];
  
  // 优势锦囊（旋钮调节式建议）
  advantageTips?: {
    reduce?: Array<{ strength: string; percentage: number; reason: string }>; // 需要调低的优势
    increase?: Array<{ strength: string; percentage: number; reason: string }>; // 需要调高的优势
    instruction: string; // 整体的调节指令
  };
}

export interface FormData {
  scenario?: string;
  strengths: string[];
  confusion: string;
}
