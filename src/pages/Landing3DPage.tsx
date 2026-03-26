import { isProfileComplete } from "../auth/profileCompletion";
import { Landing3DSection } from "../components/ui/Landing3DSection";
import { useAuth } from "../hooks/Auth/useAuth";

export default function Landing3DPage() {
  const { status, user } = useAuth();

  return (
    <Landing3DSection
      user={user}
      isAuthenticated={status === "authenticated"}
      isProfileComplete={isProfileComplete(user)}
    />
  );
}
