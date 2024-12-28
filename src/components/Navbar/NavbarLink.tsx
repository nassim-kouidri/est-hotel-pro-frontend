import { ReactNode } from "react";
import { Link } from "react-router-dom";

type NavbarLinkProps = {
  to: string;
  children: ReactNode;
};

const NavbarLink = ({ to, children }: NavbarLinkProps) => {
  return (
    <div
      style={{
        padding: "6px",
        borderRadius: "5px",
      }}
      className={`navbar-link`}
    >
      <Link style={{ padding: "8px" }} to={to}>
        {children}
      </Link>
    </div>
  );
};

export default NavbarLink;
