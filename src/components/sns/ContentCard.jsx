import { Download, FileImage, Video } from "lucide-react";
import { MiniStat } from "./Stats";

/**
 * SNS 콘텐츠 카드 컴포넌트
 */
export default function ContentCard({
    item,
    isUploaded,
    onUploadClick,
}) {
    const isVideo = item.type === "shorts";

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm h-full flex flex-col">
            <div
                className={`aspect-[4/3] w-full flex items-center justify-center ${isVideo
                        ? "bg-gray-800"
                        : "bg-gradient-to-br from-[#F9FAFB] to-[#E5E7EB]"
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
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${item.platform === "Instagram"
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
                <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-400">
                    📅 {item.date}
                </p>
                <p className="mt-2 text-sm text-teal-600">{item.description}</p>

                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                    <MiniStat label="조회" value={item.stats.views} />
                    <MiniStat label="좋아요" value={item.stats.likes} />
                    <MiniStat label="공유" value={item.stats.shares} />
                </div>

                <div className="mt-auto pt-4 flex items-center gap-2">
                    <button
                        onClick={() => onUploadClick(item)}
                        disabled={isUploaded}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-opacity ${isUploaded
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90"
                            }`}
                    >
                        {isUploaded ? "업로드됨" : "업로드"}
                    </button>

                    <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50">
                        <Download className="h-4 w-4" /> 다운로드
                    </button>
                </div>
            </div>
        </div>
    );
}
