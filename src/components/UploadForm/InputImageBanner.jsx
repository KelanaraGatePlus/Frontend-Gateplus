import React, { useState } from 'react';
import Image from "next/image";
import PropTypes from "prop-types";
import ImageCropperModal from './ImageCropperModal';

export default function InputImageBanner({
    type,
    label = "Upload Gambar",
    description,
    name,
    accept = "image/png, image/jpeg",
    files = [],
    onUpload,
    onRemove,
    icon,
    inputRef,
    error,
    enableCrop = true,
    cropAspectRatio,
}) {
    const [showCropper, setShowCropper] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [originalFileName, setOriginalFileName] = useState('');

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!enableCrop) {
            onUpload(e, name);
            return;
        }

        // Store original filename
        setOriginalFileName(file.name);

        // Create preview URL for cropper
        const reader = new FileReader();
        reader.onload = () => {
            setSelectedImage(reader.result);
            setShowCropper(true);
        };
        reader.readAsDataURL(file);
    };

    const handleCropComplete = async (croppedBlob) => {
        // Convert blob to File object with original filename
        const croppedFile = new File([croppedBlob], originalFileName, {
            type: 'image/jpeg',
            lastModified: Date.now(),
        });

        // Create a synthetic event to pass to onUpload
        const syntheticEvent = {
            target: {
                files: [croppedFile],
                name: name,
            }
        };

        onUpload(syntheticEvent, name);
        setShowCropper(false);
        setSelectedImage(null);

        // Reset input
        if (inputRef?.current) {
            inputRef.current.value = '';
        }
    };

    const handleCropCancel = () => {
        setShowCropper(false);
        setSelectedImage(null);
        
        // Reset input
        if (inputRef?.current) {
            inputRef.current.value = '';
        }
    };

    // Determine aspect ratio based on type
    const getAspectRatio = () => {
        if (cropAspectRatio) return cropAspectRatio;
        return type === 'banner' ? 16 / 9 : type === 'thumbnail' ? 1 / 1 : 2 / 3;
    };
    return (
        <>
            {showCropper && selectedImage && (
                <ImageCropperModal
                    image={selectedImage}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                    aspectRatio={getAspectRatio()}
                    title={`Crop ${type === 'banner' ? 'Banner' : 'Image'}`}
                />
            )}
            
            <section className="flex items-start gap-2 text-[#979797] montserratFont">
            <div className="flex flex-2 flex-col">
                <h3 className="montserratFont text-base font-semibold md:text-base lg:text-xl">
                    {label}
                </h3>
                {description && (
                    <p className="text-[10px] italic md:text-sm">{description}</p>
                )}
            </div>

            <div className="flex h-full w-fit flex-4 flex-wrap items-stretch justify-start gap-x-6 text-white md:flex-10">
                <div className={`${error && "border-red-500 focus:border-red-500 border"} container flex w-full flex-wrap items-start gap-4 rounded-md bg-[#585454] p-2`}>
                    {/* Upload Box */}
                    <div className="flex flex-col items-center">
                        <div className="relative h-24 w-24 cursor-pointer overflow-hidden rounded-md bg-gray-500 md:h-28 md:w-28">
                            <input
                                type="file"
                                id={`upload-${name}`}
                                name={name}
                                hidden
                                accept={accept}
                                ref={inputRef}
                                onChange={handleFileSelect}
                            />
                            <label
                                htmlFor={`upload-${name}`}
                                className="absolute inset-0 flex cursor-pointer items-center justify-center gap-1 bg-black/50 text-xs font-semibold"
                            >
                                {icon && (
                                    <Image
                                        src={icon}
                                        alt="icon"
                                        width={12}
                                        height={12}
                                        className="object-contain lg:h-5 lg:w-5"
                                    />
                                )}
                                <p className="text-[10px] font-semibold text-white lg:text-[12px]">
                                    Upload
                                </p>
                            </label>
                        </div>
                        <p className="mt-2 text-center text-xs text-white italic">
                            {files && files.length > 0
                                ? files.some(f => typeof f === "string")
                                    ? "Gambar sudah diunggah"
                                    : `${files.length} file(s) selected`
                                : "No file chosen"}
                        </p>
                    </div>

                    {/* Preview */}
                    <div className="flex flex-wrap gap-4">
                        {files && files.length > 0 && (
                            files.map((file, index) => {
                                const isUrl = typeof file === "string";
                                const imgSrc = isUrl ? file : URL.createObjectURL(file);
                                const fileName = isUrl ? "Preview" : file.name;
                                return type === "banner" ? (
                                    <div
                                        key={index}
                                        className="relative flex h-28 w-36 flex-col items-center overflow-hidden rounded-md bg-gray-500 md:h-32 md:w-42"
                                    >
                                        <div className="relative h-24 w-full md:h-28">
                                            <img
                                                src={imgSrc}
                                                alt={`preview-${index}`}
                                                className="h-full w-full object-cover object-center"
                                            />
                                            <button
                                                onClick={() => onRemove(name, index)}
                                                className="absolute top-1 right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-600/50 text-xs text-white"
                                            >
                                                <span className="flex text-base lg:-mt-0.5">&times;</span>
                                            </button>
                                        </div>
                                        <p className="w-full truncate px-1 py-0.5 text-center text-[8px] text-white lg:text-[10px]">
                                            {fileName}
                                        </p>
                                    </div>
                                ) : (
                                    <div
                                        key={index}
                                        className="relative flex h-28 w-24 flex-col items-center overflow-hidden rounded-md bg-gray-500 md:h-32 md:w-28"
                                    >
                                        <div className="relative h-24 w-full md:h-28">
                                            <img
                                                src={imgSrc}
                                                alt={`preview-${index}`}
                                                className="h-full w-full object-cover object-center"
                                            />
                                            <button
                                                onClick={() => onRemove(name, index)}
                                                className="absolute top-1 right-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-red-600/50 text-xs text-white"
                                            >
                                                <span className="flex text-base lg:-mt-0.5">
                                                    &times;
                                                </span>
                                            </button>
                                        </div>
                                        <p className="w-full truncate px-1 py-0.5 text-center text-[8px] text-white lg:text-[10px]">
                                            {fileName}
                                        </p>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
        </section>
        </>
    );
}

InputImageBanner.propTypes = {
    type: PropTypes.string,
    label: PropTypes.string,
    description: PropTypes.string,
    name: PropTypes.string.isRequired,
    accept: PropTypes.string,
    files: PropTypes.array.isRequired,
    onUpload: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    icon: PropTypes.any,
    inputRef: PropTypes.any,
    error: PropTypes.string,
    enableCrop: PropTypes.bool,
    cropAspectRatio: PropTypes.number,
};
