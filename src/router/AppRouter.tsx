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
import MyTripsPage from "../pages/DriverTrips/MyTripsPage";
import PublishTripPage from "../pages/DriverTrips/PublishTripPage";
import DriverTripDetailsPage from "../pages/DriverTrips/DriverTripDetailsPage";
import ContactPassengerPage from "../pages/DriverTrips/ContactPassengerPage";
import MyBookingsPage from "../pages/Bookings/MyBookingsPage";
import BookingDetailsPage from "../pages/Bookings/BookingDetailsPage";
import MyAccountPage from "../pages/Account/MyAccountPage";
import ChatInboxPage from "../pages/Chat/ChatInboxPage";
import ChatConversationPage from "../pages/Chat/ChatConversationPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

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
          <Route path="/find-trip/results" element={<TripResultsPage />} />
          <Route path="/trips/:tripId" element={<TripDetailsPage />} />
          <Route path="/trips/:tripId/contact-driver" element={<ContactDriverPage />} />

          <Route element={<PermissionRoute permission="can_manage_own_trips" />}>
            <Route path="/my-trips" element={<MyTripsPage />} />
            <Route path="/my-trips/new" element={<PublishTripPage />} />
            <Route path="/my-trips/:tripId" element={<DriverTripDetailsPage />} />
            <Route
              path="/my-trips/:tripId/contact-passenger/:passengerId"
              element={<ContactPassengerPage />}
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
