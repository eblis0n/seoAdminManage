/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-20 20:34:59
 * @LastEditTime: 2024-10-21 22:06:43
 */

import { ElMessage } from "element-plus";
import type { uploadFileParamsType } from "@/types/other.d.ts";
import uploadAPI from "@/api/uploadAPI/index";
import telegraAPI from "@/api/telegraAPI";

// 实例化

export async function splicingList() {
  try {
    const response = await telegraAPI.requestSplicingList();
    console.log("刷新list", response);
    return response;
  } catch (error) {
    console.error("加载列表失败:", error);
    ElMessage.error("加载列表失败");
    return [];
  }
}

export async function uploadFile(params: uploadFileParamsType) {
  try {
    // 直接调用 uploadAPI.requestUploadFile，传递 params
    const response = await uploadAPI.requestUploadFile(params);

    console.log("上传结果:", response);

    ElMessage({
      showClose: true,
      message: "上传成功",
      type: "success",
    });
  } catch (error) {
    console.error("上传失败:", error);

    ElMessage({
      showClose: true,
      message: "上传失败",
      type: "error",
    });
  }

  // 返回 false 阻止自动上传
  return false;
}
