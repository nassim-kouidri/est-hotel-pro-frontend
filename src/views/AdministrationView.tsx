import { Box, Heading, Flex, Image, Divider } from "@chakra-ui/react";
import PageContainer from "../layout/PageContainer";
import { useState } from "react";
import { AuthService } from "../services/AuthService";
import { useToasts } from "../contexts/toast";
import RegisterForm from "../components/Register/RegisterForm";
import { CreateAccount } from "../interfaces/Account";
import { useAuth } from "../contexts/auth";
import AccountList from "../components/Administration/AccountList";
import logoImage from "../assets/logo-est-hotel-pro.png";

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
      <Box 
        maxWidth={"900px"} 
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
            maxWidth="150px" 
            mb={4}
          />
          <Heading as="h2" size="lg" textAlign={"center"} fontWeight="medium">
            {"Administration"}
          </Heading>
        </Flex>

        <Divider my={4} />

        <Flex>
          {/* Left side - User list */}
          <Box flex="1" pr={4}>
            <AccountList />
          </Box>

          {/* Vertical divider */}
          <Divider orientation="vertical" mx={4} height="auto" alignSelf="stretch" />

          {/* Right side - Registration form */}
          <Box flex="1" pl={4}>
            <Heading as="h3" size="md" mb={4} fontWeight="medium">
              {"Création d'un compte STAFF"}
            </Heading>
            <RegisterForm
              submitFunction={register}
              formIsSubmitting={formIsSubmitting}
            />
          </Box>
        </Flex>
      </Box>
    </PageContainer>
  );
};
export default AdministrationView;
