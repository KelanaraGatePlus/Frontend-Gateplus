// src/components/Form/UploadReport/UploadEvidence.jsx

"use client";
import React from "react";
import PropTypes from "prop-types";

export default function InputReportEvidence({
    label = "Upload Evidence (Optional)",
    description = "Attach a screenshot that shows the problem.",
    value,
    onChange,
    error
}) {
    const files = value ? Array.from(value) : [];

    const handleFileChange = (event) => {
        const newlySelectedFiles = Array.from(event.target.files);
        if (newlySelectedFiles.length === 0) {
            return; // Tidak ada file yang dipilih, keluar
        }

        // Gabungkan file yang sudah ada dengan file yang baru dipilih
        const combinedFiles = [...files, ...newlySelectedFiles];

        // Untuk mencegah duplikat, kita buat Set berdasarkan nama dan ukuran file
        const uniqueFiles = combinedFiles.filter(
            (file, index, self) =>
                index === self.findIndex((f) => f.name === file.name && f.size === file.size)
        );

        // Buat FileList baru dari file yang sudah digabung dan unik
        const dataTransfer = new DataTransfer();
        uniqueFiles.forEach(file => dataTransfer.items.add(file));

        // Panggil onChange dengan FileList yang sudah diperbarui
        onChange(dataTransfer.files);
    };

    const handleRemoveFile = (indexToRemove) => {
        const newFiles = files.filter((_, index) => index !== indexToRemove);

        const dataTransfer = new DataTransfer();
        newFiles.forEach(file => dataTransfer.items.add(file));

        onChange(dataTransfer.files);
    };

    return (
        <section className="flex w-full flex-col gap-2 montserratFont">
            <div className="flex flex-col">
                <h3 className="text-base font-semibold text-white md:text-base lg:text-xl">{label}</h3>
                <p className="text-[10px] italic text-[#979797] md:text-sm">{description}</p>
            </div>
            <div className="flex w-full flex-col">
                <div className="relative w-full">
                    <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp"
                        id="evidenceFile"
                        hidden
                        name="evidenceFile"
                        multiple
                        onChange={handleFileChange}
                        onClick={(event) => { event.target.value = null }}
                    />
                    <label
                        htmlFor="evidenceFile"
                        className={`flex w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed ${error ? "border-red-500" : "border-gray-600"
                            } p-4 text-4xl text-gray-400 transition-colors hover:bg-gray-800/50`}
                    >
                        +
                    </label>
                </div>
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
                <div className="mt-4 flex flex-wrap gap-4">
                    {files.map((file, index) => (
                        <div key={`${file.name}-${index}`} className="flex w-36 flex-col overflow-hidden rounded-md bg-[#3a3a3a]">
                            <div className="relative aspect-video w-full">
                                <img src={URL.createObjectURL(file)} alt={file.name} className="h-full w-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFile(index)}
                                    className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600/70 text-sm text-white"
                                >
                                    <span>&times;</span>
                                </button>
                            </div>
                            {/* Penomoran dihilangkan */}
                            <p className="w-full truncate px-2 py-1.5 text-center text-[10px] text-white">
                                {file.name}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

InputReportEvidence.propTypes = {
    label: PropTypes.string,
    description: PropTypes.string,
    value: PropTypes.any,
    onChange: PropTypes.func,
    error: PropTypes.string,
};