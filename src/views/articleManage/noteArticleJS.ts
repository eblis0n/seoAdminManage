/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-20 20:34:59
 * @LastEditTime: 2024-08-22 17:09:09
 */
// EmailJS.js

import {
  requestNoteUserArticleList,
  requestNoteUserArticleInsert,
  requestNoteUserArticleDel,
} from "@/api/noteArticleAPI/index.ts";

import { ElMessage, ElLoading } from "element-plus";

import { ref } from "vue";

export async function listGo() {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestNoteUserArticleList();
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

export async function addGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestNoteUserArticleInsert(data);
    loading.close();
    // console.log("response.code", response.code)
    if (response.code == 200) {
      console.log("添加结果", response.data);
      ElMessage({
        showClose: true,
        message: "添加成功",
        type: "success",
      });

      return response.data;
    } else {
      console.log("添加失败:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
      return response.msg;
    }
  } catch (error) {
    loading.close();
    console.log("添加失败:", error);
    ElMessage({
      showClose: true,
      message: "添加失败",
      type: "error",
    });
  }
}

export async function delGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestNoteUserArticleDel(data);
    loading.close();
    // console.log("response.code", response.code)
    if (response.code == 200) {
      console.log("删除结果", response.data);
      ElMessage({
        showClose: true,
        message: "删除成功",
        type: "success",
      });

      return response.data;
    } else {
      console.log("删除结果:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
      return response.msg;
    }
  } catch (error) {
    loading.close();
    console.log("删除失败:", error);
    ElMessage({
      showClose: true,
      message: "删除失败",
      type: "error",
    });
  }
}
