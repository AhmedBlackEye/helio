import Image from "next/image";

const ConversationsPage = () => {
  return (
    <div className="bg-muted flex h-full flex-1 flex-col gap-y-4">
      <div className="flex flex-1 items-center justify-center gap-x-2">
        <Image alt="Logo" height={40} width={40} src="/logo.svg" />
        <p className="text-lg font-semibold">Helio</p>
      </div>
    </div>
  );
};

export default ConversationsPage;
