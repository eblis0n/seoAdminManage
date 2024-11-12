/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2023-10-17 21:21:36
 * @LastEditTime: 2024-11-12 23:39:32
 */
//统一管理PC客户端相关的接口
import request from "@/utils/axios/request";

//引入接口类型

import type {
  splicingInsert,
  splicingResult,
  splicingPublish,
  splicingTotal,
} from "@/types/splicing.d.ts";

enum API {
  SPLICING_LIST = "/splicing/list/",
  SPLICING_ADD = "/splicing/add/",
  SPLICING_PUSH = "/splicing/push/",
  SPLICING_TOTAL = "/splicing/total/",
  SPLICING_DELETE_ALL = "/splicing/delete/",
}

class splicingAPI {
  static requestSplicingList = () =>
    request.get<any, splicingResult[]>(API.SPLICING_LIST);

  static requestSplicingAdd = (data: splicingInsert) =>
    request.post<any, splicingResult[]>(API.SPLICING_ADD, data);

  static requestSplicingPush = (data: splicingPublish) =>
    request.post<any, splicingResult[]>(API.SPLICING_PUSH, data);

  static requestSplicingTotal = () =>
    request.get<any, splicingTotal[]>(API.SPLICING_TOTAL);

  static requestSplicingDelete = () =>
    request.get<any, splicingResult[]>(API.SPLICING_DELETE_ALL);
}

export default splicingAPI;
