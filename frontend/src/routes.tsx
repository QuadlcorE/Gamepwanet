import type { RouteObject } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Signup from "./pages/Signup";
import TestScreen from "./pages/3dtest";

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
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/test",
    Component: TestScreen,
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
];
