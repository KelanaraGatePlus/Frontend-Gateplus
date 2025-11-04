import React from "react";
import { Suspense } from "react";
import NavbarContent from "./navbarContent";
import NavbarSkeleton from "./NavbarSkeleton/page.jsx";
import PropTypes from "prop-types";

export default function Navbar({ openCreateContentModal, openRedeemVoucherModal }) {
  return (
    <Suspense fallback={<NavbarSkeleton />}>
      <NavbarContent openCreateContentModal={openCreateContentModal} openRedeemVoucherModal={openRedeemVoucherModal} />
    </Suspense>
  );
}

Navbar.propTypes = {
  openCreateContentModal: PropTypes.func.isRequired,
  openRedeemVoucherModal: PropTypes.func.isRequired,
};
