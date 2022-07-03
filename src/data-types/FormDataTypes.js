export class FormData {
  constructor(value) {
    this.value = value;
  }
  isValid = true;
}

export class InvalidForm {
  constructor(value, errMsg) {
    this.value = value;
    this.errMsg = errMsg;
  }
  isValid = false;
}
