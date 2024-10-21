/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-10-21 00:41:56
 * @LastEditTime: 2024-10-21 22:05:17
 */
import request from "@/utils/axios/request";
import type { splicingResultParams } from "@/types/telegra.d.ts";
import type { uploadFileParamsType } from "@/types/other.d.ts";

// 引入接口类型
enum API {
  UPLOAD_FILE = "/upload/file/",
}

class uploadAPI {
  // 将 uploadFileParamsType 转换为 FormData 类型
  static requestUploadFile = (params: uploadFileParamsType) => {
    const formData = new FormData();

    // 遍历文件数组并将每个文件添加到 FormData 中，键名统一为 'file'
    params.formData.forEach((file) => {
      formData.append("file", file); // 所有文件使用相同的键名 'file'
    });

    // 添加上传者信息
    formData.append("who", params.who);

    // 使用 FormData 进行文件上传
    return request.post<string, splicingResultParams>(
      API.UPLOAD_FILE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  };
}

export default uploadAPI;
