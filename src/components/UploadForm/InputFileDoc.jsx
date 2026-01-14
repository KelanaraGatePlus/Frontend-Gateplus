"use client";
import React from 'react';
import PropTypes from "prop-types";

export default function InputFileDoc({
    label = "Upload File",
    description = "Format input .docx\nNama File tidak boleh mengandung spasi",
    name,
    accept = ".doc,.docx",
    files = [],
    onUpload,
    onRemove,
    inputRef,
    error,
}) {
    return (
        <section className="flex items-start gap-2 text-white montserratFont">
            <div className="flex flex-2 flex-col">
                <h3 className="text-base font-semibold md:text-base lg:text-xl">{label}</h3>
                {description && (
                    <p className="text-[10px] italic whitespace-pre-line text-[#979797] md:text-sm">{description}</p>
                )}
            </div>

            {/* Upload Area */}
            <div className="flex h-full w-fit flex-4 flex-wrap items-stretch justify-start gap-x-6 text-white md:flex-10">
                <div className={`container flex w-full flex-wrap items-start gap-4 rounded-md bg-[#585454] p-2 ${error ? 'border border-red-500' : ''}`}>
                    {/* Upload Button */}
                    <div className="flex flex-col items-center">
                        <div className="relative">
                            <input
                                type="file"
                                id={`upload-${name}`}
                                name={name}
                                hidden
                                ref={inputRef}
                                accept={accept}
                                onChange={(e) => onUpload(e, name)}
                            />
                            <label htmlFor={`upload-${name}`}>
                                <div className="flex cursor-pointer items-center justify-center rounded-md bg-gray-500 px-4 py-2 text-xs font-semibold text-white hover:bg-gray-600 md:text-sm">
                                    Upload Files
                                </div>
                            </label>
                        </div>
                        <p className="mt-2 text-center text-xs text-white italic">
                            {files.length > 0
                                ? `${files.length} file(s) selected`
                                : "No file chosen"}
                        </p>
                    </div>

                    {/* Preview Files */}
                    <div className="flex flex-wrap gap-4">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                className="relative flex w-36 items-center justify-between rounded-md bg-gray-500 px-2 py-2 md:w-40"
                            >
                                <p className="w-28 truncate text-[10px] text-white md:w-32 lg:text-[12px]">
                                    {file.name}
                                </p>
                                <button
                                    onClick={() => onRemove(name, index)}
                                    className="ml-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-500 text-xs text-white"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
        </section>
    );
}

InputFileDoc.propTypes = {
    label: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string.isRequired,
    accept: PropTypes.string,
    files: PropTypes.array.isRequired,
    onUpload: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    inputRef: PropTypes.any,
    error: PropTypes.string,
};
