/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-20 20:34:59
 * @LastEditTime: 2024-11-16 21:55:11
 */

import AiPromptAPI from "@/api/aiPromptAPI";
import { ElMessage } from "element-plus";
import type {
  AiPromptInsert,
  AiPromptDel,
  AiPromptUpdate,
} from "@/types/aiPrompt";

// 实例化

export async function AiPromptList() {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 添加1秒延迟
  try {
    const response = await AiPromptAPI.requestAiPromptList();

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

export async function addGo(data: AiPromptInsert) {
  try {
    const response = await AiPromptAPI.requestAiPromptInsert(data);
    console.log("添加数据成功", response);

    ElMessage({
      showClose: true,
      message: "添加数据成功",
      type: "success",
    });
  } catch (error) {
    console.log("添加数据失败:", error);
    ElMessage({
      showClose: true,
      message: "添加数据失败",
      type: "error",
    });
  }
}

export async function delGo(data: AiPromptDel) {
  try {
    const response = await AiPromptAPI.requestAiPromptDel(data);
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

export async function updateGo(data: AiPromptUpdate) {
  try {
    const response = await AiPromptAPI.requestAiPromptUpdate(data);
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
