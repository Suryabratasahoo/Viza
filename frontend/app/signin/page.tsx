'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ParticleBackground from '@/components/ParticleBackground';
import { useRouter } from "next/navigation";

import {
  loginUser
} from "@/services/auth.service";


const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Simulation states
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');


  useEffect(() => {

    const token =
      localStorage.getItem(
        "token"
      );

    if (token) {

      router.push(
        "/dashboard"
      );

    }

  }, [router]);


  const handleSubmit = async (
    e: React.FormEvent
  ) => {

    e.preventDefault();

    setErrorMsg("");

    if (!email || !password) {

      setErrorMsg(
        "Please fill in all fields."
      );

      return;
    }

    try {

      setIsLoading(true);

      const response =
        await loginUser({

          email,
          password

        });

      if (
        response.status === "error"
      ) {

        setErrorMsg(
          "Invalid email or password"
        );

        return;
      }

      localStorage.setItem(
        "token",
        response.access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          response.user
        )
      );

      setIsSuccess(true);

      setTimeout(() => {

        router.push(
          "/dashboard"
        );

      }, 1500);

    } catch (error: any) {

      setErrorMsg(
        error?.response?.data?.message ||
        "Login failed"
      );

    } finally {

      setIsLoading(false);

    }
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans text-grey-1200 bg-[#FFFFFF] antialiased select-none">
      {/* Interactive canvas background */}
      <ParticleBackground />

      {/* Navigation Header */}
      <Header />

      {/* Centered Sign In form */}
      <main className="flex-grow flex items-center justify-center pt-[72px] pb-12 px-6">
        <div className="relative w-full max-w-[420px] bg-white/90 backdrop-blur-md border border-grey-100/50 rounded-[32px] p-8 md:p-10 shadow-[0_15px_50px_rgba(0,0,0,0.06)] overflow-hidden transition-all duration-300">

          {/* Decorative Google themed top stripe */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#34A853]" />

          {/* Success screen */}
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-[fadeIn_0.5s_ease-out]">
              <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-6 shadow-sm">
                <CheckIcon />
              </div>
              <h2 className="text-2xl font-bold tracking-tighter text-grey-1200 mb-2 font-heading">
                Welcome back!
              </h2>
              <p className="text-xs text-grey-800 font-medium max-w-xs mb-8">
                Authentication successful. Preparing your developer console...
              </p>
              <div className="w-8 h-8 border-2 border-[#121317]/10 border-t-[#121317] rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {/* Form Title */}
              <div className="text-center w-full mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter text-[#121317] mb-1 font-heading">
                  Sign In
                </h2>
                <p className="text-xs text-grey-800 font-medium">
                  Welcome back to Viza
                </p>
              </div>

              {/* Social Login Button */}

              {/* Divider */}
              {/* Form */}
              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 rounded-2xl text-left font-medium">
                    {errorMsg}
                  </div>
                )}

                {/* Email Address */}
                <div className="flex flex-col gap-1 w-full text-left">
                  <label className="text-[9px] font-bold text-grey-800 uppercase tracking-wider ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-[#F8F9FC] border border-grey-100 rounded-2xl px-4 py-2.5 text-xs text-grey-1200 placeholder-grey-300 focus:outline-none focus:border-grey-1200 focus:bg-white focus:ring-1 focus:ring-grey-1200/10 transition-all duration-200 disabled:opacity-50"
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1 w-full text-left">
                  <label className="text-[9px] font-bold text-grey-800 uppercase tracking-wider ml-1">
                    Password
                  </label>
                  <div className="relative w-full">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      disabled={isLoading}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#F8F9FC] border border-grey-100 rounded-2xl pl-4 pr-10 py-2.5 text-xs text-grey-1200 placeholder-grey-300 focus:outline-none focus:border-grey-1200 focus:bg-white focus:ring-1 focus:ring-grey-1200/10 transition-all duration-200 disabled:opacity-50"
                    />
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-grey-300 hover:text-grey-800 cursor-pointer transition-colors p-0.5"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                {/* Options Row */}

                {/* Submit button with Wave Reveal hover */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-curvy-fill w-full border border-grey-200 font-semibold py-3 rounded-full text-xs md:text-sm cursor-pointer shadow-sm hover:scale-[1.02] mt-4 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isLoading ? (
                    <>
                      <Spinner />
                      <span className="relative z-10">Signing In...</span>
                    </>
                  ) : (
                    <span className="relative z-10">Sign In</span>
                  )}
                </button>
              </form>

              {/* Redirect Footer */}
              <p className="text-xs text-grey-800 font-semibold mt-6">
                New to Viza?{' '}
                <Link href="/signup" className="text-grey-1200 hover:underline font-bold transition-colors">
                  Create account
                </Link>
              </p>
            </div>
          )}

        </div>
      </main>

      {/* Navigation Footer */}
      <Footer />
    </div>
  );
}
