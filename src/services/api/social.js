import { httpJson } from "@/services/api/http";

export function fetchSocialAccounts() {
  return httpJson(`/api/social/accounts`, { method: "GET" });
}

export function fetchYoutubeAuthUrl() {
  return httpJson(`/api/social/youtube/auth-url`, { method: "GET" });
}

export function exchangeYoutube({ code, state }) {
  return httpJson(`/api/social/youtube/exchange`, {
    method: "POST",
    body: { code, state },
  });
}

export function disconnectSocialAccount(platform) {
  // platform: "instagram" | "youtube"
  return httpJson(`/api/social/accounts/${platform}`, { method: "DELETE" });
}