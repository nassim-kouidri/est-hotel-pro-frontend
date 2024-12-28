import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  SimpleGrid,
  Spacer,
  Text,
} from "@chakra-ui/react";
import PageContainer from "../layout/PageContainer";
import { useAuth } from "../contexts/auth";
import { PhoneIcon } from "@chakra-ui/icons";

const AccountView = () => {
  const { user, removeAuth } = useAuth();

  if (user == null) return null;
  return (
    <PageContainer>
      <Flex justifyContent="center">
        <Card width="100%" maxWidth="500px">
          <CardBody>
            <Flex alignItems="center" gap="1rem">
              <Avatar name={`${user.accountResponse.firstName}`} />
              <Heading size="md">
                {`${user.accountResponse.firstName} ${user.accountResponse.name}`}
              </Heading>
            </Flex>

            <Spacer height={"1rem"} />

            <SimpleGrid columns={2} spacing={1} gap={4}>
              <Text>{"Rôle"}</Text>
              <Text>{user.accountResponse.role}</Text>
              <Text>{"Téléphone"}</Text>
              <Text>
                <PhoneIcon /> {user.accountResponse.phoneNumber}
              </Text>
            </SimpleGrid>
          </CardBody>
          <CardFooter justifyContent="center">
            <Button
              onClick={removeAuth}
              alignSelf={"flex-end"}
              colorScheme="red"
              size={"sm"}
            >
              {"Déconnexion"}
            </Button>
          </CardFooter>
        </Card>
      </Flex>
    </PageContainer>
  );
};

export default AccountView;
