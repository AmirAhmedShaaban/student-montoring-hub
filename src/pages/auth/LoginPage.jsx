import LoginPageShell from "./components/LoginPageShell";
import AuthLoginIllustration from "./components/AuthLoginIllustration";
import LoginFormCard from "./components/LoginFormCard";

function LoginPage() {
  return (
    <LoginPageShell>
      <AuthLoginIllustration />
      <LoginFormCard />
    </LoginPageShell>
  );
}

export default LoginPage;
