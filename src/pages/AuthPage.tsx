"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { register, login } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { Card, Divider, Form } from "@heroui/react";
import { CineButton } from "../components/UI/CineButton";
import { motion } from "framer-motion";

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);

  // Sign in state
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");
  const [siError, setSiError] = useState("");

  // Sign up state
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suError, setSuError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (siEmail && siPassword) {
      dispatch(login({ email: siEmail }));
      setSiError("");
      navigate("/");
    } else {
      setSiError("Please enter email and password");
    }
  }

  function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (suName && suEmail && suPassword) {
      dispatch(register({ email: suEmail, name: suName }));
      setSuError("");
      navigate("/");
    } else {
      setSuError("Please fill all fields");
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-900 via-indigo-900 to-pink-900 px-4">
      <Card className="relative w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Forms column */}
          <div className="p-8 bg-black/60 md:bg-transparent flex items-center justify-center">
            <motion.div
              key={isSignUp ? "signup" : "signin"}
              initial="hidden"
              animate="show"
              variants={containerVariants}
              className="w-full max-w-md"
            >
              <h2 className="text-3xl font-extrabold text-white mb-2">
                {isSignUp ? "Create Account" : "Welcome Back"}
              </h2>
              <p className="text-sm text-pink-100 mb-6">
                {isSignUp
                  ? "Register and book your tickets now!"
                  : "Sign in to access your bookings and preferences."}
              </p>

              <Divider />

              <Form
                onSubmit={isSignUp ? handleSignUp : handleLogin}
                className="mt-4 space-y-4"
              >
                {isSignUp && (
                  <input
                    name="name"
                    value={suName}
                    onChange={(e) => setSuName(e.target.value)}
                    placeholder="Name"
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/60 focus:outline-none"
                  />
                )}

                <input
                  name="email"
                  type="email"
                  value={isSignUp ? suEmail : siEmail}
                  onChange={(e) =>
                    isSignUp ? setSuEmail(e.target.value) : setSiEmail(e.target.value)
                  }
                  placeholder="Email"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/60 focus:outline-none"
                />

                <input
                  name="password"
                  type="password"
                  value={isSignUp ? suPassword : siPassword}
                  onChange={(e) =>
                    isSignUp ? setSuPassword(e.target.value) : setSiPassword(e.target.value)
                  }
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/60 focus:outline-none"
                />

                {!isSignUp && (
                  <div className="text-right">
                    <a className="text-sm text-pink-300 hover:underline" href="#">
                      Forgot your password?
                    </a>
                  </div>
                )}

                {(isSignUp ? suError : siError) && (
                  <div className="text-sm text-red-400">{isSignUp ? suError : siError}</div>
                )}

                <CineButton type="submit" className="mt-2">
                  {isSignUp ? "Sign Up" : "Sign In"}
                </CineButton>
              </Form>
            </motion.div>
          </div>

          {/* Overlay / Panels column */}
          <div className="relative hidden md:flex items-center justify-center bg-gradient-to-br from-pink-800 via-indigo-900 to-black p-8">
            <div className="absolute inset-0 opacity-20 bg-black" />
            <motion.div
              initial={{ x: isSignUp ? 0 : 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="relative z-10 max-w-sm text-center text-white"
            >
              {isSignUp ? (
                <>
                  <h3 className="text-3xl font-bold mb-2">Already have an account?</h3>
                  <p className="mb-6 text-pink-100">
                    If you already have an account, sign in to continue and manage your
                    bookings.
                  </p>
                  <CineButton
                    onClick={() => setIsSignUp(false)}
                    className="mx-auto mt-2"
                  >
                    Sign In
                  </CineButton>
                </>
              ) : (
                <>
                  <h3 className="text-3xl font-bold mb-2">Hello, Friend!</h3>
                  <p className="mb-6 text-pink-100">
                    New here? Create an account to book tickets, save favorites and more.
                  </p>
                  <CineButton
                    onClick={() => setIsSignUp(true)}
                    className="mx-auto mt-2"
                  >
                    Sign Up
                  </CineButton>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </Card>
    </div>
  );
}