import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});

/* ─── Interceptors ──────────────────────────────────────── */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const detail = err.response?.data?.detail;
    if (detail) {
      const message = Array.isArray(detail)
        ? detail.map((d) => d.msg || JSON.stringify(d)).join("; ")
        : String(detail);
      return Promise.reject(new Error(message));
    }
    return Promise.reject(err);
  }
);

/* ─── Endpoints ─────────────────────────────────────────── */
export async function predictAttrition(payload) {
  const { data } = await api.post("/predict", payload);
  return data;
}

export async function getHealth() {
  const { data } = await api.get("/health");
  return data;
}
