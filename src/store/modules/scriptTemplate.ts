/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-10-25 22:19:55
 * @LastEditTime: 2024-11-12 16:18:06
 */
import scriptTemplateAPI from "@/api/scriptTemplateAPI";
import type { scriptTemplateResult } from "@/types/scriptTemplate";
import { store } from "@/store";

export const useScriptTemplateStore = defineStore("ScriptTemplateList", () => {
  const scriptTemplateList = ref<scriptTemplateResult[]>([]);

  function fetchScriptTemplateList() {
    return new Promise<void>((resolve, reject) => {
      scriptTemplateAPI
        .requestScriptTemplateList()
        .then((data) => {
          scriptTemplateList.value = data;
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  return {
    scriptTemplateList,
    fetchScriptTemplateList,
  };
});

export function useScriptTemplateHook() {
  return useScriptTemplateStore(store);
}
