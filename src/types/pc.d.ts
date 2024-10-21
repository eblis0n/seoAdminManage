/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-10-11 13:16:25
 * @LastEditTime: 2024-10-13 16:22:37
 */
// PC

export interface pcResult {
  id: number;
  name: string;
  address: string;
  state: number;
}
export interface pcInsert {
  name: string;
  address: string;
}

export interface pcDel {
  id: number;
}

export interface pcUpdate {
  id: number;
  name: string;
  address: string;
  state: number;
}
