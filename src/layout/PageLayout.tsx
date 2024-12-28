import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const PageLayout = () => {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </>
  );
};

export default PageLayout;
