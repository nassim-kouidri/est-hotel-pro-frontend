import { SmallCloseIcon } from "@chakra-ui/icons";
import { INFO } from "../../data/constants";
import ToastIcon from "./ToastIcon";

export type ToastState = "SUCCESS" | "ERROR" | "INFO";

type ToastProps = {
  content: string;
  state?: ToastState;
  duration?: number;
  onDismiss?: () => void;
};

const Toast = ({ content, state = INFO, onDismiss }: ToastProps) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        maxWidth: "36rem",
        padding: "0.5rem",
        marginBottom: "0.5rem",
        color: "#6b7280",
        backgroundColor: "white",
        borderRadius: "0.5rem",
        boxShadow:
          "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
      }}
      role="alert"
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          width: "2rem",
          height: "2rem",
        }}
      >
        <ToastIcon state={state} />
      </div>
      <div
        style={{
          margin: "0 0.75rem",
          fontSize: "0.875rem",
          fontWeight: "normal",
        }}
      >
        {content}
      </div>
      <button
        type="button"
        style={{
          marginLeft: "auto",
          backgroundColor: "white",
          color: "#9ca3af",
          borderRadius: "0.5rem",
          padding: "1rem",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          height: "1rem",
          width: "1rem",
        }}
        aria-label="Close"
        onClick={onDismiss}
      >
        <SmallCloseIcon />
      </button>
    </div>
  );
};

export default Toast;
