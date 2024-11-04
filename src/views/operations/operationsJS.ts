/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-20 20:34:59
 * @LastEditTime: 2024-11-04 00:07:24
 */

import { ElMessage } from "element-plus";
import type { hostsDel, hostsUpdate } from "@/types/operations";

import operationsAPI from "@/api/operationsAPI";

// 实例化

export async function hostsList() {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 添加1秒延迟

  try {
    const response = await operationsAPI.requestHostList();
    console.log("刷新list", response);
    return response;
  } catch (error) {
    console.error("加载列表失败:", error);
    ElMessage.error("加载列表失败");
    return [];
  }
}

export async function delGo(data: hostsDel) {
  try {
    const response = await operationsAPI.requestHostDel(data);
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

export async function updateGo(data: hostsUpdate) {
  try {
    const response = await operationsAPI.requestHostUpdate(data);
    console.log("更新成功", response);

    ElMessage({
      showClose: true,
      message: "更新成功",
      type: "success",
    });
  } catch (error) {
    console.log("更新失败:", error);
    ElMessage({
      showClose: true,
      message: "更新失败",
      type: "error",
    });
  }
}
