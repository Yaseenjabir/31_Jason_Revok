import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainComp from "./_components/Main/Main.jsx";
import Spirographs from "./_components/Main/Spirograph/Spirographs.jsx";
import InstrumentFrameDrags from "./_components/Main/InstrumentFrameDrags/InstrumentFrameDrags.jsx";
import TapeLoops from "./_components/Main/TapeLoops/TapeLoops.jsx";
import SelfPortrait from "./_components/Main/SelfPortrait/SelfPortrait.jsx";
import Objects from "./_components/Main/Objects/Objects.jsx";
import { ContextProvider } from "../context-Api/ContextAPI.jsx";
import Profile from "./_components/Main/Profile/Profile.jsx";
import Category from "./_components/Main/Category/Category.jsx";
import Admin from "./_components/Admin/Admin.jsx";
import Login from "./_components/Admin/login/Login.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ContextProvider>
        <App />
      </ContextProvider>
    ),
    children: [
      { path: "/", element: <MainComp /> },
      { path: "/profile", element: <Profile /> },
      { path: "/:category", element: <Category /> },
    ],
  },
  { path: "/login", element: <Login /> },
  {
    path: "/admin",
    element: <Admin />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
