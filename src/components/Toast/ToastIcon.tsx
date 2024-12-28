import {
  CheckCircleIcon,
  InfoOutlineIcon,
  WarningIcon,
} from "@chakra-ui/icons";
import { ToastState } from "./Toast";

type ToastIconProps = {
  state: ToastState;
};

const ToastIcon = ({ state }: ToastIconProps) => {
  switch (state) {
    case "SUCCESS":
      return <CheckCircleIcon color={"green.600"} boxSize={4} />;
    case "ERROR":
      return <WarningIcon color={"red.500"} />;
    case "INFO":
      return <InfoOutlineIcon color={"blue.600"} />;
    default:
      return null;
  }
};

export default ToastIcon;
