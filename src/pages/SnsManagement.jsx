import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Instagram,
  Youtube,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Download,
  FileImage,
  Video,
  X,
} from "lucide-react";

import Container from "@/components/common/Container";
import useSnsStore from "@/stores/snsStore";
import {
  fetchYoutubeAuthUrl,
  fetchSocialAccounts,
  disconnectSocialAccount,
  exchangeYoutube,
} from "@/services/api/social";

// 더미 콘텐츠 데이터
const DUMMY_SNS_CONTENTS = [
  {
    id: "sns-1",
    type: "sns",
    platform: "Instagram",
    title: "인스타그램 #두쫀쿠 이미지",
    description: "감성적인 스타일링 SNS 이미지",
    date: "2024-01-20",
    status: "활성",
    stats: { views: 15200, likes: 856, comments: 124, shares: 234 },
  },
  {
    id: "sns-2",
    type: "sns",
    platform: "Instagram",
    title: "인스타그램 릴스용",
    description: "트렌디한 컬러 포인트",
    date: "2024-01-10",
    status: "활성",
    stats: { views: 9800, likes: 567, comments: 89, shares: 123 },
  },
  {
    id: "shorts-1",
    type: "shorts",
    platform: "YouTube",
    title: "유튜브 쇼츠 영상",
    description: "30초 감각적인 초콜릿 언박싱 쇼츠",
    date: "2024-01-18",
    status: "활성",
    stats: { views: 28400, likes: 1523, comments: 245, shares: 445 },
  },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function SnsManagementPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("instagram");

  // 인스타만 더미 모달
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectingPlatform, setConnectingPlatform] = useState(null);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadingContent, setUploadingContent] = useState(null);
  const [uploadedItems, setUploadedItems] = useState([]);

  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountsError, setAccountsError] = useState("");

  // 유튜브 채널 없음 안내 모달
  const [isYoutubeChannelModalOpen, setIsYoutubeChannelModalOpen] = useState(false);

  const { instagramAccount, youtubeAccount, setAccountsFromServer } = useSnsStore();

  // StrictMode / 중복 실행 대비 (OAuth exchange 중복 방지)
  const handledOAuthRef = useRef(false);

  // 늦게 도착한 응답이 store를 덮어쓰는 문제 방지
  const requestSeqRef = useRef(0);

  const reloadAccounts = useCallback(async () => {
    const seq = ++requestSeqRef.current;

    try {
      setAccountsLoading(true);
      setAccountsError("");

      const data = await fetchSocialAccounts();

      // 가장 최신 요청만 반영
      if (seq !== requestSeqRef.current) return;

      setAccountsFromServer(data);
    } catch (e) {
      if (seq !== requestSeqRef.current) return;
      setAccountsError(e?.message || "SNS 계정 정보를 불러오지 못했습니다.");
    } finally {
      if (seq !== requestSeqRef.current) return;
      setAccountsLoading(false);
    }
  }, [setAccountsFromServer]);

  // “첫 진입 + OAuth 콜백”을 한 곳에서 처리 (중복 effect 금지)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const state = params.get("state");
    const yt = params.get("yt"); // 백엔드가 ?yt=channel-missing 같은 걸로 보낼 수도 있음

    // 1) channel missing 모달 (백엔드에서 ?yt=channel-missing 로 리다이렉트하는 케이스)
    if (yt === "channel-missing") {
      setIsYoutubeChannelModalOpen(true);
      params.delete("yt");
      navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    }

    // 2) OAuth 콜백이면: exchange 먼저 → accounts 조회
    if (code && state) {
      if (handledOAuthRef.current) return;
      handledOAuthRef.current = true;

      (async () => {
        const seq = ++requestSeqRef.current;

        try {
          setAccountsLoading(true);
          setAccountsError("");

          // exchange가 먼저 끝나야 함(여기서 DB UPDATE가 수행됨)
          await exchangeYoutube({ code, state });

          // exchange 직후에도 DB/트랜잭션 반영이 미세하게 늦는 환경이면 짧게 폴링
          // (너 로그상 “페이지 로드 후 UPDATE”가 찍히는 구조라면 이게 안전장치가 됨)
          for (let i = 0; i < 5; i++) {
            if (seq !== requestSeqRef.current) return;

            const data = await fetchSocialAccounts();
            if (seq !== requestSeqRef.current) return;

            setAccountsFromServer(data);

            if (data?.youtube?.connected) break;
            await sleep(300);
          }
        } catch (e) {
          if (seq !== requestSeqRef.current) return;

          const msg = e?.message || "YouTube 연동 처리에 실패했습니다.";
          setAccountsError(msg);

          // 채널 없음 같은 케이스를 프론트에서 UI로 처리하고 싶으면 여기서도 분기 가능
          // 예: 백엔드가 ErrorCode.YOUTUBE_CHANNEL_NOT_FOUND 를 내려주면
          // setIsYoutubeChannelModalOpen(true);
        } finally {
          // URL 정리
          params.delete("code");
          params.delete("state");
          navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });

          if (seq === requestSeqRef.current) setAccountsLoading(false);
        }
      })();

      return;
    }

    // 3) 일반 진입: accounts 1회 로드
    reloadAccounts();
  }, [location.search, location.pathname, navigate, reloadAccounts, setAccountsFromServer]);

  // 탭별 콘텐츠 필터링
  const filteredContents = useMemo(
    () =>
      DUMMY_SNS_CONTENTS.filter((item) =>
        activeTab === "instagram" ? item.platform === "Instagram" : item.platform === "YouTube"
      ),
    [activeTab]
  );

  // 총 통계 계산
  const totalStats = useMemo(
    () =>
      filteredContents.reduce(
        (acc, item) => ({
          views: acc.views + item.stats.views,
          likes: acc.likes + item.stats.likes,
          comments: acc.comments + item.stats.comments,
          shares: acc.shares + item.stats.shares,
        }),
        { views: 0, likes: 0, comments: 0, shares: 0 }
      ),
    [filteredContents]
  );

  // 연결하기 처리
  const handleConnect = async (platform) => {
    try {
      setAccountsError("");

      if (platform === "youtube") {
        const data = await fetchYoutubeAuthUrl();
        const authUrl = data?.authUrl ?? data;
        if (!authUrl) throw new Error("YouTube 인증 URL을 받지 못했습니다.");
        window.location.href = authUrl; // ✅ 여기서 full navigation 발생
        return;
      }

      // (임시) instagram 더미 모달
      setConnectingPlatform(platform);
      setIsConnectModalOpen(true);
    } catch (e) {
      setAccountsError(e?.message || "연결에 실패했습니다.");
    }
  };

  // 연결 해제 (서버 호출 → reloadAccounts)
  const handleDisconnect = async (platform) => {
    const seq = ++requestSeqRef.current;

    try {
      setAccountsError("");
      setAccountsLoading(true);

      await disconnectSocialAccount(platform);

      if (seq !== requestSeqRef.current) return;

      await reloadAccounts();
    } catch (e) {
      if (seq !== requestSeqRef.current) return;
      setAccountsError(e?.message || "연결 해제에 실패했습니다.");
    } finally {
      if (seq === requestSeqRef.current) setAccountsLoading(false);
    }
  };

  const handleUploadClick = (item) => {
    setUploadingContent(item);
    setIsUploadModalOpen(true);
  };

  const handleUploadComplete = (contentId) => {
    setUploadedItems((prev) => [...prev, contentId]);
    setIsUploadModalOpen(false);
    setUploadingContent(null);
  };

  const isUploaded = (contentId) => uploadedItems.includes(contentId);

  return (
    <div className="min-h-full bg-[#F9FAFB] py-12">
      <Container>
        {/* 헤더 */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-[#111827] mb-2">SNS 관리</h1>
          <p className="text-[#9CA3AF] font-medium">
            Instagram과 YouTube 계정을 연결하고 콘텐츠를 관리하세요
          </p>
        </div>

        {/* 에러/로딩 표시 */}
        {accountsError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-600">
            {accountsError}
          </div>
        )}
        {accountsLoading && (
          <div className="mb-6 rounded-xl border border-gray-200 bg-white p-3 text-sm font-bold text-gray-500">
            계정 연결 상태를 불러오는 중...
          </div>
        )}

        {/* 계정 연결 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Instagram 카드 */}
          <AccountCard
            icon={
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 flex items-center justify-center">
                <Instagram className="h-6 w-6 text-white" />
              </div>
            }
            title="Instagram"
            subtitle={instagramAccount.connected ? `@${instagramAccount.username}` : "연결되지 않음"}
            connected={instagramAccount.connected}
            statLabel="팔로워"
            statValue={instagramAccount.followers}
            onConnect={() => handleConnect("instagram")}
            onDisconnect={() => handleDisconnect("instagram")}
          />

          {/* YouTube 카드 */}
          <AccountCard
            icon={
              <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                <Youtube className="h-6 w-6 text-white" />
              </div>
            }
            title="YouTube"
            subtitle={youtubeAccount.connected ? youtubeAccount.channelName : "연결되지 않음"}
            connected={youtubeAccount.connected}
            statLabel="구독자"
            statValue={youtubeAccount.subscribers}
            onConnect={() => handleConnect("youtube")}
            onDisconnect={() => handleDisconnect("youtube")}
          />
        </div>

        {/* 업로드된 콘텐츠 섹션 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-black text-[#111827] mb-1">업로드된 콘텐츠</h2>
            <p className="text-sm text-gray-500">각 플랫폼별 업로드된 콘텐츠와 성과를 확인하세요</p>
          </div>

          {/* 탭 */}
          <div className="flex border-b border-gray-200 mb-6">
            <TabButton
              active={activeTab === "instagram"}
              activeClass="border-pink-500 text-pink-600"
              inactiveClass="border-transparent text-gray-400 hover:text-gray-600"
              onClick={() => setActiveTab("instagram")}
              icon={<Instagram className="h-4 w-4" />}
              label="Instagram"
              count={DUMMY_SNS_CONTENTS.filter((c) => c.platform === "Instagram").length}
            />

            <TabButton
              active={activeTab === "youtube"}
              activeClass="border-red-500 text-red-600"
              inactiveClass="border-transparent text-gray-400 hover:text-gray-600"
              onClick={() => setActiveTab("youtube")}
              icon={<Youtube className="h-4 w-4" />}
              label="YouTube"
              count={DUMMY_SNS_CONTENTS.filter((c) => c.platform === "YouTube").length}
            />
          </div>

          {/* 총 통계 */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard icon={<Eye className="h-4 w-4" />} label="총 조회수" value={totalStats.views} />
            <StatCard icon={<Heart className="h-4 w-4" />} label="총 좋아요" value={totalStats.likes} />
            <StatCard icon={<MessageCircle className="h-4 w-4" />} label="총 댓글" value={totalStats.comments} />
            <StatCard icon={<Share2 className="h-4 w-4" />} label="총 공유" value={totalStats.shares} />
          </div>

          {/* 콘텐츠 리스트 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {filteredContents.map((item) => {
              const isVideo = item.type === "shorts";
              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm h-full flex flex-col"
                >
                  <div
                    className={`aspect-[4/3] w-full flex items-center justify-center ${
                      isVideo ? "bg-gray-800" : "bg-gradient-to-br from-[#F9FAFB] to-[#E5E7EB]"
                    }`}
                  >
                    {isVideo ? (
                      <Video className="h-12 w-12 text-gray-400" />
                    ) : (
                      <FileImage className="h-10 w-10 text-gray-300" />
                    )}
                  </div>

                  <div className="p-5 flex-grow flex flex-col">
                    <div className="mb-3 flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-[11px] font-bold text-[#6B7280]">
                        {item.type === "shorts" ? "🎬 숏츠" : "📷 SNS 이미지"}
                      </span>

                      <span
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${
                          item.platform === "Instagram"
                            ? "bg-gradient-to-r from-pink-100 to-purple-100 text-pink-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.platform === "Instagram" ? "📷" : "▶️"} {item.platform}
                      </span>

                      <span className="ml-auto rounded-full bg-cyan-50 px-3 py-1 text-[11px] font-bold text-cyan-600">
                        {item.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-[#111827]">{item.title}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-400">📅 {item.date}</p>
                    <p className="mt-2 text-sm text-teal-600">{item.description}</p>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                      <MiniStat label="조회" value={item.stats.views} />
                      <MiniStat label="좋아요" value={item.stats.likes} />
                      <MiniStat label="공유" value={item.stats.shares} />
                    </div>

                    <div className="mt-auto pt-4 flex items-center gap-2">
                      <button
                        onClick={() => handleUploadClick(item)}
                        disabled={isUploaded(item.id)}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-opacity ${
                          isUploaded(item.id)
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90"
                        }`}
                      >
                        {isUploaded(item.id) ? "업로드됨" : "업로드"}
                      </button>

                      <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50">
                        <Download className="h-4 w-4" /> 다운로드
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>

      {/* ✅ 인스타 임시 연결 모달 */}
      {isConnectModalOpen && connectingPlatform === "instagram" && (
        <ConnectAccountModal
          platform="instagram"
          onClose={() => setIsConnectModalOpen(false)}
          onConnect={async () => {
            setIsConnectModalOpen(false);
            // ⚠️ 지금은 더미라 실제 연결은 안 됨. (추후 인스타 OAuth로 교체)
            // UX 통일: 서버 기준으로만 갱신
            await reloadAccounts();
          }}
        />
      )}

      {/* ✅ 유튜브 채널 없음 모달 */}
      {isYoutubeChannelModalOpen && (
        <YoutubeChannelMissingModal
          onClose={() => setIsYoutubeChannelModalOpen(false)}
          onOpenStudio={() => window.open("https://studio.youtube.com/", "_blank")}
        />
      )}

      {/* 업로드 모달 */}
      {isUploadModalOpen && uploadingContent && (
        <UploadModal
          content={uploadingContent}
          onClose={() => {
            setIsUploadModalOpen(false);
            setUploadingContent(null);
          }}
          onUpload={() => handleUploadComplete(uploadingContent.id)}
        />
      )}
    </div>
  );
}

/* ===========================
   UI 컴포넌트들
=========================== */

function AccountCard({ icon, title, subtitle, connected, statLabel, statValue, onConnect, onDisconnect }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {icon}
          <div>
            <h3 className="font-bold text-lg text-[#111827]">{title}</h3>
            {connected ? (
              <p className="text-sm text-gray-500">{subtitle}</p>
            ) : (
              <p className="text-sm text-gray-400">{subtitle}</p>
            )}
          </div>
        </div>

        {connected ? (
          <span className="flex items-center gap-1.5 text-sm font-bold text-green-600">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            연결됨
          </span>
        ) : (
          <button onClick={onConnect} className="text-sm font-bold text-blue-500 hover:text-blue-600">
            연결하기
          </button>
        )}
      </div>

      {connected && (
        <>
          <div className="flex items-center justify-between py-3 border-t border-gray-100">
            <span className="text-sm text-gray-500">{statLabel}</span>
            <span className="font-bold text-[#111827]">{Number(statValue || 0).toLocaleString()}</span>
          </div>
          <button
            onClick={onDisconnect}
            className="w-full mt-2 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50"
          >
            연결 해제
          </button>
        </>
      )}
    </div>
  );
}

function TabButton({ active, activeClass, inactiveClass, onClick, icon, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 font-bold text-sm border-b-2 transition-colors ${
        active ? activeClass : inactiveClass
      }`}
    >
      {icon} {label}{" "}
      <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded-full">{Number(count || 0)}</span>
    </button>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
        {icon} {label}
      </div>
      <p className="text-2xl font-black text-[#111827]">{Number(value || 0).toLocaleString()}</p>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="text-center">
      <p className="text-lg font-black text-gray-800">{Number(value || 0).toLocaleString()}</p>
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}

/* ===========================
   모달들 (원본 유지)
=========================== */

function YoutubeChannelMissingModal({ onClose, onOpenStudio }) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <X className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
            <Youtube className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#111827]">유튜브 채널이 필요합니다</h2>
            <p className="text-sm text-gray-500">채널 생성 후 다시 연결하세요</p>
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-700 leading-relaxed">
          현재 Google 계정에 YouTube 채널이 없어 연동을 완료할 수 없습니다.
          <br />
          YouTube Studio에서 채널을 만든 뒤 다시 연결을 시도하세요.
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50"
          >
            확인
          </button>
          <button onClick={onOpenStudio} className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700">
            YouTube Studio 열기
          </button>
        </div>
      </div>
    </div>
  );
}

function ConnectAccountModal({ platform, onClose, onConnect }) {
  const [accountId, setAccountId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    if (!accountId.trim() || !password.trim()) return;
    onConnect({ username: accountId.trim(), followers: 12400 });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-8 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <X className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500">
            <Instagram className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#111827]">Instagram 로그인</h2>
            <p className="text-sm text-gray-500">임시 더미 로그인(추후 OAuth로 교체)</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">사용자명 또는 이메일</label>
            <input
              type="text"
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              placeholder="사용자명, 이메일 또는 전화번호"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-400"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50">
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!accountId.trim() || !password.trim()}
            className="flex-1 py-3 rounded-xl font-bold text-white transition-colors bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}

function UploadModal({ content, onClose, onUpload }) {
  const [description, setDescription] = useState("");
  const [hashtags, setHashtags] = useState("");

  const handleSubmit = () => {
    onUpload();
    alert(`${content.platform}에 업로드되었습니다!`);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg p-8 relative">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600">
          <X className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${
              content.platform === "Instagram"
                ? "bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500"
                : "bg-red-600"
            }`}
          >
            {content.platform === "Instagram" ? (
              <Instagram className="h-6 w-6 text-white" />
            ) : (
              <Youtube className="h-6 w-6 text-white" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-black text-[#111827]">{content.platform}에 업로드</h2>
            <p className="text-sm text-gray-500">{content.title}</p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-500 mb-2">업로드할 콘텐츠</p>
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
              {content.type === "shorts" ? (
                <Video className="h-6 w-6 text-gray-400" />
              ) : (
                <FileImage className="h-6 w-6 text-gray-400" />
              )}
            </div>
            <div>
              <p className="font-bold text-[#111827]">{content.title}</p>
              <p className="text-sm text-gray-500">{content.date}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">피드 설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="피드에 표시될 설명을 입력하세요..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-400 resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">해시태그</label>
            <input
              type="text"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
              placeholder="#해시태그 #광고 #프로모션"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-400"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50">
            취소
          </button>
          <button
            onClick={handleSubmit}
            className={`flex-1 py-3 rounded-xl font-bold text-white transition-colors ${
              content.platform === "Instagram"
                ? "bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            업로드
          </button>
        </div>
      </div>
    </div>
  );
}
