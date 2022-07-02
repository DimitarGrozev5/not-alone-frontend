import { useState } from "react";
import FormCard from "../../components/UIComponents/FormCard";
import style from "./Register.module.css";

const Register = (props) => {
  const [formIsUntouched, setFormIsUntouched] = useState(true);
  const formIsTouchedHandler = () => setFormIsUntouched(false);

  // Form data will be stored in this state
  const [formData, setFormData] = useState({
    email: "",
    repeatEmail: "",
    name: "",
    phone: "",
    password: "",
    repeatPassword: "",
  });
  const userInputHandler = (target) => (event) =>
    setFormData((prevState) => ({ ...prevState, [target]: event.target.value }));

  // Validate formData
  

  return (
    <>
      <h1>Register a new account</h1>
      <FormCard onFocus={formIsTouchedHandler}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          placeholder="email@example.com"
          onInput={userInputHandler("email")}
          value={formData.email}
        />

        <label htmlFor="email-repeat">Повторете Email:</label>
        <input
          type="email"
          name="email-repeat"
          placeholder="email@example.com"
          onInput={userInputHandler("repeatEmail")}
          value={formData.repeatEmail}
        />

        <label htmlFor="name">Име:</label>
        <input
          type="name"
          name="name"
          placeholder="Иван Иванов"
          onInput={userInputHandler("name")}
          value={formData.name}
        />

        <label htmlFor="phone">Телефонен номер:</label>
        <input
          type="text"
          name="phone"
          placeholder="0887123123"
          onInput={userInputHandler("phone")}
          value={formData.phone}
        />

        <label htmlFor="password">Парола:</label>
        <input
          type="password"
          name="password"
          onInput={userInputHandler("password")}
          value={formData.password}
        />

        <label htmlFor="password-repeat">Повторете паролата:</label>
        <input
          type="password"
          name="password-repeat"
          onInput={userInputHandler("repeatPassword")}
          value={formData.repeatPassword}
        />

        <button type="submit">Регистрация</button>
      </FormCard>
    </>
  );
};

export default Register;
