const API_BASE = "http://localhost:3000";

function getToken() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  return usuario?.token || null;
}

export async function apiFetch(path, options = {}) {
  const token = getToken();

  const headers = { ...options.headers };

  // So define Content-Type automaticamente se nao for FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const resposta = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (resposta.status === 401) {
    localStorage.removeItem("usuario");
    window.location.href = "/";
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  return resposta;
}
