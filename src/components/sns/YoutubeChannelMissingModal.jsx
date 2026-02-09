import { useState } from "react";
import { Youtube, X } from "lucide-react";

/**
 * 유튜브 채널 없음 안내 모달
 */
export function YoutubeChannelMissingModal({ onClose, onOpenStudio }) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-md p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center">
                        <Youtube className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-[#111827]">
                            유튜브 채널이 필요합니다
                        </h2>
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
                    <button
                        onClick={onOpenStudio}
                        className="flex-1 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700"
                    >
                        YouTube Studio 열기
                    </button>
                </div>
            </div>
        </div>
    );
}
