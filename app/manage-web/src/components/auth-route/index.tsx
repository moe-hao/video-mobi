import { useAuthCheck } from "@app/manage-web/hooks/user";

interface AuthRouteProps {
  children: React.ReactNode;
}

export default function AuthRoute({ children }: AuthRouteProps) {
  useAuthCheck();
  return <>{children}</>;
}

