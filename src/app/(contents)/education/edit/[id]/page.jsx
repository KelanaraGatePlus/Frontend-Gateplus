"use client";

import React from "react";
// Sesuaikan path ke hook dan komponen LoadingOverlay Anda
import EditSeriesForm from "@/components/Form/EditSeries/EditSeriesForm";
import PropTypes from "prop-types";

export default function EditSeriesPage({ params }) {
  const { id } = React.use(params);
  
  return (
    <>
      <EditSeriesForm id={id} />
    </>
  );
}

EditSeriesPage.propTypes = {
  params: PropTypes.string,
}