/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2023-10-17 21:21:36
 * @LastEditTime: 2024-12-02 16:25:20
 */
//统一管理域名相关的接口
import request from "@/utils/axios/request";

//引入接口类型
import type {
  articleResult,
  AIarticleInsert,
  articleInsert,
  articleDel,
  articlePostInSql,
} from "@/types/article";

enum API {
  ARTICLE_LIST = "/article/list/",
  ARTICLE_INSERT = "/article/add/",
  ARTICLE_DELETE = "/article/delete/",
  POST_IN_SQL = "/article/prefabrication/",
}

class ArticleAPI {
  // 获取列表
  static requestArticleList = () =>
    request.get<any, articleResult[]>(API.ARTICLE_LIST);

  static requestArticleInsert = (data: articleInsert) =>
    request.post<any, articleResult[]>(API.ARTICLE_INSERT, data);

  static requestAIArticleInsert = (data: AIarticleInsert) =>
    request.post<any, articleResult[]>(API.ARTICLE_INSERT, data);

  static requestArticleDel = (data: articleDel) =>
    request.post<any, articleResult[]>(API.ARTICLE_DELETE, data);

  static requestArticlePostInSql = (data: articlePostInSql) =>
    request.post<any, articleResult[]>(API.POST_IN_SQL, data);
}

export default ArticleAPI;
