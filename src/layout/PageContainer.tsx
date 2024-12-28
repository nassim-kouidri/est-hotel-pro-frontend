type PageContainerProps = {
  children: React.ReactNode;
};

const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <div
      style={{
        maxWidth: "1300px",
        margin: "auto",
        paddingTop: "30px",
        paddingLeft: "10px",
        paddingRight: "10px",
      }}
    >
      {children}
    </div>
  );
};

export default PageContainer;
