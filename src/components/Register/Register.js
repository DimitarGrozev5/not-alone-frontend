import { useState } from "react";
import Button from "../../common-components/FormElements/Button/Button";
import ErrorModal from "../../common-components/UIComponents/ErrorModal/ErrorModal";
import FormCard from "../../common-components/UIComponents/FormCard/FormCard";
import FormInput from "../../common-components/UIComponents/FormInput/FormInput";
import useFormInput from "../../common-components/UIComponents/FormInput/useFormInput";
import LoadingSpinner from "../../common-components/UIComponents/LoadingSpinner/LoadingSpinner";
import {
  hasLengthOf,
  isEmail,
  notEmpty,
  validBGPhone,
  valuesMatch,
} from "../../utils/data-validation";
import { useHttpClient } from "../../hooks/useHttpClient";
import { useDispatch } from "react-redux";
import { userActions } from "../../redux-store/userSlice";
// import style from "./Register.module.css";

const Register = (props) => {
  const dispatch = useDispatch();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // Setup form state
  const [formWasTouched, setFormWasTouched] = useState(false);
  // Form data will be stored in this state
  const [formData, setFormData, formDataIsValid] = useFormInput(
    "email",
    "repeatEmail",
    "name",
    "phone",
    "password",
    "repeatPassword"
  );

  const submitHandler = async (event) => {
    event.preventDefault();

    setFormWasTouched(true);

    if (!formDataIsValid()) {
      return;
    }

    const data = {
      email: formData.email.value,
      name: formData.name.value,
      phone: formData.phone.value,
      password: formData.password.value,
    };

    try {
      const response = await sendRequest("users/register", data);

      alert("Създаден е нов потребител!");
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
      <h1>Register a new account</h1>
      <FormCard onSubmit={submitHandler}>
        <FormInput
          name="email"
          label="Имейл"
          type="text"
          placeholder="email@example.com"
          value={formData.email}
          onChange={setFormData("email")}
          validator={isEmail}
          errMsg="Моля въведете валиден Имейл!"
          formWasTouched={formWasTouched}
        />

        <FormInput
          name="email-repeat"
          label="Повторете Имейл"
          type="text"
          placeholder="email@example.com"
          value={formData.repeatEmail}
          onChange={setFormData("repeatEmail")}
          validator={valuesMatch(formData.email.value)}
          errMsg="Имейлите на съвпадат!"
          formWasTouched={formWasTouched}
        />

        <FormInput
          name="name"
          label="Име"
          type="text"
          placeholder="Име Фамилия"
          value={formData.name}
          onChange={setFormData("name")}
          validator={notEmpty}
          errMsg="Моля въведете име или псевдоним!"
          formWasTouched={formWasTouched}
        />

        <FormInput
          name="phone"
          label="Телефон"
          type="text"
          placeholder="088 712 3123"
          value={formData.phone}
          onChange={setFormData("phone")}
          validator={validBGPhone}
          errMsg="Моля въведете правилен телефон!"
          formWasTouched={formWasTouched}
        />

        <FormInput
          name="password"
          label="Парола"
          type="password"
          value={formData.password}
          onChange={setFormData("password")}
          validator={hasLengthOf(6)}
          errMsg="Паролата е твърде къса!"
          formWasTouched={formWasTouched}
        />

        <FormInput
          name="repeatPassword"
          label="Повторете паролата"
          type="password"
          value={formData.repeatPassword}
          onChange={setFormData("repeatPassword")}
          validator={valuesMatch(formData.password.value)}
          errMsg="Паролите не съвпадат!"
          formWasTouched={formWasTouched}
        />

        <Button type="submit" stretch>
          Регистрация
        </Button>
      </FormCard>
    </>
  );
};

export default Register;
