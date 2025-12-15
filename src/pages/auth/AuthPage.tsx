"use client";

import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAuth } from "../../hooks";
import { storeUser } from "../../lib/auth";
import { login } from "../../store/authSlice";
import type { User } from "../../types/auth";
import type { AppDispatch } from "../../store";
import { useAnimation } from "../../contexts/AnimationContext";
import { Card } from "@heroui/react";
import { CineButton } from "../../components/UI/CineButton";
import { MultiStepLoader } from "../../components/UI/MultiStepLoader";
import TargetCursor from "../../components/Layout/TargetCursor";
import { motion } from "framer-motion";
import { StarsBackground } from "../../components/Layout/StarsBackground";
import { ShootingStars } from "../../components/Layout/ShootingStars";
import { SignInForm } from "./components/SignInForm";
import { SignUpForm } from "./components/SignUpForm";
import { useNotification } from "../../contexts/NotificationContext";
import { authenticateUser, fetchUserProfile } from "../../client/authApi";

// Email validation helper
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPassword = (password: string): string | null => {
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain lowercase letters";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain uppercase letters";
  }
  if (!/\d/.test(password)) {
    return "Password must contain numbers";
  }
  if (!/[@$!%*?&]/.test(password)) {
    return "Password must contain special characters (@$!%*?&)";
  }
  return null;
};

// Phone number validation helper
const isValidPhoneNumber = (phone: string): string | null => {
  if (!phone || phone.trim() === "") {
    // Phone is optional
    return null;
  }
  
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, "");
  
  // Check if it has at least 10 digits
  if (digitsOnly.length < 10) {
    return "Phone number must have at least 10 digits";
  }
  
  // Check if it has at most 15 digits (international standard)
  if (digitsOnly.length > 15) {
    return "Phone number must not exceed 15 digits";
  }
  
  return null;
};

export default function AuthPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { showNotification } = useNotification();
  const { setAuthAnimating } = useAnimation();
  const navigationRef = useRef(false); // Guard to prevent duplicate navigation
  const { registerAsync } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);

  // Sign in state
  const [siEmail, setSiEmail] = useState("");
  const [siPassword, setSiPassword] = useState("");

  // Sign up state
  const [suName, setSuName] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPassword, setSuPassword] = useState("");
  const [suPhoneNumber, setSuPhoneNumber] = useState("");

  // Reset navigation guard when component unmounts or when signup/signin toggles
  useEffect(() => {
    navigationRef.current = false;
  }, [isSignUp]);

  // Store timeout IDs to clear them on unmount
  useEffect(() => {
    return () => {
      // Component is unmounting - timeouts will be cleared by JS engine
      // but log it for debugging
      if (navigationRef.current) {
        console.log('🛑 AuthPage unmounting - navigation already happened');
      } else {
        console.log('⚠️  AuthPage unmounting - animation may have been interrupted');
      }
    };
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    
    // Validate email
    if (!siEmail) {
      showNotification(
        "warning",
        "Missing Email",
        "Please enter your email address"
      );
      return;
    }

    if (!isValidEmail(siEmail)) {
      showNotification(
        "warning",
        "Invalid Email",
        "Please enter a valid email address"
      );
      return;
    }

    // Validate password
    if (!siPassword) {
      showNotification(
        "warning",
        "Missing Password",
        "Please enter your password"
      );
      return;
    }

    const passwordError = isValidPassword(siPassword);
    if (passwordError) {
      showNotification(
        "warning",
        "Invalid Password",
        passwordError
      );
      return;
    }

    try {
      // Call authenticate token endpoint directly WITHOUT updating Redux state
      // This way we can validate credentials while keeping animations smooth
      let authResponse;
      try {
        authResponse = await authenticateUser({
          email: siEmail,
          password: siPassword,
        });
        console.log('✅ Authentication successful:', authResponse.email);
      } catch (err) {
        console.error('❌ Authentication error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Invalid email or password';
        showNotification(
          "error",
          "Login Failed",
          errorMessage
        );
        return; // Exit early on auth failure - NO animation
      }

      // SET ANIMATION FLAG - prevent PublicRoute from redirecting
      setAuthAnimating(true);
      console.log('🎬 Auth animation started - blocking PublicRoute redirects');

      // Start loader animation WITHOUT showing notification yet
      setLoginLoading(true);

      // Clear the form
      setSiEmail("");
      setSiPassword("");

      // Fetch full user profile using the token we got from authentication
      let fullUserData: User | null = null;
      try {
        const profileData = await fetchUserProfile(authResponse.email, authResponse.accessToken);
        fullUserData = {
          id: profileData.id,
          name: profileData.name,
          email: profileData.email,
          phoneNumber: profileData.phoneNumber,
          role: profileData.role as 'USER',
          active: profileData.active,
          tierPoint: profileData.tierPoint,
          tier: profileData.tier,
          accessToken: authResponse.accessToken,
        };
        console.log('✅ User profile fetched successfully');
      } catch (profileError) {
        console.warn('Failed to fetch full profile after login, using basic data:', profileError);
        // Use basic auth data if profile fetch fails
        fullUserData = {
          id: authResponse.id,
          email: authResponse.email,
          role: authResponse.role,
          accessToken: authResponse.accessToken,
        };
      }

      // Timeline for loader animation:
      // T+0ms: Loader mounts, state 0 visible
      // T+700ms: State 0→1 (effect runs, schedules next timeout)
      // T+1400ms: State 1→2 (effect runs, schedules next timeout)
      // T+2100ms: State 2 stays (tries to go to 3, clamped to 2, no change, effect doesn't run)
      // T+2800ms: Extra safety buffer - state 2 is definitely rendered
      // T+2800ms: Turn off loader to start exit animation
      // T+3200ms: Exit animation complete (400ms for fade out)
      // T+3200ms: Navigate to home (component unmounts)

      const loaderDuration = 700; // Per step (in milliseconds)
      const totalSteps = 3; // We have 3 loading states (0, 1, 2)
      const exitAnimationDuration = 200; // Reduced: exit fade animation is fast
      
      // To ensure all 3 states are displayed:
      // We need (totalSteps - 1) transitions = 2 transitions
      // Plus one full duration cycle for the final state to render = +1
      // totalSteps * duration total
      // Plus one more full cycle as safety = totalSteps + 1
      const totalAnimationTime = loaderDuration * (totalSteps + 1); // 2800ms

      // Log timeline for debugging
      console.log('🔄 LOGIN ANIMATION TIMELINE:');
      console.log(`T+0ms: Notification + Loader start (state 0)`);
      console.log(`T+700ms: State 0→1`);
      console.log(`T+1400ms: State 1→2`);
      console.log(`T+2100ms: State 2 locked (no further increment)`);
      console.log(`T+${totalAnimationTime}ms: setLoginLoading(false) - Exit animation starts`);
      console.log(`T+${totalAnimationTime + exitAnimationDuration}ms: navigate("/") - AFTER exit completes`);

      // Turn off loader after all animations complete
      setTimeout(() => {
        console.log('✋ Turning off loader (exit animation begins)');
        setLoginLoading(false);
      }, totalAnimationTime);

      // Navigate after exit animation completes
      // Reduced delay: exit animation only needs ~200ms instead of 400ms
      setTimeout(() => {
        console.log('🚀 Navigation timeout fired - checking if should navigate');
        if (!navigationRef.current) {
          console.log('✅ Navigating to home (animation complete)');
          navigationRef.current = true;
          
          // Store user to localStorage AND update Redux state
          if (fullUserData) {
            console.log('💾 Storing user to localStorage after animation:', fullUserData.email);
            storeUser(fullUserData);
            
            // Update Redux state so Navbar UserMenu renders immediately
            dispatch(login(fullUserData));
            console.log('📦 Redux state updated with user data');
          } else {
            console.warn('⚠️  No user data to store');
          }
          
          // Navigate to home BEFORE clearing animation flag
          // This ensures PublicRoute won't re-evaluate and render auth page
          navigate("/");
          console.log('✅ Navigation completed');
          
          // Show success notification AFTER navigation completes
          // Small delay to ensure DOM is ready
          setTimeout(() => {
            showNotification(
              "success",
              "Login Successful",
              "Welcome back!"
            );
            console.log('🎉 Success notification shown');
            
            // CRITICAL: Clear animation flag AFTER notification shown
            // Use a small delay to ensure React Router commits the route change
            // before allowing PublicRoute to evaluate again
            setTimeout(() => {
              setAuthAnimating(false);
              console.log('🎬 Auth animation ended - PublicRoute can redirect again');
            }, 50);
          }, 100);
        } else {
          console.log('⚠️  Navigation already happened');
          setAuthAnimating(false);
        }
      }, totalAnimationTime + exitAnimationDuration);

    } catch (error) {
      setLoginLoading(false);
      setAuthAnimating(false);
      const errorMessage =
        error instanceof Error ? error.message : "Login failed. Please try again.";
      showNotification(
        "error",
        "Login Failed",
        errorMessage
      );
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    
    // Validate name
    if (!suName) {
      showNotification(
        "warning",
        "Missing Name",
        "Please enter your full name"
      );
      return;
    }

    // Validate email
    if (!suEmail) {
      showNotification(
        "warning",
        "Missing Email",
        "Please enter your email address"
      );
      return;
    }

    if (!isValidEmail(suEmail)) {
      showNotification(
        "warning",
        "Invalid Email",
        "Please enter a valid email address"
      );
      return;
    }

    // Validate password
    if (!suPassword) {
      showNotification(
        "warning",
        "Missing Password",
        "Please enter a password"
      );
      return;
    }

    const passwordError = isValidPassword(suPassword);
    if (passwordError) {
      showNotification(
        "warning",
        "Invalid Password",
        passwordError
      );
      return;
    }

    // Validate phone number (if provided)
    const phoneError = isValidPhoneNumber(suPhoneNumber);
    if (phoneError) {
      showNotification(
        "warning",
        "Invalid Phone Number",
        phoneError
      );
      return;
    }

    setSignUpLoading(true);
    try {
      // Call register endpoint
      await registerAsync({
        name: suName,
        email: suEmail,
        password: suPassword,
        phoneNumber: suPhoneNumber || undefined,
      });

      showNotification(
        "success",
        "Registration Successful",
        "Account created! Please log in with your credentials."
      );
      setSuName("");
      setSuEmail("");
      setSuPassword("");
      setSuPhoneNumber("");
      setIsSignUp(false);
      setSignUpLoading(false);
    } catch (error) {
      setSignUpLoading(false);
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed. Please try again.";
      showNotification(
        "error",
        "Registration Failed",
        errorMessage
      );
    }
  }

  return (
    <>
      <TargetCursor targetSelector="button, a[role='button'], [role='button'], .btn, .button, [class*='btn'], [class*='button'], .shiny-cta, .shiny-cta-link, .cursor-target" spinDuration={2} hideDefaultCursor={true} hoverDuration={0.2} parallaxOn={true} />
      <MultiStepLoader
        loading={loginLoading}
        loadingStates={[
          { text: "Validating credentials..." },
          { text: "Authenticating user..." },
          { text: "Navigating to HomePage..." },
        ]}
        duration={700}
        loop={false}
      />
      <div className="relative min-h-screen w-full flex items-center justify-center px-4">
        {/* wallpaper base */}
        <div
          className="absolute inset-0 -z-30"
          style={{
            backgroundImage:
          "url('/images/avatar.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            filter: "saturate(1.05) contrast(1.03) blur(0.2px)",
          }}
          aria-hidden
        />

      {/* subtle starfield canvas (responsive) */}
      <div className="absolute inset-0 -z-20 pointer-events-none">
        <StarsBackground
          starDensity={0.00012}
          allStarsTwinkle={false}
          twinkleProbability={0.65}
          minTwinkleSpeed={0.6}
          maxTwinkleSpeed={1.2}
          className="opacity-70 mix-blend-screen"
        />
      </div>

      {/* occasional shooting stars for accent */}
      <div className="absolute inset-0 -z-15 pointer-events-none">
        <ShootingStars
          minSpeed={4}           // Slower minimum speed
          maxSpeed={8}           // Slower maximum speed
          minDelay={800}         // More frequent minimum delay
          maxDelay={2000}        // More frequent maximum delay
          starColor="#ffffff"    // Brighter star
          trailColor="#6366f1"   // Indigo trail
          starWidth={20}         // Larger width
          starHeight={3}         // Larger height
          className="mix-blend-screen opacity-80"  // Changed blend mode for better visibility
        />
      </div>

      <Card className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl bg-black/20 backdrop-blur-sm">
        <div className="relative grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
          {/* Left Panel (Sign Up) */}
          <div
            className={`absolute top-0 bottom-0 left-0 duration-700 ease-in-out transition-all transform ${
              isSignUp ? "translate-x-0 opacity-100 z-20" : "translate-x-full opacity-0 z-10"
            }`}
            style={{ width: "50%" }}
          >
            <SignUpForm
              name={suName}
              email={suEmail}
              password={suPassword}
              phoneNumber={suPhoneNumber}
              loading={signUpLoading}
              onNameChange={(e) => setSuName(e.target.value)}
              onPhoneChange={(e) => setSuPhoneNumber(e.target.value)}
              onEmailChange={(e) => setSuEmail(e.target.value)}
              onPasswordChange={(e) => setSuPassword(e.target.value)}
              onSubmit={handleSignUp}
            />
          </div>

          {/* Right Panel (Sign In) */}
          <div
            className={`absolute top-0 bottom-0 right-0 duration-700 ease-in-out transition-all transform ${
              isSignUp ? "translate-x-full opacity-0 z-10" : "translate-x-0 opacity-100 z-20"
            }`}
            style={{ width: "50%" }}
          >
            <SignInForm
              email={siEmail}
              password={siPassword}
              loading={loginLoading}
              onEmailChange={(e) => setSiEmail(e.target.value)}
              onPasswordChange={(e) => setSiPassword(e.target.value)}
              onSubmit={handleLogin}
            />
          </div>

          {/* Overlay Panel */}
          <motion.div
            className="absolute top-0 left-0 w-1/2 h-full hidden md:block"
            initial={false}
            animate={{ x: isSignUp ? "100%" : "0%" }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            style={{ backgroundImage: "linear-gradient(135deg,#5e85acdd 0%, #e2e2c5cc 50%, #3daadddd 100%)" }}
          >
            <div className="relative h-full w-full flex items-center justify-center p-8">
              <div className="text-center text-black/90">
                {isSignUp ? (
                  <>
                    <h3 className="text-3xl font-title font-bold mb-2">Welcome Back!</h3>
                    <p className="mb-6 text-black/70 font-body">Already have an account? Sign in to continue your journey.</p>
                    <CineButton onClick={() => setIsSignUp(false)} className="bg-white/90">Sign In</CineButton>
                  </>
                ) : (
                  <>
                    <h3 className="text-3xl font-title font-bold mb-2">Hello, Friend!</h3>
                    <p className="mb-6 text-black/70 font-body">Register and book your tickets now!!!</p>
                    <CineButton onClick={() => setIsSignUp(true)} className="bg-white/90">Sign Up</CineButton>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Mobile Toggle */}
          <div className="absolute bottom-4 left-0 right-0 text-center md:hidden">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-pink-300 hover:text-pink-200 font-body"
            >
              {isSignUp ? "Already have an account? Sign In" : "Need an account? Sign Up"}
            </button>
          </div>
        </div>
      </Card>
    </div>
    </>
  );
}