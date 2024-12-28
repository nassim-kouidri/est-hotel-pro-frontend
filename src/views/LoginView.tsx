import { Box, Heading, Spacer } from "@chakra-ui/react";
import LoginForm from "../components/Login/LoginForm";
import PageContainer from "../layout/PageContainer";
import { useState } from "react";
import { AuthService } from "../services/AuthService";
import { Login } from "../interfaces/Login";
import { useAuth } from "../contexts/auth";
import { useNavigate } from "react-router-dom";
import { useToasts } from "../contexts/toast";

const LoginView = () => {
  const [formIsSubmitting, setFormIsSubmitting] = useState(false);

  const { addAuth } = useAuth();
  const { pushToast } = useToasts();
  const navigate = useNavigate();

  const navigateToHome = () => {
    navigate("/");
  };

  const login = (login: Login) => {
    setFormIsSubmitting(true);

    AuthService.login(login)
      .then((userRes) => {
        addAuth(userRes.data);
        navigateToHome();
      })
      .catch((err) => {
        console.error(err);
        pushToast({
          content: "Erreur lors de la connexion",
          state: "ERROR",
        });
      })
      .finally(() => setFormIsSubmitting(false));
  };
  return (
    <PageContainer>
      <Box maxWidth={"380px"} style={{ margin: "auto" }}>
        <Heading as="h3" size="lg" textAlign={"center"}>
          {"Connexion"}
        </Heading>
        <Spacer h={6} />
        <LoginForm submitFunction={login} formIsSubmitting={formIsSubmitting} />
      </Box>
    </PageContainer>
  );
};
export default LoginView;
