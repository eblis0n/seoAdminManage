/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-10-11 13:16:25
 * @LastEditTime: 2024-11-22 23:55:12
 */
// PC

export interface categoryResult {
  id: number;
  name: string;
  level: number;
}
export interface categoryInsert {
  name: string;
  level: number;
}

export interface categoryUpdate {
  id: number;
  name: string;
  level: number;
}

export interface categoryDel {
  id: number;
}
