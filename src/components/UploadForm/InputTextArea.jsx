import React from 'react';
import PropTypes from 'prop-types';

export default function InputTextArea({ label, name, placeholder, onChange, error, ...props }) {
    return (
        <div className="flex items-start gap-2">
            <h3 className="montserratFont bg-[#2a2a2a]md:text-base flex-2 text-base font-semibold text-[#979797] lg:text-xl">
                {label}
            </h3>
            <div className="flex w-full flex-4 text-white md:flex-10 flex-col">
                <textarea
                    id={name}
                    name={name}
                    className={`${error && "border-red-500 focus:border-red-500"} w-full scroll-mt-32 rounded-md border border-[#F5F5F540] bg-[#2a2a2a] px-2 py-2 transition-all duration-200 focus:border-blue-500 focus:outline-none montserratFont text-sm font-normal placeholder:text-sm`}
                    cols="30"
                    rows="5"
                    onChange={onChange}
                    placeholder={placeholder}
                    {...props}
                ></textarea>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
        </div>
    )
}

InputTextArea.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string,
};
