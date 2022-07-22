import React from "react";
import Button from "../../FormElements/Button/Button";

import Modal from "../Modal/Modal";

const ErrorModal = (props) => {
  return (
    <Modal
      onClose={props.onClose}
      title="Възника грешка!"
    >
      <>
        <p>{props.error}</p>
        <Button onClick={props.onClose}>ОК</Button>
      </>
    </Modal>
  );
};

export default ErrorModal;
