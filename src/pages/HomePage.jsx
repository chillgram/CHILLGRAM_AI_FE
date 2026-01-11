import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Container from "../components/common/Container";
import Card from "../components/common/Card";
import ErrorMessage from "../components/common/ErrorMessage";
import { useFetchText } from "../hooks/useFetchText";

export default function HomePage() {
  const { data, loading, error } = useFetchText("/api/users/hello");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-10">
        <Container>
          <h1 className="text-3xl font-bold">메인 페이지</h1>

          <Card className="mt-6">
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="text-gray-600">로딩 중...</span>
              </div>
            ) : (
              <ErrorMessage message={error} />
            )}

            {!loading && !error ? (
              <div className="mt-2 text-xl font-semibold">{data}</div>
            ) : null}
          </Card>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
