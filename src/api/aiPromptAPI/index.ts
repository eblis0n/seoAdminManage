/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2023-10-17 21:21:36
 * @LastEditTime: 2024-11-16 21:51:54
 */
//统一管理域名相关的接口
import request from "@/utils/axios/request";

//引入接口类型
import type {
  AiPromptResult,
  AiPromptInsert,
  AiPromptDel,
  AiPromptUpdate,
} from "@/types/aiPrompt";

enum API {
  AI_PROMPT_LIST = "/prompt/list/",
  AI_PROMPT_INSERT = "/prompt/add/",
  AI_PROMPT_UPDATE = "/prompt/update/",
  AI_PROMPT_DELETE = "/prompt/delete/",
}

class AiPromptAPI {
  // 获取列表
  static requestAiPromptList = () =>
    request.get<any, AiPromptResult[]>(API.AI_PROMPT_LIST);

  static requestAiPromptInsert = (data: AiPromptInsert) =>
    request.post<any, AiPromptResult[]>(API.AI_PROMPT_INSERT, data);

  static requestAiPromptUpdate = (data: AiPromptUpdate) =>
    request.post<any, AiPromptResult[]>(API.AI_PROMPT_UPDATE, data);

  static requestAiPromptDel = (data: AiPromptDel) =>
    request.post<any, AiPromptResult[]>(API.AI_PROMPT_DELETE, data);
}

export default AiPromptAPI;
