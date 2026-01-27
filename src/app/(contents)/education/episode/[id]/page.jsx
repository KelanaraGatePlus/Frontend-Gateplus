"use client";
import PropTypes from 'prop-types';
import BackButton from "@/components/BackButton/page";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import DefaultVideoPlayer from "@/components/VideoPlayer/DefaultVideoPlayer";
import { useGetEducationEpisodeByIdQuery } from "@/hooks/api/educationEpisodeSliceAPI";
import { useGetEducationByIdQuery, useGetEducationProgressByIdQuery } from "@/hooks/api/educationSliceAPI";
import { useGetQuizByIdQuery, usePostQuizAttemptMutation } from "@/hooks/api/quizSliceAPI";
import { Icon } from "@iconify/react";
import React from "react";

function CurriculumSection({ episodes = [], progress, courseData, isSubscribe, episodeIdActive }) {
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
                        } ${episodeIdActive === episode.id ? 'bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/50' : ''}`}
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
    isSubscribe: PropTypes.bool,
    episodeIdActive: PropTypes.string,
};

export default function CourseDetail({ params }) {
    const { id } = params;
    const [activeTab, setActiveTab] = React.useState("content");

    const { data, isLoading } = useGetEducationEpisodeByIdQuery(id); // Placeholder for data fetching logic
    const { data: progressData } = useGetEducationProgressByIdQuery(data?.data?.educationId, {
        skip: !data?.data?.educationId,
    });
    const { data: courseData } = useGetEducationByIdQuery(data?.data?.educationId, {
        skip: !data?.data?.educationId,
    });

    const quizId = data?.data?.quizId;

    const { data: quizData, isLoading: quizLoading } = useGetQuizByIdQuery(quizId, {
        skip: !quizId,
    });

    if (isLoading || quizLoading) {
        return <LoadingOverlay />;
    }

    return (
        <div className="min-h-screen text-white p-4 md:px-10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <BackButton />
            </div>

            {/* Tab */}
            <div className="flex bg-[#2b2b2b] rounded-full overflow-hidden mb-4">
                <button
                    onClick={() => setActiveTab("content")}
                    className={`flex-1 py-2 ${activeTab === "content"
                        ? "bg-[#3a3a3a] font-medium"
                        : "text-gray-400"
                        }`}
                >
                    Materi
                </button>
                <button
                    onClick={() => setActiveTab("quiz")}
                    className={`flex-1 py-2 ${activeTab === "quiz"
                        ? "bg-[#3a3a3a] font-medium"
                        : "text-gray-400"
                        }`}
                >
                    Quiz
                </button>
            </div>

            {/* ================= MATERI ================= */}
            {activeTab === "content" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 overflow-hidden flex flex-col gap-3">
                        <DefaultVideoPlayer
                            src={data?.data?.episodeFileUrl}
                            poster={data?.data?.education?.thumbnailUrl}
                            contentType={'EDUCATION_EPISODE'}
                            contentId={data?.data?.id}
                            title={data?.data?.title}
                            genre={data?.data?.categories?.tittle}
                            logType={'WATCH_CONTENT'}
                            startFrom={data?.data?.WatchProgress?.[0]?.progressSeconds}
                        />

                        <div className="flex justify-between">
                            <div className="flex flex-col gap-0">
                                <h1 className="font-black text-4xl">
                                    {data?.data?.title ?? "Judul Movie Tidak Tersedia"}
                                </h1>
                                <p className=" text-sm/normal">
                                    {data?.data?.description ?? "Deskripsi Movie Tidak Tersedia"}
                                </p>
                            </div>
                        </div>
                        {data?.data?.homeWorkUrl && <div className="flex gap-2">
                            <button
                                onClick={() => {
                                    window.open(data?.data?.homeWorkUrl, "_blank")
                                }}
                                className="flex flex-row gap-2 bg-sky-900 rounded-md border border-gray-300 hover:bg-sky-800 px-4 py-2 h-max">
                                <Icon
                                    icon="solar:download-minimalistic-bold"
                                    width={24}
                                    height={24}
                                />
                                <p>Download Panduan Tugas Harian</p>
                            </button>
                        </div>}
                        <div className="mt-4 bg-[#F0FDF4] border-[#B9F8CF] border text-green-800 rounded-xl p-4 text-sm flex gap-2 items-center">
                            <Icon
                                icon="solar:check-circle-linear"
                                width={24}
                                height={24}
                                className="text-green-500"
                            />
                            <div>
                                <p className="font-semibold text-green-900">
                                    You&apos;re enrolled in this course!
                                </p>
                                <p className="text-[#008236]">
                                    {progressData?.data?.episodeDoneCount} of {progressData?.data?.totalEpisodeCount} episodes completed
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Materi Sidebar */}
                    <div className="bg-white text-black rounded-xl p-4 overflow-y-auto max-h-screen montserratFont">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex gap-2">
                                <Icon
                                    icon="solar:file-text-bold"
                                    color="#156EB7"
                                    width={24}
                                    height={24}
                                />

                                <div className="flex flex-col">
                                    <h2 className="font-semibold text-[#156EB7]">
                                        Modul Pembelajaran
                                    </h2>
                                    <p>Judul Course</p>
                                </div>
                            </div>

                            {data?.data?.moduleUrl && <button
                                onClick={() => {
                                    window.open(data?.data?.moduleUrl, "_blank");
                                }}
                                className="text-[#156EB7]">
                                <Icon
                                    icon="solar:download-minimalistic-bold"
                                    width={42}
                                    height={42}
                                />
                            </button>}
                        </div>

                        <div className="space-y-3 text-sm">
                            {data?.data?.moduleUrl ? (
                                <iframe
                                    src={`https://docs.google.com/gview?url=${encodeURIComponent(data?.data?.moduleUrl)}&embedded=true`}
                                    width="100%"
                                    height="900px"
                                    className="rounded-lg border border-gray-300"
                                    title="Module PDF"
                                />
                            ) : (
                                <p className="text-gray-500">No module available for this episode.</p>
                            )}
                        </div>
                    </div>
                    <div className="col-span-1 lg:col-span-3 gap-2 flex flex-col">
                        <h1 className="text-white zeinFont text-2xl">Episodes</h1>
                        <CurriculumSection
                            episodes={courseData?.data?.EducationEpisode}
                            courseData={courseData?.data}
                            isSubscribe={courseData?.data?.isSubscribe}
                            progress={progressData?.data}
                            episodeIdActive={data?.data?.id}
                        />
                    </div>
                </div>
            )}

            {/* ================= QUIZ ================= */}
            {activeTab === "quiz" && <QuizTab quizData={quizData} />}
        </div>
    );
}

/* ===================================================== */
/* ====================== QUIZ TAB ===================== */
/* ===================================================== */

function QuizTab({ quizData }) {
    const [answers, setAnswers] = React.useState({});
    const [submitted, setSubmitted] = React.useState(false);
    const [score, setScore] = React.useState(0);
    const [quizStarted, setQuizStarted] = React.useState(false);
    const [timeRemaining, setTimeRemaining] = React.useState(0);
    const [unansweredQuestions, setUnansweredQuestions] = React.useState([]);
    const [quizResult, setQuizResult] = React.useState(null);
    const questionRefs = React.useRef({});

    const [postQuizAttempt, { isLoading: isSubmitting }] = usePostQuizAttemptMutation();

    // Check if quiz data is available
    if (!quizData?.data?.questions || quizData.data.questions.length === 0) {
        console.log(quizData);
        return (
            <div className="bg-white text-black rounded-xl p-8 text-center">
                <p className="text-gray-500">Tidak ada quiz untuk episode ini</p>
            </div>
        );
    }

    const quiz = quizData.data;

    // Check if user already passed from previous attempts
    const bestAttempt = React.useMemo(() => {
        if (!quiz?.attempts || quiz.attempts.length === 0) return null;
        return quiz.attempts.reduce((best, attempt) =>
            !best || attempt.score > best.score ? attempt : best,
            null
        );
    }, [quiz?.attempts]);

    const hasPassed = React.useMemo(() => {
        if (!quiz?.attempts) return false;
        return quiz.attempts.some((a) => a.score >= quiz.passingScore);
    }, [quiz?.attempts, quiz.passingScore]);

    // Timer countdown effect
    React.useEffect(() => {
        if (!quizStarted || submitted) return;

        // Initialize timer when quiz starts
        if (timeRemaining === 0) {
            setTimeRemaining(quiz.duration * 60); // Convert minutes to seconds
        }

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit(true); // Auto-submit when time runs out, bypass validation
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [quizStarted, submitted, timeRemaining]);

    // Format time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSingle = (questionId, optionId) => {
        setAnswers({ ...answers, [questionId]: [optionId] });
        // Remove from unanswered list when answered
        setUnansweredQuestions(prev => prev.filter(id => id !== questionId));
    };

    const handleMultiple = (questionId, optionId) => {
        const current = answers[questionId] || [];
        const newAnswers = {
            ...answers,
            [questionId]: current.includes(optionId)
                ? current.filter((v) => v !== optionId)
                : [...current, optionId],
        };
        setAnswers(newAnswers);

        // Remove from unanswered list only if at least one option is selected
        if (newAnswers[questionId].length > 0) {
            setUnansweredQuestions(prev => prev.filter(id => id !== questionId));
        }
    };

    const handleSubmit = async (autoSubmit = false) => {
        // Check if all questions are answered (skip this check if auto-submit from timer)
        if (!autoSubmit) {
            const unanswered = [];
            quiz.questions.forEach((question) => {
                const userAnswers = answers[question.id] || [];
                if (userAnswers.length === 0) {
                    unanswered.push(question.id);
                }
            });

            // If there are unanswered questions, show warnings and scroll to first one
            if (unanswered.length > 0) {
                setUnansweredQuestions(unanswered);

                // Scroll to first unanswered question
                const firstUnansweredId = unanswered[0];
                if (questionRefs.current[firstUnansweredId]) {
                    questionRefs.current[firstUnansweredId].scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
                return;
            }
        }

        // Clear unanswered warnings
        setUnansweredQuestions([]);

        // Prepare submission data - flatten answers array
        const answersArray = [];
        quiz.questions.forEach((question) => {
            const selectedOptions = answers[question.id] || [];
            // For each selected option, create a separate answer entry
            selectedOptions.forEach(optionId => {
                answersArray.push({
                    questionId: question.id,
                    optionId: optionId
                });
            });
        });

        const submissionData = {
            answers: answersArray
        };

        try {
            // Submit to API
            const response = await postQuizAttempt({
                id: quiz.id,
                body: submissionData
            }).unwrap();

            // Update state with API response
            setQuizResult(response.data);
            setScore(response.data.score);
            setSubmitted(true);
        } catch (error) {
            console.error("Failed to submit quiz:", error);

            // Fallback: Calculate score locally if API fails
            let correctCount = 0;
            quiz.questions.forEach((question) => {
                const correctOptions = question.options
                    .filter(opt => opt.isCorrect)
                    .map(opt => opt.id);

                const userAnswers = answers[question.id] || [];

                const isCorrect =
                    correctOptions.length === userAnswers.length &&
                    correctOptions.every(id => userAnswers.includes(id));

                if (isCorrect) correctCount++;
            });

            const percentage = (correctCount / quiz.questions.length) * 100;
            setScore(percentage);
            setSubmitted(true);

            alert("Terjadi kesalahan saat submit quiz. Score dihitung secara lokal.");
        }
    };

    const handleReset = () => {
        setAnswers({});
        setSubmitted(false);
        setScore(0);
        setQuizStarted(false);
        setTimeRemaining(0);
        setUnansweredQuestions([]);
        setQuizResult(null);
    };

    const handleStartQuiz = () => {
        setQuizStarted(true);
        setTimeRemaining(quiz.duration * 60);
    };

    // Get number of correct answers for each question to determine input type
    const getQuestionType = (question) => {
        const correctCount = question.options.filter(opt => opt.isCorrect).length;
        return correctCount > 1 ? "multiple" : "single";
    };

    // Calculate remaining attempts
    const totalAttempts = quiz.attempts?.length || 0;
    const maxAttempts = 5; // You can adjust this or get from API
    const remainingAttempts = maxAttempts - totalAttempts;

    // If user already passed previously, show completion message only
    if (hasPassed) {
        return (
            <div className="bg-white text-black rounded-xl p-6 text-center space-y-4">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
                    <Icon icon="solar:check-circle-bold" className="text-green-600" width={64} />
                </div>
                <h2 className="font-bold text-2xl text-green-700">Quiz sudah diselesaikan</h2>
                <p className="text-gray-600">Kamu sudah melewati passing grade untuk quiz ini.</p>

                {bestAttempt && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-left mx-auto max-w-xl">
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-700">Nilai terbaik</span>
                            <span className="font-semibold text-green-700">{bestAttempt.score}%</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span className="text-gray-700">Passing Grade</span>
                            <span className="font-semibold text-green-700">{quiz.passingScore}%</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-700">Tanggal selesai</span>
                            <span className="font-semibold text-gray-800">
                                {bestAttempt.finishedAt
                                    ? new Date(bestAttempt.finishedAt).toLocaleString('id-ID')
                                    : '-'}
                            </span>
                        </div>
                    </div>
                )}

                <div className="pt-2">
                    <p className="text-sm text-gray-500">Anda tidak perlu mengerjakan ulang.</p>
                </div>

                <button
                    className="w-full bg-[#1e4e9e] text-white rounded-lg p-3 font-medium hover:bg-[#163a78] transition-colors flex items-center justify-center gap-2"
                    onClick={() => {
                        // TODO: navigate to next episode if available
                        console.log("Next episode clicked");
                    }}
                >
                    Next Episode
                    <Icon icon="solar:arrow-right-bold" />
                </button>
            </div>
        );
    }

    // Show start quiz confirmation screen
    if (!quizStarted) {
        return (
            <div className="space-y-4">
                <div className="bg-white text-black rounded-xl p-8">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-4">
                            <Icon icon="solar:document-text-bold" className="text-blue-600" width={40} />
                        </div>
                        <h2 className="font-bold text-2xl mb-2">{quiz.title}</h2>
                        <p className="text-gray-600">{quiz.description}</p>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Icon icon="solar:clock-circle-bold" className="text-blue-600" width={24} />
                                <span className="font-medium">Durasi</span>
                            </div>
                            <span className="font-bold">{quiz.duration} Menit</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Icon icon="solar:document-bold" className="text-green-600" width={24} />
                                <span className="font-medium">Jumlah Soal</span>
                            </div>
                            <span className="font-bold">{quiz.questions.length} Soal</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Icon icon="solar:star-bold" className="text-yellow-600" width={24} />
                                <span className="font-medium">Passing Score</span>
                            </div>
                            <span className="font-bold">{quiz.passingScore}%</span>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Icon icon="solar:refresh-circle-bold" className="text-purple-600" width={24} />
                                <span className="font-medium">Percobaan Tersisa</span>
                            </div>
                            <span className="font-bold">{remainingAttempts} dari {maxAttempts}</span>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <div className="flex gap-3">
                            <Icon icon="solar:danger-triangle-bold" className="text-yellow-600 flex-shrink-0" width={24} />
                            <div className="text-sm">
                                <p className="font-semibold text-yellow-900 mb-1">Perhatian!</p>
                                <ul className="text-yellow-800 space-y-1">
                                    <li>• Timer akan mulai berjalan setelah Anda klik &quot;Mulai Quiz&quot;</li>
                                    <li>• Quiz akan otomatis tersubmit jika waktu habis</li>
                                    <li>• Pastikan koneksi internet Anda stabil</li>
                                    <li>• Anda tidak dapat mengulang quiz jika sudah dimulai</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleStartQuiz}
                        disabled={remainingAttempts <= 0}
                        className={`w-full py-4 rounded-xl font-semibold text-lg transition-colors ${remainingAttempts <= 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-[#1e4e9e] text-white hover:bg-[#163a78]'
                            }`}
                    >
                        {remainingAttempts <= 0 ? 'Tidak Ada Percobaan Tersisa' : 'Mulai Quiz'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Timer Bar - Fixed at top */}
            <div className="bg-white text-black rounded-xl p-4 sticky top-0 z-10 shadow-md">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Icon
                            icon="solar:clock-circle-bold"
                            className={timeRemaining <= 60 ? "text-red-600" : "text-blue-600"}
                            width={24}
                        />
                        <span className="font-semibold">Sisa Waktu</span>
                    </div>
                    <span className={`font-bold text-2xl ${timeRemaining <= 60 ? "text-red-600 animate-pulse" : "text-blue-600"}`}>
                        {formatTime(timeRemaining)}
                    </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ${timeRemaining <= 60 ? 'bg-red-500' : 'bg-blue-500'
                            }`}
                        style={{
                            width: `${(timeRemaining / (quiz.duration * 60)) * 100}%`
                        }}
                    />
                </div>
            </div>

            {/* Quiz Info */}
            <div className="bg-white text-black rounded-xl p-4">
                <h2 className="font-semibold text-lg mb-2">{quiz.title}</h2>
                <p className="text-sm text-gray-600 mb-3">{quiz.description}</p>
                <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                        <Icon icon="solar:clock-circle-bold" className="text-blue-600" />
                        <span>Durasi: {quiz.duration} menit</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Icon icon="solar:star-bold" className="text-yellow-600" />
                        <span>Passing Score: {quiz.passingScore}%</span>
                    </div>
                </div>
            </div>

            {/* Questions */}
            {quiz.questions.map((question, index) => {
                const questionType = getQuestionType(question);
                const isMultiple = questionType === "multiple";
                const isUnanswered = unansweredQuestions.includes(question.id);

                return (
                    <div
                        key={question.id}
                        ref={el => questionRefs.current[question.id] = el}
                        className={`bg-white text-black rounded-xl p-4 transition-all ${isUnanswered ? 'ring-2 ring-red-500 ring-offset-2' : ''
                            }`}
                    >
                        <div className="flex justify-between items-start mb-3">
                            <h3 className={`font-semibold ${isUnanswered ? 'text-red-600' : 'text-blue-600'}`}>
                                Soal {index + 1}
                            </h3>
                            {isMultiple && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                    Pilih lebih dari 1
                                </span>
                            )}
                        </div>

                        <p className="font-medium mb-4">{question.question}</p>

                        <div className="space-y-2">
                            {question.options.map((option) => {
                                const isPassed = score >= quiz.passingScore;
                                const isUserAnswer = (answers[question.id] || []).includes(option.id);

                                return (
                                    <label
                                        key={option.id}
                                        className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg border transition-colors ${submitted
                                            ? isPassed && option.isCorrect
                                                ? "border-green-500 bg-green-50"
                                                : isUserAnswer && !option.isCorrect
                                                    ? "border-red-500 bg-red-50"
                                                    : "border-gray-200"
                                            : isUserAnswer
                                                ? "border-blue-500 bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                            }`}
                                    >
                                        <input
                                            type={isMultiple ? "checkbox" : "radio"}
                                            name={`question-${question.id}`}
                                            checked={isUserAnswer}
                                            onChange={() => {
                                                if (!submitted) {
                                                    isMultiple
                                                        ? handleMultiple(question.id, option.id)
                                                        : handleSingle(question.id, option.id);
                                                }
                                            }}
                                            disabled={submitted}
                                            className="w-4 h-4"
                                        />
                                        <span className="flex-1">
                                            <span className="font-medium mr-2">{option.label}.</span>
                                            {option.text}
                                        </span>
                                        {submitted && isPassed && option.isCorrect && (
                                            <Icon icon="solar:check-circle-bold" className="text-green-600" width={20} />
                                        )}
                                        {submitted && isUserAnswer && !option.isCorrect && (
                                            <Icon icon="solar:close-circle-bold" className="text-red-600" width={20} />
                                        )}
                                    </label>
                                );
                            })}
                        </div>

                        {/* Warning message for unanswered question */}
                        {isUnanswered && !submitted && (
                            <div className="mt-3 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                                <Icon icon="solar:danger-triangle-bold" className="text-red-600 flex-shrink-0 mt-0.5" width={20} />
                                <div className="text-sm text-red-800">
                                    <p className="font-semibold">Soal ini belum dijawab!</p>
                                    <p className="text-xs mt-0.5">Silakan pilih jawaban sebelum submit quiz.</p>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Submit Button */}
            {!submitted && (
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`w-full rounded-xl p-4 font-semibold transition-colors ${isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-[#1e4e9e] text-white hover:bg-[#163a78]'
                        }`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <Icon icon="solar:loading-bold" className="animate-spin" width={20} />
                            Mengirim Quiz...
                        </span>
                    ) : (
                        'Submit Quiz'
                    )}
                </button>
            )}

            {/* RESULT */}
            {submitted && (
                <div className="bg-white text-black rounded-xl p-4">
                    <h2 className="font-semibold text-lg mb-3">Hasil Quiz Anda</h2>

                    {/* Show API result details if available */}
                    {quizResult && (
                        <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <Icon icon="solar:check-circle-bold" className="text-blue-600" width={18} />
                                <span className="font-semibold text-blue-900">Quiz berhasil tersubmit!</span>
                            </div>
                            <div className="space-y-1 text-gray-700">
                                <p>Jawaban Benar: <strong>{quizResult.correctQuestions || 0}</strong> dari <strong>{quizResult.totalQuestions || quiz.questions.length}</strong></p>
                                <p>Waktu Mulai: <strong>{quizResult.startedAt ? new Date(quizResult.startedAt).toLocaleTimeString('id-ID') : '-'}</strong></p>
                                <p>Waktu Selesai: <strong>{quizResult.finishedAt ? new Date(quizResult.finishedAt).toLocaleTimeString('id-ID') : '-'}</strong></p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between text-sm mb-2">
                        <span>Score</span>
                        <span className="font-semibold">{score.toFixed(0)}%</span>
                    </div>

                    <div className="w-full h-3 bg-gray-300 rounded-full mb-4 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-500 ${score >= quiz.passingScore ? 'bg-green-500' : 'bg-red-500'
                                }`}
                            style={{ width: `${score}%` }}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className={`rounded-lg p-3 text-center ${score >= quiz.passingScore
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                            }`}>
                            <div className="text-2xl font-bold">{score.toFixed(0)}%</div>
                            <div className="text-xs">
                                {score >= quiz.passingScore ? 'LULUS' : 'TIDAK LULUS'}
                            </div>
                        </div>
                        <div className="bg-blue-100 text-blue-700 rounded-lg p-3 text-center">
                            <div className="text-2xl font-bold">{remainingAttempts - 1}</div>
                            <div className="text-xs">Percobaan Tersisa</div>
                        </div>
                        <button
                            onClick={handleReset}
                            disabled={remainingAttempts <= 1}
                            className={`rounded-lg font-medium transition-colors ${remainingAttempts <= 1
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-[#1e4e9e] text-white hover:bg-[#163a78]'
                                }`}
                        >
                            Coba Lagi
                        </button>
                    </div>

                    {score >= quiz.passingScore && (
                        <div className="mt-4 pt-4 border-t">
                            <button className="w-full bg-green-600 text-white rounded-lg p-3 font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                                Lanjut ke Episode Berikutnya
                                <Icon icon="solar:arrow-right-bold" />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

QuizTab.propTypes = {
    quizData: PropTypes.object
};

CourseDetail.propTypes = {
    params: PropTypes.shape({
        id: PropTypes.string.isRequired
    }).isRequired
};
