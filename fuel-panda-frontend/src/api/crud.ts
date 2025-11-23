// src/api/crud.ts
import api from "./axios";

export const list = async (path: string, params = {}) => {
  const { data } = await api.get(path, { params });
  return data;
};

export const getOne = async (path: string, id: string) => {
  const { data } = await api.get(`${path}/${id}`);
  return data;
};

export const createOne = async (path: string, body: any) => {
  const { data } = await api.post(path, body);
  return data;
};

export const updateOne = async (path: string, id: string, body: any) => {
  const { data } = await api.put(`${path}/${id}`, body);
  return data;
};

export const deleteOne = async (path: string, id: string) => {
  const { data } = await api.delete(`${path}/${id}`);
  return data;
};
