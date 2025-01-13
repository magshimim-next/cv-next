"use client";
import { createContext, useState, useContext, ReactNode } from "react";
import PopupWrapper from "@/components/ui/popupWrapper";

interface ErrorContextType {
  errorMsg: string | null;
  errorDescription: string | null;
  showError: (msg: string, desc: string, callback?: () => void) => void;
  clearError: () => void;
  errorCallback: (() => void) | null;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorDescription, setErrorDescription] = useState<string | null>(null);
  const [errorCallback, setErrorCallback] = useState<(() => void) | null>(null);

  const showError = (msg: string, desc: string, callback?: () => void) => {
    setErrorMsg(msg);
    setErrorDescription(desc);
    setErrorCallback(callback || null);
  };

  const clearError = () => {
    setErrorMsg(null);
    setErrorDescription(null);
    if (errorCallback) errorCallback();
    setErrorCallback(null);
  };

  return (
    <ErrorContext.Provider
      value={{
        errorMsg,
        errorDescription,
        showError,
        clearError,
        errorCallback,
      }}
    >
      {children}
      {errorMsg && (
        <PopupWrapper onClose={clearError}>
          <div className="flex flex-col items-center justify-center rounded-md border-2 border-black bg-red-700 px-4 py-2 text-red-500">
            <div className="text-xl font-bold">{errorMsg}</div>
            {errorDescription && (
              <div className="mt-2 text-lg text-red-500/90">
                {errorDescription}
              </div>
            )}
          </div>
        </PopupWrapper>
      )}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};
