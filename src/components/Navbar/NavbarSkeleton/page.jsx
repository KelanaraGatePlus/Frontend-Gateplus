"use client";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function NavbarSkeleton() {
  return (
    <header className="flex h-16 w-full animate-pulse items-center justify-between bg-white px-6 shadow-md">
      <div className="flex items-center space-x-3">
        <Skeleton width={120} height={20} />
      </div>

      <div className="mx-6 max-w-md flex-1">
        <Skeleton height={36} borderRadius={8} />
      </div>

      <div className="flex items-center space-x-4">
        <Skeleton circle width={36} height={36} />
        <Skeleton width={90} height={24} />
      </div>
    </header>
  );
}
