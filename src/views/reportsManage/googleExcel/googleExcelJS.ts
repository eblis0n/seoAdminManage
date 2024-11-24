/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-20 20:34:59
 * @LastEditTime: 2024-11-23 20:36:30
 */

import { ElMessage } from "element-plus";

import PublicAPI from "@/api/publicAPI";

// 实例化

export async function excelList() {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 添加1秒延迟

  try {
    const response = await PublicAPI.requestGoogleExcel();
    console.log("刷新list", response);

    return response;
  } catch (error) {
    console.error("加载列表失败:", error);
    ElMessage.error("加载列表失败");
    return [];
  }
}
