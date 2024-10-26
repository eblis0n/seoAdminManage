/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-10-25 22:19:55
 * @LastEditTime: 2024-10-25 22:39:56
 */
import PublicAPI from "@/api/publicAPI";
import type { platformsParams } from "@/types/other";
import { store } from "@/store";

export const useSupportedPlatformsStore = defineStore(
  "SupportedPlatforms",
  () => {
    const supportedPlatforms = ref<platformsParams[]>([]);

    function fetchSupportedPlatforms() {
      return new Promise<void>((resolve, reject) => {
        PublicAPI.requestSupportedPlatforms()
          .then((data) => {
            supportedPlatforms.value = data;
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    }

    return {
      supportedPlatforms,
      fetchSupportedPlatforms,
    };
  }
);

export function useSupportedPlatformsHook() {
  return useSupportedPlatformsStore(store);
}
