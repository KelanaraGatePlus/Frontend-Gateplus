"use client";
import React from "react";
import Image from "next/image";
import PropTypes from "prop-types";
import IconsGalery from "@@/icons/logo-upload-banner.svg";

export default function InputComicPic({
    label = "File Input",
    description = "Penting: Agar File Terunggah Sesuai Urutan. Mohon ubah nama file dengan dua digit angka di depan: 01, 02, dst.",
    uploadedFiles = {},
    handleFileUpload,
    handleRemoveFile,
    error,
}) {
    return (
        <section className="flex items-start gap-2 text-[#979797] montserratFont">
            <div className="flex flex-2 flex-col">
                <h3 className="text-base font-semibold md:text-base lg:text-xl">{label}</h3>
                <p className="text-[10px] italic md:text-sm">{description}</p>
            </div>

            <div className="flex h-full w-fit flex-4 flex-wrap items-stretch justify-start gap-x-6 text-white md:flex-10">
                <div className={`${error && "border-red-500 focus:border-red-500 border"} container flex w-full flex-wrap items-start gap-4 rounded-md bg-[#585454] p-2`}>
                    <div className="flex flex-col items-center">
                        <div className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-md bg-gray-500 md:h-42 md:w-32">
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/webp"
                                id="inputFile"
                                hidden
                                name="inputFile"
                                multiple
                                onChange={handleFileUpload}
                            />
                            <label
                                htmlFor="inputFile"
                                className="absolute inset-0 flex cursor-pointer items-center justify-center gap-1 bg-black/50 text-xs font-semibold"
                            >
                                <Image
                                    src={IconsGalery}
                                    alt="camera icon"
                                    width={12}
                                    height={12}
                                    className="object-contain lg:h-5 lg:w-5"
                                />
                                <p className="text-[10px] font-semibold text-white lg:text-[12px]">Upload</p>
                            </label>
                        </div>
                        <p className="mt-2 text-center text-xs text-white italic">
                            {uploadedFiles.inputFile?.length > 0
                                ? `${uploadedFiles.inputFile.length} file(s) selected`
                                : "No file chosen"}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4">
                        {uploadedFiles.inputFile?.map((file, index) => (
                            <div
                                key={index}
                                className="relative flex h-28 w-36 flex-col items-center overflow-hidden rounded-md bg-gray-500 md:h-46 md:w-32"
                            >
                                <div className="relative h-24 w-full md:h-42 md:w-32">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt={`preview-${index}`}
                                        className="h-full w-full object-cover object-center"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFile("inputFile", index)}
                                        className="absolute top-1 right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-600/50 text-xs text-white"
                                    >
                                        <span className="flex text-base lg:-mt-0.5">&times;</span>
                                    </button>
                                </div>
                                <p className="w-full truncate px-1 py-0.5 text-center text-[8px] text-white lg:text-[10px]">
                                    {file.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
        </section>
    );
}

InputComicPic.propTypes = {
    label: PropTypes.string,
    description: PropTypes.string,
    uploadedFiles: PropTypes.object.isRequired,
    handleFileUpload: PropTypes.func.isRequired,
    handleRemoveFile: PropTypes.func.isRequired,
    error: PropTypes.string,
};
