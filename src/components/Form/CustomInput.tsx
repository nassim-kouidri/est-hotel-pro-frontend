import { Input } from "@chakra-ui/react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

type CustomInputProps = {
  name: Path<FieldValues>;
  type: "text" | "number" | "email" | "password" | "date";
  register: UseFormRegister<any>;
  disabled?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
};

const CustomInput = ({
  name,
  type,
  register,
  disabled,
  placeholder,
  min,
  max,
}: CustomInputProps) => {
  return (
    <Input
      type={type}
      placeholder={placeholder}
      {...register(name)}
      min={min}
      max={max}
      focusBorderColor="primary.300"
      variant={"outline"}
      isDisabled={disabled}
    />
  );
};

export default CustomInput;
