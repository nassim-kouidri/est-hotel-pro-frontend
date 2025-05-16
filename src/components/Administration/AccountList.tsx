import { useEffect, useState } from "react";
import {
  Box,
  Button, Flex,
  Heading,
  List,
  ListItem,
  Spinner,
  Tag,
} from "@chakra-ui/react";
import { AccountResponse } from "../../interfaces/Account";
import { AuthService } from "../../services/AuthService";
import { useAuth } from "../../contexts/auth";
import { useToasts } from "../../contexts/toast";

const AccountList = () => {
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [accountsAreLoading, setAccountsAreLoading] = useState(false);

  const { user } = useAuth();
  const { pushToast } = useToasts();

  useEffect(() => {
    fetchAllAccounts();
  }, []);

  const fetchAllAccounts = () => {
    if (user) {
      setAccountsAreLoading(true);
      AuthService.getAllAccounts(user.token)
        .then((accountsRes) => setAccounts(accountsRes.data))
        .finally(() => setAccountsAreLoading(false));
    }
  };

  const handleDelete = (userId: string) => {
    if (user) {
      AuthService.deleteAccount(user.token, userId)
        .then(() => {
          pushToast({
            content: "Utilisateur supprimé avec succès",
            state: "SUCCESS",
          });
          fetchAllAccounts();
        })
        .catch((err) =>
          pushToast({
            content: `Erreur lors de la suppression de l'utilisateur : ${err.response.data}`,
            state: "ERROR",
          })
        );
    }
  };

  return (
    <Box>
      <Heading as="h3" size="md" mb={4} fontWeight="medium" textAlign="center">
        {"Liste des utilisateurs"}
      </Heading>
      {accountsAreLoading ? (
        <Flex justify="center" my={4}>
          <Spinner color="primary.500" />
        </Flex>
      ) : (
        <List spacing={3}>
          {accounts.map((account) => (
            <ListItem
              key={account.firstName}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              p={3}
              borderRadius="md"
              boxShadow="xs"
              bg="white"
              _hover={{ boxShadow: "sm", bg: "gray.50" }}
              transition="all 0.2s"
            >
              <Box display="flex" gap={2} alignItems="center">
                <Tag colorScheme="primary" borderRadius="full">{account.role}</Tag>
                <Box fontWeight="medium">{account.firstName} {account.name}</Box>
                <Box color="gray.600" fontSize="sm">({account.phoneNumber})</Box>
              </Box>
              <Button
                colorScheme="red"
                variant={"outline"}
                onClick={() => handleDelete(account.id)}
                size={"sm"}
                borderRadius="md"
                _hover={{ bg: "red.50" }}
              >
                Supprimer
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default AccountList;
