"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";

const DynamicAuthUIComponent = dynamic(
  () => import("../../ui/auth/firebaseAuth"),
  { ssr: false }
);

export default function LogIn() {
  return (
    <div>
      <h1>LogIn</h1>
      <DynamicAuthUIComponent />
    </div>
  );
}
