import React from "react";
import { Suspense } from "react";
import NavbarContent from "./navbarContent";
import NavbarSkeleton from "./NavbarSkeleton/page.jsx";

export default function Navbar() {
  return (
    <Suspense fallback={<NavbarSkeleton />}>
      <NavbarContent />
    </Suspense>
  );
}
