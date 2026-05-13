import { useState } from "react";

let listeners = [];

export function toast({ title, description }) {
  listeners.forEach((l) => l({ title, description }));
}

export function useToast() {
  const [message, setMessage] = useState(null);

  const addToast = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  if (!listeners.includes(addToast)) {
    listeners.push(addToast);
  }

  return { message };
}