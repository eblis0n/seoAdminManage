/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-10-11 13:16:25
 * @LastEditTime: 2024-11-25 00:17:57
 */
// PC

export interface articleResult {
  id: number;
  isAI: string;
  promptID: string;
  sortID: string;
  source: string;
  title: string;
  content: string;
  type: string;
  user: string;
  commission: string;
  theme: string;
  Keywords: string;
  ATag: string;
  link: string;
  language: string;
  spoken: string;
}
export interface AIarticleInsert {
  isAI: string;
  promptID: string;
  sortID: string;
  source: string;
  type: string;
  user: string;
  commission: string;
  theme: string;
  Keywords: string;
  ATag: string;
  link: string;
  language: string;
}

export interface articleInsert {
  isAI: string;
  promptID: string;
  sortID: string;
  source: string;
  title: string;
  content: string;
  spoken: string;
  type: string;
  user: string;
  commission: string;
}

export interface articleDel {
  id: number;
}
