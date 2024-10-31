/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-10-11 13:16:25
 * @LastEditTime: 2024-10-31 15:49:55
 */
// PC

export interface bloggerResult {
  id: number;
  group: string;
  adsNumber: number;
  adsID: string;
  proxy: string;
  bloggerID: number;
}
export interface bloggerInsert {
  group: string;
  adsNumber: number;
  adsID: string;
  proxy: string;
  bloggerID: number;
}

export interface bloggerDel {
  id: number;
}

export interface bloggerUpdate {
  id: number;
  group: string;
  adsNumber: number;
  adsID: string;
  proxy: string;
  bloggerID: number;
}
