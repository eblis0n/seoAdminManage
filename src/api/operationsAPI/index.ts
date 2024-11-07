/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2023-10-17 21:21:36
 * @LastEditTime: 2024-11-07 20:16:09
 */
//统一管理PC客户端相关的接口
import request from "@/utils/axios/request";

//引入接口类型

import type { hostsResult, hostDisable, hostsUpdate } from "@/types/operations";

enum API {
  OPERATIONS_HOSTS_LIST = "/operations/hosts/list/",
  OPERATIONS_HOSTS_UPDATE = "/operations/hosts/update/",
  OPERATIONS_HOSTS_DISABLE = "/operations/hosts/disable/",
  TOPERATIONS_ASKS_LIST = "/operations/tasks/list/",
  OPERATIONS_TASK_IMPLEMENT_LOGS = "/operations/task/logs/",
}

class operationsAPI {
  static requestHostList = () =>
    request.get<any, hostsResult[]>(API.OPERATIONS_HOSTS_LIST);

  static requestHostDisable = (data: hostDisable) =>
    request.post<any, hostsResult[]>(API.OPERATIONS_HOSTS_DISABLE, data);

  static requestHostUpdate = (data: hostsUpdate) =>
    request.post<any, hostsResult[]>(API.OPERATIONS_HOSTS_UPDATE, data);
}

export default operationsAPI;
