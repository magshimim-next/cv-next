"use client";

import { useState, ReactNode } from "react";
import { Button } from "./button";
import Alert from "./alert";

interface ButtonWithAlertProps {
  buttonContent: ReactNode;
  buttonClassName?: string;
  isDisabled?: boolean;
  alertMessage: string;
  alertColor?: string;
  onConfirm: () => void;
}

/**
 * The component renders a button that trigger at alert when clicked.
 * @param {ReactNode} buttonContent The content of the button
 * @param {string} buttonClassName The classname of the button
 * @param {boolean} isDisabled Whether the button is disabled
 * @param {string} alertMessage The message shown in the alert
 * @param {string} alertColor The color of the alert defaults to red.
 * @param {() => void} onConfirm The action to perform.
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
