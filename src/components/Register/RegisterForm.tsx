import { useForm } from "react-hook-form";
import CustomFormControl from "../Form/CustomFormControl";
import CustomInput from "../Form/CustomInput";
import { Button, Spacer } from "@chakra-ui/react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { CHAMP_OBLIGATOIRE } from "../../data/constants";
import { CreateAccount } from "../../interfaces/Account";
import PasswordInput from "../Form/PasswordInput";

interface IRegisterFormValues {
  name: string;
  firstName: string;
  phoneNumber: string;
  password: string;
}

const registerFormValidationSchema = yup.object().shape({
  name: yup.string().required(CHAMP_OBLIGATOIRE),
  firstName: yup.string().required(CHAMP_OBLIGATOIRE),
  phoneNumber: yup.string().required(CHAMP_OBLIGATOIRE),
  password: yup.string().required(CHAMP_OBLIGATOIRE),
});

type RegisterFormProps = {
  submitFunction: (account: CreateAccount) => void;
  formIsSubmitting: boolean;
};

const RegisterForm = ({
  submitFunction,
  formIsSubmitting,
}: RegisterFormProps) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid },
  } = useForm<IRegisterFormValues>({
    mode: "onChange",
    resolver: yupResolver(registerFormValidationSchema),
  });

  const onSubmit = (values: IRegisterFormValues) => {
    const account: CreateAccount = {
      name: values.name,
      firstName: values.firstName,
      phoneNumber: values.phoneNumber,
      password: values.password,
    };
    submitFunction(account);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "25px",
        }}
      >
        <CustomFormControl label="Nom" errorField={errors.name} isRequired>
          <CustomInput
            type="text"
            name="name"
            register={register}
            placeholder="Nom"
          />
        </CustomFormControl>
        <CustomFormControl
          label="Prénom"
          errorField={errors.firstName}
          isRequired
        >
          <CustomInput
            type="text"
            name="firstName"
            register={register}
            placeholder="Prénom"
          />
        </CustomFormControl>
        <CustomFormControl
          label="Numéro de téléphone"
          errorField={errors.phoneNumber}
          isRequired
        >
          <CustomInput
            type="text"
            name="phoneNumber"
            register={register}
            placeholder="Numéro de téléphone"
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
        >
          {"Enregistrer"}
        </Button>
      </div>
      <Spacer height={"25px"} />
    </form>
  );
};

export default RegisterForm;
