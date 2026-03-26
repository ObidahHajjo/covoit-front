import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";
import PermissionRoute from "./PermissionRoute";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage";
import CompleteProfilePage from "../pages/Person/CompleteProfilePage";
import HomePage from "../pages/HomePage";
import FindTripPage from "../pages/Trips/FindTripPage";
import TripResultsPage from "../pages/Trips/TripResultsPage";
import TripDetailsPage from "../pages/Trips/TripDetailsPage";
import ContactDriverPage from "../pages/Trips/ContactDriverPage";
import ContactDriverEmailPage from "../pages/Trips/ContactDriverEmailPage";
import MyTripsPage from "../pages/DriverTrips/MyTripsPage";
import PublishTripPage from "../pages/DriverTrips/PublishTripPage";
import DriverTripDetailsPage from "../pages/DriverTrips/DriverTripDetailsPage";
import ContactPassengerPage from "../pages/DriverTrips/ContactPassengerPage";
import ContactPassengerEmailPage from "../pages/DriverTrips/ContactPassengerEmailPage";
import MyBookingsPage from "../pages/Bookings/MyBookingsPage";
import BookingDetailsPage from "../pages/Bookings/BookingDetailsPage";
import MyAccountPage from "../pages/Account/MyAccountPage";
import ChatInboxPage from "../pages/Chat/ChatInboxPage";
import ChatConversationPage from "../pages/Chat/ChatConversationPage";
import LandingPage from "../pages/LandingPage";
import Landing3DPage from "../pages/Landing3DPage";
import SupportPage from "../pages/SupportPage";
import AdminRoute from "./AdminRoute";
import AdminLayout from "../components/layout/AdminLayout";
import AdminDashboardPage from "../pages/Admin/AdminDashboardPage";
import AdminUsersPage from "../pages/Admin/AdminUsersPage";
import AdminTripsPage from "../pages/Admin/AdminTripsPage";
import AdminBrandsPage from "../pages/Admin/AdminBrandsPage";
import AdminModelsPage from "../pages/Admin/AdminModelsPage";
import AdminCarsPage from "../pages/Admin/AdminCarsPage";
import AdminSupportInboxPage from "../pages/Admin/AdminSupportInboxPage";
import AdminSupportChatPage from "../pages/Admin/AdminSupportChatPage";

/**
 * Declares the application's public, protected, and permission-based routes.
 *
 * @returns The browser router and route tree for the application.
 */
export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/3d" element={<Landing3DPage />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        <Route path="/complete-profile" element={<CompleteProfilePage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/find-trip" element={<FindTripPage />} />
          <Route path="/chat" element={<ChatInboxPage />} />
          <Route path="/chat/:conversationId" element={<ChatConversationPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/find-trip/results" element={<TripResultsPage />} />
          <Route path="/trips/:tripId" element={<TripDetailsPage />} />
          <Route path="/trips/:tripId/contact-driver" element={<ContactDriverPage />} />
          <Route path="/trips/:tripId/contact-driver-email" element={<ContactDriverEmailPage />} />

          <Route element={<PermissionRoute permission="can_manage_own_trips" />}>
            <Route path="/my-trips" element={<MyTripsPage />} />
            <Route path="/my-trips/new" element={<PublishTripPage />} />
            <Route path="/my-trips/:tripId" element={<DriverTripDetailsPage />} />
            <Route
              path="/my-trips/:tripId/contact-passenger/:passengerId"
              element={<ContactPassengerPage />}
            />
            <Route
              path="/my-trips/:tripId/contact-passenger/:passengerId/email"
              element={<ContactPassengerEmailPage />}
            />
          </Route>

          <Route element={<PermissionRoute permission="can_view_bookings" />}>
            <Route path="/bookings" element={<MyBookingsPage />} />
            <Route path="/bookings/:tripId" element={<BookingDetailsPage />} />
          </Route>

          <Route element={<PermissionRoute permission="can_edit_profile" />}>
            <Route path="/my-account" element={<MyAccountPage />} />
          </Route>
        </Route>

        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/trips" element={<AdminTripsPage />} />
            <Route path="/admin/brands" element={<AdminBrandsPage />} />
            <Route path="/admin/models" element={<AdminModelsPage />} />
            <Route path="/admin/cars" element={<AdminCarsPage />} />
            <Route path="/admin/support" element={<AdminSupportInboxPage />} />
            <Route path="/admin/support/:sessionId" element={<AdminSupportChatPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
