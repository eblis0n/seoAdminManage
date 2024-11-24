/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-10-11 13:16:25
 * @LastEditTime: 2024-11-22 16:01:11
 */
// PC

// 首先定义 prompt 对象的接口
interface PromptItem {
  type: string;
  promptdata: string;
}

export interface AiPromptResult {
  id: number;
  sort: string;
  salesman: string;
  pronoun: string;
  name: string;
  prompt: string;
}
export interface AiPromptInsert {
  sort: string;
  salesman: string;
  name: string;
  pronoun: string;
  prompt: string;
}

export interface AiPromptDel {
  id: number;
}

export interface AiPromptUpdate {
  id: number;
  sort: string;
  salesman: string;
  name: string;
  pronoun: string;
  prompt: string;
}
