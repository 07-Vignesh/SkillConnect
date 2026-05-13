import { useToast } from "./use-toast";

export function Toaster() {
  const { message } = useToast();

  if (!message) return null;

  return (
    <div className="fixed top-5 right-5 z-50 bg-black text-white px-6 py-4 rounded-lg shadow-lg border border-white/10">
      <h4 className="font-semibold">{message.title}</h4>
      <p className="text-sm text-gray-300">{message.description}</p>
    </div>
  );
}