/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-20 20:34:59
 * @LastEditTime: 2024-11-12 23:06:04
 */

import { ElMessage } from "element-plus";
import type {
  splicingInsert,
  splicingPublish,
  splicingTotal,
} from "@/types/splicing.d.ts";

import splicingAPI from "@/api/SplicingAPI";

// 实例化

export async function splicingList() {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 添加1秒延迟

  try {
    const response = await splicingAPI.requestSplicingList();
    console.log("刷新list", response);
    const sortedData = response.sort((a: any, b: any) => {
      return new Date(b.create_at).getTime() - new Date(a.create_at).getTime();
    });
    return sortedData;
  } catch (error) {
    console.error("加载列表失败:", error);
    ElMessage.error("加载列表失败");
    return [];
  }
}

export async function addGo(data: splicingInsert) {
  try {
    const response = await splicingAPI.requestSplicingAdd(data);
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

export async function clearGo() {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 添加1秒延迟

  try {
    const response = await splicingAPI.requestSplicingDelete();
    console.log("清空列表数据结果", response);
    return response;
  } catch (error) {
    console.error("清空列表失败:", error);
    ElMessage.error("清空列表失败");
    return [];
  }
}

export async function totalGo() {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 添加1秒延迟

  try {
    const response = await splicingAPI.requestSplicingTotal();
    console.log("总数", response);
    return response;
  } catch (error) {
    console.error("获取总数失败:", error);
    ElMessage.error("获取总数失败");
    return 0;
  }
}

export async function publishGo(data: splicingPublish) {
  try {
    const response = await splicingAPI.requestSplicingPush(data);
    console.log("任务发布结果", response);

    ElMessage({
      showClose: true,
      message: "任务发布成功",
      type: "success",
    });
  } catch (error) {
    ElMessage({
      showClose: true,
      message: "任务发布失败",
      type: "error",
    });
  }
}
