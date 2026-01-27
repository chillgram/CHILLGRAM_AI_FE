import { useMemo, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Field } from "@/components/common/Field";
import { SelectField } from "@/components/common/SelectField";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { ConsentSection } from "./ConsentSection";
import { isEmail, isPasswordOk, isPasswordMatch } from "@/utils/validators";
import { useFormField } from "@/hooks/useFormField";
import { fetchCompanies } from "@/services/api/companies";
import { signup } from "@/services/api/auth";

export function SignupForm() {
  const navigate = useNavigate();

  const company = useFormField("");
  const email = useFormField("");
  const name = useFormField("");
  const password = useFormField("");
  const passwordConfirm = useFormField("");

  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [privacyTouched, setPrivacyTouched] = useState(false);
  const [globalError, setGlobalError] = useState("");

  const {
    data: companies = [],
    isLoading: companiesLoading,
    isError: companiesIsError,
    error: companiesErrorObj,
  } = useQuery({
    queryKey: ["companies"],
    queryFn: fetchCompanies,
    staleTime: 10 * 60_000,
  });

  const companiesError = companiesIsError
    ? companiesErrorObj?.message ?? "회사 목록을 불러오지 못했습니다."
    : "";

  const errors = useMemo(() => {
    return {
      companyError: company.value ? null : "회사를 선택하세요.",
      nameError: name.value.trim() ? null : "이름은 필수입니다.",
      emailError: !email.value.trim() ? "이메일을 입력하세요." : !isEmail(email.value) ? "이메일 형식이 올바르지 않습니다." : null,
      passwordError: !password.value ? "비밀번호를 입력하세요." : !isPasswordOk(password.value) ? "비밀번호 규칙을 확인하세요." : null,
      passwordConfirmError: !passwordConfirm.value ? "비밀번호 확인을 입력하세요." : !isPasswordMatch(password.value, passwordConfirm.value) ? "비밀번호가 일치하지 않습니다." : null,
      consentError: privacyConsent ? null : "개인정보 수집·이용 동의는 필수입니다.",
    };
  }, [
    company.value,
    name.value,
    email.value,
    password.value,
    passwordConfirm.value,
    privacyConsent,
  ]);

  const canSubmit = useMemo(() => {
    return Object.values(errors).every((e) => !e) && !companiesLoading && !companiesError;
  }, [errors, companiesLoading, companiesError]);

  const touchAll = () => {
    company.setTouched(true);
    email.setTouched(true);
    name.setTouched(true);
    password.setTouched(true);
    passwordConfirm.setTouched(true);
    setPrivacyTouched(true);
  };

  const buildPayload = () => ({
    companyId: Number(company.value),
    email: email.value.trim(),
    name: name.value.trim(),
    password: password.value,
    privacyConsent,
  });

  const signupMutation = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      // 성공 페이지 이동
      navigate("/signup/sent", { state: { message: data?.message } });
    },
    onError: (err) => {
      setGlobalError(err?.response?.data?.message ?? err?.message ?? "회원가입에 실패했습니다.");
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setGlobalError("");
    touchAll();

    if (!canSubmit) return;

    const companyId = Number(company.value);
    if (!Number.isFinite(companyId) || companyId <= 0) return;

    signupMutation.mutate(buildPayload());
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="mt-12 space-y-10">
        <SelectField
          label="회사"
          required
          value={company.value}
          onChange={company.onChange}
          options={companies.map((c) => ({
            value: String(c.companyId),
            label: c.name,
          }))}
          placeholder={companiesLoading ? "회사 목록 로딩 중..." : "회사를 선택하세요"}
          touched={company.touched}
          error={company.touched ? errors.companyError : null}
          disabled={companiesLoading || !!companiesError}
        />

        {companiesError && (
          <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{companiesError}</p>
        )}

        <Field
          label="이메일"
          required
          value={email.value}
          onChange={email.onChange}
          touched={email.touched}
          error={email.touched ? errors.emailError : null}
          placeholder="example@email.com"
        />

        <Field
          label="이름"
          required
          value={name.value}
          onChange={name.onChange}
          touched={name.touched}
          error={name.touched ? errors.nameError : null}
        />

        <div className="space-y-3">
          <Field
            label="비밀번호"
            required
            type="password"
            value={password.value}
            onChange={password.onChange}
            touched={password.touched}
            error={password.touched ? errors.passwordError : null}
          />
          <p className="text-sm text-black/60">
            비밀번호는 최소 8자 이상이며, 영문/숫자/특수문자 조합을 권장합니다.
          </p>
        </div>

        <Field
          label="비밀번호 확인"
          required
          type="password"
          value={passwordConfirm.value}
          onChange={passwordConfirm.onChange}
          touched={passwordConfirm.touched}
          error={passwordConfirm.touched ? errors.passwordConfirmError : null}
        />

        <div
          className={[
            "rounded-lg p-4",
            privacyTouched && errors.consentError ? "bg-red-50" : "bg-gray-50",
          ].join(" ")}
        >
          <ConsentSection
            value={privacyConsent}
            onChange={(checked) => {
              setPrivacyConsent(checked);
              setPrivacyTouched(true);
            }}
          />
          {privacyTouched && errors.consentError && (
            <p className="mt-2 text-sm font-medium text-red-600">{errors.consentError}</p>
          )}
        </div>

        {globalError && (
          <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{globalError}</p>
        )}
      </div>

      <PrimaryButton type="submit" disabled={!canSubmit || signupMutation.isPending}>
        {signupMutation.isPending ? "처리 중..." : "회원가입"}
      </PrimaryButton>
    </form>
  );
}
