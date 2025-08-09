"use client";

import React, { useEffect } from "react";
import { Button } from "./button";
import Alert from "./alert";

interface ButtonWithAlertProps {
  buttonText: React.ReactNode;
  buttonClassName?: string;
  isDisabled?: boolean;
  alertMessage: string;
  alertColor?: string;
  onConfirm: () => void;
  closeSignal?: any;
}

/**
 *
 * @param root0
 * @param root0.buttonText
 * @param root0.buttonClassName
 * @param root0.isDisabled
 * @param root0.alertMessage
 * @param root0.alertColor
 * @param root0.onConfirm
 * @param root0.closeSignal
 */
export default function ButtonWithAlert({
  buttonText,
  buttonClassName,
  isDisabled = false,
  alertMessage,
  alertColor = "red",
  onConfirm,
  closeSignal,
}: ButtonWithAlertProps) {
  const [showAlert, setShowAlert] = React.useState(false);
  useEffect(() => {
    setShowAlert(false);
  }, [closeSignal]);
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
        {buttonText}
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
