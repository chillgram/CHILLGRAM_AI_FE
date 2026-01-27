import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginView from "@/components/auth/LoginView";

export default function AuthModal({ open, onClose }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const goSignup = () => {
    onClose?.();
    navigate("/signup");
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="absolute inset-0 flex items-center justify-center px-4 py-10">
        <div className="relative w-full max-w-5xl rounded-[48px] bg-white px-12 py-16 shadow-xl">
          <button
            type="button"
            aria-label="close"
            onClick={onClose}
            className="absolute right-10 top-10 text-5xl leading-none text-black"
          >
            ×
          </button>

          <LoginView onGoSignup={goSignup} onClose={onClose} />
        </div>
      </div>
    </div>
  );
}
