import { useRef } from "react";

import FormCard from "../../common-components/UIComponents/FormCard/FormCard";
import ErrorModal from "../../common-components/UIComponents/ErrorModal/ErrorModal";
import LoadingSpinner from "../../common-components/UIComponents/LoadingSpinner/LoadingSpinner";
import Button from "../../common-components/FormElements/Button/Button";
import { useHttpClient } from "../../hooks/useHttpClient";
import { useDispatch } from "react-redux";
import { userActions } from "../../redux-store/userSlice";

const Login = (props) => {
  const dispatch = useDispatch();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const emailRef = useRef();
  const passwordRef = useRef();

  const submitHandler = async (event) => {
    event.preventDefault();

    const loginData = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      const response = await sendRequest("/users/login", loginData);

      localStorage.setItem("jwt", JSON.stringify(response));
      dispatch(userActions.updateAccessToken(response.token));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      {error && <ErrorModal error={error} onClose={clearError} />}

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
        <Button type="submit" stretch>Вписване</Button>
      </FormCard>
    </>
  );
};

export default Login;
