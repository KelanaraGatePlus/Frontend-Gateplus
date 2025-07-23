import React from 'react';
import BackButton from "@/components/BackButton/page";
import PropTypes from 'prop-types';

export default function HeaderUploadForm({ title }) {
    return (
        <section className="relative mb-2 flex items-center">
            <BackButton />
            <div className="zeinFont absolute left-1/2 -translate-x-1/2 text-3xl font-bold text-[#979797]">
                { title }
            </div>
        </section>
    )
}

HeaderUploadForm.propTypes = {
    title: PropTypes.string,
}
