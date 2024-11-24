/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-10-25 22:19:55
 * @LastEditTime: 2024-11-21 23:29:01
 */
import AiPromptAPI from "@/api/aiPromptAPI";
import type { AiPromptResult } from "@/types/aiPrompt";
import { store } from "@/store";

export const useAiPromptStore = defineStore("aiPromptList", () => {
  const aiPromptList = ref<AiPromptResult[]>([]);

  function fetchAiPromptList() {
    return new Promise<void>((resolve, reject) => {
      AiPromptAPI.requestAiPromptList()
        .then((data) => {
          aiPromptList.value = data;
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  return {
    aiPromptList,
    fetchAiPromptList,
  };
});

export function useAiPromptHook() {
  return useAiPromptStore(store);
}
