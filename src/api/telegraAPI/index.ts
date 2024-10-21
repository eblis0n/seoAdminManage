/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2023-10-17 21:21:36
 * @LastEditTime: 2024-10-21 00:43:23
 */
//统一管理PC客户端相关的接口
import request from "@/utils/axios/request";

//引入接口类型

import type {
  submit301Params,
  splicingResultParams,
} from "@/types/telegra.d.ts";

enum API {
  SPLICING_LIST = "/telegra/list/",
  SUBMIT_301 = "/telegra/301/",
}

class telegraAPI {
  static requestSplicingList = () =>
    request.get<any, splicingResultParams[]>(API.SPLICING_LIST);

  static requestSubmit301 = (data: submit301Params) =>
    request.post<any, splicingResultParams[]>(API.SUBMIT_301, data);
}

export default telegraAPI;
