import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/Auth/LoginPage.tsx";
import RegisterPage from "../pages/Auth/RegisterPage.tsx";
import CompleteProfilePage from "../pages/Person/CompleteProfilePage.tsx";
import ForgotPasswordPage from "../pages/Auth/ForgotPasswordPage.tsx";
import ResetPasswordPage from "../pages/Auth/ResetPasswordPage.tsx";
import HomePage from "../pages/HomePage.tsx";
import FindTripPage from "../pages/Trips/FindTripPage.tsx";
import TripResultsPage from "../pages/Trips/TripResultsPage.tsx";
import TripDetailsPage from "../pages/Trips/TripDetailsPage.tsx";
import ContactDriverPage from "../pages/Trips/ContactDriverPage.tsx";
import MyBookingsPage from "../pages/Bookings/MyBookingsPage.tsx";
import BookingDetailsPage from "../pages/Bookings/BookingDetailsPage.tsx";
import MyTripsPage from "../pages/DriverTrips/MyTripsPage.tsx";
import PublishTripPage from "../pages/DriverTrips/PublishTripPage.tsx";
import DriverTripDetailsPage from "../pages/DriverTrips/DriverTripDetailsPage.tsx";
import ContactPassengerPage from "../pages/DriverTrips/ContactPassengerPage.tsx";
import MyAccountPage from "../pages/Account/MyAccountPage.tsx";
import ProtectedRoute from "./ProtectedRoute.tsx";
import PermissionRoute from "./PermissionRoute.tsx";
import GuestRoute from "./GuestRoute.tsx";

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>

                <Route element={<GuestRoute />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                </Route>

                <Route path="/complete-profile" element={<CompleteProfilePage />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/find-trip" element={<FindTripPage />} />
                    <Route path="/find-trip/results" element={<TripResultsPage />} />
                    <Route path="/trips/:tripId" element={<TripDetailsPage />} />
                    <Route path="/trips/:tripId/contact-driver" element={<ContactDriverPage />} />
                    <Route path="/my-account" element={<MyAccountPage />} />

                    <Route element={<PermissionRoute permission="can_view_bookings" />}>
                        <Route path="/bookings" element={<MyBookingsPage />} />
                        <Route path="/bookings/:tripId" element={<BookingDetailsPage />} />
                    </Route>

                    <Route element={<PermissionRoute permission="can_manage_own_trips" />}>
                        <Route path="/my-trips" element={<MyTripsPage />} />
                        <Route path="/my-trips/:tripId" element={<DriverTripDetailsPage />} />
                        <Route
                            path="/my-trips/:tripId/contact-passenger/:personId"
                            element={<ContactPassengerPage />}
                        />
                    </Route>
                    <Route element={<PermissionRoute permission="can_publish_trip" />}>
                        <Route path="/my-trips/new" element={<PublishTripPage />} />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </BrowserRouter>
    );
}