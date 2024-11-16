/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-10-24 15:32:55
 * @LastEditTime: 2024-11-14 15:49:24
 */
export interface outcomeDel {
  platform: string;
  urldatas: string;
}

export interface outcomeParams {
  platform: string;
}

export interface outcomeExportParams {
  title: string;
  exportD: any[];
}

export interface outcomeTotal {
  total: number;
}

export interface outcomeResult {
  url: string;
  platform: string;
  genre: string;
  sort: string;
}
