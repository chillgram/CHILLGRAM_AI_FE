import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { exchangeYoutube } from "@/services/api/social";
import useSnsStore from "@/stores/snsStore";

export default function YoutubeCallbackPage() {
  const navigate = useNavigate();
  const { connectYoutube } = useSnsStore();

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    // code/state 즉시 제거
    window.history.replaceState({}, document.title, url.pathname);

    if (error || !code || !state) {
      navigate("/dashboard/sns?yt=cancelled", { replace: true });
      return;
    }

    (async () => {
      try {
        const res = await exchangeYoutube({ code, state });
        connectYoutube(res.accountLabel || "YouTube", res.subscribers || 0);
        navigate("/dashboard/sns?yt=connected", { replace: true });
      } catch (e) {
        // 에러코드 분기
        if (e?.code === "YOUTUBE_CHANNEL_NOT_FOUND") {
          navigate("/dashboard/sns?yt=channel-missing", { replace: true });
          return;
        }
        navigate("/dashboard/sns?yt=error", { replace: true });
      }
    })();
  }, [navigate, connectYoutube]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-600 font-bold">YouTube 계정 연결 중...</div>
    </div>
  );
}
