import App from "../App";
import { createBrowserRouter } from "react-router-dom";
import Home from "../components/Home/Home";
import Category from "../components/Category/Category";
import About from "../components/pages/About";
import Login from "../components/pages/Login";
import Thankyou from "../components/pages/Thankyou";
import Signup from "../components/pages/Signup";
import Profile from "../components/pages/Profile";
import ContactUs from "../components/pages/Contactus";
import Notification from "../components/pages/Notification";
import Cart from "../components/pages/Cart";
import Welcome from "../components/pages/Welcome";
import Loader from "../components/Loader/Loader";
import Allbooks from "../components/Category/Allbooks";
import ViewBookDetails from "../components/ViewBookDetails/ViewBookDetails";
import Terms from "../components/Profile/Terms";
import Privacy from "../components/Profile/privacy";
import Blog from "../components/Profile/Blog";
import Faq from "../components/Profile/Faq";
import BestAuthor from "../components/Profile/BestAuthor";
import Wishlist from "../components/Profile/Wishlist";
import EditProfile from "../components/Profile/EditProfile";
import Mainwishlist from "../components/pages/Mainwishlist";
import Favorite from "../components/pages/Wishlistmy";
import Buy from "../components/pages/Buy";
import Checkout from "../components/payment/Checkout";
import ResetPassword from "../components/pages/ResetPassword";
import PaymentSuccess from "../components/Payment/PaymentSuccess";
import AdminNavbar from "../components/Admin/AdminNav";
import AdminHome from "../components/Admin/AdminHome";
import AdminDashboard from "../components/Admin/AdminDashboard";
import DailyStats from "../components/Admin/Dashboard/DailyStats";
import UserActivity from "../components/Admin/Dashboard/UserActivity";
import BookAnalytics from "../components/Admin/Dashboard/BookAnalytics";
import MonthlyAnalytics from '../components/Admin/Dashboard/MonthlyStats';
import AdminBooks from "../components/Admin/EditBook";
import AddBook from "../components/Admin/Managebooks/AddBook";
import EditBook from "../components/Admin/Managebooks/EditBook";
import DeleteBook from "../components/Admin/Managebooks/DeleteBook";
import AdminUser from "../components/Admin/Edituser";
import AdminProfile from "../components/Admin/AdminProfile";
import AdminSettings from "../components/Admin/AdminSetting";

const API_URL = "http://localhost:1000";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/reset-password/:token",
        element: <ResetPassword />,
      },
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/category",
        element: <Category />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/thankyou",
        element: <Thankyou />,
      },
      {
        path: "/wishlist/:id",
        element: <Mainwishlist />,
      },
      {
        path: "/wishlist",
        element: <Favorite />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/contact-us",
        element: <ContactUs />,
      },
      {
        path: "/notification",
        element: <Notification />,
      },
      {
        path: "/addtocart",
        element: <Cart />,
      },
      {
        path: "/welcome",
        element: <Welcome />,
      },
      {
        path: "/allbooks",
        element: <Allbooks />,
      },
      {
        path: "/view-book-details/:id",
        element: <ViewBookDetails />,
      },
      {
        path: "/buy/:id",
        element: <Buy />,
      },
      {
        path: "/checkout",
        element: <Checkout />,
      },
      {
        path: "/payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "/profile",
        element: <Profile />,
        children: [
          {
            path: "/profile",
            element: <Wishlist />,
          },
          {
            path: "/profile/wishlist",
            element: <Wishlist />,
          },
          {
            path: "/profile/terms",
            element: <Terms />,
          },
          {
            path: "/profile/privacy-policy",
            element: <Privacy />,
          },
          {
            path: "/profile/blog",
            element: <Blog />,
          },
          {
            path: "/profile/best-author",
            element: <BestAuthor />,
          },
          {
            path: "/profile/faq",
            element: <Faq />,
          },
          {
            path: "/profile/edit-profile",
            element: <EditProfile />,
          },
        ],
      },
      {
        path: "/admin/home",
        element: <AdminHome />,
      },
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
        children: [
          {
            path: "/admin/dashboard/daily-stats",
            element: <DailyStats />,
          },
          {
            path: "/admin/dashboard/user-activity",
            element: <UserActivity />,
          },
          {
            path: "/admin/dashboard/book-analytics",
            element: <BookAnalytics />,
          },
          {
            path: "/admin/dashboard/Monthly-analytics",
            element: <MonthlyAnalytics />,
          },
        ],
      },
      {
        path: "/admin/books",
        element: <AdminBooks />,
        children: [
          {
            path: "/admin/books/add-book",
            element: <AddBook />,
          },
          {
            path: "/admin/books/edit-books",
            element: <EditBook />,
          },
          {
            path: "/admin/books/delete-book",
            element: <DeleteBook />,
          },
        ],
      },
      {
        path: "/admin/users",
        element: <AdminUser />,
      },
      {
        path: "/admin/profile",
        element: <AdminProfile />,
      },
      {
        path: "/admin/settings",
        element: <AdminSettings />,
      },
      {
        path: "/*",
        element: <div>404</div>,
      },
    ],
  },
]);

export default router;