const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-w-screen flex h-full min-h-screen flex-col items-center justify-center">
      {children}
    </div>
  );
};

export default Layout;
