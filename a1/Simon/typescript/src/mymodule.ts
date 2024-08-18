console.log("Loading mymodule ...");

export function getSecret() {
  return s;
}

let s = "secret";

export {}; // force file to be a module
