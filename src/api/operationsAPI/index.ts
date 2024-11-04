/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2023-10-17 21:21:36
 * @LastEditTime: 2024-11-03 23:57:42
 */
//统一管理PC客户端相关的接口
import request from "@/utils/axios/request";

//引入接口类型

import type { hostsResult, hostsDel, hostsUpdate } from "@/types/operations";

enum API {
  OPERATIONS_HOSTS_LIST = "/operations/hosts/list/",
  OPERATIONS_HOSTS_UPDATE = "/operations/hosts/update/",
  OPERATIONS_HOSTS_UPDATE_STATUS = "/operations/hosts/status/",
  TOPERATIONS_ASKS_LIST = "/operations/tasks/list/",
  OPERATIONS_TASK_IMPLEMENT_LOGS = "/operations/task/logs/",
}

class operationsAPI {
  static requestHostList = () =>
    request.get<any, hostsResult[]>(API.OPERATIONS_HOSTS_LIST);

  static requestHostDel = (data: hostsDel) =>
    request.post<any, hostsResult[]>(API.OPERATIONS_HOSTS_UPDATE_STATUS, data);

  static requestHostUpdate = (data: hostsUpdate) =>
    request.post<any, hostsResult[]>(API.OPERATIONS_HOSTS_UPDATE, data);
}

export default operationsAPI;
