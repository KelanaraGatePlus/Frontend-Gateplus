"use client";
import React, { useState } from 'react';
import PropTypes from 'prop-types';

// ==================== IMPORT ACTUAL COMPONENTS ====================
import DefaultVideoPlayer from '@/components/VideoPlayer/DefaultVideoPlayer';
import CommentComponent from '@/components/Comment/page';
import CarouselTemplate from '@/components/Carousel/carouselTemplate';
import { useGetEducationByIdQuery, useGetEducationProgressByIdQuery, useGetRecomendationEducationQuery, useLazyGenerateEducationCertificateQuery } from '@/hooks/api/educationSliceAPI';
import LoadingOverlay from '@/components/LoadingOverlay/page';
import { DEFAULT_AVATAR } from '@/lib/defaults';
import { useGetCommentByEducationQuery } from '@/hooks/api/commentSliceAPI';
import { Icon } from '@iconify/react';
import DefaultProgressBar from '@/components/ProgressBar/DefaultProgressBar';

// ==================== COURSE HEADER COMPONENT ====================

function CourseHeader({ course, isEnrolled = false }) {
    const countDuration = (episodes = []) => {
        // total durasi sudah dalam detik
        const totalSeconds = episodes.reduce((total, ep) => {
            return total + (Number(ep.duration) || 0);
        }, 0);

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return {
            totalSeconds,
            formatted: `${hours.toString().padStart(2, "0")}h ` +
                `${minutes.toString().padStart(2, "0")}m ` +
                `${seconds.toString().padStart(2, "0")}s`
        };
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
            <div className="flex-1 w-full">
                <h2 className="text-white font-bold text-2xl md:text-3xl lg:text-4xl mb-4 leading-tight">
                    {course?.title}
                </h2>
                <div className="flex items-center gap-3 text-gray-300 text-sm md:text-base mb-5">
                    <span className="font-medium">{countDuration(course?.EducationEpisode).formatted}</span>
                    <span>•</span>
                    <span className="px-2.5 py-1 bg-yellow-500/20 text-yellow-400 rounded font-medium">
                        {"Semua Usia"}
                    </span>
                    <span>•</span>
                    <span>{course?.categories?.tittle}</span>
                </div>
                <div className="flex items-center gap-4">
                    <div
                        className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-gray-700 bg-gradient-to-br overflow-hidden from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg"
                    >
                        <img src={course?.creator?.imageUrl || DEFAULT_AVATAR.src} alt={course?.creator?.name || "Default Avatar"} />
                    </div>
                    <div>
                        <p className="text-white font-semibold text-base md:text-lg">
                            {course?.creator?.profileName}
                        </p>
                        <p className="text-gray-400 text-sm md:text-base">
                            {course?.creator?.followers} followers
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 w-full lg:w-auto lg:min-w-[300px]">
                <div className="rounded-xl flex flex-col items-center">
                    <div className="text-white font-bold text-3xl md:text-4xl mb-4 text-center">
                        Rp{course?.price?.toLocaleString('id-ID')}
                    </div>
                    <button
                        onClick={() => {
                            window.location.href = '/checkout/subscribe/education/' + course?.id;
                        }}
                        disabled={isEnrolled}
                        className={`w-full py-4 text-white rounded-full font-semibold transition-all transform text-base md:text-lg shadow-lg ${isEnrolled
                            ? 'bg-gray-600 cursor-not-allowed'
                            : 'bg-[#0076E999] hover:bg-[#0076E999]/60'
                            }`}
                    >
                        {isEnrolled ? 'Already Enrolled' : 'Enroll Now'}
                    </button>
                    <p className="text-gray-400 text-xs md:text-sm text-center mt-3 leading-relaxed">
                        Dengan membeli course menyetujui syarat dan ketentuan
                    </p>
                </div>
            </div>
        </div>
    );
}

CourseHeader.propTypes = {
    course: PropTypes.object,
    isEnrolled: PropTypes.bool
};

// ==================== STATS CARDS COMPONENT ====================

function StatsCards({ stats, course, progress }) {
    const [generateCertificate, { isLoading }] = useLazyGenerateEducationCertificateQuery(course?.id);
    const countTotalMinutes = (episodes = []) => {
        const totalSeconds = episodes.reduce((total, ep) => {
            return total + (Number(ep.duration) || 0);
        }, 0);

        return Math.ceil(totalSeconds / 60);
    };

    const handleGenerateCertificate = async () => {
        try {
            if (!course?.id) return;

            const response = await generateCertificate(course.id).unwrap();

            // contoh: jika API mengembalikan URL sertifikat
            if (response?.data?.certificateId) {
                window.open('/education/certificate/' + response.data.certificateId, "_blank");
            }

        } catch (error) {
            console.error("Failed to generate certificate:", error);
        }
    };

    return (
        <div className='flex flex-col gap-4'>
            {course?.haveCertificate && progress?.averageScore >= course?.passingGrade && progress?.progressPercentage >= 100 && (
                <div className="bg-[#FAD1B04D] border border-[#FAD1B0] rounded-xl p-2 md:p-4">
                    <div className="flex items-start justify-between">
                        <div className='flex items-start gap-4'>
                            <Icon
                                icon={'solar:medal-ribbon-linear'}
                                className='text-[#F07F26]'
                                width={32}
                                height={32}
                            />
                            <div className="flex-1">
                                <h4 className="text-orange-300 font-bold text-lg md:text-xl">Certificate of Completion</h4>
                                <p className="text-orange-200/90 text-base md:text-lg leading-relaxed">
                                    Well done! You’ve successfully completed this course and earned your certificate.
                                </p>
                            </div>
                        </div>
                        <button onClick={handleGenerateCertificate} disabled={isLoading} className="bg-orange-500 border-2 border-orange-400 self-center hover:bg-orange-400 text-white px-4 py-2 rounded-lg font-semibold transition-all text-sm md:text-base shadow-lg flex items-center gap-2">
                            {isLoading ? "Generating..." : "Generate Certificate"}
                        </button>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-3 gap-3 md:gap-4">
                <div className="bg-[#515151] rounded-xl p-4 md:p-6 border border-blue-500/20 text-center">
                    <div className="text-blue-400 text-3xl md:text-4xl font-bold mb-2 zeinFont">{stats?.EducationEpisode?.length}</div>
                    <div className="text-gray-300 text-sm md:text-base font-medium">Episodes</div>
                </div>
                <div className="bg-[#515151] rounded-xl p-4 md:p-6 border border-purple-500/20 text-center">
                    <div className="text-purple-400 text-3xl md:text-4xl font-bold mb-2 zeinFont">{countTotalMinutes(stats?.EducationEpisode)}</div>
                    <div className="text-gray-300 text-sm md:text-base font-medium">Minutes</div>
                </div>
                <div className="bg-[#515151] rounded-xl p-4 md:p-6 border border-green-500/20 text-center">
                    <div className="text-green-400 text-lg md:text-2xl font-bold mb-2 zeinFont">{stats?.EducationLevel}</div>
                    <div className="text-gray-300 text-sm md:text-base font-medium">Level</div>
                </div>
            </div>
        </div>
    );
}

StatsCards.propTypes = {
    stats: PropTypes.object,
    course: PropTypes.object,
    progress: PropTypes.object
};

// ==================== TAB NAVIGATION COMPONENT ====================

function TabNavigation({ activeTab, onTabChange }) {
    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'curriculum', label: 'Curriculum' },
        { id: 'progress', label: 'Progress' }
    ];

    return (
        <div className="flex gap-2 bg-[#515151] rounded-xl p-2 border border-gray-700/50">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex-1 py-3 md:py-3.5 px-4 rounded-lg font-semibold transition-all text-sm md:text-base ${activeTab === tab.id
                        ? 'bg-[#222222] text-white shadow-lg'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-[#222222]/30'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

TabNavigation.propTypes = {
    activeTab: PropTypes.string.isRequired,
    onTabChange: PropTypes.func.isRequired
};

// ==================== CURRICULUM SECTION COMPONENT ====================

function CurriculumSection({ episodes = [], progress, courseData, isSubscribe }) {
    const countTotalMinutes = (episode) => {
        const totalSeconds = episode.duration || 0;

        return Math.ceil(totalSeconds / 60);
    };

    const isEpisodeLocked = (episode) => {
        return episode.isLocked || !isSubscribe;
    };

    const isEpisodeCompleted = (episode) => {
        return isSubscribe && episode?.userProgress?.finishWatch && (episode?.quizId ? episode?.userProgress?.finishQuiz : true);
    };

    return (
        <div className="space-y-4">
            {episodes.map((episode) => (
                <button
                    key={episode.id}
                    onClick={() => {
                        if (!isEpisodeLocked(episode)) {
                            window.location.href = '/education/episode/' + episode.id;
                        }
                    }}
                    disabled={isEpisodeLocked(episode)}
                    className={`w-full rounded-xl p-5 md:p-6 border transition-all ${isEpisodeLocked(episode)
                        ? 'border-gray-700/30 cursor-not-allowed'
                        : isEpisodeCompleted(episode)
                            ? 'border-green-500/50 hover:border-green-500/70 hover:bg-green-900/20 cursor-pointer'
                            : 'border-gray-700/50 hover:border-blue-500/50 hover:bg-gray-800/60 cursor-pointer'
                        }`}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center flex-shrink-0 ${isEpisodeLocked(episode)
                            ? 'bg-gray-700/50'
                            : isEpisodeCompleted(episode)
                                ? 'bg-gradient-to-br from-green-500/20 to-green-500/20 border border-green-500/30'
                                : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30'
                            }`}>
                            {isEpisodeLocked(episode) ? (
                                <svg className="w-6 h-6 md:w-7 md:h-7 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                            ) : isEpisodeCompleted(episode) ? (
                                <svg className="w-6 h-6 md:w-7 md:h-7 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 md:w-7 md:h-7 text-blue-400 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )}
                        </div>

                        <div className="flex-1 text-left">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-gray-400 text-sm md:text-base font-medium">Episode {episode.number}</span>
                                {episode.hasQuiz && (
                                    <span className="bg-blue-500/20 text-blue-400 text-xs md:text-sm px-2.5 py-1 rounded-full font-medium border border-blue-500/30">
                                        Quiz
                                    </span>
                                )}
                            </div>
                            <h4 className="text-white font-semibold text-base md:text-lg mb-2">{episode.title}</h4>
                            <div className="flex items-center gap-4 text-gray-400 text-sm md:text-base">
                                <span className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                    </svg>
                                    {episode.videoCount} video{countTotalMinutes(episode) > 1 ? 's' : ''}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    {countTotalMinutes(episode)} min
                                </span>
                            </div>
                        </div>

                        {(isSubscribe) && (
                            <>
                                <div className='flex flex-col gap-1 items-end'>
                                    <div className={`flex flex-row gap-1 items-center ${episode?.userProgress?.finishWatch ? 'text-green-400' : 'text-yellow-300'}`}>
                                        <p>Video</p>
                                        <Icon
                                            icon={'solar:play-bold'}
                                        />
                                    </div>
                                    {episode?.quizId && (
                                        <div className={`flex flex-row gap-1 items-center ${episode?.userProgress?.finishQuiz ? 'text-green-400' : 'text-yellow-300'}`}>
                                            <p>Quiz</p>
                                            <Icon
                                                icon={'solar:check-circle-bold'}
                                            />
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </button>
            ))}
            {courseData?.haveFinalProject && <button
                onClick={() => {
                    if (progress?.finalProjectDoneCount < progress?.totalFinalProjectCount && progress?.quizDoneCount >= progress?.totalQuizCount && progress?.episodeDoneCount >= progress?.totalEpisodeCount) {
                        window.location.href = '/education/final-assignment/' + courseData?.id;
                    }
                }}
                disabled={progress?.finalProjectDoneCount >= progress?.totalFinalProjectCount || progress?.quizDoneCount < progress?.totalQuizCount || progress?.episodeDoneCount < progress?.totalEpisodeCount}
                className={`bg-gradient-to-r grid col-span-2 from-blue-900/30 to-purple-900/30 rounded-xl p-5 md:p-6 border border-blue-500/30 transition-all w-full text-left cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:border-blue-500/50 hover:bg-gradient-to-r hover:from-blue-900/40 hover:to-purple-900/40 
                            `}
            >
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        {progress?.finalProjectDoneCount >= progress?.totalFinalProjectCount ? <Icon
                            icon={'solar:check-circle-bold'}
                            className='text-green-500'
                            width={32}
                            height={32}
                        /> : <Icon
                            icon={'solar:close-circle-bold'}
                            className='text-red-600'
                            width={32}
                            height={32}
                        />}
                    </div>
                    <div className="flex-1">
                        <h4 className="text-blue-300 font-semibold text-base md:text-lg mb-2">Final Assignment</h4>
                        <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                            {progress?.quizDoneCount < progress?.totalQuizCount || progress?.episodeDoneCount < progress?.totalEpisodeCount ? 'You need to complete all quizzes and episodes before starting the final assignment.' : progress?.finalProjectDoneCount >= progress?.totalFinalProjectCount ? 'You have completed the final assignment.' : 'Click to start the final assignment. Minimum score: ' + courseData?.passingGrade + '%'}
                        </p>
                    </div>
                    {progress?.finalProjectDoneCount < progress?.totalFinalProjectCount && (
                        <div className="flex items-center">
                            <Icon
                                icon={'solar:arrow-right-bold'}
                                className='text-blue-400'
                                width={24}
                                height={24}
                            />
                        </div>
                    )}
                </div>
            </button>}
        </div>
    );
}

CurriculumSection.propTypes = {
    episodes: PropTypes.array,
    progress: PropTypes.object,
    courseData: PropTypes.object,
    isSubscribe: PropTypes.bool
};

// ==================== OVERVIEW CONTENT COMPONENT ====================

function OverviewContent({ course }) {
    const countDuration = (episodes = []) => {
        // total durasi sudah dalam detik
        const totalSeconds = episodes.reduce((total, ep) => {
            return total + (Number(ep.duration) || 0);
        }, 0);

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return {
            totalSeconds,
            formatted: `${hours.toString().padStart(2, "0")}h ` +
                `${minutes.toString().padStart(2, "0")}m ` +
                `${seconds.toString().padStart(2, "0")}s`
        };
    };

    return (
        <div className="space-y-8 md:space-y-10">
            <div>
                <h3 className="text-white font-bold text-xl md:text-2xl mb-4">About This Course</h3>
                <p className="text-gray-300 leading-relaxed text-base md:text-lg">
                    {course?.description}
                </p>
            </div>

            <div>
                <h3 className="text-white font-bold text-xl md:text-2xl mb-4">Course Requirement</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {course?.requirement?.map((point, index) => (
                        <div key={index} className="flex items-start gap-3 text-gray-300 text-base md:text-lg">
                            <svg className="w-6 h-6 md:w-7 md:h-7 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{point}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-white font-bold text-xl md:text-2xl mb-4">What You&apos;ll Learn</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    {course?.benefit?.map((point, index) => (
                        <div key={index} className="flex items-start gap-3 text-gray-300 text-base md:text-lg">
                            <svg className="w-6 h-6 md:w-7 md:h-7 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{point}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-white font-bold text-xl md:text-2xl mb-4">Course Details</h3>
                <div className="bg-gray-800/30 rounded-xl p-5 md:p-6 border border-gray-700/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base md:text-lg">
                        <div className="flex justify-between py-2 border-b border-gray-700/50">
                            <span className="text-gray-400 font-medium">Category</span>
                            <span className="text-white font-semibold">{course?.categories?.tittle}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-700/50">
                            <span className="text-gray-400 font-medium">Level</span>
                            <span className="text-white font-semibold capitalize">{course?.EducationLevel}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-700/50">
                            <span className="text-gray-400 font-medium">Duration</span>
                            <span className="text-white font-semibold">{countDuration(course?.episodes).formatted}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-700/50">
                            <span className="text-gray-400 font-medium">Episodes</span>
                            <span className="text-white font-semibold">{course?.EducationEpisode?.length}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-700/50">
                            <span className="text-gray-400 font-medium">Access</span>
                            <span className="text-white font-semibold">Rp{course?.price?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-gray-700/50">
                            <span className="text-gray-400 font-medium">Certificate</span>
                            <span className="text-green-500 font-semibold flex items-center gap-2">
                                {course?.haveCertificate && (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                )}
                                {course?.haveCertificate ? 'Yes' : 'No'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {course?.haveCertificate && (
                <div className="bg-[#FAD1B04D] border border-[#FAD1B0] rounded-xl p-2 md:p-4">
                    <div className="flex items-start gap-4">
                        <Icon
                            icon={'solar:medal-ribbon-linear'}
                            className='text-[#F07F26]'
                            width={32}
                            height={32}
                        />
                        <div className="flex-1">
                            <h4 className="text-orange-300 font-bold text-lg md:text-xl">Certificate of Completion</h4>
                            <p className="text-orange-200/90 text-base md:text-lg leading-relaxed">
                                Earn a certificate by completing all episodes and passing the final assignment with {course?.passingGrade}% or higher.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <h3 className="text-white font-bold text-xl md:text-2xl mb-4">Course Instructor</h3>
                <div className="flex items-center gap-4 bg-gray-800/30 rounded-xl p-5 md:p-6 border border-gray-700/50">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br overflow-hidden from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl md:text-3xl">
                        <img
                            src={course?.instructorPhoto ?? DEFAULT_AVATAR.src}
                        />
                    </div>
                    <div>
                        <p className="text-white font-bold text-lg md:text-xl">{course?.instructorName}</p>
                        <p className="text-gray-400 text-sm md:text-base font-medium">{course?.instructorBio}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

OverviewContent.propTypes = {
    course: PropTypes.object
};

// ==================== PROGRESS CONTENT COMPONENT ====================

function ProgressContent({ progress, courseData, isEnrolled }) {
    // Jika belum enroll, tampilkan UI untuk enroll dulu
    if (!isEnrolled) {
        return (
            <div className="space-y-6">
                <h3 className="text-white font-bold text-xl md:text-2xl">Your Progress</h3>

                <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl p-8 md:p-12 border border-blue-500/30 text-center">
                    <div className="flex flex-col items-center gap-6">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-full flex items-center justify-center border-2 border-blue-500/50">
                            <Icon
                                icon={'solar:lock-keyhole-bold'}
                                className='text-blue-400'
                                width={48}
                                height={48}
                            />
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-white font-bold text-xl md:text-2xl">Enroll to Track Your Progress</h4>
                            <p className="text-gray-300 text-base md:text-lg max-w-md mx-auto leading-relaxed">
                                You need to enroll in this course first to start learning and track your progress.
                            </p>
                        </div>
                        <button
                            onClick={() => {
                                window.location.href = '/checkout/subscribe/education/' + courseData?.id;
                            }}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold transition-all transform hover:scale-105 text-base md:text-lg shadow-lg flex items-center gap-2"
                        >
                            <Icon
                                icon={'solar:cart-large-2-bold'}
                                width={24}
                                height={24}
                            />
                            Enroll Now - Rp{courseData?.price?.toLocaleString('id-ID')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-white font-bold text-xl md:text-2xl">Your Progress</h3>

            <div className="bg-gray-800/30 rounded-xl p-5 md:p-6 border border-gray-700/50">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-gray-300 text-base md:text-lg font-medium">Completion</span>
                        <span className="text-white font-bold text-xl md:text-2xl">{progress?.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3 md:h-4 overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 md:h-4 rounded-full transition-all duration-500"
                            style={{ width: `${progress?.progressPercentage}%` }}
                        ></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:gap-6">
                    <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-xl p-5 md:p-6 border border-green-500/30">
                        <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">
                            {progress?.episodeDoneCount}
                        </div>
                        <div className="text-gray-300 text-sm md:text-base font-medium">Episodes Done</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-5 md:p-6 border border-blue-500/30">
                        <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">
                            {progress?.totalEpisodeCount - progress?.episodeDoneCount}
                        </div>
                        <div className="text-gray-300 text-sm md:text-base font-medium">Episodes Remaining</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-xl p-5 md:p-6 border border-green-500/30">
                        <div className="text-4xl md:text-5xl font-bold text-green-400 mb-2">
                            {progress?.quizDoneCount}
                        </div>
                        <div className="text-gray-300 text-sm md:text-base font-medium">Quiz Done</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-5 md:p-6 border border-blue-500/30">
                        <div className="text-4xl md:text-5xl font-bold text-blue-400 mb-2">
                            {progress?.totalQuizCount - progress?.quizDoneCount}
                        </div>
                        <div className="text-gray-300 text-sm md:text-base font-medium">Quiz Remaining</div>
                    </div>
                    {courseData?.haveFinalProject && <button
                        onClick={() => {
                            if (progress?.finalProjectDoneCount < progress?.totalFinalProjectCount && progress?.quizDoneCount >= progress?.totalQuizCount && progress?.episodeDoneCount >= progress?.totalEpisodeCount) {
                                window.location.href = '/education/final-assignment/' + courseData?.id;
                            }
                        }}
                        disabled={progress?.finalProjectDoneCount >= progress?.totalFinalProjectCount || progress?.quizDoneCount < progress?.totalQuizCount || progress?.episodeDoneCount < progress?.totalEpisodeCount}
                        className={`bg-gradient-to-r grid col-span-2 from-blue-900/30 to-purple-900/30 rounded-xl p-5 md:p-6 border border-blue-500/30 transition-all w-full text-left cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:border-blue-500/50 hover:bg-gradient-to-r hover:from-blue-900/40 hover:to-purple-900/40 
                            `}
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                {progress?.finalProjectDoneCount >= progress?.totalFinalProjectCount ? <Icon
                                    icon={'solar:check-circle-bold'}
                                    className='text-green-500'
                                    width={32}
                                    height={32}
                                /> : <Icon
                                    icon={'solar:close-circle-bold'}
                                    className='text-red-600'
                                    width={32}
                                    height={32}
                                />}
                            </div>
                            <div className="flex-1">
                                <h4 className="text-blue-300 font-semibold text-base md:text-lg mb-2">Final Assignment</h4>
                                <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                                    {progress?.quizDoneCount < progress?.totalQuizCount || progress?.episodeDoneCount < progress?.totalEpisodeCount ? 'You need to complete all quizzes and episodes before starting the final assignment.' : progress?.finalProjectDoneCount >= progress?.totalFinalProjectCount ? 'You have completed the final assignment.' : 'Click to start the final assignment. Minimum score: ' + courseData?.passingGrade + '%'}
                                </p>
                            </div>
                            {progress?.finalProjectDoneCount < progress?.totalFinalProjectCount && (
                                <div className="flex items-center">
                                    <Icon
                                        icon={'solar:arrow-right-bold'}
                                        className='text-blue-400'
                                        width={24}
                                        height={24}
                                    />
                                </div>
                            )}
                        </div>
                    </button>}
                </div>
            </div>
            <div className="bg-[gray-800/30] rounded-xl p-5 md:p-6 border border-gray-700/50 montserratFont">
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-white text-lg font-bold md:text-2xl">Your Current Grade</span>
                    </div>
                    <div className='grid grid-cols-5 gap-14 items-end'>
                        <div className="col-span-4 flex flex-col justify-between h-full">
                            <div className="mb-4 flex flex-row justify-between w-full h-6">
                                <span className="text-gray-300 text-base md:text-lg font-medium">Grade</span>
                                <span
                                    className={`text-2xl font-bold ${progress?.averageScore < courseData?.passingGrade
                                        ? 'text-[#D00416]'
                                        : progress?.averageScore === courseData?.passingGrade
                                            ? 'text-[#DFB400]'
                                            : 'text-[#1FC16B]'
                                        }`}
                                >
                                    {progress?.averageScore}
                                </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-3 md:h-4 overflow-hidden">
                                <DefaultProgressBar
                                    progress={progress?.averageScore}
                                    barColor={
                                        `${progress?.averageScore < courseData?.passingGrade
                                            ? '#D00416'
                                            : progress?.averageScore === courseData?.passingGrade
                                                ? '#DFB400'
                                                : '#1FC16B'
                                        }`
                                    }
                                />
                            </div>
                        </div>
                        <div className="bg-[#1DBDF5]/10 col-span-1 rounded-xl p-2 md:p-2 border border-green-500/30">
                            <div className="text-2xl md:text-2xl font-bold text-[#1DBDF5] mb-2">
                                {courseData?.passingGrade}
                            </div>
                            <div className="text-[#1297DC] text-sm md:text-base font-medium">Minimum Grade</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 md:gap-6">
                    <div className='flex flex-col gap-2'>
                        <h1 className='text-white font-bold text-lg'>Quiz Grade</h1>
                        {progress?.highestScoresPerQuiz?.map((quiz, index) =>
                            <div key={index} className='flex flex-col gap-2'>
                                <div className='flex flex-row justify-between w-full text-white'>
                                    <p>Quiz: {quiz.quizTitle}</p>
                                    <p className='font-medium'>{quiz.bestScore == 0 ? '-' : quiz.bestScore}</p>
                                </div>
                                <DefaultProgressBar
                                    progress={quiz.bestScore}
                                />
                            </div>
                        )}
                    </div>
                    {courseData?.haveFinalProject &&
                        <div className='flex flex-col gap-2 text-white'>
                            <h1 className='text-white font-bold text-lg'>Final Assignment Grade</h1>
                            <div className='p-2 bg-[#84EBB4]/10 rounded-lg'>
                                <p className='font-bold text-2xl text-[#1FC16B]'>{progress?.finalAssignmentBestScore ?? '-'}</p>
                                <p className='text-[#1FC16B]'>Your Final Assignment Grade</p>
                            </div>
                        </div>}
                </div>
            </div>
        </div>
    );
}

ProgressContent.propTypes = {
    progress: PropTypes.object,
    courseData: PropTypes.object,
    isEnrolled: PropTypes.bool
};

// ==================== MAIN EDUCATION PAGE COMPONENT ====================

export default function EducationPage({ params }) {
    const [activeTab, setActiveTab] = useState('overview');
    const { id } = params;
    const { data, isLoading } = useGetEducationByIdQuery(id);
    const { data: commentData, isLoading: commentLoading } = useGetCommentByEducationQuery(id);
    const { data: progressData, isLoading: progressLoading } = useGetEducationProgressByIdQuery(id);
    const { data: recommendationData, isLoading: recommendationLoading } = useGetRecomendationEducationQuery(data?.data?.categoriesId, {
        skip: !data?.data?.categoriesId
    });

    const handleEpisodeClick = (episode) => console.log('Play episode:', episode);

    if (isLoading || progressLoading || recommendationLoading) {
        return <LoadingOverlay />;
    }

    return (
        <div className='w-full min-h-screen flex flex-col'>
            <div className="w-full">
                {/* DefaultVideoPlayer Component */}
                <DefaultVideoPlayer
                    src={data?.data?.trailerUrl}
                    poster={data?.data?.thumbnailUrl}
                    title={data?.data?.title}
                    genre={data?.data?.categories?.tittle}
                    ageRestriction={data?.data?.EducationLevel}
                />

                <div className='flex flex-col px-4 md:px-15 py-15 gap-4'>
                    <CourseHeader
                        course={data?.data}
                        isEnrolled={data?.data?.isSubscribe}
                    />
                    <StatsCards stats={data?.data} course={data?.data} progress={progressData?.data} />
                    <TabNavigation
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                    <div className="min-h-[400px]">
                        {activeTab === 'overview' && (
                            <OverviewContent course={data?.data} />
                        )}
                        {activeTab === 'curriculum' && (
                            <CurriculumSection
                                episodes={data?.data?.EducationEpisode}
                                onEpisodeClick={handleEpisodeClick}
                                courseData={data?.data}
                                isSubscribe={data?.data?.isSubscribe}
                                progress={progressData?.data}
                            />
                        )}
                        {activeTab === 'progress' && (
                            <ProgressContent progress={progressData?.data} courseData={data?.data} isEnrolled={data?.data?.isSubscribe} />
                        )}
                    </div>
                </div>
                {/* CarouselTemplate Component */}
                <CarouselTemplate
                    label="Rekomendasi Serupa"
                    contents={recommendationData?.data || []}
                    isLoading={recommendationLoading}
                    isTopTen={false}
                    type={'education'}
                />
                <div className='flex flex-col px-4 md:px-10 py-15 gap-4'>
                    {/* CommentComponent Component */}
                    <CommentComponent
                        commentData={commentData?.data?.data || []}
                        contentType="EDUCATION"
                        episodeId={data?.data?.id}
                        isDark={true}
                        isLoadingGetComment={commentLoading}
                    />
                </div>
            </div>
        </div>
    );
}

EducationPage.propTypes = {
    params: PropTypes.shape({
        id: PropTypes.string.isRequired
    }).isRequired
};