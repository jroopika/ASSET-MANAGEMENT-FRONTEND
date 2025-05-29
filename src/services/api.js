import axios from "axios";

// Use environment variable for base URL, with fallback to deployed backend
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://asset-management-backend-qezn.onrender.com/api';
const API_URL = 'https://asset-management-backend-qezn.onrender.com/api';
// Create Axios Instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Get auth header with token
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("Authentication token missing");
    // It's often better to let the caller handle the missing token error
    // or rely on the backend to send a 401, which the interceptor will catch.
    // However, returning empty headers is also a valid strategy if specific calls don't require auth.
    return { headers: {} }; 
  }
  return { headers: { Authorization: `Bearer ${token}` } };
};

// LOGIN USER
export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    const { token, refreshToken: newRefreshToken, role, user } = response.data; // Assuming backend sends refreshToken
    
    localStorage.setItem("token", token);
    if (newRefreshToken) {
      localStorage.setItem("refreshToken", newRefreshToken); // Store refresh token if available
    }
    
    console.log("Token stored:", token ? "Token exists" : "No token");
    
    return { token, role, user };
  } catch (err) {
    console.error("Login failed:", {
      message: err.message,
      code: err.code,
      response: err.response ? {
        status: err.response.status,
        data: err.response.data,
        headers: err.response.headers
      } : null,
      request: err.config ? {
        url: err.config.url,
        method: err.config.method,
        data: err.config.data
      } : null
    });
    throw err.response?.data?.message || "Login failed";
  }
};

// SIGNUP USER
export const signupUser = async (name, email, password) => {
  try {
    const response = await api.post("/auth/signup", {
      name,
      email,
      password,
      role: "user", // Default role, can be adjusted as needed
    });
    return response.data;
  } catch (err) {
    console.error("Signup failed:", err.response || err.message);
    throw err.response?.data?.message || "Signup failed";
  }
};

// FETCH ALL ASSETS
export const getAssets = async () => {
  try {
    const response = await api.get("/assets", getAuthHeader());
    return response.data;
  } catch (err) {
    console.error("Fetching assets failed:", err.response || err.message);
    throw err.response?.data?.message || "Failed to fetch assets";
  }
};

// CREATE ASSET
export const createAsset = async (assetData) => {
  try {
    const response = await api.post("/assets/create", assetData, getAuthHeader());
    return response.data;
  } catch (err) {
    console.error("Creating asset failed:", err.response || err.message);
    throw err.response?.data?.message || "Failed to create asset";
  }
};

// UPDATE ASSET
export const updateAsset = async (id, assetData) => {
  try {
    const response = await api.put(`/assets/${id}`, assetData, getAuthHeader());
    return response.data;
  } catch (err) {
    console.error("Updating asset failed:", err.response || err.message);
    throw err.response?.data?.message || "Failed to update asset";
  }
};

// DELETE ASSET
export const deleteAsset = async (id) => {
  try {
    const response = await api.delete(`/assets/${id}`, getAuthHeader());
    return response.data;
  } catch (err) {
    console.error("Deleting asset failed:", err.response || err.message);
    throw err.response?.data?.message || "Failed to delete asset";
  }
};

// FETCH SINGLE ASSET BY ID (Public or specific endpoint)
export const getAssetById = async (assetId) => {
  try {
    // Adjust endpoint if it requires authentication or is different
    const response = await api.get(`/assets/public/${assetId}`); 
    return response.data;
  } catch (err) {
    console.error("Fetching asset by ID failed:", err.response || err.message);
    throw err.response?.data?.message || "Failed to fetch asset";
  }
};

// FETCH ALL REQUESTS
export const getAllRequests = async () => {
  try {
    const response = await api.get("/requests/all", getAuthHeader());
    return response.data;
  } catch (err) {
    console.error("Fetching requests failed:", err.response || err.message);
    throw err.response?.data?.message || "Failed to fetch requests";
  }
};

// REPORT ISSUE
export const reportIssue = async (assetId, userId, issue) => {
  try {
    const response = await api.post(
      "/issues",
      { assetId, userId, issue },
      getAuthHeader()
    );
    return response.data;
  } catch (err) {
    console.error("Reporting issue failed:", err.response || err.message);
    throw err.response?.data?.message || "Failed to report issue";
  }
};

// FETCH ACTIVITY LOGS

export const fetchLogs = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found. Please log in again.');
    }

    const response = await axios.get(`${API_URL}/requests/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || 'Failed to fetch requests';
    throw new Error(errorMessage);
  }
};

// FETCH ALL USERS
export const getAllUsers = async () => {
  try {
    const response = await api.get("/auth/users", getAuthHeader());
    return response.data;
  } catch (err) {
    console.error("Fetching users failed:", err.response || err.message);
    throw err.response?.data?.message || "Failed to fetch users";
  }
};

// CREATE USER (This is an admin action, ensure backend protects it)
export const createUser = async (userData) => {
  try {
    // This typically requires admin privileges and should use getAuthHeader()
    const response = await api.post("/auth/create-user", userData, getAuthHeader()); 
    return response.data;
  } catch (err) {
    console.error("Creating user failed:", err.response || err.message);
    throw err.response?.data?.message || "Failed to create user";
  }
};

// UPDATE USER
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/auth/users/${id}`, userData, getAuthHeader());
    return response.data;
  } catch (err) {
    console.error("Updating user failed:", err.response || err.message);
    throw err.response?.data?.message || "Failed to update user";
  }
};

// DELETE USER
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/auth/users/${id}`, getAuthHeader());
    return response.data;
  } catch (err) {
    console.error("Deleting user failed:", err.response || err.message);
    throw err.response?.data?.message || "Failed to delete user";
  }
};

// REFRESH TOKEN
// Add or update the refreshToken function
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("No refresh token available");
    
    const response = await api.post("/auth/refresh", { refreshToken });
    const { token } = response.data;
    
    localStorage.setItem("token", token);
    return token;
  } catch (error) {
    console.error("Token refresh failed:", error);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
    throw error;
  }
};

// AXIOS RESPONSE INTERCEPTOR for handling 401 errors and refreshing token
api.interceptors.response.use(
  (response) => response, // Simply return successful responses
  async (error) => {
    const originalRequest = error.config;

    // Check if it's a 401 error and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark that we've attempted a retry
      
      try {
        console.log("Attempting to refresh token...");
        const newToken = await refreshToken(); // Attempt to get a new token
        
        // Update the Authorization header for the original request
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // Retry the original request with the new token
        console.log("Retrying original request with new token.");
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Failed to refresh token or retry original request:", refreshError);
        // If refresh fails, logout user or redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        // window.location.href = '/login'; // Or handle this in a more global way
        return Promise.reject(refreshError); // Reject with the refresh error
      }
    }
    
    // For errors other than 401, or if retry already attempted, just reject
    return Promise.reject(error);
  }
);

// VERIFY TOKEN (Optional utility, backend should handle actual verification on protected routes)
export const verifyToken = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false; // No token to verify
    
    // Example: make a lightweight authenticated GET request to a verify endpoint
    // The backend's auth middleware will do the actual verification.
    await api.get("/auth/verify-status", getAuthHeader()); // Ensure this endpoint exists
    return true;
  } catch (error) {
    console.warn("Token verification call failed or token is invalid:", error.response || error.message);
    return false;
  }
};

// Add this utility function to check if token is expired
export const isTokenExpired = () => {
  const token = localStorage.getItem("token");
  if (!token) return true;
  
  try {
    // Get the payload part of the JWT token
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Check if token is expired
    return payload.exp * 1000 < Date.now();
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true; // Assume expired if we can't parse it
  }
};

export default api; // Optional: export the configured axios instance if needed elsewhere
