import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Container from "../components/common/Container";
import Card from "../components/common/Card";
import ErrorMessage from "../components/common/ErrorMessage";
import { useFetchText } from "../hooks/useFetchText";

export default function HomePage() {
  // const { data, loading, error } = useFetchText("/api/users/hello");
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["hello"],
    queryFn: fetchHello,
  });

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-3xl font-bold">메인 페이지</h1>

      <div className="mt-6 rounded-xl border p-4">
        {isLoading ? (
          <div>로딩 중...</div>
        ) : error ? (
          <div className="text-red-600">{error.message}</div>
        ) : (
          <div className="text-xl font-semibold">{data}</div>
        )}

        <button
          className="mt-4 rounded-lg bg-black px-4 py-2 text-white"
          onClick={() => refetch()}
        >
          다시 불러오기
        </button>
      </div>
    </main>
  );
}