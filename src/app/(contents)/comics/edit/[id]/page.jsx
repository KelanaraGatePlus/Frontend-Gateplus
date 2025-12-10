"use client";
import React from "react";
import EditComicForm from "@/components/Form/EditComic/EditComicForm";
import PropTypes from "prop-types";

export default function EditComicPage({ params }) {
   const { id } = React.use(params);

  return (
    <EditComicForm id={id} />
  );
}


EditComicPage.propTypes = {
  params: PropTypes.string,
}