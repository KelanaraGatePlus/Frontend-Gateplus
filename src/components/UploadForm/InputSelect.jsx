import React from 'react';
import PropTypes from 'prop-types';
import { normalizeOptions } from '@/lib/normalizeOption';

export default function InputSelect({
    label,
    name,
    onChange,
    options,
    placeholder,
    value = "",
    isLanguage = false,
    isControlled = true,
    ...props
}) {
    return (
        <div className="flex items-start gap-2">
            <h3 className="montserratFont flex-2 text-base font-semibold text-[#979797] md:text-base lg:text-xl">
                {label}
            </h3>
            <div className="relative flex w-full flex-4 text-white md:flex-10 montserratFont">
                <select
                    id={name}
                    name={name}
                    {...(isControlled ? { value } : { defaultValue: value })}
                    className="w-full appearance-none rounded-md border border-white/20 bg-[#2a2a2a] px-2 py-2 text-sm text-white transition-all duration-200 focus:border-blue-500 focus:outline-none "
                    onChange={onChange}
                    {...props}
                >
                    <option value="" disabled hidden>
                        {placeholder}
                    </option>
                    {normalizeOptions(options)
                        .sort((a, b) => a.title.localeCompare(b.title))
                        .map((item) => (
                            <option
                                key={item.id}
                                value={isLanguage ? item.title : item.id}
                                className="bg-[#2a2a2a] text-white montserratFont"
                            >
                                {item.title}
                            </option>
                        ))}

                </select>

                <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-white/60">
                    ▼
                </div>
            </div>
        </div>
    );
}

InputSelect.propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
                .isRequired,
            title: PropTypes.string.isRequired,
        })
    ).isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    isLanguage: PropTypes.bool,
    isControlled: PropTypes.bool,
};
