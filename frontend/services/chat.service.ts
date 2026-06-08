import { api } from "./api";

export interface AskPayload {
  session_id: string;
  question: string;
}

export interface AskResponse {
  status: string;
  question: string;
  sql: string;
  explanation: string;

  chart?: {
    type: string;
    labels?: string;
    values?: string;
    confidence?: number;
    reason?: string;
  };

  result?: {
    row_count: number;
    rows: Record<string, unknown>[];
    success: boolean;
    truncated?: boolean;
  };

  attempt_count?: number;
}

export const askQuestion = async (
  payload: AskPayload
): Promise<AskResponse> => {

  const response =
    await api.post<AskResponse>(
      "/ask",
      payload
    );

  return response.data;
};