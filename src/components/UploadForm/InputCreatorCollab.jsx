"use client";
import React from "react";
import PropTypes from "prop-types";
import Image from "next/image";
import { DEFAULT_AVATAR } from "@/lib/defaults";

export default function InputCreatorCollab({
    query,
    setQuery,
    selectedCreators,
    setSelectedCreators,
    creators,
    isLoadingCreator,
    isErrorCreator,
}) {
    return (
        <section className="flex items-start gap-2 text-[#979797]">
            <div className="flex flex-2 flex-col">
                <h3 className="montserratFont text-base font-semibold text-white md:text-base lg:text-xl">
                    Kolaborator / Bintang Tamu (Guest Star)
                </h3>
                <p className="text-[10px] text-[#979797] italic md:text-sm">Opsional</p>
            </div>

            <div className="flex h-full w-fit flex-4 flex-wrap items-stretch justify-start gap-x-6 text-white md:flex-10 relative">
                <div className={`${selectedCreators.length > 0 ? "gap-2" : "gap-0"} flex w-full flex-wrap items-start rounded-md bg-[#2a2a2a] p-2 border border-[#F5F5F540]`}>
                    <div className="flex flex-row flex-wrap w-full items-center justify-start gap-2">
                        {selectedCreators.map((creator) => (
                            <div
                                key={creator.id}
                                className="p-2 montserratFont border-2 w-fit rounded-lg border-[#F5F5F559] bg-[#F5F5F540] text-sm flex gap-2 items-center"
                            >
                                <div className="flex flex-row items-center gap-3">
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                        <Image
                                            src={creator.imageUrl || DEFAULT_AVATAR}
                                            alt={creator.username}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="text-white font-semibold text-sm">
                                            {creator.profileName}
                                        </h3>
                                        <p className="text-gray-300 text-xs">@{creator.username}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedCreators((prev) =>
                                            prev.filter((c) => c.id !== creator.id)
                                        )
                                    }
                                    className="h-6 w-6 shrink-0 rounded-full bg-black/25 text-white text-base cursor-pointer"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Input Search */}
                    <div className="flex flex-col items-center w-full gap-2">
                        <input
                            type="text"
                            className="border-none outline-none w-full rounded-lg p-1 placeholder:montserratFont"
                            placeholder="Tag nama narasumber atau co-host. Ini membantu episode muncul saat nama mereka dicari."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Dropdown Result */}
                {query && (
                    <div className="w-full bg-[#2e2e2e] h-fit rounded-md drop-shadow-black/40 drop-shadow-2xl border border-white/50 absolute translate-y-full -bottom-2 z-10">
                        {isLoadingCreator ? (
                            <div className="px-4 py-2 text-sm text-gray-300">Loading...</div>
                        ) : isErrorCreator ? (
                            <div className="px-4 py-2 text-sm text-red-400">Terjadi kesalahan</div>
                        ) : creators?.length > 0 ? (
                            creators.map((creator) => (
                                <div
                                    key={creator.id}
                                    className="px-4 py-2 cursor-pointer hover:bg-white/30"
                                    onClick={() => {
                                        if (!selectedCreators.find((c) => c.id === creator.id)) {
                                            setSelectedCreators((prev) => [...prev, creator]);
                                        }
                                        setQuery("");
                                    }}
                                >
                                    <div className="flex flex-row items-center gap-3">
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                                            <Image
                                                src={creator.imageUrl || DEFAULT_AVATAR}
                                                alt={creator.username}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <h3 className="text-white font-semibold text-sm">
                                                {creator.profileName}
                                            </h3>
                                            <p className="text-gray-300 text-xs">@{creator.username}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-2 text-sm text-gray-300">
                                Kreator tidak ditemukan
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

InputCreatorCollab.propTypes = {
    query: PropTypes.string,
    setQuery: PropTypes.func,
    selectedCreators: PropTypes.array,
    setSelectedCreators: PropTypes.func,
    creators: PropTypes.array,
    isLoadingCreator: PropTypes.bool,
    isErrorCreator: PropTypes.bool,
};