import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/pages/Home";
import { Laws } from "./components/pages/Laws";
import { AIConsultant } from "./components/pages/AIConsultant";
import { Templates } from "./components/pages/Templates";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "laws", Component: Laws },
      { path: "ai-consultant", Component: AIConsultant },
      { path: "templates", Component: Templates },
    ],
  },
]);
