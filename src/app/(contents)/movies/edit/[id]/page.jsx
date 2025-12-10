"use client";

import React from "react";
// Sesuaikan path ke hook dan komponen LoadingOverlay Anda
import EditMovieForm from "@/components/Form/EditMovie/EditMovieForm";
import PropTypes from "prop-types";

export default function EditMoviePage({ params }) {
  const { id } = React.use(params);

  return (
    <>
      <EditMovieForm id={id} />
    </>
  );
}

EditMoviePage.propTypes = {
  params: PropTypes.string,
}