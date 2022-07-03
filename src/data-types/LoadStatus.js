export const pageStatus = {
  IDLE: "IDLE",
  LOADING: "LOADING",
  EMPTY: "EMPTY",
  LOADED: "LOADED",
  ERROR: "ERROR",
};

class Idle {
  constructor() {
    this.type = pageStatus.IDLE;
  }
}

class Loading {
  constructor() {
    this.type = pageStatus.LOADING;
  }
}

class Empty {
  constructor() {
    this.type = pageStatus.EMPTY;
  }
}

class Loaded {
  constructor(result) {
    this.type = pageStatus.LOADED;
    this.result = result;
  }
}

class Error {
  constructor(message) {
    this.type = pageStatus.ERROR;
    this.message = message;
  }
}

export const LoadStatus = {
  Idle,
  Loading,
  Empty,
  Loaded,
  Error,
};
