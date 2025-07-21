import { useState } from "react";
import { apiFetch } from "@/lib/api";


export interface User {
  _id: string;     
  username: string;
  email: string;
}

export interface UserConnection {
  _id: string;
  user: User;
  status: "pending" | "accepted";
  initiatedBy: string;
}

export function useConnections() {
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [connections, setConnections] = useState<UserConnection[]>([]);

  const searchUsers = async (query: string) => {
    setLoading(true);
    try {
      const res = await apiFetch(`/auth/users?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSearchResults(data.data ?? []);  //backend returns an array of users
    } catch (error) {
      console.error("Search users failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const addConnection = async (userId: string) => {
    try {
      const res = await apiFetch(`/auth/users/${userId}/connections`, {
        method: "POST",
      });
      if (res.ok) {
        await loadConnections();
        alert("Connection added!");
      } else {
        const data = await res.json();
        alert(data.message || "Failed to add connection");
      }
    } catch (error) {
      console.error("Add connection failed:", error);
    }
  };
  const loadConnections = async () => {
  const res = await apiFetch(`/auth/me/connections`);
  const data = await res.json();
  console.log("✅ Loaded connections:", data);
  setConnections(Array.isArray(data.data.data) ? data.data.data : []);  // always an array!
};

  const acceptConnection = async (userId: string) => {
    await apiFetch(`/auth/users/${userId}/connections/accept`, {
      method: "POST",
    })
    await loadConnections();
  };

   return {
    connections,
    searchResults,
    loadConnections,
    searchUsers,
    addConnection,
    acceptConnection,
    loading,
  };
}
