/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-20 20:34:59
 * @LastEditTime: 2024-08-27 16:02:08
 */
// EmailJS.js

import {
  requestNoteUserInfoList,
  requestNoteUserInfoInsert,
  requestNoteUserInfoUpdate,
  requestNoteUserInfoDel,
  requestNoteUserPost,
  requestNoteUserBatchPost,
  requestNoteUserBatchUpdateCookie,
  requestNoteUserUpdateCookie,
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
    const response = await requestNoteUserInfoList();
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
    const response = await requestNoteUserInfoInsert(data);
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

export async function updateGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestNoteUserInfoUpdate(data);
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
    const response = await requestNoteUserInfoDel(data);
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

export async function postGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestNoteUserPost(data);
    loading.close();
    // console.log("response.code", response.code)
    if (response.code == 200) {
      console.log("发帖结果", response.data);
      ElMessage({
        showClose: true,
        message: "发帖成功",
        type: "success",
      });

      return response.data;
    } else {
      console.log("发帖结果:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
      return response.msg;
    }
  } catch (error) {
    loading.close();
    console.log("发帖失败:", error);
    ElMessage({
      showClose: true,
      message: "发帖失败",
      type: "error",
    });
  }
}

export async function batchPostGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestNoteUserBatchPost(data);
    loading.close();
    // console.log("response.code", response.code)
    if (response.code == 200) {
      console.log("批量发帖结果", response.data);
      ElMessage({
        showClose: true,
        message: "批量发帖成功",
        type: "success",
      });

      return response.data;
    } else {
      console.log("批量发帖结果:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
      return response.msg;
    }
  } catch (error) {
    loading.close();
    console.log("批量发帖失败:", error);
    ElMessage({
      showClose: true,
      message: "批量发帖失败",
      type: "error",
    });
  }
}

export async function batchUpdateCookieGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestNoteUserBatchUpdateCookie(data);
    loading.close();
    // console.log("response.code", response.code)
    if (response.code == 200) {
      console.log("批量发帖结果", response.data);
      ElMessage({
        showClose: true,
        message: "批量发帖成功",
        type: "success",
      });

      return response.data;
    } else {
      console.log("批量发帖结果:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
      return response.msg;
    }
  } catch (error) {
    loading.close();
    console.log("批量发帖失败:", error);
    ElMessage({
      showClose: true,
      message: "批量发帖失败",
      type: "error",
    });
  }
}

export async function updateCookieGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestNoteUserUpdateCookie(data);
    loading.close();
    // console.log("response.code", response.code)
    if (response.code == 200) {
      console.log("批量发帖结果", response.data);
      ElMessage({
        showClose: true,
        message: "批量发帖成功",
        type: "success",
      });

      return response.data;
    } else {
      console.log("批量发帖结果:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
      return response.msg;
    }
  } catch (error) {
    loading.close();
    console.log("批量发帖失败:", error);
    ElMessage({
      showClose: true,
      message: "批量发帖失败",
      type: "error",
    });
  }
}
