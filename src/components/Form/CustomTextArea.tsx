import { Textarea } from "@chakra-ui/react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

type CustomInputProps = {
  name: Path<FieldValues>;
  register: UseFormRegister<any>;
  placeholder?: string;
};

const CustomTextArea = ({ name, register, placeholder }: CustomInputProps) => {
  return (
    <Textarea
      placeholder={placeholder}
      {...register(name)}
      focusBorderColor="primary.300"
    />
  );
};

export default CustomTextArea;
