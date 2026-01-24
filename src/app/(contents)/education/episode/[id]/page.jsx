"use client";
import BackButton from "@/components/BackButton/page";
import DefaultVideoPlayer from "@/components/VideoPlayer/DefaultVideoPlayer";
import { useGetEducationEpisodeByIdQuery } from "@/hooks/api/educationEpisodeSliceAPI";
import { useGetQuizByIdQuery, usePostQuizAttemptMutation } from "@/hooks/api/quizSliceAPI";
import { Icon } from "@iconify/react";
import React from "react";

export default function CourseDetail({ params }) {
    const { id } = params;
    const [activeTab, setActiveTab] = React.useState("content");

    const { data, error, isLoading } = useGetEducationEpisodeByIdQuery(id); // Placeholder for data fetching logic
    const quizId = data?.data?.quizId;

    const { data: quizData } = useGetQuizByIdQuery(quizId, {
        skip: !quizId,
    });


    return (
        <div className="min-h-screen text-white p-4">
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
                            startFrom={0}
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
                            <div className="flex gap-2">
                                <button className="flex flex-row gap-2 bg-sky-900 rounded-md border border-gray-300 hover:bg-sky-800 px-4 py-2 h-max">
                                    <Icon
                                        icon="solar:download-minimalistic-bold"
                                        width={24}
                                        height={24}
                                    />
                                    <p>Download Panduan Tugas Harian</p>
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 bg-[#F0FDF4] border-[#B9F8CF] border text-green-800 rounded-xl p-4 text-sm flex gap-2 items-center">
                            <Icon
                                icon="solar:check-circle-linear"
                                width={24}
                                height={24}
                                className="text-green-500"
                            />
                            <div>
                                <p className="font-semibold text-green-900">
                                    You're enrolled in this course!
                                </p>
                                <p className="text-[#008236]">
                                    0 of 0 episodes completed
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Materi Sidebar */}
                    <div className="bg-white text-black rounded-xl p-4 overflow-y-auto max-h-[460px] montserratFont">
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
                                        [Materi] Pengenalan
                                    </h2>
                                    <p>Judul Course</p>
                                </div>
                            </div>

                            <button className="text-[#156EB7]">
                                <Icon
                                    icon="solar:download-minimalistic-bold"
                                    width={42}
                                    height={42}
                                />
                            </button>
                        </div>

                        <div className="space-y-3 text-sm">
                            <p className="font-semibold">
                                1. Penerimaan dan Kepatuhan
                            </p>

                            <ul className="list-disc ml-4 space-y-1 text-gray-700">
                                <li>Telah membaca dan menyetujui ketentuan</li>
                                <li>Memiliki kapasitas hukum</li>
                                <li>Tunduk pada peraturan platform</li>
                            </ul>

                            <p className="font-semibold">
                                2. Layanan dan Peran Pengguna
                            </p>

                            <ul className="list-disc ml-4 space-y-1 text-gray-700">
                                <li>Penonton (Viewer)</li>
                                <li>Kreator (Creator)</li>
                                <li>Admin</li>
                            </ul>
                        </div>
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
    const [startTime, setStartTime] = React.useState(null);
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
        setStartTime(null);
    };

    const handleStartQuiz = () => {
        setQuizStarted(true);
        setTimeRemaining(quiz.duration * 60);
        setStartTime(new Date().toISOString());
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
                                    <li>• Timer akan mulai berjalan setelah Anda klik "Mulai Quiz"</li>
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
