"use client";
import React from "react";
import EditPodcastForm from "@/components/Form/EditPodcast/EditPodcastForm";
import PropTypes from "prop-types";

export default function EditPodcastPage({ params }) {
    const { id } = React.use(params);

    return (
        <EditPodcastForm id={id} />
    );
}

EditPodcastPage.propTypes = {
  params: PropTypes.string,
}