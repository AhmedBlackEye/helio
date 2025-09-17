import DashboardSidebar from "@/components/dashboard/sidebar";
import { AuthGuard } from "@/modules/auth/ui/components/auth-guard";
import OrgGuard from "@/modules/auth/ui/components/org-guard";
import { SidebarProvider } from "@workspace/ui/components/sidebar";
import { cookies } from "next/headers";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value == "true";
  return (
    <AuthGuard>
      <OrgGuard>
        <SidebarProvider defaultOpen={defaultOpen}>
          <DashboardSidebar />
          <main className="flex flex-1 flex-col">{children}</main>
        </SidebarProvider>
      </OrgGuard>
    </AuthGuard>
  );
};

export default Layout;
