import env from "../config/env";

export const AUTH_TOKEN_KEY = "gamepwanet.auth.token";
export const AUTH_EMAIL_KEY = "gamepwanet.auth.email";

export type LoginResponse = {
  access_token: string;
  token_type: string;
};

export function getStoredToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getStoredEmail(): string | null {
  return localStorage.getItem(AUTH_EMAIL_KEY);
}

export function isLoggedIn(): boolean {
  return Boolean(getStoredToken());
}

export function storeSession(token: string, email: string) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_EMAIL_KEY, email);
}

export function clearSession() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_EMAIL_KEY);
}

export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  if (!env.backendBaseUrl) {
    throw new Error("Backend URL is missing. Set VITE_BACKEND_URL.");
  }

  const formData = new URLSearchParams({
    username: email,
    password,
  });

  const response = await fetch(`${env.backendBaseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    throw new Error("Invalid email or password.");
  }

  return response.json() as Promise<LoginResponse>;
}

export async function signupUser(username: string, email: string, password: string) {
  if (!env.backendBaseUrl) {
    throw new Error("Backend URL is missing. Set VITE_BACKEND_URL.");
  }

  const response = await fetch(`${env.backendBaseUrl}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });

  if (!response.ok) {
    const fallbackMessage = "Unable to create your account.";
    const isJsonResponse = response.headers.get("content-type")?.includes("application/json");

    if (isJsonResponse) {
      const error = (await response.json()) as { detail?: string };
      throw new Error(error.detail || fallbackMessage);
    }

    throw new Error(fallbackMessage);
  }

  return response.json();
}
