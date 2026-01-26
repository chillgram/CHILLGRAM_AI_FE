import PolicyLayout from "@/components/layout/PolicyLayout";

export default function PrivacyConsentPage() {
  const sections = [
    {
      id: "필수 수집 이용 동의",
      toc: "필수 동의",
      heading: "[필수] 개인정보 수집·이용 동의",
      body: (
        <>
          <p>회원가입을 위해 아래와 같이 개인정보를 수집·이용합니다.</p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>구분</th>
                  <th>내용</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>수집·이용 목적</td>
                  <td>회원 가입, 계정 관리, 서비스 제공</td>
                </tr>
                <tr>
                  <td>수집 항목</td>
                  <td>이메일, 비밀번호, 이름/닉네임</td>
                </tr>
                <tr>
                  <td>보유·이용 기간</td>
                  <td>회원 탈퇴 시까지(또는 목적 달성 시까지)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600">
            동의 거부 권리가 있으나, 거부 시 회원가입이 제한됩니다.
          </p>
        </>
      ),
    },
    {
      id: "선택 수집 이용 동의",
      toc: "선택 동의",
      heading: "[선택] 개인정보 수집·이용 동의",
      body: (
        <>
          <p>선택 정보는 입력하는 경우에만 수집·이용됩니다.</p>
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>구분</th>
                  <th>내용</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>수집·이용 목적</td>
                  <td>프로필 구성, 사용자 경험 개선</td>
                </tr>
                <tr>
                  <td>수집 항목</td>
                  <td>프로필 이미지</td>
                </tr>
                <tr>
                  <td>보유·이용 기간</td>
                  <td>회원 탈퇴 시 또는 삭제 요청 시까지</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ),
    },
  ];

  return (
    <PolicyLayout
      title="개인정보 수집·이용 동의"
      updatedAt="2026-01-26"
      sections={sections}
    />
  );
}
