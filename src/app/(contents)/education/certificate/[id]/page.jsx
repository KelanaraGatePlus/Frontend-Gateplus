"use client";
import React from "react";
import DefaultAvatar from "@/components/Avatar/DefaultAvatar";
import BackButton from "@/components/BackButton/page";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import { useGetEducationCertificateByIdQuery } from "@/hooks/api/certificateEducationAPI";
import { useGetEducationByIdQuery } from "@/hooks/api/educationSliceAPI";
import { DEFAULT_AVATAR } from "@/lib/defaults";
import { Icon } from "@iconify/react";
import PropTypes from "prop-types";

const countDuration = (episodes = []) => {
    // total durasi sudah dalam detik
    const totalSeconds = episodes.reduce((total, ep) => {
        return total + (Number(ep.duration) || 0);
    }, 0);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return {
        totalSeconds,
        formatted: `${hours.toString().padStart(2, "0")}j ` +
            `${minutes.toString().padStart(2, "0")}m `
    };
};

export default function CertificatePage({ params }) {
    const { id } = params;

    const { data: certificateData, isLoading } = useGetEducationCertificateByIdQuery(id);
    const { data: courseData, isLoading: courseLoading } = useGetEducationByIdQuery(certificateData?.data?.educationId, {
        skip: !certificateData?.data?.educationId,
    });

    if (isLoading || courseLoading) {
        return <LoadingOverlay />;
    }

    return (
        <div className="flex flex-col px-5 md:px-15 gap-10">
            <BackButton />

            <div className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <h1 className="text-white font-bold zeinFont text-3xl">{courseData?.data?.title}</h1>
                    <p className="text-white montserratFont">{countDuration(courseData?.data?.EducationEpisode).formatted} | {courseData?.data?.EducationLevel} | {courseData?.data?.categories?.tittle}</p>
                </div>
                <div className="flex justify-between">
                    <div className="flex flex-row gap-2">
                        <div className="w-12 h-12 rounded-full overflow-hidden">
                            <img
                                src={courseData?.data?.creator?.imageUrl || DEFAULT_AVATAR.src}
                                alt="Instructor Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-white font-bold zeinFont text-2xl">{courseData?.data?.creator?.profileName}</p>
                        </div>
                    </div>
                    <button onClick={() =>
                        window.open(certificateData?.data?.certificateUrl, "_blank")
                    } className="py-3 text-center px-10 bg-[#0076E999] zeinFont font-bold rounded-full text-white hover:bg-[#0076E9] transition duration-300">
                        Unduh Sertifikat
                    </button>
                </div>
                <div className="flex-row grid grid-cols-1 md:grid-cols-7 gap-10 montserratFont">
                    <div className="outline-4 outline-[#393939] rounded-xl md:col-span-4 2xl:col-span-3 h-max overflow-hidden">
                        <img src={certificateData?.data?.certificateJpgUrl} className="w-full h-auto" />
                    </div>
                    <div className="md:col-span-3 2xl:col-span-4">
                        <div className="flex flex-col gap-4">
                            <div className="border border-[#F5F5F540] rounded-lg px-4 py-4 flex flex-col gap-2 text-[#C6C6C6]">
                                <h1>Course Detail</h1>
                                <div className="flex flex-row justify-between">
                                    <p className="font-medium">Category</p>
                                    <p className="text-white">{courseData?.data?.categories?.tittle}</p>
                                </div>
                                <div className="flex flex-row justify-between">
                                    <p className="font-medium">Level</p>
                                    <p className="text-white">{courseData?.data?.EducationLevel}</p>
                                </div>
                                <div className="flex flex-row justify-between">
                                    <p className="font-medium">Duration</p>
                                    <p className="text-white">{courseData?.data?.categories?.tittle}</p>
                                </div>
                                <div className="flex flex-row justify-between">
                                    <p className="font-medium">Episodes</p>
                                    <p className="text-white">{courseData?.data?.EducationEpisode?.length}</p>
                                </div>
                                <div className="flex flex-row justify-between">
                                    <p className="font-medium">Access</p>
                                    <p className="text-white">Rp. {courseData?.data?.price.toLocaleString()}</p>
                                </div>
                                <div className="flex flex-row justify-between">
                                    <p className="font-medium">Certificate</p>
                                    <p className="text-white">{courseData?.data?.haveCertificate ? <Icon
                                        icon={'solar:check-circle-outline'}
                                        className="text-green-400"
                                    /> : <Icon
                                        icon={'solar:close-circle-outline'}
                                        className="text-red-500"
                                    />}</p>
                                </div>
                                <div className="flex flex-row items-center gap-2">
                                    <DefaultAvatar
                                        size={64}
                                        src={courseData?.data?.instructorPhoto ?? DEFAULT_AVATAR.src}
                                    />
                                    <div className="flex flex-col">
                                        <p className="zeinFont text-2xl">{courseData?.data?.instructorName}</p>
                                        <p className="font-medium text-sm">{courseData?.data?.instructorBio}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 text-white">
                                <h1 className="font-bold">What You&apos;ll Learn</h1>
                                <div className="flex flex-col">
                                    {courseData?.data?.benefit.map((benefit, index) => <div key={index} className="flex flex-row items-center gap-2">
                                        <Icon
                                            icon={'solar:check-circle-outline'}
                                            className="text-green-400"
                                        />
                                        <p className="font-medium text-sm">{benefit}</p>
                                    </div>)}
                                </div>
                                <div className="rounded-xl border-[#FAD1B0] border bg-[#FAD1B04D] py-2 px-4">
                                    <div className="flex flex-row gap-2">
                                        <Icon icon={'solar:medal-ribbon-outline'} className="text-[#F07F26]" width={32} height={32} />
                                        <div className="flex flex-col gap-1 font-bold text-2xl">
                                            <p className="text-[#F07F26] font-bold zeinFont">Certficate of Completion</p>
                                            <p className="text-[#FAD1B0] text-sm font-normal">Earn a certificate by completing all episodes and passing the final assignment with {courseData?.data?.passingGrade}% or higher.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

CertificatePage.propTypes = {
    params: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }).isRequired,
};