import {jwtDecode} from "jwt-decode";

interface JWTPayload {
  exp: number;
}

export async function fetchWithAuth(input: RequestInfo, init: RequestInit = {}) {
  const token = localStorage.getItem("token");

  if (!token) {
    redirectToLogin();
    return Promise.reject(new Error("No token found"));
  }

  try {
    const { exp } = jwtDecode<JWTPayload>(token);
    if (exp < Date.now() / 1000) {
      redirectToLogin();
      return Promise.reject(new Error("Token expired"));
    }
  } catch {
    redirectToLogin();
    return Promise.reject(new Error("Token invalid"));
  }

  const headers: HeadersInit = {
    ...init.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  console.log("Sending request to :", input);

  return fetch(input, {
    ...init,
    headers,
  });
}

function redirectToLogin() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}
