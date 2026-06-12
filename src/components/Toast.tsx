import { Sparkles } from 'lucide-react';

type ToastProps = {
  message: string | null;
};

// Transient toast, extracted from the prototype's inline block (Slice 2).
// Renders nothing when there is no message — same as the prototype's
// `{toastMessage && (...)}` conditional.
export default function Toast({ message }: ToastProps) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-[60] bg-[#121115] text-[#b4b3ac] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#b4b3ac]/20 animate-bounce">
      <Sparkles className="w-5 h-5 text-[#b0a58d] animate-spin" />
      <span className="font-semibold text-sm tracking-wide">{message}</span>
    </div>
  );
}
