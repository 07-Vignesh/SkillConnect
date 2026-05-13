import { SignIn } from "@clerk/clerk-react";

const LoginPage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden" style={{ backgroundColor: "#080810" }}>
      <div className="grid-background" />
      <div className="bg-bloom-top" />
      <div className="bg-bloom-bottom" />
      <div className="bg-noise" />

      <div className="page-content w-full max-w-md animate-fade-up">
        <div className="text-center mb-8">
          <span className="badge-violet mb-4 inline-flex">Welcome Back</span>
          <h2 className="text-3xl font-extrabold text-white">Sign in to SkillConnect</h2>
          <p className="text-gray-400 mt-2 text-sm">Continue your freelance journey</p>
        </div>

        <div className="glass-card p-6" style={{ borderColor: "rgba(124,58,237,0.2)" }}>
          <div className="flex justify-center">
            <SignIn
              signUpUrl="/register"
              appearance={{
                elements: {
                  card: "shadow-none bg-transparent",
                  headerTitle: "text-white",
                  headerSubtitle: "text-gray-400",
                  dividerLine: "bg-white/10",
                  dividerText: "text-gray-500",
                  formFieldLabel: "text-gray-300 text-xs uppercase tracking-wide",
                  formFieldInput: "bg-white/5 border border-white/10 text-white placeholder:text-gray-500 rounded-lg",
                  socialButtonsBlockButton: "bg-white/5 text-white border border-white/10 hover:bg-white/10 rounded-lg",
                  formButtonPrimary: "bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:opacity-90",
                  footerActionLink: "text-violet-400 hover:text-violet-300",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
