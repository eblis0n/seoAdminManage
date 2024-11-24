/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-20 20:34:59
 * @LastEditTime: 2024-11-22 20:01:02
 */

import categoryAPI from "@/api/categoryAPI";
import { ElMessage } from "element-plus";
import type {
  categoryInsert,
  categoryDel,
  categoryUpdate,
} from "@/types/category";

export async function addGo(data: categoryInsert) {
  try {
    const response = await categoryAPI.requestCategoryInsert(data);
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

export async function delGo(data: categoryDel) {
  try {
    const response = await categoryAPI.requestCategoryDel(data);
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

export async function updateGo(data: categoryUpdate) {
  try {
    const response = await categoryAPI.requestCategoryUpdate(data);
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
