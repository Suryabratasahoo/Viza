import { api } from "./api";

export interface CreateSessionPayload {
  dataset_id: string;
}

export interface CreateSessionResponse {
  status: string;
  session_id: string;
  dataset_id: string;
  title: string;
}

export const createSession = async (
  payload: CreateSessionPayload
): Promise<CreateSessionResponse> => {

  const response =
    await api.post<CreateSessionResponse>(
      "/chat-sessions",
      payload
    );

  return response.data;
};

export const getChatSessions =
  async () => {

    const response =
      await api.get(
        "/chat-sessions"
      );

    return response.data;
  };

export const getChatSession =
  async (
    sessionId: string
  ) => {

    const response =
      await api.get(
        `/chat-sessions/${sessionId}`
      );

    return response.data;
  };

export const deleteChatSession =
  async (
    sessionId: string
  ) => {

    const response =
      await api.delete(
        `/chat-sessions/${sessionId}`
      );

    return response.data;
  };
