import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import FormCard from "../../components/UIComponents/FormCard/FormCard";
import useMessages from "../../services/useMessages";
import useUserService from "../../services/useUserService";

const Login = (props) => {
  const navigate = useNavigate();
  const userService = useUserService();
  const errMsg = useMessages();

  const emailRef = useRef();
  const passwordRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();
    
    const loginData = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    userService
      .login(loginData)
      .then(() => navigate("/", { replace: true }))
      .catch((err) => errMsg.alert(err));
  };

  return (
    <>
      <h1>Login to your account</h1>
      <FormCard onSubmit={submitHandler} >
        <label htmlFor="email">E-Mail:</label>
        <input
          ref={emailRef}
          type="email"
          name="email"
          placeholder="email@example.com"
        />
        <label htmlFor="password">Password:</label>
        <input ref={passwordRef} type="password" name="password" />
        <button type="submit">Log in</button>
      </FormCard>
    </>
  );
};

export default Login;
