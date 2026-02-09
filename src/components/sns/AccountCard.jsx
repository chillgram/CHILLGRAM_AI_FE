/**
 * SNS 계정 연결 카드 컴포넌트
 */
export default function AccountCard({
    icon,
    title,
    subtitle,
    connected,
    statLabel,
    statValue,
    onConnect,
    onDisconnect,
}) {
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
                    <button
                        onClick={onConnect}
                        className="text-sm font-bold text-blue-500 hover:text-blue-600"
                    >
                        연결하기
                    </button>
                )}
            </div>

            {connected && (
                <>
                    <div className="flex items-center justify-between py-3 border-t border-gray-100">
                        <span className="text-sm text-gray-500">{statLabel}</span>
                        <span className="font-bold text-[#111827]">
                            {Number(statValue || 0).toLocaleString()}
                        </span>
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
