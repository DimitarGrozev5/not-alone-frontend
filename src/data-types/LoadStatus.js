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
  isIdle = true;
}

class Loading {
  constructor() {
    this.type = pageStatus.LOADING;
  }
  isLoading = true;
}

class Empty {
  constructor() {
    this.type = pageStatus.EMPTY;
  }
  isEmpty = true;
}

class Loaded {
  constructor(result) {
    this.type = pageStatus.LOADED;
    this.result = result;
  }
  isLoaded = true;
}

class Error {
  constructor(message) {
    this.type = pageStatus.ERROR;
    this.message = message;
  }
  isError = true;
}

export const LoadStatus = {
  Idle,
  Loading,
  Empty,
  Loaded,
  Error,
};
