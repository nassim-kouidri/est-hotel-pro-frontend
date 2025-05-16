import { Box, Heading, Spacer, Flex, Image } from "@chakra-ui/react";
import LoginForm from "../components/Login/LoginForm";
import PageContainer from "../layout/PageContainer";
import { useState } from "react";
import { AuthService } from "../services/AuthService";
import { Login } from "../interfaces/Login";
import { useAuth } from "../contexts/auth";
import { useNavigate } from "react-router-dom";
import { useToasts } from "../contexts/toast";
import logoImage from "../assets/logo-est-hotel-pro.png";

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
      <Box 
        maxWidth={"380px"} 
        mx="auto" 
        p={6} 
        borderRadius="md" 
        boxShadow="sm" 
        bg="white"
      >
        <Flex direction="column" align="center" mb={4}>
          <Image 
            src={logoImage} 
            alt="Est Hotel Pro Logo" 
            maxWidth="180px" 
            mb={4}
          />
          <Heading as="h3" size="lg" textAlign={"center"} fontWeight="medium">
            {"Connexion"}
          </Heading>
        </Flex>
        <Spacer h={4} />
        <LoginForm submitFunction={login} formIsSubmitting={formIsSubmitting} />
      </Box>
    </PageContainer>
  );
};
export default LoginView;
