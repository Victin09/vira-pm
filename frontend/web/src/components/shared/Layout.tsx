const Layout: React.FC = ({ children }) => {
  return (
    <div className="flex w-full h-full overflow-hidden bg-base-100 text-base-content">
      {children}
    </div>
  );
};

export default Layout;
