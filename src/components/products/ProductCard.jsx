import Card from "@/components/common/Card";

function StatusPill({ label = "진행 상태" }) {
    return (
        <span className="inline-flex items-center rounded-full bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700">
        {label}
        </span>
    );
}

function ProgressBar({ value = 70 }) {
    const safe = Math.max(0, Math.min(100, value));

    return (
        <div className="mt-2">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
            <span>진행률</span>
            <span>{safe} %</span>
        </div>

        <div className="h-3 w-full rounded-full bg-gray-200">
            <div className="h-3 rounded-full bg-gray-500" style={{ width: `${safe}%` }} />
        </div>
        </div>
    );
}

export default function ProductCard({ name, category, progress = 50 }) {
    return (
        <Card className="w-[520px] p-10">
        <StatusPill />

        <h3 className="mt-6 text-3xl font-extrabold text-[#3b312b]">{name}</h3>
        <p className="mt-3 text-lg text-gray-600">{category}</p>

        <ProgressBar value={progress} />

        <div className="mt-10 text-sm text-gray-500">생성 일시</div>
        </Card>
  );
}
