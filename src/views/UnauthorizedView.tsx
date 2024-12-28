import { Container, Text } from "@chakra-ui/react";
import PageContainer from "../layout/PageContainer";
import CustomLink from "../components/CustomLink";

const UnauthorizedView = () => {
  return (
    <PageContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Container
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <Text fontSize={"30px"} fontWeight={"extrabold"}>
            {"Accès refusé"}
          </Text>
          <Text fontSize={"20px"}>
            {
              "Vous n'avez pas les permissions nécessaires pour accéder à cette page."
            }
          </Text>
          <Text>
            {"Revenir en "}
            <CustomLink to="/" label="lieu sûr" />
          </Text>
        </Container>
      </div>
    </PageContainer>
  );
};

export default UnauthorizedView;
