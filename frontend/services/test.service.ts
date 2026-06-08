import { api } from "./api";

export async function testConnection() {
  const response = await api.get("/");
  return response.data;
}