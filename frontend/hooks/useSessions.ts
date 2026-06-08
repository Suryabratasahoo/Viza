'use client';

import { useState, useEffect, useCallback } from 'react';
import { getChatSessions } from '@/services/ChatSession.service';

export interface ChatSession {
  session_id: string;
  dataset_id: string;
  title: string;
  created_at: string;
  preview_chart?: string;
}

export function useSessions() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getChatSessions();
      setSessions(data.sessions || []);
      setError(null);
    } catch (err: any) {
      setError(err);
      console.error("Failed to fetch sessions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  return {
    sessions,
    setSessions,
    loading,
    error,
    fetchSessions
  };
}
