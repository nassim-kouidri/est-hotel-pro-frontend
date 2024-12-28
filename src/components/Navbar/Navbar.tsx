import { Avatar, Text } from "@chakra-ui/react";
import NavbarLink from "./NavbarLink";
import logo from "../../assets/logo-est-hotel-pro.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth";
import { ADMIN_ROLE } from "../../data/constants";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const navigateToHome = () => {
    navigate("/");
  };

  return (
    <div
      style={{
        width: "100%",
        height: "3.3rem",
        borderBottom: "1px solid #eee",
        padding: "0 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          height: "100%",
          gap: "10px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          className="navlink-logo-ehp"
          style={{ display: "flex", alignItems: "center" }}
          onClick={navigateToHome}
        >
          <img src={logo} alt="Site Logo" style={{ height: "3.6rem" }} />
          <Text fontSize={"2xl"}>{"Est Hotel Pro"}</Text>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <NavbarLink to={"/reservation"}>{"Réservation"}</NavbarLink>
          <NavbarLink to={"/hotelRoom"}>{"Chambre"}</NavbarLink>
          <NavbarLink to={"/statistic"}>{"Statistique"}</NavbarLink>
          {user?.accountResponse.role === ADMIN_ROLE && (
            <NavbarLink to={"/administration"}>{"Administration"}</NavbarLink>
          )}
          {user ? (
            <NavbarLink to={"/account"}>
              <Avatar size="sm" name={user?.accountResponse.firstName} />
            </NavbarLink>
          ) : (
            <NavbarLink to={"/login"}>{"Connexion"}</NavbarLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
