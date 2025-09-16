import React from "react";
import { profileIconData } from "@/lib/constants/profileIcon";
import IconsCameraAdd from "@@/icons/icons-camera-add.svg";
import logoUsersComment from "@@/icons/logo-users-comment.svg";
import PropTypes from "prop-types";
import { XIcon } from "lucide-react";
import Image from "next/image";

// Ubah props dari { setImage } menjadi { onImageUpload, onIconSelect }
export default function ProfileModal({
    isShow,
    setIsShow,
    onImageUpload,
    onIconSelect,
}) {
    return (
        <div
            className={`${isShow ? "block" : "hidden"
                } absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-10`}
        >
            {/* Modal Box */}
            <div className="relative flex max-h-3/4 flex-col rounded-2xl bg-[#222222]">
                {/* Scrollable Area */}
                <div className="overflow-y-auto custom-scrollbar">
                    {/* Padding wrapper */}
                    <div className="p-16">
                        <div className="grid sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-8">
                            {/* Upload Image */}
                            <label className="relative h-16 w-16 cursor-pointer lg:h-24 lg:w-24">
                                <div className="group relative h-full w-full cursor-pointer overflow-hidden rounded-full bg-amber-600">
                                    <Image
                                        src={logoUsersComment}
                                        alt="profile"
                                        fill
                                        className="h-full w-full rounded-full bg-white object-cover"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 flex h-[28%] items-center justify-center bg-black/40">
                                        <Image
                                            src={IconsCameraAdd}
                                            alt="camera icon"
                                            width={16}
                                            height={16}
                                            className="scale-110 object-contain"
                                        />
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    accept="image/png, image/jpeg"
                                    className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                                    onChange={(e) => onImageUpload(e)}
                                />
                            </label>

                            {/* Profile Icon List */}
                            {profileIconData.map((icon, idx) => (
                                // GANTI <label> MENJADI <div> dan tambahkan onClick
                                <div
                                    key={idx}
                                    className="relative h-16 w-16 cursor-pointer lg:h-24 lg:w-24"
                                    onClick={() => {
                                        onIconSelect(icon.image, icon.url)
                                        console.log('Icon selected:', icon.image);
                                        console.log('Icon URL:', icon.url);
                                    }} // LOGIKA UTAMA ADA DI SINI
                                >
                                    <div className="group relative h-full w-full cursor-pointer overflow-hidden rounded-full bg-amber-600">
                                        <Image
                                            src={icon.image}
                                            alt="profile"
                                            fill
                                            className="h-full w-full rounded-full bg-white object-cover"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={() => setIsShow(false)}
                    className="absolute top-4 left-4 rounded-full bg-[#595959] p-1 text-white hover:cursor-pointer hover:text-gray-300"
                >
                    <XIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

ProfileModal.propTypes = {
    isShow: PropTypes.bool.isRequired,
    setIsShow: PropTypes.func.isRequired,
    onImageUpload: PropTypes.func.isRequired,
    onIconSelect: PropTypes.func.isRequired,
};