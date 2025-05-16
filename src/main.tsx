import "./index.css";
import { createRoot } from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ErrorView from "./views/ErrorView.tsx";
import LoginView from "./views/LoginView.tsx";
import PageLayout from "./layout/PageLayout.tsx";
import ReservationView from "./views/Reservation/ReservationView.tsx";
import ReservationCreationView from "./views/Reservation/ReservationCreationView.tsx";
import HotelRoomView from "./views/HotelRoom/HotelRoomView.tsx";
import HotelRoomCreationView from "./views/HotelRoom/HotelRoomCreationView.tsx";
import { ToastContextProvider } from "./contexts/toast.tsx";
import { AuthProvider } from "./contexts/auth.tsx";
import PrivateRoute from "./components/Router/PrivateRoute.tsx";
import AccountView from "./views/AccountView.tsx";
import UnauthorizedView from "./views/UnauthorizedView.tsx";
import AdministrationView from "./views/AdministrationView.tsx";
import StatisticView from "./views/StatisticView.tsx";
import { setupAxiosInterceptors } from "./axiosConfig.ts";

// Set up axios interceptors for handling 403 errors
setupAxiosInterceptors();

const colors = {
  primary: {
    50: "#f1cd86",
    100: "#eec36e",
    200: "#ecb956",
    300: "#e9af3e",
    400: "#e6a526",
    500: "#e49b0e",
    600: "#cd8b0c",
    700: "#b67c0b",
    800: "#9f6c09",
    900: "#885d08",
  },
};

const theme = extendTheme({ colors });

const router = createBrowserRouter([
  {
    path: "/",
    element: <PageLayout />,
    errorElement: <ErrorView />,
    children: [
      {
        index: true,
        element: <Navigate to="/reservation" replace />,
      },
      {
        path: "reservation",
        element: (
          <PrivateRoute>
            <ReservationView />
          </PrivateRoute>
        ),
      },
      {
        path: "login",
        element: <LoginView />,
      },
      {
        path: "reservation/creation",
        element: (
          <PrivateRoute>
            <ReservationCreationView />
          </PrivateRoute>
        ),
      },
      {
        path: "hotelRoom",
        element: (
          <PrivateRoute>
            <HotelRoomView />
          </PrivateRoute>
        ),
      },
      {
        path: "hotelRoom/creation",
        element: (
          <PrivateRoute>
            <HotelRoomCreationView />
          </PrivateRoute>
        ),
      },
      {
        path: "statistic",
        element: (
          <PrivateRoute>
            <StatisticView />
          </PrivateRoute>
        ),
      },
      {
        path: "Account",
        element: (
          <PrivateRoute>
            <AccountView />
          </PrivateRoute>
        ),
      },
      {
        path: "administration",
        element: (
          <PrivateRoute>
            <AdministrationView />
          </PrivateRoute>
        ),
      },
      {
        path: "unauthorized",
        element: <UnauthorizedView />,
      },
      {
        path: "*",
        element: <ErrorView />,
      },
    ],
  },
]);
createRoot(document.getElementById("root")!).render(
  <ChakraProvider theme={theme}>
    <ToastContextProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ToastContextProvider>
  </ChakraProvider>
);
