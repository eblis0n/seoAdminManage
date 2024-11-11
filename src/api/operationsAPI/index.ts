/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2023-10-17 21:21:36
 * @LastEditTime: 2024-11-09 22:24:05
 */
//统一管理PC客户端相关的接口
import request from "@/utils/axios/request";

//引入接口类型

import type {
  hostsResult,
  hostDisable,
  hostsUpdate,
  postTaskInsert,
} from "@/types/operations";

enum API {
  OPERATIONS_HOSTS_LIST = "/operations/hosts/list/",
  OPERATIONS_HOSTS_UPDATE = "/operations/hosts/update/",
  OPERATIONS_HOSTS_DISABLE = "/operations/hosts/disable/",
  OPERATIONS_TASKS_INSERT = "/operations/tasks/insert/",
  OPERATIONS_TASKS_LIST = "/operations/tasks/list/",
  OPERATIONS_TASK_IMPLEMENT_LOGS = "/operations/task/logs/",
}

class operationsAPI {
  static requestHostList = () =>
    request.get<any, hostsResult[]>(API.OPERATIONS_HOSTS_LIST);

  static requestHostDisable = (data: hostDisable) =>
    request.post<any, hostsResult[]>(API.OPERATIONS_HOSTS_DISABLE, data);

  static requestHostUpdate = (data: hostsUpdate) =>
    request.post<any, hostsResult[]>(API.OPERATIONS_HOSTS_UPDATE, data);

  static requestTasksList = () =>
    request.get<any, hostsResult[]>(API.OPERATIONS_TASKS_LIST);

  static requestTasksInsert = (data: postTaskInsert) =>
    request.post<any, hostsResult[]>(API.OPERATIONS_TASKS_INSERT, data);
}

export default operationsAPI;
