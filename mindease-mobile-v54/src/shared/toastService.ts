export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

type Listener = (msg: ToastMessage) => void;

const listeners: Listener[] = [];

export const subscribe = (cb: Listener) => {
  listeners.push(cb);
  return () => {
    const idx = listeners.indexOf(cb);
    if (idx >= 0) listeners.splice(idx, 1);
  };
};

export const showToast = (payload: Omit<ToastMessage, "id">) => {
  const id = Date.now().toString();
  const msg: ToastMessage = { id, ...payload };
  listeners.forEach((l) => l(msg));
  return id;
};

export default { subscribe, showToast };
