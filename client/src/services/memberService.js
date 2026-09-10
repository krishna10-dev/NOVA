import api from "./api";

export const getProjectMembers = async (projectId) => {
  const response = await api.get(
    `/projects/${projectId}/members`
  );

  return response.data;
};

export const addProjectMember = async (
  projectId,
  memberData
) => {
  const response = await api.post(
    `/projects/${projectId}/members`,
    memberData
  );

  return response.data;
};

export const removeProjectMember = async (
  projectId,
  userId
) => {
  const response = await api.delete(
    `/projects/${projectId}/members/${userId}`
  );

  return response.data;
};