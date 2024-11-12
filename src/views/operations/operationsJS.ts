/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-20 20:34:59
 * @LastEditTime: 2024-11-12 22:09:31
 */

import { ElMessage } from "element-plus";
import type {
  hostDisable,
  hostsUpdate,
  postTaskInsert,
  taskImplementLogs,
} from "@/types/operations";

import operationsAPI from "@/api/operationsAPI";

// 实例化

export async function hostsList() {
  console.log("刷新list");
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

export async function disableGo(data: hostDisable) {
  try {
    const response = await operationsAPI.requestHostDisable(data);
    console.log("成功", response);

    ElMessage({
      showClose: true,
      message: "成功",
      type: "success",
    });
  } catch (error) {
    console.log("失败:", error);
    ElMessage({
      showClose: true,
      message: "失败",
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

export async function tasksInsertGo(data: postTaskInsert) {
  try {
    const response = await operationsAPI.requestTasksInsert(data);
    console.log("添加成功", response);

    ElMessage({
      showClose: true,
      message: "添加成功",
      type: "success",
    });
  } catch (error) {
    console.log("添加失败:", error);
    ElMessage({
      showClose: true,
      message: "添加失败",
      type: "error",
    });
  }
}

export async function tasksList() {
  console.log("刷新list");
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 添加1秒延迟

  try {
    const response = await operationsAPI.requestTasksList();
    console.log("刷新list", response);
    return response;
  } catch (error) {
    console.error("加载列表失败:", error);
    ElMessage.error("加载列表失败");
    return [];
  }
}

export async function tasksImplementLogs(data: taskImplementLogs) {
  console.log("刷新logs信息");
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 添加1秒延迟

  try {
    const response = await operationsAPI.requestTasksImplementLogs(data);
    console.log("刷新logs信息", response);
    return response;
  } catch (error) {
    console.error("加载列表失败:", error);
    ElMessage.error("加载列表失败");
    return [];
  }
}
