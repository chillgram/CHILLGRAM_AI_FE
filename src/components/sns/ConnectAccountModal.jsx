import { useState } from "react";
import { Instagram, X } from "lucide-react";

/**
 * 인스타그램 계정 연결 모달 (임시 더미)
 */
export default function ConnectAccountModal({ platform, onClose, onConnect }) {
    const [accountId, setAccountId] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = () => {
        if (!accountId.trim() || !password.trim()) return;
        onConnect({ username: accountId.trim(), followers: 12400 });
    };

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
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500">
                        <Instagram className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-[#111827]">
                            Instagram 로그인
                        </h2>
                        <p className="text-sm text-gray-500">
                            임시 더미 로그인(추후 OAuth로 교체)
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            사용자명 또는 이메일
                        </label>
                        <input
                            type="text"
                            value={accountId}
                            onChange={(e) => setAccountId(e.target.value)}
                            placeholder="사용자명, 이메일 또는 전화번호"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-blue-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            비밀번호
                        </label>
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
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50"
                    >
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
