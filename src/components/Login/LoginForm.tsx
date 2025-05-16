import { useForm } from "react-hook-form";
import CustomFormControl from "../Form/CustomFormControl";
import CustomInput from "../Form/CustomInput";
import { Button, Spacer, VStack } from "@chakra-ui/react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { CHAMP_OBLIGATOIRE } from "../../data/constants";
import { Login } from "../../interfaces/Login";
import PasswordInput from "../Form/PasswordInput";

interface ILoginFormValues {
  identifiant: string;
  password: string;
}

const loginFormValidationSchema = yup.object().shape({
  identifiant: yup.string().required(CHAMP_OBLIGATOIRE),
  password: yup.string().required(CHAMP_OBLIGATOIRE),
});

type LoginFormProps = {
  submitFunction: (login: Login) => void;
  formIsSubmitting: boolean;
};

const LoginForm = ({ submitFunction, formIsSubmitting }: LoginFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<ILoginFormValues>({
    mode: "onChange",
    resolver: yupResolver(loginFormValidationSchema),
  });

  const onSubmit = (values: ILoginFormValues) => {
    const login: Login = {
      name: values.identifiant,
      password: values.password,
    };
    submitFunction(login);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={5}>
        <CustomFormControl
          label="Identifiant"
          errorField={errors.identifiant}
          isRequired
        >
          <CustomInput
            type="text"
            name="identifiant"
            register={register}
            placeholder="Identifiant"
          />
        </CustomFormControl>
        <CustomFormControl
          label="Mot de passe"
          errorField={errors.password}
          isRequired
        >
          <PasswordInput
            name="password"
            register={register}
            placeholder="Mot de passe"
          />
        </CustomFormControl>
        <Button
          type="submit"
          colorScheme={"primary"}
          isLoading={formIsSubmitting}
          isDisabled={!isValid}
          size="md"
          width="100%"
          mt={2}
          boxShadow="sm"
          _hover={{ boxShadow: "md" }}
        >
          {"Se connecter"}
        </Button>
      </VStack>
      <Spacer height={"20px"} />
    </form>
  );
};

export default LoginForm;
