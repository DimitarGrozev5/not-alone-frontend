import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import FormCard from "../../common-components/UIComponents/FormCard/FormCard";
import useUserService from "../../services/useUserService";
import ErrorModal from "../../common-components/UIComponents/ErrorModal/ErrorModal";
import LoadingSpinner from "../../common-components/UIComponents/LoadingSpinner/LoadingSpinner";
import Button from "../../common-components/FormElements/Button/Button";

const Login = (props) => {
  const navigate = useNavigate();
  const userService = useUserService();

  // Setup load status
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const emailRef = useRef();
  const passwordRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();

    const loginData = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    setIsLoading(true);

    userService
      .login(loginData)
      .then(() => navigate("/", { replace: true }))
      .catch((err) => {
        setIsLoading(false);
        setError(err.message);
        // errMsg.alert(err);
      });
  };

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      {error && (
        <ErrorModal error={error} onClose={setError.bind(null, undefined)} />
      )}
      <h1>Login to your account</h1>
      <FormCard onSubmit={submitHandler}>
        <label htmlFor="email">E-Mail:</label>
        <input
          ref={emailRef}
          type="email"
          name="email"
          placeholder="email@example.com"
        />
        <label htmlFor="password">Password:</label>
        <input ref={passwordRef} type="password" name="password" />
        <Button stretch>Вписване</Button>
      </FormCard>
    </>
  );
};

export default Login;
