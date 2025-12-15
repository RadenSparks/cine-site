import { Form } from "@heroui/react";
import { CineButton } from "../../../components/UI/CineButton";

interface SignUpFormProps {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  loading: boolean;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SignUpForm({
  name,
  email,
  password,
  phoneNumber,
  loading,
  onNameChange,
  onPhoneChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: SignUpFormProps) {
  return (
    <div className="h-full w-full flex items-center justify-center p-10">
      <div
        className="w-full max-w-md space-y-6
                              bg-gradient-to-br from-white/6 via-white/4 to-transparent
                              p-6 rounded-2xl border border-white/10 backdrop-blur-sm shadow-xl"
      >
        <h2 className="text-3xl font-title font-extrabold text-amber-50">Create Account</h2>
        <p className="mt-2  text-sl font-semibold text-amber-100/80">
          Register for a new account
        </p>
        <Form onSubmit={onSubmit} className="space-y-4">
          <input
            name="name"
            value={name}
            onChange={onNameChange}
            placeholder="Name"
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg bg-white/6 border border-white/10 text-white placeholder:text-white/60 disabled:opacity-50"
          />
          <input
            name="phone"
            value={phoneNumber}
            onChange={onPhoneChange}
            placeholder="Phone Number (Optional)"
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg bg-white/6 border border-white/10 text-white placeholder:text-white/60 disabled:opacity-50"
          />
          <input
            name="email"
            type="email"
            value={email}
            onChange={onEmailChange}
            placeholder="Email"
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg bg-white/6 border border-white/10 text-white placeholder:text-white/60 disabled:opacity-50"
          />
          <input
            name="password"
            type="password"
            value={password}
            onChange={onPasswordChange}
            placeholder="Password"
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg bg-white/6 border border-white/10 text-white placeholder:text-white/60 disabled:opacity-50"
          />
          <CineButton type="submit" disabled={loading} className="w-full">
            {loading ? "Creating Account..." : "Sign Up"}
          </CineButton>
        </Form>
      </div>
    </div>
  );
}
