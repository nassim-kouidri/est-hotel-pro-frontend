import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { FieldError } from "react-hook-form";

type FormControlProps = {
  label: string;
  children: React.ReactNode;
  isRequired?: boolean;
  errorField?: FieldError;
};

const CustomFormControl = ({
  label,
  children,
  isRequired,
  errorField,
}: FormControlProps) => {
  return (
    <FormControl isInvalid={!!errorField} isRequired={isRequired}>
      <FormLabel>{label}</FormLabel>
      {children}
      <FormErrorMessage style={{ fontWeight: "600" }}>
        {errorField && errorField.message}
      </FormErrorMessage>
    </FormControl>
  );
};

export default CustomFormControl;
