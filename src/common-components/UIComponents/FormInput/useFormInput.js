import { useState } from "react";
import { FormData } from "../../../data-types/FormDataTypes";

const useFormInput = (...formNames) => {
  const initFormData = formNames.reduce(
    (obj, name) => ({ ...obj, [name]: new FormData("") }),
    {}
  );

  const [formData, setFormData] = useState(initFormData);

  const setFormDataHandler = (field) => (value) =>
    setFormData((fd) => ({ ...fd, [field]: value }));

  const isValid = () =>
    Object.values(formData).reduce((p, c) => p && c.isValid, true);

  return [formData, setFormDataHandler, isValid];
};

export default useFormInput;
