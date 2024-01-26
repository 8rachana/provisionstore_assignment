import axios from "axios";

const apiUrl = "https://apiv2stg.promilo.com/user/oauth/token";
const productListUrl = "https://api.kalpav.com/api/v1/product/category/retail";
const refreshTokenUrl = "https://your-refresh-token-endpoint";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

const authService = {
  login: async (email, password) => {
    const formData = new FormData();
    formData.append("username", email);
    formData.append("password", password);
    formData.append("grant_type", "password");

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Basic UHJvbWlsbzpxNCE1NkBaeSN4MiRHQg==",
        },
      });
      return response.data.access_token;
    } catch (error) {
      console.error("Login failed", error);
      if (error.response) {
        console.log("API Response:", error.response);
      }
      throw error;
    }
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("Refresh token not found");
    }

    try {
      const response = await axios.post(refreshTokenUrl, {
        refresh_token: refreshToken,
      });

      return response.data.access_token;
    } catch (error) {
      console.error("Token refresh failed", error);
      throw error;
    }
  },

  getProductList: async () => {
    try {
      const response = await axiosInstance.get(productListUrl);

      return response.data;
    } catch (error) {
      console.error("Error fetching product list", error);
      throw error;
    }
  },
  setAccessToken: (token) => {
    sessionStorage.setItem("accessToken", token);
  },
};

export default authService;
