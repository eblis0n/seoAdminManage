/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2023-10-17 21:21:36
 * @LastEditTime: 2024-10-31 15:31:24
 */
//统一管理域名相关的接口
import request from "@/utils/axios/request";

//引入接口类型
import type {
  bloggerResult,
  bloggerInsert,
  bloggerDel,
  bloggerUpdate,
} from "@/types/blogger.d.ts";

enum API {
  BLOGGER_INFO_LIST = "/blog/list/",
  BLOGGER_INFO_INSERT = "/blog/add/",
  BLOGGER_INFO_UPDATE = "/blog/update/",
  BLOGGER_INFO_DELETE = "/blog/delete/",
}

class bloggerAPI {
  // 获取列表
  static requestBloggerList = () =>
    request.get<any, bloggerResult[]>(API.BLOGGER_INFO_LIST);

  static requestBloggerInsert = (data: bloggerInsert) =>
    request.post<any, bloggerResult[]>(API.BLOGGER_INFO_INSERT, data);

  static requestBloggerUpdate = (data: bloggerUpdate) =>
    request.post<any, bloggerResult[]>(API.BLOGGER_INFO_UPDATE, data);

  static requestBloggerDel = (data: bloggerDel) =>
    request.post<any, bloggerResult[]>(API.BLOGGER_INFO_DELETE, data);
}

export default bloggerAPI;
