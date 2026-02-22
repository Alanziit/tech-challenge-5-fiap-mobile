import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import ToastComponent from "./components/Toast";
import { subscribe, ToastMessage } from "./toastService";

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
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((t) => (
        <View key={t.id} style={styles.item} pointerEvents="auto">
          <ToastComponent
            id={t.id}
            message={t.message}
            type={t.type}
            duration={t.duration}
            onClose={handleClose}
          />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 16,
    right: 16,
    flexDirection: "column",
    gap: 12,
    zIndex: 9999,
  },
  item: {
    // preserve pointerEvents per-item
  },
});

export default ToastProvider;
