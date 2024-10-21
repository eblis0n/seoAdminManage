/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-20 20:34:59
 * @LastEditTime: 2024-10-12 13:28:44
 */
// EmailJS.js

import {
  requestAiArticleList,
  requestAiArticleDel,
  requestAiArticleRewrite,
  requestAiArticleInsert,
  requestAiArticleRecording,
} from "@/api/aiArticleAPI/index.ts";

import {
  requestWpInstideList,
  requestWpDirectoryList,
} from "@/api/wordPressAPI/index.ts";

import { aiTrainListGo } from "@/views/AItrain/aiTrainJS";
import { ElMessage, ElLoading } from "element-plus";
import { getAiTrainListStore, getAiArticleListStore } from "@/store";

import { ref } from "vue";

const aiTrainStore = getAiTrainListStore();
const getAiArticleStore = getAiArticleListStore();

export async function aiArticleListGo() {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestAiArticleList();
    loading.close();
    if (response.code == 200) {
      getAiArticleStore.setaiArticleListData(response.data);
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

export async function aiArticleRecordingGo() {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestAiArticleRecording();
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

export async function addGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestAiArticleInsert(data);
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

export async function rewriteGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestAiArticleRewrite(data);
    loading.close();
    // console.log("response.code", response.code)
    if (response.code == 200) {
      console.log("重写结果", response.data);
      ElMessage({
        showClose: true,
        message: "重写成功",
        type: "success",
      });

      return response.data;
    } else {
      console.log("重写失败:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
      return response.msg;
    }
  } catch (error) {
    loading.close();
    console.log("重写失败:", error);
    ElMessage({
      showClose: true,
      message: "重写失败",
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
    const response = await requestAiArticleDel(data);
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

export async function aiTrainLGo() {
  const aiTrainStateDatare = await aiTrainStore.aiTrainListData;

  if (aiTrainStateDatare.length === 0) {
    const aiTrainList = await aiTrainListGo();
    console.log("获取aiTrainList 列表数据", aiTrainList);
    return aiTrainList;
  }
  // console.log('adsListStateDatare', adsListStateDatare);
  return aiTrainStateDatare;
}

export async function wpInstideListGo() {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestWpInstideList();
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

export async function wpHomeListGo() {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestWpDirectoryList();
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
