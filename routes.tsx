import { createBrowserRouter } from "react-router";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Book from "../pages/Book";
import Vehicles from "../pages/Vehicles";
import Track from "../pages/Track";
import Safety from "../pages/Safety";
import Kiosk from "../pages/Kiosk";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "book", Component: Book },
      { path: "vehicles", Component: Vehicles },
      { path: "track", Component: Track },
      { path: "safety", Component: Safety },
      { path: "kiosk", Component: Kiosk },
    ],
  },
]);
