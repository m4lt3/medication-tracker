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
  localStorage.setItem(import.meta.env.VITE_CONFIG_KEY, JSON.stringify(config));
}

handler.getPassword = () => {
    return sessionStorage.getItem(import.meta.env.VITE_PASSWORD_KEY);
}

handler.setPassword = (password) => {
  sessionStorage.setItem(import.meta.env.VITE_PASSWORD_KEY, password);
}

export { handler };
