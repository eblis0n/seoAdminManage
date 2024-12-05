/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-20 20:34:59
 * @LastEditTime: 2024-12-05 20:30:37
 */

import { ElMessage } from "element-plus";
import outcomeAPI from "@/api/outcomeAPI";
import type { outcomeParams, outcomeExportParams } from "@/types/outcome";
import { exportToExcel } from "@/utils/excel";

// 实例化

export async function upshotList(params: outcomeParams) {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 添加1秒延迟

  try {
    const response = await outcomeAPI.requesOutcomeList(params);
    console.log("刷新list", response);
    // 对数据进行排序
    const sortedData = response.sort((a: any, b: any) => {
      return new Date(b.create_at).getTime() - new Date(a.create_at).getTime();
    });
    return sortedData;
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

// 修改导出Excel功能的包装函数名称
export async function exportToExcelWrapper(data: outcomeExportParams) {
  if (data.exportD.length === 0) {
    ElMessage.warning("没有可导出的数据");
    return false;
  }

  if (data.exportD.length > 10000) {
    ElMessage.warning("导出数据不能超过10000条，将只导出前10000条数据");
    data.exportD = data.exportD.slice(0, 10000);
  }

  try {
    const success = await exportToExcel(data);

    if (success) {
      if (data.title === "article") { 
        // 收集所有URL
      const dataId = data.exportD.map((item) => item.id).join(",");

      // 执行删除操作
      await outcomeAPI.requesOutcomDeleteData({
        platform: data.title,
        urldatas: dataId,
      });
      }elis{
// 收集所有URL
      const urldatas = data.exportD.map((item) => item.url).join(",");
      // 执行删除操作
      await outcomeAPI.requesOutcomDeleteData({
        platform: data.title,
        urldatas: urldatas,
      });
      }
      

      ElMessage.success("导出成功并清除数据");
      return true;
    }
    return false;
  } catch (error) {
    console.error("导出失败:", error);
    ElMessage.error("导出失败");
    return false;
  }
}
