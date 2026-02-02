"use client";
import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { Controller } from "react-hook-form";
import Checkbox from "@mui/material/Checkbox";

export default function TermsCheckbox({ name, control, label, linkHref = "#", linkText = "" }) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <label className="flex items-center gap-0 text-white">
                    <Checkbox
                        {...field}
                        checked={field.value}
                        onChange={(e) => {
                            field.onChange(e.target.checked);
                            field.onBlur();
                        }}
                        sx={{
                            color: "white",
                            "&.Mui-checked": {
                                color: "cyan",
                            },
                        }}
                    />
                    <span>
                        {label}{" "}
                        <Link href={linkHref} target="_blank" className="underline hover:text-blue-500">
                            {linkText}
                        </Link>
                    </span>

                    {fieldState.error && (
                        <div className="ml-2 text-red-500 flex justify-center items-center gap-2 group">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path
                                    d="M11.9525 23.906C18.48 23.906 23.9055 18.492 23.9055 11.953C23.9055 5.4255 18.468 0 11.9405 0C5.402 0 0 5.4255 0 11.953C0 18.492 5.4135 23.906 11.9525 23.906ZM11.953 21.914C6.421 21.914 2.0025 17.484 2.0025 11.953C2.0025 6.433 6.409 1.992 11.9405 1.992C17.46 1.992 21.901 6.4335 21.913 11.953C21.9245 17.4845 17.4715 21.914 11.952 21.914M11.9405 14.074C12.5025 14.074 12.819 13.7575 12.8305 13.1485L13.0065 6.961C13.0185 6.363 12.5495 5.918 11.9285 5.918C11.2955 5.918 10.8505 6.3515 10.862 6.949L11.0145 13.1485C11.026 13.746 11.3545 14.074 11.9405 14.074ZM11.9405 17.8825C12.608 17.8825 13.2055 17.3435 13.2055 16.664C13.2055 15.9725 12.62 15.445 11.9405 15.445C11.249 15.445 10.6745 15.984 10.6745 16.664C10.6745 17.332 11.2605 17.8825 11.9405 17.8825Z"
                                    fill="#EF4444"
                                />
                            </svg>
                            <div className="rounded-lg px-2 py-1 w-fit hidden group-hover:block bg-[#2a2a2a] border">
                                {fieldState.error.message}
                            </div>
                        </div>
                    )}
                </label>
            )}
        />
    );
}

TermsCheckbox.propTypes = {
    name: PropTypes.string.isRequired,
    control: PropTypes.any.isRequired,
    label: PropTypes.string.isRequired,
    linkHref: PropTypes.string.isRequired,
    linkText: PropTypes.string.isRequired,
};
