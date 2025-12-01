import { MultiStepLoader } from '../UI/MultiStepLoader';

const logoutLoadingStates = [
  { text: "Saving session data..." },
  { text: "Clearing credentials..." },
  { text: "Redirecting to home..." },
];

interface LogoutLoaderProps {
  loading: boolean;
}

export function LogoutLoader({ loading }: LogoutLoaderProps) {
  return (
    <MultiStepLoader
      loading={loading}
      loadingStates={logoutLoadingStates}
      duration={700}
      loop={false}
    />
  );
}
