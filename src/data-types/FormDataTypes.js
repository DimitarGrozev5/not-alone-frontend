export class FormData {
  constructor(value) {
    this.value = value;
  }
  get isValid() {
    return true;
  }
}
FormData.of = (value) => new FormData(value);

export class InvalidForm {
  constructor(value, errMsg) {
    this.value = value;
    this.errMsg = errMsg;
  }
  get isValid() {
    return false;
  }
}
InvalidForm.of = (value, errMsg) => new InvalidForm(value, errMsg);
