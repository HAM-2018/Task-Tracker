import { createBrowserRouter, Navigate } from "react-router-dom";
import { Tasks } from "./pages/tasks";
import LoginPage  from "./pages/login";
import { ProtectedRoute } from "./components/protected.routes";
import SignUpPage from "./pages/signUp";
import { Logout } from "./components/logout/logout";



export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/signup",
        element: <SignUpPage />,
    },

    {
        path: "/",
        element: (
            <ProtectedRoute>
                <Tasks />
            </ProtectedRoute>
        ),
    },

    {
        path: "/logout",
        element: <Logout />,
    },
    {
        path: "*",
        element: <Navigate to="/login" replace />
    }
]);