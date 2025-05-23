import { Button, InputGroup, InputRightElement } from "@chakra-ui/react";
import CustomInput from "../Form/CustomInput";
import { useState } from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

type PasswordInputProps = {
  name: Path<FieldValues>;
  register: UseFormRegister<any>;
  placeholder: string;
};

const PasswordInput = ({ name, register, placeholder }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () =>
    setShowPassword((prevState) => {
      return !prevState;
    });

  return (
    <InputGroup size="md">
      <CustomInput
        name={name}
        type={showPassword ? "text" : "password"}
        register={register}
        placeholder={placeholder}
      />
      <InputRightElement width="4.5rem">
        <Button
          h="1.75rem"
          size="sm"
          variant="ghost"
          color="gray.500"
          onClick={handleClick}
          _hover={{ color: "primary.500", bg: "gray.50" }}
          transition="all 0.2s"
        >
          {showPassword ? <ViewOffIcon /> : <ViewIcon />}
        </Button>
      </InputRightElement>
    </InputGroup>
  );
};

export default PasswordInput;
