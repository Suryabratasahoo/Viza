'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const verifyUser = async () => {

      const token =
        localStorage.getItem(
          'token'
        );

      if (!token) {

        router.replace(
          '/signin'
        );

        return;
      }

      try {

        await api.get(
          '/auth/me'
        );

        setLoading(false);

      } catch {

        localStorage.removeItem(
          'token'
        );

        localStorage.removeItem(
          'user'
        );

        router.replace(
          '/signin'
        );
      }
    };

    verifyUser();

  }, [router]);

  if (loading) {

    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      {children}
    </>
  );
}