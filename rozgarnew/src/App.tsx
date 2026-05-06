import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import UserHome from "./pages/user/Home";
import Jobs from "./pages/user/Jobs";
import Performance from "./pages/user/Performance";
import Result from "./pages/user/Result";
import Profile from "./pages/user/Profile";
import Apply from "./pages/user/Apply";
import Exam from "./pages/user/Exam";
import AdminHome from "./pages/admin/Home";
import Works from "./pages/admin/Works";
import Applications from "./pages/admin/Applications";
import AdminProfile from "./pages/admin/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedOutlet = ({ role }: { role: "user" | "admin" }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  return <Outlet />;
};

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  {
    path: "/dashboard",
    element: <ProtectedOutlet role="user" />,
    children: [
      { index: true, element: <UserHome /> },
      { path: "jobs", element: <Jobs /> },
      { path: "performance", element: <Performance /> },
      { path: "result", element: <Result /> },
      { path: "profile", element: <Profile /> },
      { path: "apply/:id", element: <Apply /> },
      { path: "exam/:id", element: <Exam /> },
    ],
  },
  {
    path: "/admin",
    element: <ProtectedOutlet role="admin" />,
    children: [
      { index: true, element: <AdminHome /> },
      { path: "works", element: <Works /> },
      { path: "applications", element: <Applications /> },
      { path: "profile", element: <AdminProfile /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
