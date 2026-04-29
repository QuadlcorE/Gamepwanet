import env from "../config/env";
import { clearSession, getStoredToken } from "./auth";

export type UserProfile = {
  favorite_ids: number[];
  wishlist_ids: number[];
};

export async function getUserProfile(): Promise<UserProfile> {
  if (!env.backendBaseUrl) {
    throw new Error("Backend URL is missing. Set VITE_BACKEND_URL.");
  }

  const token = getStoredToken();
  if (!token) {
    throw new Error("You need to sign in to view your profile.");
  }

  const response = await fetch(`${env.backendBaseUrl}/user/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    clearSession();
    throw new Error("Your session has expired. Please sign in again.");
  }

  if (!response.ok) {
    throw new Error("Unable to load your profile right now.");
  }

  return response.json() as Promise<UserProfile>;
}
