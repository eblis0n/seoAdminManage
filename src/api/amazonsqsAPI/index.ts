/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2023-10-17 21:21:36
 * @LastEditTime: 2024-10-27 23:04:43
 */
//统一管理域名相关的接口
import request from "@/utils/axios/request";

import type { amazonsqsResult } from "@/types/other";

enum API {
  AMAZONSQS_LIST = "/ama/list/",
}
class amazonsqsAPI {
  static requestamazonSQSList = () =>
    request.get<any, amazonsqsResult[]>(API.AMAZONSQS_LIST);
}

export default amazonsqsAPI;
