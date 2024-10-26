/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-10-11 13:16:25
 * @LastEditTime: 2024-10-25 22:52:14
 */
// PC

export interface pcResult {
  id: number;
  group: string;
  name: string;
  address: string;
  account: string;
  password: string;
  platform: string;
  state: number;
  remark: string;
}
export interface pcInsert {
  group: string;
  name: string;
  address: string;
  account: string;
  password: string;
  platform: string;
  remark: string;
}

export interface pcDel {
  id: number;
}

export interface pcUpdate {
  id: number;
  group: string;
  name: string;
  address: string;
  account: string;
  password: string;
  platform: string;
  state: number;
  remark: string;
}
