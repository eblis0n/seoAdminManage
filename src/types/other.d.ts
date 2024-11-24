/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2023-10-17 21:22:47
 * @LastEditTime: 2024-11-01 20:56:10
 */

export interface uploadFileParamsType {
  formData: File[]; // 多个文件的数组
  who: string; // 上传者的信息
}

export interface platformsParams {
  value: string;
  label: string;
}

export interface amazonsqsResult {
  id: number;
  url: string;
}

export interface amazonsqsDel {
  url: string;
}

export interface googleExcelParams {
  url: string;
}
