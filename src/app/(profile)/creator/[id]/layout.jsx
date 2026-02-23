/* eslint-disable react/react-in-jsx-scope */
"use client";

import PropTypes from "prop-types";
import { ToastProvider } from "@/components/ToastProvider/page";

export default function CreatorLayout({ children }) {
  return <ToastProvider>{children}</ToastProvider>;
}

CreatorLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
