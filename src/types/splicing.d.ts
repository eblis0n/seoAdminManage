/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-10-24 15:32:55
 * @LastEditTime: 2024-11-04 20:04:51
 */
export interface splicingInsert {
  zyurl: string;
  url: string;
  platform: string;
  genre: string;
  sort: string;
}

export interface splicingPublish {
  alt_text: string;
  stacking_min: number;
  stacking_max: number;
  platform: string;
  genre: string;
  sort: string;
  postingStyle: string;
  group: string;
}
export interface splicingResult {
  url: string;
  platform: string;
  genre: string;
  sort: string;
}

export interface splicingTotal {
  total: number;
}
