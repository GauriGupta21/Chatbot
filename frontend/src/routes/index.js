import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import RegisterPages from "../pages/RegisterPages";
import CheckEmailPage from "../pages/CheckEmailPage";
import CheckPasswordPage from "../pages/CheckPasswordPage";
import MessagePage from "../components/MessagePage";
import Home from "../pages/Home";
import AuthLayouts from "../layout";
import ForgotPassword from "../pages/ForgotPassword";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "register",
        element: (
          <AuthLayouts>
            <RegisterPages />
          </AuthLayouts>
        ),
      },
      {
        path: "email",
        element: (
          <AuthLayouts>
            <CheckEmailPage />
          </AuthLayouts>
        ),
      },
      {
        path: "password",
        element: (
          <AuthLayouts>
            <CheckPasswordPage />
          </AuthLayouts>
        ),
      },
      {
        path: "forget-password",
        element: (
          <AuthLayouts>
            <ForgotPassword />
          </AuthLayouts>
        ),
      },
      {
        path: "",
        element: <Home />,
        children: [
          {
            path: ":userId",
            element: <MessagePage />,
          },
        ],
      },
    ],
  },
]);
export default router;
