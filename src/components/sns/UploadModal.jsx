import { useState } from "react";
import { Instagram, Youtube, FileImage, Video, X } from "lucide-react";

/**
 * SNS 업로드 모달 컴포넌트
 */
export default function UploadModal({ content, onClose, onUpload }) {
    const [description, setDescription] = useState("");
    const [hashtags, setHashtags] = useState("");

    const handleSubmit = () => {
        onUpload();
        alert(`${content.platform}에 업로드되었습니다!`);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${content.platform === "Instagram"
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
                        <h2 className="text-xl font-black text-[#111827]">
                            {content.platform}에 업로드
                        </h2>
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
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            피드 설명
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="피드에 표시될 설명을 입력하세요..."
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-400 resize-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            해시태그
                        </label>
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
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSubmit}
                        className={`flex-1 py-3 rounded-xl font-bold text-white transition-colors ${content.platform === "Instagram"
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
