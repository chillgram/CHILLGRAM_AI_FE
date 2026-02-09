import loadingGif from "@/assets/Loding.gif";

/**
 * 로딩 오버레이 컴포넌트
 * 광고 영상 생성 등 시간이 걸리는 작업 시 표시
 */
export default function LoadingOverlay({ message = "로딩 중입니다..." }) {
    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-50">
            <img
                src={loadingGif}
                alt="Loading..."
                className="w-40 h-40 mb-6"
                style={{ mixBlendMode: "screen" }} // 검은 배경 숨기기 (배경이 흰색이면 multiply로 변경)
            />
            <p className="text-white text-xl font-bold">{message}</p>
            <p className="text-gray-400 text-sm mt-2">잠시만 기다려주세요</p>
        </div>
    );
}
