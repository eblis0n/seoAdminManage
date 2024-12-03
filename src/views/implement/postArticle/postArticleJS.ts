/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-20 20:34:59
 * @LastEditTime: 2024-12-02 20:07:16
 */

import { ElMessage } from "element-plus";
import type { articlePostInSql } from "@/types/article";

import ArticleAPI from "@/api/articleAPI";

// 实例化

export async function postInSqlGo(data: articlePostInSql) {
  console.log("接收到的数据", data);
  try {
    const response = await ArticleAPI.requestArticlePostInSql(data);
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
