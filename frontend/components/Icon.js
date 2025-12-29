"use client";
import React from "react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";

export default function Icon({ name = "chat", className = "h-6 w-6 text-indigo-600" }) {
  // For now we provide a default chat icon. This wrapper makes it easy
  // to swap icons in one place later (Heroicons set).
  if (name === "chat") return <ChatBubbleLeftRightIcon className={className} />;
  return <ChatBubbleLeftRightIcon className={className} />;
}
