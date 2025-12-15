import { useState } from "react";
import { motion } from "framer-motion";
import {
  UserCircleIcon,
  PencilIcon,
  ArrowLeftOnRectangleIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import FloatingLabelInput from "../../../components/UI/FloatingLabelInput";
import SplashedPushNotifications, {
  type SplashedPushNotificationsHandle,
} from "../../../components/UI/SplashedPushNotifications";

interface UserData {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: "USER" | "ADMIN";
  tierPoint: number;
  tier: string;
  active: boolean;
}

interface PasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ProfileSectionProps {
  userData: UserData | null;
  isEditing: boolean;
  formData: Partial<UserData>;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onLogout: () => void;
  onFormChange: (field: keyof UserData, value: string | number | boolean) => void;
  passwordData?: PasswordData;
  onPasswordChange?: (field: string, value: string) => void;
  passwordError?: string;
  notificationRef?: React.RefObject<SplashedPushNotificationsHandle>;
}

export function ProfileSection({
  userData,
  isEditing,
  formData,
  onEdit,
  onSave,
  onCancel,
  onLogout,
  onFormChange,
  passwordData = { currentPassword: "", newPassword: "", confirmPassword: "" },
  onPasswordChange,
  passwordError = "",
  notificationRef,
}: ProfileSectionProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      {notificationRef && <SplashedPushNotifications ref={notificationRef} />}
      <motion.div
        className="backdrop-blur-sm bg-white/10 shadow-2xl rounded-2xl border border-white/20 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-4 sm:px-8 py-4 sm:py-6">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4 flex-1">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur opacity-75 animate-pulse"></div>
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 border-white shadow-2xl flex items-center justify-center bg-indigo-500">
                  <UserCircleIcon className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-title font-bold text-white drop-shadow-lg">
                  {userData.name}
                </h1>
                <p className="text-indigo-100 text-sm sm:text-base break-all font-body">
                  {userData.email}
                </p>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
              {isEditing ? (
                <>
                  <button
                    onClick={onSave}
                    className="btn flex-1 sm:flex-none px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-all duration-200 font-button font-semibold text-sm"
                  >
                    Save All Changes
                  </button>
                  <button
                    onClick={onCancel}
                    className="btn flex-1 sm:flex-none px-4 py-2 bg-indigo-400/40 text-white rounded-lg hover:bg-indigo-400/60 transition-all duration-200 font-button font-semibold text-sm"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={onEdit}
                    className="btn flex-1 sm:flex-none px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2 font-button font-semibold text-sm"
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit Profile
                  </button>
                  <button
                    onClick={onLogout}
                    className="btn flex-1 sm:flex-none px-4 py-2 bg-red-500/40 hover:bg-red-500/60 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2 font-button font-semibold text-sm"
                  >
                    <ArrowLeftOnRectangleIcon className="w-4 h-4" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="space-y-4">
            {/* Profile Fields */}
            <div className="space-y-2">
              <h2 className="text-base sm:text-lg font-title font-bold text-white flex items-center gap-2">
                <UserCircleIcon className="w-5 h-5 text-pink-400" />
                Personal Information
              </h2>
            </div>

            {isEditing ? (
              <div className="space-y-6">
                {/* Profile Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-label font-semibold text-indigo-200 uppercase tracking-wider">Profile Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FloatingLabelInput
                      label="Full Name"
                      type="text"
                      value={formData.name || ""}
                      onValueChange={(v) => onFormChange("name", v)}
                      disabled={false}
                      autoComplete="name"
                    />
                    <FloatingLabelInput
                      label="Email"
                      type="email"
                      value={formData.email || ""}
                      onValueChange={(v) => onFormChange("email", v)}
                      disabled={true}
                      autoComplete="email"
                    />
                    <FloatingLabelInput
                      label="Phone Number"
                      type="tel"
                      value={formData.phoneNumber || ""}
                      onValueChange={(v) => onFormChange("phoneNumber", v)}
                      disabled={false}
                      autoComplete="tel"
                    />
                  </div>
                </div>

                {/* Password Section */}
                <div className="border-t border-slate-700/50 pt-6 space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 bg-gradient-to-b from-indigo-400 to-pink-400 rounded"></div>
                    <h3 className="text-sm font-label font-semibold text-indigo-200 uppercase tracking-wider">Change Password (Optional)</h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 font-body">Leave blank to keep your current password</p>
                  
                  {/* Current Password */}
                  <div className="relative">
                    <FloatingLabelInput
                      label="Current Password"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onValueChange={(v) => onPasswordChange?.("currentPassword", v)}
                      disabled={false}
                      autoComplete="current-password"
                    />
                    {passwordData.currentPassword && (
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      >
                        {showCurrentPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="relative">
                    <FloatingLabelInput
                      label="New Password"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onValueChange={(v) => onPasswordChange?.("newPassword", v)}
                      disabled={false}
                      autoComplete="new-password"
                    />
                    {passwordData.newPassword && (
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      >
                        {showNewPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <FloatingLabelInput
                      label="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onValueChange={(v) => onPasswordChange?.("confirmPassword", v)}
                      disabled={false}
                      autoComplete="new-password"
                    />
                    {passwordData.confirmPassword && (
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Password Error Message */}
                  {passwordError && (
                    <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                      <p className="text-red-300 text-sm font-body">{passwordError}</p>
                    </div>
                  )}

                  {/* Password Requirements */}
                  {passwordData.newPassword && (
                    <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                      <p className="text-xs text-indigo-300 font-semibold mb-2 font-label">Password Requirements:</p>
                      <ul className="text-xs text-indigo-200 space-y-1 font-body">
                        <li>✓ At least 8 characters</li>
                        <li>✓ Contains uppercase and lowercase letters</li>
                        <li>✓ Contains at least one number</li>
                        <li>✓ Contains at least one special character (@$!%*?&)</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-400 font-semibold font-label">
                    Full Name
                  </p>
                  <p className="text-white mt-1 font-body">{userData.name}</p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-400 font-semibold font-label">
                    Email
                  </p>
                  <p className="text-white mt-1 break-all font-body">{userData.email}</p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-400 font-semibold font-label">
                    Phone Number
                  </p>
                  <p className="text-white mt-1 font-body">{userData.phoneNumber}</p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700/50">
                  <p className="text-xs text-slate-400 font-semibold font-label">Tier</p>
                  <p className="text-white mt-1 font-body">{userData.tier}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
