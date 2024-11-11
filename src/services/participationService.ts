import httpService from "./httpService";

interface ParticipationData {
  firstName: string;
  lastName: string;
  percentage: number;
}

export const createParticipation = async (data: ParticipationData) => {
  const response = await httpService.post(`/participation`, data);
  return response.data;
};

export const getAllParticipationByUsername = async (
  fname: string,
  lname: string
) => {
  const response = await httpService.get(
    `/participation/user?firstname=${fname}&lastname=${lname}`
  );
  return response.data;
};

export const getAllParticipations = async () => {
  const response = await httpService.get(`/participation`);
  return response.data;
};

export const updateParticipationById = async (
  data: ParticipationData,
  id: any
) => {
  const response = await httpService.put(`/participation/${id}`, data);
  return response.data;
};

export const deleteParticipationById = async (id: any) => {
  const response = await httpService.delete(`/participation/${id}`);
  return response.data;
};
