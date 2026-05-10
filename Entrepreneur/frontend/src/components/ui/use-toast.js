import { useState } from "react";

let listeners = [];

export function useToast() {
  const [message, setMessage] = useState(null);

  const toast = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  if (!listeners.includes(toast)) {
    listeners.push(toast);
  }

  return { toast, message };
}