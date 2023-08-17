const handler = {};

const defaultConfig = {
  encryption: false
};

handler.read = () => {
  let config = localStorage.getItem(import.meta.env.VITE_CONFIG_KEY);

  if (!config) {
    return defaultConfig;
  }

  return JSON.parse(config);
}

handler.write = (config) => {
  if (config) {
    localStorage.setItem(import.meta.env.VITE_CONFIG_KEY, JSON.stringify(config));
  } else {
    localStorage.removeItem(import.meta.env.VITE_CONFIG_KEY);
  }

}

handler.getPassword = () => {
    return sessionStorage.getItem(import.meta.env.VITE_PASSWORD_KEY);
}

handler.setPassword = (password) => {
  if (password) {
    sessionStorage.setItem(import.meta.env.VITE_PASSWORD_KEY, password);
  } else {
    sessionStorage.removeItem(import.meta.env.VITE_PASSWORD_KEY);
  }
}

export { handler };
