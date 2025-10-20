import React from 'react';
import BackButton from "@/components/BackButton/page";
import PropTypes from 'prop-types';

export default function HeaderUploadForm({ title, children, subtitle = null, titlePosition = "center" }) {
    return (
        <section className="relative mb-2 flex items-center gap-4">
            <BackButton />
            <div className='flex flex-col gap-0 w-full items-center justify-center mt-3'
                style={{ alignItems: titlePosition === "center" ? "center" : "flex-start" }}
            >
                <h1 className="zeinFont text-3xl/5 font-bold text-[#979797]">
                    {title}
                </h1>
                {subtitle && <h2 className='text-[#979797] text-[16px] montserratFont'>
                    {subtitle}
                </h2>}
            </div>
            {children}
        </section>
    )
}

HeaderUploadForm.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
}
