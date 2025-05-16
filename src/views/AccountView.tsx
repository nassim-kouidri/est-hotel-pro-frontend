import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Flex,
  Heading,
  Image,
  SimpleGrid,
  Spacer,
  Text,
} from "@chakra-ui/react";
import PageContainer from "../layout/PageContainer";
import { useAuth } from "../contexts/auth";
import { PhoneIcon } from "@chakra-ui/icons";
import logoImage from "../assets/logo-est-hotel-pro.png";

const AccountView = () => {
  const { user, removeAuth } = useAuth();

  if (user == null) return null;
  return (
    <PageContainer>
      <Box 
        maxWidth={"500px"} 
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
            {"Mon Compte"}
          </Heading>
        </Flex>

        <Divider my={4} />

        <Card 
          width="100%" 
          variant="outline" 
          boxShadow="xs" 
          borderRadius="md"
          _hover={{ boxShadow: "sm" }}
          transition="all 0.2s"
        >
          <CardBody>
            <Flex alignItems="center" gap="1rem">
              <Avatar 
                name={`${user.accountResponse.firstName}`} 
                size="lg"
                bg="primary.500"
                color="white"
              />
              <Heading size="md" fontWeight="medium">
                {`${user.accountResponse.firstName} ${user.accountResponse.name}`}
              </Heading>
            </Flex>

            <Spacer height={"1.5rem"} />

            <SimpleGrid columns={2} spacing={2} gap={4}>
              <Text fontWeight="medium">{"Rôle"}</Text>
              <Text>{user.accountResponse.role}</Text>
              <Text fontWeight="medium">{"Téléphone"}</Text>
              <Text>
                <PhoneIcon mr={2} color="primary.500" /> {user.accountResponse.phoneNumber}
              </Text>
            </SimpleGrid>
          </CardBody>
          <CardFooter justifyContent="center" pt={2}>
            <Button
              onClick={removeAuth}
              colorScheme="red"
              size={"md"}
              boxShadow="sm"
              _hover={{ boxShadow: "md" }}
            >
              {"Déconnexion"}
            </Button>
          </CardFooter>
        </Card>
        <Spacer h={6} />
      </Box>
    </PageContainer>
  );
};

export default AccountView;
