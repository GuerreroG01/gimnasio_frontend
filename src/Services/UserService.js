import axiosInstance from './AxiosInstance';

const API_URL = "/User";

const getUsers = () => {
  return axiosInstance.get(API_URL);
};

const getUserById = (id) => {
  return axiosInstance.get(`${API_URL}/${id}`);
};

const createUser = (userData) => {
  return axiosInstance.post(API_URL, userData);
};

const updateUser = (id, userData) => {
  return axiosInstance.put(`${API_URL}/${id}`, userData);
};

const deleteUser = (id) => {
  return axiosInstance.delete(`${API_URL}/${id}`);
};

const UserService = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
export default UserService;