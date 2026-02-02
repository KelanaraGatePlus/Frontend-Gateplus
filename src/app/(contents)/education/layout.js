"use client";
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import NavbarEduacation from '@/components/Navbar/navbarEducation';
import FlexModal from '@/components/Modal/FlexModal';
import Image from 'next/image';
import { contentType } from '@/lib/constants/contentType';
import RedeemVoucherModal from '@/components/Modal/RedeemVoucherModal';

export default function EducationLayout({ children }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [objective] = useState("");
    const [isModalRedeemOpen, setIsModalRedeemOpen] = useState(false);

    const redirect = (type, objective) => {
        setIsModalOpen(false);
        const url = objective == 'upload' ? 'upload' : 'upload/episode';
        switch (type) {
            case "movies":
                return `/movies/${url}`;
            case "series":
                return `/series/${url}`;
            case "podcasts":
                return `/podcasts/${url}`;
            case "ebooks":
                return `/ebooks/${url}`;
            case "comics":
                return `/comics/${url}`;
            case "education":
                return `/education/${url}`;
            default:
                return "/";
        }
    };

    return (
        <main className="relative flex flex-col">
            <NavbarEduacation
                openCreateContentModal={setIsModalOpen}
                openRedeemVoucherModal={setIsModalRedeemOpen}
            />
            <div className="flex w-full flex-col 2xl:mt-[125px] md:mt-[75px]">
                {children}
            </div>

            <RedeemVoucherModal isModalRedeemOpen={isModalRedeemOpen} setIsModalRedeemOpen={setIsModalRedeemOpen} />

            <FlexModal isOpen={isModalOpen} onClose={() => {
                setIsModalOpen(false);
            }} title={"Kategori Upload Karya"}>
                <div className="flex flex-row items-center text-white text-xs md:text-sm xl:text-md xl:px-52">
                    {Object.values(contentType)
                        .filter((content) => {
                            if (objective === "episode") {
                                return content.haveEpisodes; // hanya yang true
                            }
                            return true; // tampilkan semua kalau bukan "episode"
                        })
                        .map((content) => (
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    window.location.href = redirect(content.pluralName, objective);
                                }}
                                key={content.singleName}
                                className="flex flex-col items-center justify-center mr-4 hover:cursor-pointer w-12 md:w-28 xl:w-[148px]"
                            >
                                <Image
                                    src={content.icon}
                                    alt={content.singleName}
                                />
                                <p>{content.pluralName.toUpperCase()}</p>
                            </button>
                        ))}
                </div>
            </FlexModal>
        </main>
    );
}

EducationLayout.propTypes = {
    children: PropTypes.node.isRequired,
};
