/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-01-20 20:34:59
 * @LastEditTime: 2024-11-09 19:36:32
 */

import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import type { outcomeExportParams } from "@/types/outcome";
import { ElMessage } from "element-plus";

// 导出到 Excel 文件
export async function exportToExcel(
  data: outcomeExportParams
): Promise<boolean> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(data.title || "Exported Data");

  // 设置列标题
  worksheet.columns = Object.keys(data.exportD[0]).map((key) => ({
    header: key,
    key: key,
    width: 20, // 可根据需求调整列宽
  }));

  // 添加数据行
  data.exportD.forEach((item) => {
    worksheet.addRow(item);
  });

  // 设置样式 (可选)
  worksheet.columns.forEach((column) => {
    column.alignment = { vertical: "middle", horizontal: "center" };
  });
  worksheet.getRow(1).font = { bold: true }; // 表头加粗

  try {
    // 转换为二进制并保存
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `${data.title || "Export"}.xlsx`);
    ElMessage.success("Excel 文件导出成功");
    return true;
  } catch (error) {
    console.error("导出 Excel 文件失败:", error);
    ElMessage.error("导出 Excel 文件失败");
    return false;
  }
}
