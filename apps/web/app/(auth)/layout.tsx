import { AuthLayout } from "@/modules/auth/ui/layouts/layouts";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <AuthLayout>{children}</AuthLayout>;
};

export default Layout;
