/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2023-10-17 21:21:36
 * @LastEditTime: 2024-10-25 22:11:34
 */
//统一管理域名相关的接口
import request from "@/utils/axios/request";
import type { platformsParams, googleExcelParams } from "@/types/other";

enum API {
  SUPPORTED_PLATFORMS = "/public/platforms/",
  GOOGLE_EXCEL = "/public/excle/",
}
class PublicAPI {
  static requestSupportedPlatforms = () =>
    request.get<any, platformsParams[]>(API.SUPPORTED_PLATFORMS);
  static requestGoogleExcel = () =>
    request.get<any, googleExcelParams[]>(API.GOOGLE_EXCEL);
}

export default PublicAPI;
