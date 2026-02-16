import { httpForm, httpJson } from "./http";

/**
 * 트렌드 분석
 */
export async function fetchAdTrends({ productId, date }) {
  const body = date ? { date } : {};
  return httpJson(`/api/products/${productId}/ad-trends`, {
    method: "POST",
    body,
  });
}

/**
 * 가이드 생성
 */
export function fetchAdGuides(payload) {
  return httpJson(`/api/products/${payload.productId}/ad-guides`, {
    method: "POST",
    body: payload,
  });
}

/**
 * 문구 생성
 */
export function fetchAdCopies(payload) {
  return httpJson(`/api/products/${payload.productId}/ad-copies`, {
    method: "POST",
    body: payload,
  });
}

/**
 * 최종 광고 생성
 */
export async function createAdContents(formData) {
  const res = await fetch(`/api/products/ads`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "create failed");
    throw new Error(msg);
  }
  return res.json();
}

/**
 * ✅ BASIC 잡 생성 (multipart)
 * POST /api/projects/basic-images
 * returns: { jobId }
 */
export async function createBasicImageJob({ payload, file, baseFile }) {
  const form = new FormData();
  form.append("payload", JSON.stringify(payload));
  form.append("file", file);
  if (baseFile) {
    form.append("base_file", baseFile);
  }

  // NOTE: /api/jobs/basic-images 대신 /api/projects/{projectId}/basic-images 사용
  // 그래야 projectId가 job_task 테이블에 제대로 들어가고 payload(conceptUrl 등)가 보존됨
  return httpForm(`/api/projects/${payload.projectId}/basic-images`, {
    method: "POST",
    formData: form,
  });
}

/**
 * ✅ 잡 조회
 * GET /api/jobs/{jobId}
 */
export async function fetchJob(jobId) {
  return httpJson(`/api/jobs/${jobId}`, { method: "GET" });
}

/**
 * ✅ BASIC 결과(manifest) 조회
 * - job.outputUri = public url (manifest.json)
 */
export async function fetchBasicImageResult(jobId) {
  const job = await fetchJob(jobId);
  if (!job?.outputUri) throw new Error("outputUri가 없습니다.");

  const res = await fetch(job.outputUri);
  if (!res.ok)
    throw new Error(await res.text().catch(() => "manifest fetch failed"));
  return res.json();
}
