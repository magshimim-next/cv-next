"use client";

import { useState, ReactNode } from "react";
import { Button } from "./button";
import Alert from "./alert";

/**
 * Props for ButtonWithAlert component.
 */
interface ButtonWithAlertProps {
  /** The content of the button */
  buttonContent: ReactNode;
  /** The classname of the button */
  buttonClassName?: string;
  /** Whether the button is disabled */
  isDisabled?: boolean;
  /** The message shown in the alert */
  alertMessage: string;
  /** The color of the alert (defaults to red) */
  alertColor?: string;
  /** The action to perform on confirmation */
  onConfirm: () => void;
}

/**
 * The component renders a button that triggers an alert when clicked.
 * @param {ButtonWithAlertProps} props - The properties for the button with alert.
 * @returns {JSX.Element} A button with an alert dialog.
 */
export default function ButtonWithAlert({
  buttonContent,
  buttonClassName,
  isDisabled = false,
  alertMessage,
  alertColor = "red",
  onConfirm,
}: ButtonWithAlertProps) {
  const [showAlert, setShowAlert] = useState(false);
  return (
    <div className="flex w-full flex-col items-center">
      <Button
        type="button"
        className={buttonClassName}
        onClick={() => {
          setShowAlert(true);
        }}
        disabled={isDisabled}
      >
        {buttonContent}
      </Button>
      <div className="mt-3 w-full">
        <Alert
          display={showAlert ? "flex" : "none"}
          message={alertMessage}
          color={alertColor}
          onClick={(confirmed: boolean) => {
            setShowAlert(false);
            if (confirmed) onConfirm();
          }}
        />
      </div>
    </div>
  );
}
