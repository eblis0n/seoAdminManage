/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-20 20:34:59
 * @LastEditTime: 2024-07-23 22:56:26
 */
// EmailJS.js

import {
  requestGoogleAuthList,
  requestGoogleAuthInsert,
  requestGoogleAuthDel,
  requestGoogleAuthUpdate,
  requestGoogleAuthGetToken,
  requestGoogleAuthGetBatchToken,
  requestGoogleAuthRefreshToken,
  requestGoogleAuthRefreshBatchToken,
  requestGoogleAuthBloggerPost,
  requestGoogleAuthBloggerBatchPost,
} from "@/api/googleOauthAPI/index.ts";
import { aiArticleListGo } from "@/views/AIarticle/aiArticleJS";
import { getAiArticleListStore } from "@/store";

import { requestUploadFile } from "@/api/uploadFileAPI/index";
import { ElMessage, ElLoading } from "element-plus";
import { ref } from "vue";

const getAiArticleStore = getAiArticleListStore();
export async function oauthListGo() {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestGoogleAuthList();
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

export async function updateOautGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestGoogleAuthUpdate(data);
    loading.close();
    // console.log("response.code", response.code)
    if (response.code == 200) {
      console.log("更新结果", response.data);
      ElMessage({
        showClose: true,
        message: "更新成功",
        type: "success",
      });

      return response.data;
    } else {
      console.log("更新结果:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
      return response.msg;
    }
  } catch (error) {
    loading.close();
    console.log("更新失败:", error);
    ElMessage({
      showClose: true,
      message: "更新失败",
      type: "error",
    });
  }
}

export async function delOautGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestGoogleAuthDel(data);
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

export async function addOautGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestGoogleAuthInsert(data);
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

export async function oauthGetTokenGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  // console.log('get token', data);
  try {
    const response = await requestGoogleAuthGetToken(data);
    loading.close();
    if (response.code == 200) {
      console.log("get token 结果", response.data);
      ElMessage({
        showClose: true,
        message: "get token 成功",
        type: "success",
      });

      return response.data;
    } else {
      console.log("get token 失败:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
      return response.msg;
    }
  } catch (error) {
    loading.close();
    console.log("get token 失败:", error);
    ElMessage({
      showClose: true,
      message: "get token 失败",
      type: "error",
    });
  }
}

export async function oauthGetBatchTokenGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  // console.log('get token', data);
  try {
    const response = await requestGoogleAuthGetBatchToken(data);
    loading.close();
    if (response.code == 200) {
      console.log("get token 结果", response.data);
      ElMessage({
        showClose: true,
        message: "get token 成功",
        type: "success",
      });

      return response.data;
    } else {
      console.log("get token 失败:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
      return response.msg;
    }
  } catch (error) {
    loading.close();
    console.log("get token 失败:", error);
    ElMessage({
      showClose: true,
      message: "get token 失败",
      type: "error",
    });
  }
}

export async function oauthRefreshBatchTokenGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  // console.log('get token', data);
  try {
    const response = await requestGoogleAuthRefreshBatchToken(data);
    loading.close();
    if (response.code == 200) {
      console.log("Refresh token 结果", response.data);
      ElMessage({
        showClose: true,
        message: "Refresh token 成功",
        type: "success",
      });

      return response.data;
    } else {
      console.log("Refresh token 失败:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
      return response.msg;
    }
  } catch (error) {
    loading.close();
    console.log("Refresh token 失败:", error);
    ElMessage({
      showClose: true,
      message: "Refresh token 失败",
      type: "error",
    });
  }
}

export async function oauthRefreshTokenGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestGoogleAuthRefreshToken(data);
    loading.close();
    if (response.code == 200) {
      console.log("Refresh token 结果", response.data);
      ElMessage({
        showClose: true,
        message: "Refresh token 成功",
        type: "success",
      });

      return response.data;
    } else {
      console.log("Refresh token 失败:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
      return response.msg;
    }
  } catch (error) {
    loading.close();
    console.log("Refresh token 失败::", error);
    ElMessage({
      showClose: true,
      message: "Refresh token 失败",
      type: "error",
    });
  }
}

export async function bloggerPostsGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestGoogleAuthBloggerPost(data);
    loading.close();
    if (response.code == 200) {
      console.log("发帖 结果", response.data);
      ElMessage({
        showClose: true,
        message: "发帖 成功",
        type: "success",
      });

      return response.data;
    } else {
      console.log("发帖 失败:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
      return response.msg;
    }
  } catch (error) {
    loading.close();
    console.log("发帖 失败::", error);
    ElMessage({
      showClose: true,
      message: "发帖 失败",
      type: "error",
    });
  }
}

export async function bloggerBatchPostsGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestGoogleAuthBloggerBatchPost(data);
    loading.close();
    if (response.code == 200) {
      console.log("批量发帖 结果", response.data);
      ElMessage({
        showClose: true,
        message: "批量发帖 成功",
        type: "success",
      });

      return response.data;
    } else {
      console.log("批量发帖 失败:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
      return response.msg;
    }
  } catch (error) {
    loading.close();
    console.log("批量发帖 失败::", error);
    ElMessage({
      showClose: true,
      message: "批量发帖 失败",
      type: "error",
    });
  }
}

// 批量上传
export async function uploadFile(formData) {
  const headers = {
    "Content-Type": "application/form-data",
  };
  try {
    const response = await requestUploadFile(headers, formData);
    if (response.code === 200) {
      console.log("上传结果:", response.code, response.data);

      ElMessage({
        showClose: true,
        message: response.msg,
        type: "success",
      });
    } else {
      console.log("上传结果:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
    }
  } catch (error) {
    console.log("上传失败::", error);
    ElMessage({
      showClose: true,
      message: "上传 失败",
      type: "error",
    });
  }
  // 返回 false 阻止自动上传
  return false;
}

export async function aiArticleLGo() {
  const AiArticleStateDatare = await getAiArticleStore.aiArticleListData;

  if (AiArticleStateDatare.length === 0) {
    const aiArticleList = await aiArticleListGo();
    console.log("获取aiTrainList 列表数据", aiArticleList);
    return aiArticleList;
  }
  // console.log('adsListStateDatare', adsListStateDatare);
  return AiArticleStateDatare;
}
