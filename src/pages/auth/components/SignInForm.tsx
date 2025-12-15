import { Form } from "@heroui/react";
import { CineButton } from "../../../components/UI/CineButton";

interface SignInFormProps {
  email: string;
  password: string;
  loading: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SignInForm({
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: SignInFormProps) {
  return (
    <div className="h-full w-full flex items-center justify-center p-10">
      <div
        className="w-full max-w-md space-y-6
                              bg-gradient-to-br from-white/6 via-white/4 to-transparent
                              p-6 rounded-2xl border border-white/10 backdrop-blur-sm shadow-xl"
      >
        <h2 className="text-3xl font-title font-extrabold text-amber-50">Welcome Back</h2>
        <p className="mt-2  text-sl font-semibold text-amber-100/80">
          Sign in to your account
        </p>
        <Form onSubmit={onSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            value={email}
            onChange={onEmailChange}
            placeholder="Email"
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg bg-white/6 border border-white/10 text-white placeholder:text-amber-100/60 disabled:opacity-50"
          />
          <input
            name="password"
            type="password"
            value={password}
            onChange={onPasswordChange}
            placeholder="Password"
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg bg-white/6 border border-white/10 text-white placeholder:text-amber-100/60 disabled:opacity-50"
          />
          <CineButton type="submit" disabled={loading} className="w-full">
            {loading ? "Signing In..." : "Sign In"}
          </CineButton>
        </Form>
      </div>
    </div>
  );
}
