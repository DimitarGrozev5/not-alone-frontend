import React from "react";

import Modal from "../Modal/Modal";

const ConfirmModal = (props) => {
  return (
    <Modal onClose={props.onCancel} title="Потвърдете">
      <>
        <p>{props.message}</p>
        <button onClick={props.onConfirm}>Да</button>
        <button onClick={props.onCancel}>Не</button>
      </>
    </Modal>
  );
};

export default ConfirmModal;
