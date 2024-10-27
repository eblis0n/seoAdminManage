/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-20 20:34:59
 * @LastEditTime: 2024-10-27 21:39:13
 */

import pcAPI from "@/api/pcSettingAPI";
import { ElMessage } from "element-plus";
import type { pcDel, pcUpdate, pcInsert } from "@/types/pc.d.ts";

// 实例化

export async function pclist() {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 添加1秒延迟
  try {
    const response = await pcAPI.requestPcList();

    console.log("刷新PC", response);

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

export async function addGo(data: pcInsert) {
  try {
    const response = await pcAPI.requestPcInsert(data);
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

export async function delGo(data: pcDel) {
  try {
    const response = await pcAPI.requestPcDel(data);
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

export async function updateGo(data: pcUpdate) {
  try {
    const response = await pcAPI.requestPcUpdate(data);
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
