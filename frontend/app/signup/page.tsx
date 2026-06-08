'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ParticleBackground from '@/components/ParticleBackground';
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/auth.service";


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

export default function SignUp() {



  const router = useRouter();


  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Simulation states
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password evaluation logic
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength(password);
  const strengthLabels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = [
    'bg-grey-100',      // empty
    'bg-[#EA4335]',    // Red (Weak)
    'bg-[#FBBC05]',    // Yellow (Fair)
    'bg-[#4285F4]',    // Blue (Good)
    'bg-[#34A853]'     // Green (Strong)
  ];

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

    if (!name || !email || !password) {

      setErrorMsg(
        "Please fill in all fields."
      );

      return;
    }

    if (password.length < 8) {

      setErrorMsg(
        "Password must be at least 8 characters long."
      );

      return;
    }

    if (!agreeTerms) {

      setErrorMsg(
        "Please agree to the Terms of Service & Privacy Policy."
      );

      return;
    }

    try {

      setIsLoading(true);

      const response =
        await registerUser({
          name,
          email,
          password
        });

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
        error?.response?.data?.detail ||
        "Registration failed"
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

      {/* Centered Sign Up form */}
      <main className="flex-grow flex items-center justify-center pt-[72px] pb-12 px-6">
        <div className="relative w-full max-w-[420px] bg-white/90 backdrop-blur-md border border-grey-100/50 rounded-[32px] p-8 md:p-10 shadow-[0_15px_50px_rgba(0,0,0,0.06)] overflow-hidden transition-all duration-300">

          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4285F4] via-[#EA4335] to-[#34A853]" />

          {/* Success screen */}
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-10 text-center animate-[fadeIn_0.5s_ease-out]">
              <div className="w-12 h-12 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-6 shadow-sm">
                <CheckIcon />
              </div>
              <h2 className="text-2xl font-bold tracking-tighter text-grey-1200 mb-2 font-heading">
                Account created!
              </h2>
              <p className="text-xs text-grey-800 font-medium max-w-xs mb-8">
                Welcome to  Viza, {name.split(' ')[0]}! Setting up your workspace environment...
              </p>
              <div className="w-8 h-8 border-2 border-[#121317]/10 border-t-[#121317] rounded-full animate-spin" />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {/* Form Title */}
              <div className="text-center w-full mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter text-[#121317] mb-1 font-heading">
                  Create Account
                </h2>
                <p className="text-xs text-grey-800 font-medium">
                  Build in the agent-first era
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3.5">
                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 rounded-2xl text-left font-medium">
                    {errorMsg}
                  </div>
                )}

                {/* Full Name */}
                <div className="flex flex-col gap-1 w-full text-left">
                  <label className="text-[9px] font-bold text-grey-800 uppercase tracking-wider ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isLoading}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Johnson"
                    className="w-full bg-[#F8F9FC] border border-grey-100 rounded-2xl px-4 py-2.5 text-xs text-grey-1200 placeholder-grey-300 focus:outline-none focus:border-grey-1200 focus:bg-white focus:ring-1 focus:ring-grey-1200/10 transition-all duration-200 disabled:opacity-50"
                  />
                </div>

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

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="flex flex-col gap-1.5 mt-1.5 px-1 animate-[fadeIn_0.2s_ease-out]">
                      <div className="flex justify-between items-center text-[10px] font-bold text-grey-800">
                        <span>Password Strength:</span>
                        <span style={{
                          color: strengthScore === 1 ? '#EA4335' :
                            strengthScore === 2 ? '#FBBC05' :
                              strengthScore === 3 ? '#4285F4' : '#34A853'
                        }}>
                          {strengthLabels[strengthScore]}
                        </span>
                      </div>
                      <div className="flex gap-1 h-1 w-full">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`flex-grow rounded-full h-full transition-all duration-500 ${i <= strengthScore ? strengthColors[strengthScore] : 'bg-grey-100'
                              }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Agree Terms Checkbox */}
                <div className="flex items-start gap-2.5 w-full text-[11px] font-semibold text-grey-800 mt-2 select-none text-left leading-snug">
                  <input
                    type="checkbox"
                    id="agree-terms"
                    disabled={isLoading}
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-3.5 h-3.5 rounded-md border-grey-200 text-[#121317] focus:ring-0 cursor-pointer accent-[#121317] mt-0.5"
                  />
                  <label htmlFor="agree-terms" className="cursor-pointer">
                    I agree to the{' '}
                    <a href="#" className="text-grey-1200 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-grey-1200 hover:underline">Privacy Policy</a>.
                  </label>
                </div>

                {/* Submit button with Wave Reveal hover */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-curvy-fill w-full border border-grey-200 font-semibold py-3 rounded-full text-xs md:text-sm cursor-pointer shadow-sm hover:scale-[1.02] mt-3 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isLoading ? (
                    <>
                      <Spinner />
                      <span className="relative z-10">Creating Account...</span>
                    </>
                  ) : (
                    <span className="relative z-10">Create Account</span>
                  )}
                </button>
              </form>

              {/* Redirect Footer */}
              <p className="text-xs text-grey-800 font-semibold mt-6">
                Already have an account?{' '}
                <Link href="/signin" className="text-grey-1200 hover:underline font-bold transition-colors">
                  Sign In
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
