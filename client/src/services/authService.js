import api from "./api";

export const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);

  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);

  return response.data;
};

export const getCurrentUser = async () => {
  try {
    const response = await api.get("/auth/me");

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      return {
        success: false,
        user: null
      };
    }

    throw error;
  }
};

export const logoutUser = async () => {
  const response = await api.post("/auth/logout");

  return response.data;
};

export const updateProfile = async (
  profileData
) => {
  const response = await api.patch(
    "/auth/profile",
    profileData
  );

  return response.data;
};

export const changePassword = async (
  passwordData
) => {
  const response = await api.patch(
    "/auth/password",
    passwordData
  );

  return response.data;
};