/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2023-10-17 21:21:36
 * @LastEditTime: 2024-11-12 16:06:14
 */
//统一管理域名相关的接口
import request from "@/utils/axios/request";

//引入接口类型
import type {
  scriptTemplateDel,
  scriptTemplateUpdate,
  scriptTemplateResult,
  scriptTemplateInsert,
} from "@/types/scriptTemplate";

enum API {
  SCRIPT_TEMPLATE_INSERT = "/template/add/",
  SCRIPT_TEMPLATE_DELETE = "/template/delete/",
  SCRIPT_TEMPLATE_LIST = "/template/list/",
  SCRIPT_TEMPLATE_UPDATE = "/template/update/",
}

class scriptTemplateAPI {
  // 获取列表
  static requestScriptTemplateList = () =>
    request.get<any, scriptTemplateResult[]>(API.SCRIPT_TEMPLATE_LIST);

  static requestScriptTemplateInsert = (data: scriptTemplateInsert) =>
    request.post<any, scriptTemplateResult[]>(API.SCRIPT_TEMPLATE_INSERT, data);

  static requestScriptTemplateUpdate = (data: scriptTemplateUpdate) =>
    request.post<any, scriptTemplateResult[]>(API.SCRIPT_TEMPLATE_UPDATE, data);

  static requestScriptTemplateDel = (data: scriptTemplateDel) =>
    request.post<any, scriptTemplateResult[]>(API.SCRIPT_TEMPLATE_DELETE, data);
}

export default scriptTemplateAPI;
