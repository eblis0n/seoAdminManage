/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-20 20:34:59
 * @LastEditTime: 2024-11-14 23:48:57
 */

import noteAPI from "@/api/noteAPI";
import { ElMessage } from "element-plus";
import type {
  noteInfoInsert,
  noteInfoDel,
  noteInfoRenewCookie,
  noteInfoUpdate,
  noteInfoBranchCookie,
} from "@/types/Note.d.ts";

// 实例化

export async function noteInfoList() {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 添加1秒延迟
  try {
    const response = await noteAPI.requestNoteInfoList();

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

export async function addGo(data: noteInfoInsert) {
  try {
    const response = await noteAPI.requestNoteInfoInsert(data);
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

export async function delGo(data: noteInfoDel) {
  try {
    const response = await noteAPI.requestNoteInfoDel(data);
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

export async function updateGo(data: noteInfoUpdate) {
  try {
    const response = await noteAPI.requestNoteInfoUpdate(data);
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

export async function renewCookieGo(data: noteInfoRenewCookie) {
  try {
    const response = await noteAPI.requestNoteInfoRenewCookie(data);
    console.log("更新Cookie成功", response);

    ElMessage({
      showClose: true,
      message: "更新Cookie成功",
      type: "success",
    });
  } catch (error) {
    console.log("更新Cookie失败:", error);
    ElMessage({
      showClose: true,
      message: "更新Cookie失败",
      type: "error",
    });
  }
}

export async function branchCookieGo(data: noteInfoBranchCookie) {
  try {
    const response = await noteAPI.requestNoteInfoBatchCookie(data);
    console.log("更新Cookie成功", response);

    ElMessage({
      showClose: true,
      message: "更新Cookie成功",
      type: "success",
    });
  } catch (error) {
    console.log("更新Cookie失败:", error);
    ElMessage({
      showClose: true,
      message: "更新Cookie失败",
      type: "error",
    });
  }
}
