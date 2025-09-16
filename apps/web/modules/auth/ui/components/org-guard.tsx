"use client";

import { useOrganization } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const OrgGuard = ({ children }: { children: React.ReactNode }) => {
  const { organization } = useOrganization();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!organization) {
      const redirectUrl = encodeURIComponent(pathname);
      const newUrl = `/org-selection?redirect_url=${redirectUrl}`;
      router.push(newUrl);
    }
  }, [organization, router, pathname]);
  return organization && children;
};

export default OrgGuard;
