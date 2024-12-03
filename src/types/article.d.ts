/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-10-11 13:16:25
 * @LastEditTime: 2024-12-02 19:55:00
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
  sortID: string;
  source: string;
  title: string;
  content: string;
  spoken: string;
  type: string;
  user: string;
  commission: string;
}

export interface articlePostInSql {
  post_max: number;
  group: string;
  platform: string;
  isSecondary: string;
  isAI: string;
  sortID: string;
  spoken: string;
  type: string;
  user: string;
  commission: string;
}

export interface articleDel {
  id: number;
}
