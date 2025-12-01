import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { StarIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../hooks";
import { useLogout } from "../../hooks/useLogout";
import { motion } from "framer-motion";
import { AccountSidebar } from "../../components/Layout/AccountSidebar";
import TargetCursor from "../../components/Layout/TargetCursor";
import { BackButton } from "../../components/UI/BackButton";
import SplashedPushNotifications, { type SplashedPushNotificationsHandle } from "../../components/UI/SplashedPushNotifications";
import { ProfileSection } from "./components/ProfileSection";

interface UserData {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: 'USER' | 'ADMIN';
  tierPoint: number;
  tier: string;
  tierCode?: string;
  active: boolean;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * Get tier name based on tier object from API or fallback to points
 */
function getTierName(tierPoint: number, tierObj?: { name: string; code: string; requiredPoints: number }): string {
  if (tierObj?.name) {
    return tierObj.name;
  }
  // Fallback if tier object not available
  if (tierPoint >= 5000) return "Platinum";
  if (tierPoint >= 3000) return "Gold";
  if (tierPoint >= 1000) return "Silver";
  return "Bronze";
}

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, fetchProfile, updateProfileAsync } = useAuth();
  // Logout to auth page when clicking logout button on this page
  const { executeLogout, cleanup } = useLogout("/auth");
  const notificationRef = useRef<SplashedPushNotificationsHandle>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState<PasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState<Partial<UserData>>({});
  const hasInitialized = useRef(false);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    // Only initialize once to prevent infinite loops
    if (hasInitialized.current) {
      return;
    }

    hasInitialized.current = true;

    // Fetch user profile on component mount
    const initializeProfile = async () => {
      await fetchProfile();
    };

    initializeProfile();
  }, [user, navigate, fetchProfile]);

  // Separate effect to update UI when user data changes
  useEffect(() => {
    if (user && hasInitialized.current) {
      // Get tier name from user object if available, otherwise calculate from points
      const tierName = getTierName(user?.tierPoint || 0, user?.tier);
      const userData: UserData = {
        id: user?.id?.toString() || "1",
        name: user?.name || "User",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        role: user?.role || "USER",
        tierPoint: user?.tierPoint || 0,
        tier: tierName,
        tierCode: user?.tier?.code,
        active: user?.active !== false,
      };

      setUserData(userData);
      setFormData(userData);
    }
  }, [user]);

  const handleSave = async () => {
    // Validate form data
    if (!formData.name?.trim()) {
      notificationRef.current?.createNotification("error", "Validation Error", "Name is required");
      return;
    }
    
    if (!formData.phoneNumber?.trim()) {
      notificationRef.current?.createNotification("error", "Validation Error", "Phone number is required");
      return;
    }

    // Validate password if any password field is filled
    const hasPasswordChange = passwordData.currentPassword || passwordData.newPassword || passwordData.confirmPassword;
    
    if (hasPasswordChange) {
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setPasswordError("All password fields are required when changing password");
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError("New passwords do not match");
        return;
      }

      if (passwordData.newPassword.length < 8) {
        setPasswordError("New password must be at least 8 characters");
        return;
      }

      // Check for password complexity (at least 1 uppercase, 1 lowercase, 1 number, 1 special char)
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(passwordData.newPassword)) {
        setPasswordError("Password must contain uppercase, lowercase, number, and special character");
        return;
      }
    }

    try {
      // Prepare update data - email and tierPoint are required by backend
      const updateData: Record<string, string | number | boolean> = {
        email: formData.email || user?.email || "",
        name: formData.name || "",
        phoneNumber: formData.phoneNumber || "",
        tierPoint: userData?.tierPoint || 0,
      };

      // Add password field if password is being changed
      // Backend expects the new password in the 'password' field
      if (hasPasswordChange) {
        updateData.password = passwordData.newPassword; // New password to set
      }

      // Call updateProfile API
      await updateProfileAsync(updateData);

      setUserData((prev) => (prev ? { ...prev, ...formData } : null));
      setIsEditing(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordError("");
      
      const successMessage = hasPasswordChange 
        ? "Your profile and password have been updated successfully."
        : "Your account details have been updated successfully.";
      notificationRef.current?.createNotification("success", "Changes Saved", successMessage);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to update your profile. Please try again.";
      notificationRef.current?.createNotification("error", "Update Failed", errorMessage);
    }
  };

  const handleCancel = () => {
    setFormData(userData || {});
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordError("");
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await executeLogout();
  };

  const handlePasswordDataChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
    setPasswordError("");
  };

  const handleFormChange = (field: keyof UserData, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!userData) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-pink-900 flex items-center justify-center pt-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="relative"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-20 h-20 border-4 border-pink-400/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          ></motion.div>
          <motion.div
            className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-pink-400 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          ></motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <>
      <TargetCursor targetSelector="button, a[role='button'], [role='button'], .btn, .button, [class*='btn'], [class*='button'], .shiny-cta, .shiny-cta-link, .cursor-target" spinDuration={2} hideDefaultCursor={true} hoverDuration={0.2} parallaxOn={true} />
      <SplashedPushNotifications ref={notificationRef} />
      <motion.div
        className="min-h-screen bg-gradient-to-br from-indigo-900 via-indigo-800 to-pink-900 px-4 sm:px-6 lg:px-8 pt-16 pb-4"
      >
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative w-full mx-auto">
          <div className="mb-6 px-6">
            <BackButton />
          </div>

          <div className="flex flex-col lg:flex-row gap-0 h-fit px-6">
            <AccountSidebar />

            <div className="flex-1 min-h-0 ml-6">
              <ProfileSection
                userData={userData}
                isEditing={isEditing}
                formData={formData}
                onEdit={() => setIsEditing(true)}
                onSave={handleSave}
                onCancel={handleCancel}
                onLogout={handleLogout}
                onFormChange={handleFormChange}
                passwordData={passwordData}
                onPasswordChange={handlePasswordDataChange}
                passwordError={passwordError}
                notificationRef={notificationRef as React.RefObject<SplashedPushNotificationsHandle>}
              />

              <div className="mt-6 space-y-4">
                <div className="space-y-2">
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 mb-6">
                    <StarIcon className="w-5 h-5 text-yellow-400" />
                    Membership & Rewards
                  </h2>

                  {/* Rewards Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Reward Points Card */}
                    <motion.div
                      className="relative group rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 p-6 backdrop-blur-sm"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-purple-300 text-sm font-semibold tracking-widest mb-1">REWARD BALANCE</p>
                            <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                              {userData?.tierPoint.toLocaleString()}
                            </h3>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center border border-purple-400/50">
                            <span className="text-xl">⭐</span>
                          </div>
                        </div>

                        <p className="text-indigo-200 text-sm mb-6 leading-relaxed">
                          Use your points to unlock exclusive discounts, early access, and special perks.
                        </p>

                        <div className="flex gap-3">
                        </div>
                      </div>

                      {/* Animated border effect */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 opacity-20"></div>
                      </div>
                    </motion.div>

                    {/* Membership Tier Card */}
                    <motion.div
                      className="relative group rounded-2xl overflow-hidden bg-gradient-to-br from-pink-900/40 to-rose-900/40 border border-pink-500/30 hover:border-pink-400/60 transition-all duration-300 p-6 backdrop-blur-sm"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="text-pink-300 text-sm font-semibold tracking-widest mb-1">MEMBERSHIP TIER</p>
                            <h3 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-rose-300">
                              {userData?.tier}
                            </h3>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500/30 to-rose-500/30 flex items-center justify-center border border-pink-400/50">
                            <span className="text-xl">👑</span>
                          </div>
                        </div>

                        <p className="text-rose-200 text-sm mb-6 leading-relaxed">
                          Unlock premium benefits and earn 2x points on every booking.
                        </p>

                        <div className="flex gap-3">
                        </div>
                      </div>

                      {/* Animated border effect */}
                      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 opacity-20"></div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Benefits Showcase */}
                  <motion.div
                    className="mt-6 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-600/10 border border-violet-400/30 p-6 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <h3 className="text-white font-bold mb-4 text-sm flex items-center gap-2">
                      <span className="text-lg">✨</span>
                      Your {userData?.tier} Tier Benefits
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex-shrink-0 mt-1.5"></div>
                        <span className="text-xs text-indigo-100">10% discount on all movie bookings</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex-shrink-0 mt-1.5"></div>
                        <span className="text-xs text-indigo-100">Early access to exclusive screenings and premieres</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex-shrink-0 mt-1.5"></div>
                        <span className="text-xs text-indigo-100">Priority customer support (24/7)</span>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex-shrink-0 mt-1.5"></div>
                        <span className="text-xs text-indigo-100">Earn 2x points on every booking</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
