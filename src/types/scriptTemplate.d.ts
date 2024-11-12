/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-11-12 15:34:32
 * @LastEditTime: 2024-11-12 15:36:29
 */
export interface scriptTemplateResult {
  id: number;
  script_type: string;
  script_name: string;
  script_content: string;
}
export interface scriptTemplateInsert {
  script_type: string;
  script_name: string;
  script_content: string;
}

export interface scriptTemplateDel {
  id: number;
}

export interface scriptTemplateUpdate {
  id: number;
  script_type: string;
  script_name: string;
  script_content: string;
}
