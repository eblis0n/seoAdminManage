/*
 * @version: 1.0.0
 * @Author: Eblis
 * @Date: 2024-10-11 23:58:30
 * @LastEditTime: 2024-10-12 16:45:23
 */
import { TOKEN_KEY } from "@/enums/CacheEnum";
// const TOKEN_KEY = "seo-admin-token";

function getToken(): string {
  return localStorage.getItem(TOKEN_KEY) || "";
}

function setToken(token: string) {
  return localStorage.setItem(TOKEN_KEY, token);
}

function removeToken() {
  return localStorage.removeItem(TOKEN_KEY);
}

function isLogin(): boolean {
  return !!getToken();
}

export { getToken, setToken, removeToken, isLogin };
