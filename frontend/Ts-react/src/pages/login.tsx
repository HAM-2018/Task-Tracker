import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

export default function LoginPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
  e.preventDefault();
  setError("");

  try {
    const response = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("Login response:", data);

    const token = data?.data?.token;

    if (!response.ok || !token) {
      throw new Error(data.message || "Login failed");
    }

    localStorage.setItem("token", token);
    queryClient.clear();
    toast.success("Login Successful!");
// I hope this works (set delay for navigate to take effect)
    setTimeout(() => {
      console.log("Navigating to /");
      navigate("/");
    }, 100);
  } catch (error: any) {
    setError(error.message);
    console.error("Login error:", error.message);
  }
}


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="absolute top-12 text-center">
        <h1 className="text-4xl font-bold">TaskTracker Pro</h1>
      </div>

      <div className="w-full max-w-sm bg-gray-800 p-8 rounded-lg shadow-lg mt-24">
        <form onSubmit={handleLogin} className="space-y-4">
          <h2 className="text-2xl font-semibold text-center">Login</h2>

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button type="submit" className="w-full">
            Login
          </Button>

          <p className="text-sm text-center text-gray-300">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-400 hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
