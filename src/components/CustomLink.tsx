import { Link as LinkFromChakra } from "@chakra-ui/react";
import { Link } from "react-router-dom";

type CustomLinkProps = {
  to: string;
  label: string;
};

const CustomLink = ({ to, label }: CustomLinkProps) => {
  return (
    <Link to={to}>
      <LinkFromChakra>{label}</LinkFromChakra>
    </Link>
  );
};

export default CustomLink;
