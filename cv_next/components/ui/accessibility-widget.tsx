"use client";

import { useEffect } from "react";

export function AccessibilityWidget() {
  useEffect(() => {
    void import("accessibility").then(({ Accessibility }) => {
      new Accessibility();
    });
  }, []);

  return null;
}
