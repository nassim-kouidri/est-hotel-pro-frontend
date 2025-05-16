import * as React from "react";

type PageContainerProps = {
  children: React.ReactNode;
};

const PageContainer = ({ children }: PageContainerProps) => {
  return (
    <div
      style={{
        maxWidth: "1500px",
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
