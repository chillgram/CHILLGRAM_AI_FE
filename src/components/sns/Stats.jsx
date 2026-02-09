/**
 * 통계 카드 컴포넌트
 */
export function StatCard({ icon, label, value }) {
    return (
        <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                {icon} {label}
            </div>
            <p className="text-2xl font-black text-[#111827]">
                {Number(value || 0).toLocaleString()}
            </p>
        </div>
    );
}

/**
 * 미니 통계 컴포넌트
 */
export function MiniStat({ label, value }) {
    return (
        <div className="text-center">
            <p className="text-lg font-black text-gray-800">
                {Number(value || 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">{label}</p>
        </div>
    );
}
