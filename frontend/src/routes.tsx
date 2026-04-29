import type { RouteObject } from "react-router";
import { Navigate } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import GameDetailsPage from "./pages/GameDetails";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Signup from "./pages/Signup";

export const routes: RouteObject[] = [
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/games/:gameId",
    Component: GameDetailsPage,
  },
  {
    path: "/search",
    Component: Search,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    Component: ProtectedRoute,
    children: [
      {
        path: "/profile",
        Component: Profile,
      },
    ],
  },
  {
    path: "/404",
    Component: NotFound,
  },
  {
    path: "*",
    element: <Navigate to="/404" replace />,
  },
];
