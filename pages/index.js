import { CardForm } from "./components/cardForm";
import "bootstrap/dist/css/bootstrap.css";

const IndexPage = (props) => {
  const { clientToken, clientID } = props;
  return (
    <>
      {clientToken && (
        <CardForm clientToken={clientToken} clientID={clientID} />
      )}
    </>
  );
};

export const getServerSideProps = async () => {
  const response = await fetch("https://b9il3r.sse.codesandbox.io/api/tokens");
  const data = await response.json();
  const { client_token } = data;
  const { TEST_CLIENT_ID } = process.env;

  return {
    props: {
      clientToken: client_token,
      clientID: TEST_CLIENT_ID
    }
  };
};

export default IndexPage;
