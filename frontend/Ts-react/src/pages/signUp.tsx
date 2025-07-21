import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();

  function passwordStrength(password: string): number {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  }

  const passwordStrengthLabel = (score: number): string => {
    switch (score) {
      case 0:
      case 1:
        return "Weak";
      case 2: 
        return "Medium";
      case 3:
      case 4:
        return "Strong";
      default:
        return "";
    }
  }

  async function handleSignup(e: React.FormEvent) {
  e.preventDefault();
  setErrors({}); // Clear previous errors
  setPasswordError("");

  if (password !== confirmPassword) {
    setPasswordError("Passwords must match");
    return;
  }

  try {
    const response = await fetch("http://localhost:3001/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, username }),
    });

    const data = await response.json(); //confirmvalid JSON

    if (!response.ok) {
      const newErrors: Record<string, string> = {};
      const errorsArray = data.errors || data.error?.errors;

      if (errorsArray && Array.isArray(errorsArray)) {
        errorsArray.forEach((err: { msg: string; param: string }) => {
          if (err.param) {
            newErrors[err.param] = err.msg;
          } else {
            newErrors.form = err.msg || "Something went wrong.";
          }
        });
      } else if (data.message) {
        newErrors.form = data.message;
      }

      setErrors(newErrors);
      console.log("New Errors State:", newErrors); 
      return;
    }

    // Success — navigate to login
    navigate("/login");
  } catch (error) {
    console.error("Signup error:", error);
  }
}


return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-sm bg-gray-800 p-8 rounded-lg shadow-lg mt-24">
        <form onSubmit={handleSignup} className="space-y-4">
          <h2 className="text-2xl font-semibold text-center">Sign Up</h2>

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && (
            <p className="text-red-400 text-sm">{errors.email}</p>
          )}
          {/*username*/}
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            />
            {errors.username && (
              <p className="text-red-400 text-sm">{errors.username}</p>
            )}

          {/* Password Field */}
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && (
            <p className="text-red-400 text-sm">{errors.password}</p>
          )}

          {/* Password Strength Meter */}
          {password && (
          <div className="mt-2">
            <div className="h-2 rounded bg-gray-300">
              <div
                style={{
                  width: `${(passwordStrength(password) / 4) * 100}%`,
                  backgroundColor: passwordStrength(password) <= 1
                    ? "red"
                    : passwordStrength(password) === 2
                    ? "orange"
                    : "green",
                }}
                className="h-2 rounded"
              />
            </div>
            {password && (
              <p
                className="text-sm mt-1"
                style={{
                  color:
                    passwordStrength(password) <= 1
                      ? "red"
                      : passwordStrength(password) === 2
                      ? "orange"
                      : "green",
                }}
              >
                {passwordStrengthLabel(passwordStrength(password))}
              </p>
            )}
          </div>
          )}
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {passwordError && (
            <p className="text-red-400 text-sm">{passwordError}</p>
          )}

          {/*Form-wide Errors*/}
          {errors.form && (
            <p className="text-red-400 text-sm text-center">{errors.form}</p>
          )}

          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
      </div>
    </div>
  );
}