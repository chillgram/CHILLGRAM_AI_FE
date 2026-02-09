/**
 * 플랫폼 탭 버튼 컴포넌트
 */
export default function TabButton({
    active,
    activeClass,
    inactiveClass,
    onClick,
    icon,
    label,
    count,
}) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-3 font-bold text-sm border-b-2 transition-colors ${active ? activeClass : inactiveClass
                }`}
        >
            {icon} {label}{" "}
            <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                {Number(count || 0)}
            </span>
        </button>
    );
}
