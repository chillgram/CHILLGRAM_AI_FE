import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Instagram, Youtube, Eye, Heart, MessageCircle, Share2 } from "lucide-react";

import Container from "@/components/common/Container";
import useSnsStore from "@/stores/snsStore";
import {
  fetchYoutubeAuthUrl,
  fetchSocialAccounts,
  disconnectSocialAccount,
  exchangeYoutube,
} from "@/services/api/social";

// SNS 컴포넌트들
import AccountCard from "@/components/sns/AccountCard";
import TabButton from "@/components/sns/TabButton";
import { StatCard } from "@/components/sns/Stats";
import ContentCard from "@/components/sns/ContentCard";
import { YoutubeChannelMissingModal } from "@/components/sns/YoutubeChannelMissingModal";
import ConnectAccountModal from "@/components/sns/ConnectAccountModal";
import UploadModal from "@/components/sns/UploadModal";

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
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [connectingPlatform, setConnectingPlatform] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadingContent, setUploadingContent] = useState(null);
  const [uploadedItems, setUploadedItems] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [accountsError, setAccountsError] = useState("");
  const [isYoutubeChannelModalOpen, setIsYoutubeChannelModalOpen] = useState(false);

  const { instagramAccount, youtubeAccount, setAccountsFromServer } = useSnsStore();
  const handledOAuthRef = useRef(false);
  const requestSeqRef = useRef(0);

  const reloadAccounts = useCallback(async () => {
    const seq = ++requestSeqRef.current;
    try {
      setAccountsLoading(true);
      setAccountsError("");
      const data = await fetchSocialAccounts();
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const state = params.get("state");
    const yt = params.get("yt");

    if (yt === "channel-missing") {
      setIsYoutubeChannelModalOpen(true);
      params.delete("yt");
      navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
    }

    if (code && state) {
      if (handledOAuthRef.current) return;
      handledOAuthRef.current = true;

      (async () => {
        const seq = ++requestSeqRef.current;
        try {
          setAccountsLoading(true);
          setAccountsError("");
          await exchangeYoutube({ code, state });

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
          setAccountsError(e?.message || "YouTube 연동 처리에 실패했습니다.");
        } finally {
          params.delete("code");
          params.delete("state");
          navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
          if (seq === requestSeqRef.current) setAccountsLoading(false);
        }
      })();
      return;
    }

    reloadAccounts();
  }, [location.search, location.pathname, navigate, reloadAccounts, setAccountsFromServer]);

  const filteredContents = useMemo(
    () => DUMMY_SNS_CONTENTS.filter((item) =>
      activeTab === "instagram" ? item.platform === "Instagram" : item.platform === "YouTube"
    ),
    [activeTab]
  );

  const totalStats = useMemo(
    () => filteredContents.reduce(
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

  const handleConnect = async (platform) => {
    try {
      setAccountsError("");
      if (platform === "youtube") {
        const data = await fetchYoutubeAuthUrl();
        const authUrl = data?.authUrl ?? data;
        if (!authUrl) throw new Error("YouTube 인증 URL을 받지 못했습니다.");
        window.location.href = authUrl;
        return;
      }
      setConnectingPlatform(platform);
      setIsConnectModalOpen(true);
    } catch (e) {
      setAccountsError(e?.message || "연결에 실패했습니다.");
    }
  };

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
            {filteredContents.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                isUploaded={isUploaded(item.id)}
                onUploadClick={handleUploadClick}
              />
            ))}
          </div>
        </div>
      </Container>

      {/* 모달들 */}
      {isConnectModalOpen && connectingPlatform === "instagram" && (
        <ConnectAccountModal
          platform="instagram"
          onClose={() => setIsConnectModalOpen(false)}
          onConnect={async () => {
            setIsConnectModalOpen(false);
            await reloadAccounts();
          }}
        />
      )}

      {isYoutubeChannelModalOpen && (
        <YoutubeChannelMissingModal
          onClose={() => setIsYoutubeChannelModalOpen(false)}
          onOpenStudio={() => window.open("https://studio.youtube.com/", "_blank")}
        />
      )}

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
