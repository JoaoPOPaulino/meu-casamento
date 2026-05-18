import { Toaster } from "react-hot-toast";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#881337",
            border: "1px solid #fda4af",
            borderRadius: "12px",
            padding: "14px 16px",
          },
        }}
      />
    </>
  );
}
