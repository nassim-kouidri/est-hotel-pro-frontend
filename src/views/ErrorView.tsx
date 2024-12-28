import { Container, Text } from "@chakra-ui/react";
import PageContainer from "../layout/PageContainer";
import CustomLink from "../components/CustomLink";

const ErrorView = () => {
  return (
    <PageContainer>
      <div
        style={{
          height: "calc(100vh - 100px)",
          display: "flex",
          alignContent: "center",
        }}
      >
        <Container
          style={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",

            gap: "15px",
          }}
        >
          <Text fontSize={"30px"} fontWeight={"extrabold"}>
            {"Oops !"}
          </Text>
          <Text fontSize={"20px"}>{"Cette page n'existe pas !"}</Text>
          <Text>
            {"Revenir en "}
            <CustomLink to="/" label="lieu sûr" />
          </Text>
        </Container>
      </div>
    </PageContainer>
  );
};

export default ErrorView;
