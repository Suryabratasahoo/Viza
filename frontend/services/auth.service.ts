import { api } from "./api";

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface RegisterResponse {
    access_token: string;
    token_type: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export const registerUser = async (
    payload: RegisterPayload
): Promise<RegisterResponse> => {

    const response =
        await api.post<RegisterResponse>(
            "/auth/register",
            payload
        );

    return response.data;
};


export interface LoginPayload {
    email: string;
    password: string;
}

export interface AuthResponse {
    status: string;
    access_token: string;
    token_type: string;
    user: {
        id: string;
        name: string;
        email: string;
    };
}

export const loginUser = async (
    payload: LoginPayload
): Promise<AuthResponse> => {

    const response =
        await api.post<AuthResponse>(
            "/auth/login",
            payload
        );

    return response.data;
};


export const updateProfile =
async (
  name: string,
  email: string
) => {

  const response =
    await api.put(
      "/auth/profile",
      {
        name,
        email
      }
    );

  return response.data;
};