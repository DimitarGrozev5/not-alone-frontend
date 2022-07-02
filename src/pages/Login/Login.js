import FormCard from "../../components/UIComponents/FormCard";
import style from "./Login.module.css";

const Login = (props) => {
  return (
    <>
      <h1>Login to your account</h1>
      <FormCard>
        <label htmlFor="email">E-Mail:</label>
        <input type="email" name="email" placeholder="email@example.com" />
        <label htmlFor="password">Password:</label>
        <input type="password" name="password" />
        <button type="submit">Log in</button>
      </FormCard>
    </>
  );
};

export default Login;
