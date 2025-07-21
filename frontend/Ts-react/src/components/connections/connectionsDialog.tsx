"use client";

import { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useConnections } from "@/hooks/useConnections";
import { toast } from "sonner";

export const ConnectionsDialog = () => {
  const [query, setQuery] = useState("");
  const {
    searchResults,
    searchUsers,
    addConnection,
    connections,
    loadConnections,
    acceptConnection,
    loading,
  } = useConnections();

  useEffect(() => {
    loadConnections();
  }, []);

  const handleSearch = () => {
    if (query.trim() !== "") {
      searchUsers(query);
    }
  };

  const rawToken = localStorage.getItem("token");
  const currentUserId = rawToken
    ? JSON.parse(atob(rawToken.split(".")[1])).userId
    : null;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Find Teammates</h2>

      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Search by username or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      <div className="space-y-2 mb-6">
        {searchResults.length === 0 && !loading && (
          <p className="text-sm text-gray-500">No results yet.</p>
        )}

        {searchResults.map((user) => {
          const existingConnection = connections.find(
            (c) => c.user._id === user._id
          );

          const isPending = existingConnection?.status === "pending";
          const isAccepted = existingConnection?.status === "accepted";

          return (
            <div
              key={user._id}
              className="flex justify-between items-center border px-3 py-2 rounded"
            >
              <span>
                {user.username} ({user.email})
              </span>

              {isAccepted ? (
                <span className="text-green-500 text-sm">Connected</span>
              ) : isPending ? (
                <span className="text-yellow-500 text-sm">Invite Sent</span>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={async () => {
                    await addConnection(user._id);
                    toast.success(`Invite sent to ${user.username}!`);
                    await loadConnections();
                  }}
                >
                  Add
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <h3 className="font-semibold">Connections</h3>
      <div className="space-y-2 mb-4">
        {connections.filter((c) => c.status === "accepted").length === 0 && (
          <p className="text-sm text-gray-500">No connections yet.</p>
        )}
        {connections
          .filter((c) => c.status === "accepted")
          .map((c) => (
            <div
              key={c._id || c.user?._id}
              className="flex justify-between items-center border px-3 py-2 rounded"
            >
              <span>
                {c.user?.username} ({c.user?.email})
              </span>
            </div>
          ))}
      </div>

      <h3 className="font-semibold">Pending Invites</h3>
      <div className="space-y-2">
        {connections.filter(
          (c) =>
            c.status === "pending" &&
            c.initiatedBy?.toString() !== currentUserId
        ).length === 0 && (
          <p className="text-sm text-gray-500">No pending invites.</p>
        )}

        {connections
          .filter(
            (c) =>
              c.status === "pending" &&
              c.initiatedBy?.toString() !== currentUserId
          )
          .map((c) => (
            <div
              key={c._id || c.user?._id}
              className="flex justify-between items-center border px-3 py-2 rounded"
            >
              <span>
                {c.user?.username} ({c.user?.email})
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => acceptConnection(c.user._id)}
              >
                Accept
              </Button>
            </div>
          ))}
      </div>

       {/* Debug display
      <pre className="text-xs mt-4 bg-gray-800 p-2 rounded overflow-x-auto">
        {JSON.stringify(connections, null, 2)}
      </pre>
      */}
    </div>
  );
};

