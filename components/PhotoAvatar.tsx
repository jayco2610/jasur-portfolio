"use client";

import { useState } from "react";

export default function PhotoAvatar() {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <span className="font-mono text-4xl font-bold text-[#7C3AED]">J</span>
    );
  }

  return (
    <img
      src="/jasur.jpg"
      alt="Jasur Akhmadaliev"
      className="w-full h-full object-cover object-top"
      onError={() => setError(true)}
    />
  );
}
