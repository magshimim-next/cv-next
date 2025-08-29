"use client";
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";
import PopupWrapper from "@/components/ui/popupWrapper";

interface ErrorContextType {
  errorMsg: string | null;
  errorDescription: string | null;
  showError: ReturnType<typeof useCallback> &
    ((msg: string, desc: string, callback?: () => void) => void);
  clearError: () => void;
  errorCallback: (() => void) | null;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({ children }: { children: ReactNode }) => {
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorDescription, setErrorDescription] = useState<string | null>(null);
  const [errorCallback, setErrorCallback] = useState<(() => void) | null>(null);
  const [clearState, triggerClear] = useState(false);
  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);

  const showError = useCallback(
    (msg: string, desc: string, callback?: () => void) => {
      setErrorMsg(msg);
      setErrorDescription(desc);
      setErrorCallback(() => callback || null);
    },
    [setErrorMsg, setErrorDescription, setErrorCallback]
  );

  useEffect(() => {
    if (clearState) {
      setErrorMsg(null);
      setErrorDescription(null);
      const currentCallback = errorCallback;
      setErrorCallback(null);
      triggerClear(false);
      if (currentCallback) {
        currentCallback();
      }
    }
  }, [clearState, errorCallback, triggerClear]);

  useEffect(() => {
    if (prevPathname.current && prevPathname.current !== pathname && errorMsg) {
      triggerClear(true);
    }
    prevPathname.current = pathname;
  }, [pathname, errorMsg, triggerClear]);

  return (
    <ErrorContext.Provider
      value={{
        errorMsg,
        errorDescription,
        showError,
        clearError: () => triggerClear(true),
        errorCallback,
      }}
    >
      {children}
      {errorMsg && (
        <PopupWrapper onClose={() => triggerClear(true)}>
          <div className="flex flex-col items-center justify-center rounded-md border-2 border-primary bg-destructive px-4 py-2 text-primary">
            <div className="text-xl font-bold">{errorMsg}</div>
            {errorDescription && (
              <div className="mt-2 text-lg text-primary">
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
