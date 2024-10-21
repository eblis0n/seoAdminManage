/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-20 20:34:59
 * @LastEditTime: 2024-09-12 22:50:26
 */

import {
  requestWpDirectoryList,
  requestWpDirectoryInsert,
  requestWpDirectoryInsertAuthor,
  requestWpDirectoryDel,
  requestWpDirectoryUpdate,
  requestWpBatchInsideArticlePost,
  requestWpInsideArticlePost,
  requestWpStocksArticlePost,
  requestWpBuildWebsite,
  requestWpPushYouTube,
} from "@/api/wordPressAPI/index.ts";

import { ElMessage, ElLoading } from "element-plus";

import { ref } from "vue";

export async function wpDirectoryListGo() {
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

export async function addWpDirectoryGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestWpDirectoryInsert(data);
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
export async function updateOautGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestWpDirectoryUpdate(data);
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

export async function insertAuthorGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestWpDirectoryInsertAuthor(data);
    loading.close();
    // console.log("response.code", response.code)
    if (response.code == 200) {
      console.log("添加新作者结果", response.data);
      ElMessage({
        showClose: true,
        message: "添加新作者成功",
        type: "success",
      });

      return response.data;
    } else {
      console.log("添加新作者结果:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
      return response.msg;
    }
  } catch (error) {
    loading.close();
    console.log("添加新作者失败:", error);
    ElMessage({
      showClose: true,
      message: "添加新作者失败",
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
    const response = await requestWpDirectoryDel(data);
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

export async function batchPostInsideArticleGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestWpBatchInsideArticlePost(data);
    loading.close();
    // console.log("response.code", response.code)
    if (response.code == 200) {
      console.log("批量发文章结果", response.data);
      ElMessage({
        showClose: true,
        message: "批量发文章成功",
        type: "success",
      });

      return response.data;
    } else {
      console.log("批量发文章失败:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
      return response.msg;
    }
  } catch (error) {
    loading.close();
    console.log("批量发文章失败:", error);
    ElMessage({
      showClose: true,
      message: "批量发文章失败",
      type: "error",
    });
  }
}

export async function postInsideArticleGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestWpInsideArticlePost(data);
    loading.close();
    // console.log("response.code", response.code)
    if (response.code == 200) {
      console.log("发文章结果", response.data);
      ElMessage({
        showClose: true,
        message: "发文章成功",
        type: "success",
      });

      return response.data;
    } else {
      console.log("发文章失败:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
      return response.msg;
    }
  } catch (error) {
    loading.close();
    console.log("发文章失败:", error);
    ElMessage({
      showClose: true,
      message: "发文章失败",
      type: "error",
    });
  }
}

export async function postStocksArticleGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestWpStocksArticlePost(data);
    loading.close();
    // console.log("response.code", response.code)
    if (response.code == 200) {
      console.log("发股票文章结果", response.data);
      ElMessage({
        showClose: true,
        message: "发股票文章成功",
        type: "success",
      });

      return response.data;
    } else {
      console.log("发股票文章失败:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
      return response.msg;
    }
  } catch (error) {
    loading.close();
    console.log("发股票文章失败:", error);
    ElMessage({
      showClose: true,
      message: "发股票文章失败",
      type: "error",
    });
  }
}

export async function pushYouTubeGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestWpPushYouTube(data);
    loading.close();
    // console.log("response.code", response.code)
    if (response.code == 200) {
      console.log("发youtube文章结果", response.data);
      ElMessage({
        showClose: true,
        message: "发youtube文章成功",
        type: "success",
      });

      return response.data;
    } else {
      console.log("发youtube文章失败:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
      return response.msg;
    }
  } catch (error) {
    loading.close();
    console.log("发youtube文章失败:", error);
    ElMessage({
      showClose: true,
      message: "发youtube文章失败",
      type: "error",
    });
  }
}

export async function buildWebsiteGo(data) {
  const loading = ElLoading.service({
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.8)",
  });
  try {
    const response = await requestWpBuildWebsite(data);
    loading.close();
    // console.log("response.code", response.code)
    if (response.code == 200) {
      console.log("建站结果", response.data);
      ElMessage({
        showClose: true,
        message: "建站结果",
        type: "success",
      });

      return response.data;
    } else {
      console.log("建站失败:", response.code, response.msg);
      ElMessage({
        showClose: true,
        message: response.msg,
        type: "error",
      });
      return response.msg;
    }
  } catch (error) {
    loading.close();
    console.log("建站失败:", error);
    ElMessage({
      showClose: true,
      message: "建站失败",
      type: "error",
    });
  }
}
