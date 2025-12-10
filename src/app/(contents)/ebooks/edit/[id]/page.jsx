"use client";
import React from "react";
import EditEbookForm from "@/components/Form/EditEbook/EditEbookForm";
import PropTypes from "prop-types";

export default function EditEbookPage({ params }) {
  const { id } = React.use(params);

  return (
    <EditEbookForm id={id} />
  );
}

EditEbookPage.propTypes = {
  params: PropTypes.string,
}