import { OrganizationList } from "@clerk/nextjs";

const Page = () => {
  return (
    <OrganizationList
      afterCreateOrganizationUrl="/"
      afterSelectOrganizationUrl="/"
      hidePersonal
      skipInvitationScreen
    />
  );
};

export default Page;
