/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-20 20:34:59
 * @LastEditTime: 2024-11-21 22:24:42
 */

import ArticleAPI from "@/api/articleAPI";
import { ElMessage } from "element-plus";
import type {
  AIarticleInsert,
  articleInsert,
  articleDel,
} from "@/types/article";

// 实例化

export async function articleList() {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 添加1秒延迟
  try {
    const response = await ArticleAPI.requestArticleList();

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

export async function addGo(data: articleInsert) {
  try {
    const response = await ArticleAPI.requestArticleInsert(data);
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

export async function aiAddGo(data: AIarticleInsert) {
  try {
    const response = await ArticleAPI.requestAIArticleInsert(data);
    console.log("添加生成文章任务成功", response);

    ElMessage({
      showClose: true,
      message: "添加生成文章任务成功",
      type: "success",
    });
  } catch (error) {
    console.log("添加生成文章任务失败:", error);
    ElMessage({
      showClose: true,
      message: "添加生成文章任务失败",
      type: "error",
    });
  }
}

export async function delGo(data: articleDel) {
  try {
    const response = await ArticleAPI.requestArticleDel(data);
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
