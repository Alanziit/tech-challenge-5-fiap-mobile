import React, { useEffect, useState } from "react";
import ToastComponent from "./components/Toast";
import { subscribe, ToastMessage } from "./toastService";

const containerStyle: React.CSSProperties = {
  position: "fixed",
  top: 16,
  right: 16,
  display: "flex",
  flexDirection: "column",
  gap: 12,
  zIndex: 9999,
};

export const ToastProvider: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const unsub = subscribe((msg) => {
      setToasts((t) => [...t, msg]);
    });
    return unsub;
  }, []);

  const handleClose = (id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  };

  return (
    <div style={containerStyle} pointerEvents="none">
      {toasts.map((t) => (
        <div key={t.id} style={{ pointerEvents: "auto" }}>
          <ToastComponent
            id={t.id}
            message={t.message}
            type={t.type}
            duration={t.duration}
            onClose={handleClose}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastProvider;
