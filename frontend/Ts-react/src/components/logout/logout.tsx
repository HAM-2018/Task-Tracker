import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const Logout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [shouldLogout, setShouldLogout] = useState(false); 

  useEffect(() => {
    if (shouldLogout) {
      localStorage.removeItem("token");
      queryClient.clear(); // clear queried task for next users login
      toast("Logout successful, goodbye!");

      const timer = setTimeout(() => {
        navigate("/login");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [shouldLogout, navigate]);

  return (
    <div>
      <Button variant="outline" onClick={() => setShouldLogout(true)}>
        Logout
      </Button>
    </div>
  );
};
