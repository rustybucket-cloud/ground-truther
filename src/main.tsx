import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Classifier } from "./features/index.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: (req) => {
      console.log(req)
      return null
    },
    children: [{ path: "/classifier", element: <Classifier /> }],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
