import React from "react";
import Button from "../../FormElements/Button/Button";

import Modal from "../Modal/Modal";

const ConfirmModal = (props) => {
  return (
    <Modal onClose={props.onCancel} title="Потвърдете">
      <>
        <p>{props.message}</p>
        <Button onClick={props.onConfirm}>Да</Button>
        <Button onClick={props.onCancel}>Не</Button>
      </>
    </Modal>
  );
};

export default ConfirmModal;
