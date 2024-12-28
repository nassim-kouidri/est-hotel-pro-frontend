import { Box, Heading, Spacer } from "@chakra-ui/react";
import PageContainer from "../layout/PageContainer";
import { useState } from "react";
import { AuthService } from "../services/AuthService";
import { useToasts } from "../contexts/toast";
import RegisterForm from "../components/Register/RegisterForm";
import { CreateAccount } from "../interfaces/Account";
import { useAuth } from "../contexts/auth";
import AccountList from "../components/Administration/AccountList";

const AdministrationView = () => {
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);

  const { pushToast } = useToasts();
  const { user } = useAuth();

  const register = (newAccount: CreateAccount) => {
    if (user) {
      setFormIsSubmitting(true);

      AuthService.createAccount(user.token, newAccount)
        .then(() => {
          pushToast({
            content: "Utilisateur ajouté avec succès",
            state: "SUCCESS",
          });
        })
        .catch(() => {
          pushToast({
            content: "Erreur lors de l'enregistrement du nouveau compte",
            state: "ERROR",
          });
        })
        .finally(() => setFormIsSubmitting(false));
    }
  };
  return (
    <PageContainer>
      <Box maxWidth={"400px"} style={{ margin: "auto" }}>
        <Spacer h={6} />
        <AccountList />
        <Spacer h={6} />
        <Heading as="h2" size="md" mb={4}>
          {"Création d'un compte STAFF"}
        </Heading>
        <RegisterForm
          submitFunction={register}
          formIsSubmitting={formIsSubmitting}
        />
      </Box>
    </PageContainer>
  );
};
export default AdministrationView;
