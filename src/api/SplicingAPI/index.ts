/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2023-10-17 21:21:36
 * @LastEditTime: 2024-10-26 15:41:55
 */
//统一管理PC客户端相关的接口
import request from "@/utils/axios/request";

//引入接口类型

import type {
  splicingInsert,
  splicingResult,
  splicingPublish,
} from "@/types/splicing.d.ts";

enum API {
  SPLICING_LIST = "/splicing/list/",
  SPLICING_ADD = "/splicing/add/",
  SPLICING_PUSH = "/splicing/push/",
}

class splicingAPI {
  static requestSplicingList = () =>
    request.get<any, splicingResult[]>(API.SPLICING_LIST);

  static requestSplicingAdd = (data: splicingInsert) =>
    request.post<any, splicingResult[]>(API.SPLICING_ADD, data);

  static requestSplicingPush = (data: splicingPublish) =>
    request.post<any, splicingResult[]>(API.SPLICING_PUSH, data);
}

export default splicingAPI;
