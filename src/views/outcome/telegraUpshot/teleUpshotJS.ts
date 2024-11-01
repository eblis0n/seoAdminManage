/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-20 20:34:59
 * @LastEditTime: 2024-11-01 22:19:51
 */

import { ElMessage } from "element-plus";
import * as XLSX from "xlsx";

import outcomeAPI from "@/api/outcomeAPI";
import type { outcomeParams, outcomeExportParams } from "@/types/outcome";

// 实例化

export async function upshotList(params: outcomeParams) {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 添加1秒延迟

  try {
    const response = await outcomeAPI.requesOutcomeList(params);
    console.log("刷新list", response);
    return response;
  } catch (error) {
    console.error("加载列表失败:", error);
    ElMessage.error("加载列表失败");
    return [];
  }
}

export async function totalGo(params: outcomeParams) {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 添加1秒延迟

  try {
    const response = await outcomeAPI.requesOutcomTotal(params);
    console.log("总数", response);
    return response.total; // 返回 total 属性值
  } catch (error) {
    console.error("获取总数失败:", error);
    ElMessage.error("获取总数失败");
    return 0;
  }
}

// 导出Excel功能
export async function exportToExcel(data: outcomeExportParams) {
  if (data.exportD.length === 0) {
    ElMessage.warning("没有可导出的数据");
    return false;
  }

  if (data.exportD.length > 10000) {
    ElMessage.warning("导出数据不能超过10000条，将只导出前10000条数据");
    data.exportD = data.exportD.slice(0, 10000);
  }

  try {
    // 格式化数据
    const exportData = data.exportD.map((item) => ({
      ID: item.id,
      URL: item.url,
      投放平台: item.platform,
      类型:
        item.genre === "0"
          ? "重定向"
          : item.genre === "1"
            ? "镜像"
            : item.genre === "2"
              ? "留痕"
              : "未知",
      添加时间: item.created_at,
    }));

    // 创建工作簿
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(exportData);

    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(wb, ws, `${data.title}发布结果`);

    // 生成文件名
    const fileName = `${data.title}发布结果_${new Date().toLocaleDateString().replace(/\//g, "-")}.xlsx`;

    // 导出文件
    XLSX.writeFile(wb, fileName);

    // 收集所有URL
    const urldatas = data.exportD.map((item) => item.url).join(",");

    const datas = {
      platform: `${data.title}`,
      urldatas: urldatas,
    };

    // 执行删除操作
    await outcomeAPI.requesOutcomDeleteData(datas);

    ElMessage.success("导出成功并清除数据");
    return true;
  } catch (error) {
    console.error("导出失败:", error);
    ElMessage.error("导出失败");
    return false;
  }
}
