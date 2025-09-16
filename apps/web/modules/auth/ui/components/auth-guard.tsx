"use client";

import { useEffect } from "react";
import { useConvexAuth } from "convex/react";
import { AuthLayout } from "../layouts/layouts";
import { usePathname, useRouter } from "next/navigation";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirectUrl = encodeURIComponent(pathname);
      const newUrl = `${process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}?redirect_url=${redirectUrl}`;
      router.push(newUrl);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  if (isLoading) {
    return (
      <AuthLayout>
        <p>Loading...</p>
      </AuthLayout>
    );
  }

  return isAuthenticated && children;
};
