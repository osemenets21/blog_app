const fetchWithAuth = async (url, options = {}) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const headers = {
    "Content-Type": "application/json",
    ...(user.token ? { Authorization: `Bearer ${user.token}` } : {}),
  };

  const config = {
    ...options,
    method: options.method || "GET",
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  return response;
};

export default fetchWithAuth;



