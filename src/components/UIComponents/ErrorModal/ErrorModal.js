import React from "react";

import Modal from "../Modal/Modal";

const ErrorModal = (props) => {
  return (
    <Modal
      onClose={props.onClose}
      title="Възника грешка!"
    >
      <>
        <p>{props.error}</p>
        <button onClick={props.onClose}>ОК</button>
      </>
    </Modal>
  );
};

export default ErrorModal;
