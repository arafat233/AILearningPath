import { Link } from "react-router-dom";

export default function StartOnboarding() {
  return (
    <div className="min-h-screen bg-apple-gray6 flex items-center justify-center px-4">
      <div className="w-full max-w-[320px] text-center">

        <div className="w-20 h-20 rounded-[28px] bg-apple-blue shadow-apple-lg flex items-center justify-center mx-auto mb-8">
          <span className="text-white text-3xl font-black">A</span>
        </div>

        <h1 className="text-[28px] font-black text-[var(--label)] tracking-tight mb-2">AILearn</h1>
        <p className="text-[15px] text-apple-gray mb-10">Your personal AI study coach</p>

        <div className="flex flex-col gap-3">
          <Link to="/register" className="btn-primary w-full py-4 text-[16px]">
            Create Account
          </Link>
          <Link to="/login" className="btn-secondary w-full py-4 text-[16px]">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
}
