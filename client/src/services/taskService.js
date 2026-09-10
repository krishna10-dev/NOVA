import api from "./api";

export const getProjectTasks = async (projectId, filters = {}) => {
  const response = await api.get(
    `/projects/${projectId}/tasks`,
    {
      params: filters
    }
  );

  return response.data;
};

export const getTask = async (taskId) => {
  const response = await api.get(
    `/projects/tasks/${taskId}`
  );

  return response.data;
};

export const createTask = async (
  projectId,
  taskData
) => {
  const response = await api.post(
    `/projects/${projectId}/tasks`,
    taskData
  );

  return response.data;
};

export const updateTask = async (
  taskId,
  taskData
) => {
  const response = await api.patch(
    `/projects/tasks/${taskId}`,
    taskData
  );

  return response.data;
};

export const deleteTask = async (taskId) => {
  const response = await api.delete(
    `/projects/tasks/${taskId}`
  );

  return response.data;
};