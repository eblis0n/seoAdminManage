/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2023-10-17 21:21:36
 * @LastEditTime: 2024-10-29 00:28:33
 */
//统一管理PC客户端相关的接口
import request from "@/utils/axios/request";

//引入接口类型

import type { splicingResult, splicingTotal } from "@/types/splicing.d.ts";

import type { outcomeDel, outcomeParams } from "@/types/outcome";

enum API {
  OUTCOME_LIST = "/outcome/list/",
  OUTCOME_TOTAL = "/outcome/total/",
  OUTCOME_DELETE_DATA = "/outcome/delete/", // 确保这个路径与后端一致
}

class outcomeAPI {
  static requesOutcomeList = (params: outcomeParams) =>
    request.get<any, splicingResult[]>(API.OUTCOME_LIST, { params });

  static requesOutcomTotal = (params: outcomeParams) =>
    request.get<void, splicingTotal>(API.OUTCOME_TOTAL, { params });

  // 修改为 DELETE 方法
  static requesOutcomDeleteData = (datas: outcomeDel) =>
    request.delete<any, splicingResult[]>(API.OUTCOME_DELETE_DATA, {
      data: datas,
    });
}

export default outcomeAPI;
