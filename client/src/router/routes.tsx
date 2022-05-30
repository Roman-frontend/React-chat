import React, { ReactElement } from "react";
import { Routes, Route, RouteObject } from "react-router-dom";
import { RequireAuth } from "../components/Helpers/RequireAuth.jsx";
import SignUpPage from "../pages/SignUpPage/SignUpPage.js";
import { SignInPage } from "../pages/SignInPage/SignInPage.js";
import { Chat } from "../pages/Chat/Chat";
import MainVideoCall from "../pages/MainVideoRoom/MainVideoCall.jsx";
import Room from "../pages/Room/index.js";

export const routes: RouteObject[] = [
  {
    path: "/signIn",
    element: <SignInPage />,
  },
  {
    path: "/signUp",
    element: <SignUpPage />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/rooms",
    element: <MainVideoCall />,
  },
  {
    path: "/room/:id",
    element: <Room />,
  },
  {
    path: "/",
    element: <RequireAuth redirectTo="/chat" children={<SignInPage />} />,
  },
];

const createRoutes = () => {
  return routes.map((route: RouteObject) => {
    return <Route path={route.path} element={route.element} key={route.path} />;
  });
};

export function AppRoutes(): ReactElement {
  return <Routes>{createRoutes()}</Routes>;
}
