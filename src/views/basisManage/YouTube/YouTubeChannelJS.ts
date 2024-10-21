/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-20 20:34:59
 * @LastEditTime: 2024-09-02 16:00:11
 */
// EmailJS.js

import {
  requestYouTubeChannelList,
  requestYouTubeChannelDel,
  requestYouTubeChannelUpdate,
  requestYouTubeChannelInsert,
  requestYouTubeChannelSubtitle,
  requestYouTubeChannelArticle,
  requestYouTubeBroadcasterArticleList,
  requestYouTubeBroadcasterArticlelDel,
} from "@/api/youTubeChannelAPI/index.ts";

import { ElMessage, ElLoading } from "element-plus";

import { ref } from "vue";

export async function listGo() {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestYouTubeChannelList();
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

export async function updateGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestYouTubeChannelUpdate(data);
    loading.close();
    if (response.code == 200) {
      console.log("更新结果：", response.data);
      ElMessage({
        showClose: true,
        message: "更新成功",
        type: "success",
      });

      return response.data;
    } else {
      console.log("更新失败:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
      return [];
    }
  } catch (error) {
    loading.close();
    console.log("更新失败:", error);
    ElMessage({
      showClose: true,
      message: "更新失败",
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
    const response = await requestYouTubeChannelInsert(data);
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
    const response = await requestYouTubeChannelDel(data);
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

export async function subtitleGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestYouTubeChannelSubtitle(data);
    loading.close();
    // console.log("response.code", response.code)
    if (response.code == 200) {
      console.log("结果", response.data);
      ElMessage({
        showClose: true,
        message: "成功",
        type: "success",
      });

      return response.data;
    } else {
      console.log("失败:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
      return response.msg;
    }
  } catch (error) {
    loading.close();
    console.log("失败:", error);
    ElMessage({
      showClose: true,
      message: "失败",
      type: "error",
    });
  }
}

export async function channelArticelGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestYouTubeChannelArticle(data);
    loading.close();
    // console.log("response.code", response.code)
    if (response.code == 200) {
      console.log("转文章结果", response.data);
      ElMessage({
        showClose: true,
        message: "转文章任务发动成功",
        type: "success",
      });

      return response.data;
    } else {
      console.log("转文章任务发动失败:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
      return response.msg;
    }
  } catch (error) {
    loading.close();
    console.log("转文章任务发动失败:", error);
    ElMessage({
      showClose: true,
      message: "转文章任务发动失败",
      type: "error",
    });
  }
}

export async function articleListGo() {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestYouTubeBroadcasterArticleList();
    loading.close();
    if (response.code == 200) {
      console.log("table列表结果：", response.data);
      ElMessage({
        showClose: true,
        message: "table加载列表成功",
        type: "success",
      });

      return response.data;
    } else {
      console.log("table加载列表失败:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
      return [];
    }
  } catch (error) {
    loading.close();
    console.log("table加载列表失败:", error);
    ElMessage({
      showClose: true,
      message: "table加载列表失败",
      type: "error",
    });

    return [];
  }
}

export async function articleDelGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestYouTubeBroadcasterArticlelDel(data);
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
