/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-20 20:34:59
 * @LastEditTime: 2024-07-29 15:31:27
 */

import {
  requestBloggerPostsList,
  requestBloggerPostsRecording,
  requestBloggerPostsSelect,
} from "@/api/bloggerAPI/index.ts";

import { ElMessage, ElLoading } from "element-plus";

import { ref } from "vue";

export async function bloggerPostsListGo() {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestBloggerPostsList();
    loading.close();
    if (response.code == 200) {
      console.log("加载列表结果：", response.data);
      ElMessage({
        showClose: true,
        message: "加载列表成功",
        type: "success",
      });

      return response.data;
    } else {
      console.log("加载列表失败:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
      return [];
    }
  } catch (error) {
    loading.close();
    console.log("加载列表失败:", error);
    ElMessage({
      showClose: true,
      message: "加载列表失败",
      type: "error",
    });

    return [];
  }
}

export async function bloggerPostsRecordingGo() {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestBloggerPostsRecording();
    loading.close();
    if (response.code == 200) {
      console.log("重新入库结果：", response.data);
      ElMessage({
        showClose: true,
        message: "重新入库成功",
        type: "success",
      });

      return response.data;
    } else {
      console.log("重新入库失败:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
      return [];
    }
  } catch (error) {
    loading.close();
    console.log("重新入库失败:", error);
    ElMessage({
      showClose: true,
      message: "重新入库失败",
      type: "error",
    });

    return [];
  }
}

export async function selectGo(data) {
  const response = await requestBloggerPostsSelect(data);
  if (response.code === 200) {
    console.log("查询结果", response.code, response.data);

    ElMessage({
      showClose: true,
      message: response.msg,
      type: "success",
    });
    return response.data;
  } else {
    console.log("查询结果:", response.code, response.msg);
    ElMessage({
      showClose: true,
      message: response.msg,
      type: "error",
    });
  }
  return [];
}
