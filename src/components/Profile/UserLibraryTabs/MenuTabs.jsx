import React from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';

import { userLibraryTabsOptions } from "@/lib/constants/userLibraryTabsOptions";

export default function MenuTabs({ switchTab, handleSwitchTab }) {
    return (
        <div className="flex w-full">
            {userLibraryTabsOptions.map((tab) => (
                <div key={tab.id} className="flex flex-1 flex-col gap-1 relative">
                    <div
                        className="flex cursor-pointer items-center justify-center gap-1 rounded-lg py-1 text-white hover:bg-white/10"
                        onClick={() => handleSwitchTab(tab.name)}
                    >
                        <div>
                            <Image
                                priority
                                className="aspect-auto"
                                height={20}
                                width={20}
                                alt="logo-riwayat-tonton"
                                src={tab.icon}
                            />
                        </div>
                        <p className="font-bold text-xs md:text-sm">{tab.name}</p>
                    </div>
                    <div className={`
                        h-2 w-full bg-gradient-to-b from-[#0395BC]/30 to-[#0E5BA8]/30 lg:h-3 relative
                        ${tab.id === 1 && "rounded-l-full"}
                        ${tab.id === userLibraryTabsOptions.length && "rounded-r-full"}
                    `}>
                        <div className={`h-full w-full rounded-full bg-gradient-to-b from-[#0395BC] to-[#0E5BA8] lg:h-3 relative ${switchTab === tab.name ? "block" : "hidden"}`} />
                    </div>
                </div>
            ))}
        </div>
    )
}

MenuTabs.propTypes = {
    switchTab: PropTypes.string.isRequired,
    handleSwitchTab: PropTypes.func.isRequired,
}