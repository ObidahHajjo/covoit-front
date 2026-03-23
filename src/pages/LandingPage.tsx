import { isProfileComplete } from "../auth/profileCompletion";
import { LandingSection } from "../components/ui/LandingSection";
import { useAuth } from "../hooks/Auth/useAuth";

/**
 * Render the public landing page shown before users enter the protected app shell.
 *
 * @returns The landing page content.
 */
export default function LandingPage() {
  const { status, user } = useAuth();

  return (
    <LandingSection
      user={user}
      isAuthenticated={status === "authenticated"}
      isProfileComplete={isProfileComplete(user)}
    />
  );
}
