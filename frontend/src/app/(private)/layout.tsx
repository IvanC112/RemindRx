"use client";

import Navbar from "@/app/components/navbar";
import PrivateRoute from "./privateroute";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <PrivateRoute>
      <div>
        <Navbar />
        {children}
      </div>
    </PrivateRoute>
  );
}