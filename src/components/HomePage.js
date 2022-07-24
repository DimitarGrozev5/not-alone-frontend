import Button from "../common-components/FormElements/Button/Button";
import DataCard from "../common-components/UIComponents/DataCard/DataCard";

const HomePage = (props) => {
  return (
    <DataCard expand>
      <Button to="/login">Login</Button>
      <Button to="/register">Register</Button>
    </DataCard>
  );
};

export default HomePage;
