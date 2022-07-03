import { useState } from "react";
import FormCard from "../../components/UIComponents/FormCard";
import FormInput from "../../components/UIComponents/FormInput/FormInput";
import useFormInput from "../../components/UIComponents/FormInput/useFormInput";
import {
  hasLengthOf,
  isEmail,
  notEmpty,
  validBGPhone,
  valuesMatch,
} from "../../utils/data-validation";
import style from "./Register.module.css";

const Register = (props) => {
  // Form data will be stored in this state
  const [formData, setFormData, formDataIsValid] = useFormInput(
    "email",
    "repeatEmail",
    "name",
    "phone",
    "password",
    "repeatPassword"
  );

  const submitHandler = (event) => {
    event.preventDefault();

    if (!formDataIsValid()) {
      return;
    }

    console.log(formData);
  };

  return (
    <>
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
        />

        <FormInput
          name="email-repeat"
          label="Повторете Имейл"
          type="text"
          placeholder="email@example.com"
          value={formData.repeatEmail}
          onChange={setFormData("repeatEmail")}
          validator={valuesMatch(formData.repeatEmail.value)}
          errMsg="Имейлите на съвпадат!"
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
        />

        <FormInput
          name="password"
          label="Парола"
          type="password"
          value={formData.password}
          onChange={setFormData("password")}
          validator={hasLengthOf(6)}
          errMsg="Паролата е твърде къса!"
        />

        <FormInput
          name="repeatPassword"
          label="Повторете паролата"
          type="password"
          value={formData.repeatPassword}
          onChange={setFormData("repeatPassword")}
          validator={valuesMatch(formData.password.value)}
          errMsg="Паролите не съвпадат!"
        />

        <button type="submit">Регистрация</button>
      </FormCard>
    </>
  );
};

export default Register;
