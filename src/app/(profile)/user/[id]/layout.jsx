/* eslint-disable react/react-in-jsx-scope */
"use client";

import { ToastProvider } from "@/components/ToastProvider/page";
import PropTypes from "prop-types";
export default function ProfileLayout({ children }) {
  // semua halaman di folder [id] bakal dibungkus ToastProvider
  return <ToastProvider>{children}</ToastProvider>;
}
ProfileLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
