export const isEmail = (value) => /\S+@\S+\.\S+/.test(value);

export const valuesMatch = (val1) => (val2) => val1 === val2 && val1.length;

export const notEmpty = (val) => val.length > 0;

export const hasLengthOf = (len) => (val) => val.length >= len;

export const validBGPhone = (val) =>
  /^(\+359|0) {0,1}(8|9)[1-9]([0-9]{7}|[0-9] [0-9]{2} [0-9]{2} [0-9]{2}|[0-9] [0-9]{3} [0-9]{3}| [0-9]{2} [0-9]{2} [0-9]{3}| [0-9]{3} [0-9]{4})$/g.test(
    val
  );
