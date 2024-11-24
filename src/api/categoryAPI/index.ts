/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2023-10-17 21:21:36
 * @LastEditTime: 2024-11-22 19:52:31
 */
//统一管理域名相关的接口
import request from "@/utils/axios/request";

//引入接口类型
import type {
  categoryResult,
  categoryInsert,
  categoryDel,
  categoryUpdate,
} from "@/types/category";

enum API {
  CATEGORY_LIST = "/category/list/",
  CATEGORY_INSERT = "/category/add/",
  CATEGORY_UPDATE = "/category/update/",
  CATEGORY_DELETE = "/category/delete/",
}

class categoryAPI {
  // 获取列表
  static requestCategoryList = () =>
    request.get<any, categoryResult[]>(API.CATEGORY_LIST);

  static requestCategoryInsert = (data: categoryInsert) =>
    request.post<any, categoryResult[]>(API.CATEGORY_INSERT, data);

  static requestCategoryUpdate = (data: categoryUpdate) =>
    request.post<any, categoryResult[]>(API.CATEGORY_UPDATE, data);

  static requestCategoryDel = (data: categoryDel) =>
    request.post<any, categoryResult[]>(API.CATEGORY_DELETE, data);
}

export default categoryAPI;
