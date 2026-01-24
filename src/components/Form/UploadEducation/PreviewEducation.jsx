import DefaultAvatar from "@/components/Avatar/DefaultAvatar";
import DefaultVideoPlayer from "@/components/VideoPlayer/DefaultVideoPlayer";
import { useGetEducationByIdQuery, usePublishEducationByIdMutation } from "@/hooks/api/educationSliceAPI";
import { DEFAULT_AVATAR } from "@/lib/defaults";
import { Icon } from "@iconify/react";
import EpisodeEducationForm from "./EpisodeUploadForm";
import TermsCheckbox from "@/components/UploadForm/TermsCheckbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { publishEducationSchema } from "@/lib/schemas/publishEducationSchema";
import { useForm } from "react-hook-form";
import LoadingOverlay from "@/components/LoadingOverlay/page";

export default function PreviewEducation({ educationId }) {
    const { data: educationData, isLoading: isEducationLoading } = useGetEducationByIdQuery(educationId);
    const [publishEducation, { isLoading, isSuccess, isError, error }] = usePublishEducationByIdMutation();

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(publishEducationSchema),
        mode: "onChange",
        defaultValues: {
            termAccepted: false,
            agreementAccepted: false,
            educationId: educationId,
        },
    });

    const onSubmit = async (data) => {
        try {
            const result = await publishEducation({
                educationId: data.educationId
            }).unwrap();
            console.log("Education published successfully:", result);
            if (result) {
                window.location.href = '/';
            }
            // You can add success notification or redirect here
        } catch (err) {
            console.error("Failed to publish education:", err);
            // You can add error notification here
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {(isEducationLoading || isLoading) && <LoadingOverlay isLoading={isLoading == true || isEducationLoading == true} />}
            <div className="bg-[#393939] rounded-xl border-[#686868] border p-4 montserratFont text-white font-bold flex flex-col gap-2">
                <h1 className="text-sm font-bold">Basic Information</h1>
                <p className="text-sm font-bold">Course Introduction</p>
                <DefaultVideoPlayer
                    src={educationData?.data?.trailerUrl}
                    poster={educationData?.data?.bannerUrl}
                    width="100%"
                />
                <p className="text-sm font-bold">Education Title</p>
                <p className="text-sm font-normal">{educationData?.data?.title}</p>
                <p className="text-sm font-bold">About This Course</p>
                <div className="border border-[#F5F5F540] rounded-lg p-2">
                    <p className="text-sm font-normal">{educationData?.data?.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="border border-[#F5F5F540] rounded-lg px-4 py-4 flex flex-col gap-3">
                        <h1>Course Detail</h1>
                        <div className="flex flex-row justify-between">
                            <p className="font-normal">Category</p>
                            <p className="text-[#C6C6C6]">{educationData?.data?.categories?.tittle}</p>
                        </div>
                        <div className="flex flex-row justify-between">
                            <p className="font-normal">Level</p>
                            <p className="text-[#C6C6C6]">{educationData?.data?.EducationLevel}</p>
                        </div>
                        <div className="flex flex-row justify-between">
                            <p className="font-normal">Duration</p>
                            <p className="text-[#C6C6C6]">{educationData?.data?.categories?.tittle}</p>
                        </div>
                        <div className="flex flex-row justify-between">
                            <p className="font-normal">Episodes</p>
                            <p className="text-[#C6C6C6]">{educationData?.data?.EducationEpisode?.length}</p>
                        </div>
                        <div className="flex flex-row justify-between">
                            <p className="font-normal">Access</p>
                            <p className="text-[#C6C6C6]">Rp. {educationData?.data?.price.toLocaleString()}</p>
                        </div>
                        <div className="flex flex-row justify-between">
                            <p className="font-normal">Certificate</p>
                            <p className="text-[#C6C6C6]">{educationData?.data?.haveCertificate ? <Icon
                                icon={'solar:check-circle-outline'}
                                className="text-green-500"
                            /> : <Icon
                                icon={'solar:close-circle-outline'}
                                className="text-red-500"
                            />}</p>
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <DefaultAvatar
                                size={64}
                                src={educationData?.data?.instructorPhoto ?? DEFAULT_AVATAR.src}
                            />
                            <div className="flex flex-col">
                                <p className="zeinFont text-2xl">{educationData?.data?.instructorName}</p>
                                <p className="font-medium text-sm">{educationData?.data?.instructorBio}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h1>What You'll Learn</h1>
                        <div className="flex flex-row">
                            {educationData?.data?.benefit.map(benefit => <div className="flex flex-row items-center gap-2">
                                <Icon
                                    icon={'solar:check-circle-outline'}
                                    className="text-green-500"
                                />
                                <p className="font-medium text-sm">{benefit}</p>
                            </div>)}
                        </div>
                        <div className="rounded-xl border-[#FAD1B0] border bg-[#FAD1B04D] py-2 px-4">
                            <div className="flex flex-row gap-2">
                                <Icon icon={'solar:medal-ribbon-outline'} className="text-[#F07F26]" width={32} height={32} />
                                <div className="flex flex-col gap-1 font-bold text-2xl">
                                    <p className="text-[#F07F26] font-bold zeinFont">Certficate of Completion</p>
                                    <p className="text-[#FAD1B0] text-sm font-normal">Earn a certificate by completing all episodes and passing the final assignment with 80% or higher.</p>
                                </div>
                            </div>
                        </div>
                        <button className="flex flex-row gap-2 items-center bg-[#FAD1B0] rounded-lg p-2 justify-center">
                            <Icon icon={'solar:medal-ribbon-outline'} className="text-[#F07F26]" width={32} height={32} />
                            <p className="text-[#F07F26] font-bold">Preview Certificate</p>
                        </button>
                    </div>
                </div>
            </div>
            <div className="bg-[#393939] rounded-xl border-[#686868] border p-4 montserratFont text-white font-bold flex flex-col gap-2">
                <EpisodeEducationForm educationId={educationId} />
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <TermsCheckbox
                    name="termAccepted"
                    control={control}
                    label="Saya menyetujui"
                    linkHref="/term-and-conditions"
                    linkText="Syarat & Ketentuan"
                />
                <TermsCheckbox
                    name="agreementAccepted"
                    control={control}
                    label="Saya menyetujui"
                    linkHref="/agreement"
                    linkText="Agreement"
                />

                <div className="w-full flex flex-row justify-between mt-2">
                    <button type="button" className="flex flex-row items-center gap-2 px-4 py-2 rounded-md border border-[#686868] bg-[#393939] text-white font-medium montserratFont ">
                        <Icon icon={'solar:arrow-left-linear'} width={32} height={32} />
                        <span>Previous</span>
                    </button>
                    <button type="submit" disabled={isLoading} className="flex flex-row items-center gap-2 px-4 py-2 rounded-md border border-[#156EB7] bg-[#184A97] text-white font-medium montserratFont disabled:opacity-50 disabled:cursor-not-allowed">
                        <span>{isLoading ? "Publishing..." : "Publish"}</span>
                        <Icon icon={'solar:arrow-right-linear'} width={32} height={32} />
                    </button>
                </div>
            </form>
        </div>
    );
}