/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-20 20:34:59
 * @LastEditTime: 2024-11-01 20:58:59
 */

import { ElMessage } from "element-plus";
import amazonsqsAPI from "@/api/amazonsqsAPI";
import type { amazonsqsDel } from "@/types/other";
// 实例化

export async function amazonSQSList() {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 添加1秒延迟
  try {
    const response = await amazonsqsAPI.requestamazonSQSList();

    console.log("刷新", response);

    ElMessage({
      showClose: true,
      message: "加载列表成功",
      type: "success",
    });

    return response;
  } catch (error) {
    console.log("加载列表失败:", error);
    ElMessage({
      showClose: true,
      message: "加载列表失败",
      type: "error",
    });
    return [];
  }
}
export async function delGo(data: amazonsqsDel) {
  try {
    const response = await amazonsqsAPI.requestamazonSQSDel(data);
    console.log("删除成功", response);

    ElMessage({
      showClose: true,
      message: "删除成功",
      type: "success",
    });
  } catch (error) {
    console.log("删除失败:", error);
    ElMessage({
      showClose: true,
      message: "删除失败",
      type: "error",
    });
  }
}
