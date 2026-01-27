"use client";
import React, { useState } from "react";
import PropTypes from 'prop-types';
import FlexModal from "@/components/Modal/FlexModal";
import DefaultProgressBar from "@/components/ProgressBar/DefaultProgressBar";
import { Icon } from "@iconify/react";
import UploadEducationEpisodeForm from "./UploadEducationEpisodeForm";
import EditEducationEpisodeForm from "./EditEducationEpisodeForm";
import { useDeleteEducationEpisodeByIdMutation, useGetEducationEpisodeByEducationIdQuery } from "@/hooks/api/educationEpisodeSliceAPI";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import EducationModal from "@/components/Modal/EducationModal";

export default function EpisodeEducationForm({ educationId, step = null, setStep = null }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedEpisodeForEdit, setSelectedEpisodeForEdit] = useState(null);
    const { data: episodeEducationData } = useGetEducationEpisodeByEducationIdQuery(educationId);
    const [deleteEducationEpisodeById, { isLoading: isDeleting }] = useDeleteEducationEpisodeByIdMutation();
    const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
    const [selectedEpisodeId, setSelectedEpisodeId] = useState(null);

    const openModalDelete = (episodeId) => {
        setSelectedEpisodeId(episodeId);
        setModalDeleteOpen(true);
    }

    const handleDeleteEpisode = async () => {
        try {
            await deleteEducationEpisodeById(selectedEpisodeId).unwrap();
            // Optionally, you can add a success notification here
        } catch (err) {
            console.error("Failed to delete episode:", err);
            // Optionally, you can add an error notification here
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-start gap-2 bg-[#393939] border border-[#686868] rounded-xl p-4">
                <h3 className="montserratFont flex-2 text-base font-semibold text-white md:text-base lg:text-xl">
                    Episode Education
                </h3>
                <div className="relative flex w-full flex-4 text-white md:flex-10 montserratFont flex-col gap-2">
                    {episodeEducationData?.data?.map((episode, index) => (<div key={episode.id} className="border border-[#515151] rounded-lg p-4 flex flex-row justify-between items-center">
                        <div className="flex flex-row gap-4 items-center">
                            <div className="rounded-full bg-[#C6C6C6] text-[#156EB7] px-4 py-2 w-auto h-max montserratFont font-semibold">
                                {index + 1}
                            </div>
                            <div className="flex flex-col gap-2 items-start justify-center">
                                <div className="flex flex-row gap-2 items-center justify-center">
                                    <h3 className="text-[#1DBDF5] font-medium">{episode.title}</h3>
                                    <div className="rounded-lg text-black font-bold bg-[#C6C6C6] px-4 py-1 text-sm outline-2 outline-[#515151]">
                                        Draft
                                    </div>
                                </div>
                                <div className="flex flex-row gap-3">
                                    <div className="flex flex-row gap-2 items-center justify-center">
                                        <Icon
                                            icon={'material-symbols:play-arrow-outline'}
                                            width={20} height={20}
                                        />
                                        <p className="text-[#C6C6C6] text-sm">Video</p>
                                    </div>
                                    <div className="flex flex-row gap-2 items-center justify-center">
                                        <Icon
                                            icon={'material-symbols:nest-clock-farsight-analog-outline'}
                                            width={20} height={20}
                                        />
                                        <p className="text-[#C6C6C6] text-sm">{episode.duration} Min</p>
                                    </div>
                                    {episode.quiz && <div className="flex flex-row gap-2 items-center justify-center">
                                        <Icon
                                            icon={'material-symbols:check-circle'}
                                            width={20} height={20}
                                        />
                                        <p className="text-[#C6C6C6] text-sm">Quiz: {episode.quiz.title}</p>
                                    </div>}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-row gap-4">
                            <div className="w-32">
                                <DefaultProgressBar
                                    progress={70}
                                />
                            </div>
                            {/* Edit button */}
                            <button onClick={() => {
                                setSelectedEpisodeForEdit(episode.id);
                                setIsEditModalOpen(true);
                            }}>
                                <Icon
                                    icon={'material-symbols:edit-square-rounded'}
                                    className="text-white"
                                    width={20}
                                    height={20}
                                />
                            </button>
                            {/* Delete button */}
                            <button onClick={() => openModalDelete(episode.id)}>
                                <Icon
                                    icon={'solar:trash-bin-minimalistic-outline'}
                                    className="text-red-600"
                                    width={20}
                                    height={20}
                                />
                            </button>
                        </div>
                    </div>
                    ))}
                    <button onClick={
                        () => setIsModalOpen(true)
                    } className="w-full border border-[#515151] rounded-lg p-4 flex flex-row justify-between items-center">
                        <div className="flex flex-col items-center w-full">
                            <p className="font-bold montserratFont text-2xl text-center">+</p>
                            <p className="text-[#C6C6C6] text-sm text-center">Tambahkan episode baru ke dalam education Anda</p>
                        </div>
                    </button>
                </div>
                <EducationModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} title="Tambah Episode Baru" onClose={() => {
                    setIsModalOpen(false)
                }}>
                    <UploadEducationEpisodeForm educationId={educationId} />
                </EducationModal>

                <EducationModal isOpen={isEditModalOpen} setIsOpen={setIsEditModalOpen} title="Edit Episode" onClose={() => {
                    setIsEditModalOpen(false);
                    setSelectedEpisodeForEdit(null);
                }}>
                    {selectedEpisodeForEdit && (
                        <EditEducationEpisodeForm 
                            episodeId={selectedEpisodeForEdit} 
                            onClose={() => {
                                setIsEditModalOpen(false);
                                setSelectedEpisodeForEdit(null);
                            }} 
                        />
                    )}
                </EducationModal>
            </div>
            {step && setStep && <div className="w-full flex flex-row justify-between">
                <button onClick={() => {
                    window.location.href = "/education/upload"
                }} className="flex flex-row items-center gap-2 px-4 py-2 rounded-md border border-[#686868] bg-[#393939] text-white font-medium montserratFont ">
                    <Icon icon={'solar:arrow-left-linear'} width={32} height={32} />
                    <span>Previous</span>
                </button>
                <button onClick={() => setStep(4)} className="flex flex-row items-center gap-2 px-4 py-2 rounded-md border border-[#156EB7] bg-[#184A97] text-white font-medium montserratFont ">
                    <span>Next</span>
                    <Icon icon={'solar:arrow-right-linear'} width={32} height={32} />
                </button>
            </div>}

            <FlexModal
                isOpen={modalDeleteOpen}
                setIsOpen={setModalDeleteOpen}
                title="Konfirmasi Hapus Episode"
                onClose={() => setModalDeleteOpen(false)}
            >
                <div className="flex flex-col gap-6">

                    <div className="flex flex-col gap-2">
                        <p className="text-white text-base font-medium">
                            Yakin ingin menghapus episode education ini?
                        </p>
                        <p className="text-sm text-[#B0B0B0]">
                            Episode yang dihapus tidak dapat dipulihkan. Pastikan keputusan Anda sudah benar.
                        </p>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setModalDeleteOpen(false)}
                            className="px-4 py-2 rounded-md border border-[#686868] bg-[#2E2E2E] text-white font-medium montserratFont hover:bg-[#3A3A3A] transition"
                        >
                            Batal
                        </button>

                        <button
                            onClick={() => {
                                handleDeleteEpisode();
                                setModalDeleteOpen(false);
                            }}
                            className="px-4 py-2 rounded-md bg-[#E53935] text-white font-medium montserratFont hover:bg-[#D32F2F] transition"
                        >
                            Hapus Episode
                        </button>
                    </div>

                </div>
            </FlexModal>

            {isDeleting && <LoadingOverlay isOpen={isDeleting} />}
        </div>
    )
}

EpisodeEducationForm.propTypes = {
    educationId: PropTypes.string.isRequired,
    step: PropTypes.number,
    setStep: PropTypes.func
};