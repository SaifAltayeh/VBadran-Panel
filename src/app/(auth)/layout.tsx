import { AuthChrome } from "@/components/layout/auth-chrome";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthChrome>{children}</AuthChrome>;
}
