"use client";
import React from "react";
import PropTypes from 'prop-types';
import BackButton from "@/components/BackButton/page";
import { Icon } from "@iconify/react";
import { useGetEducationByIdQuery } from "@/hooks/api/educationSliceAPI";
import { useGetQuizByIdQuery, usePostQuizAttemptMutation } from "@/hooks/api/quizSliceAPI";
import { useParams } from "next/navigation";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import FlexModal from "@/components/Modal/FlexModal";
import { contentType } from "@/lib/constants/contentType";
import Image from "next/image";

export default function LastAssignmentPage() {
	const { id } = useParams(); // education id
	const { data: educationData } = useGetEducationByIdQuery(id);
	const [activeTab, setActiveTab] = React.useState(null);
	const [isModalOpen, setIsModalOpen] = React.useState(false);

	// Try to pick quizId from education detail (adjust when backend shape is known)
	const quizId = educationData?.data?.quizId;
	const projectType = educationData?.data?.finalProjectType;
	const showQuiz = projectType === "QUIZ" || projectType === "MIXED";
	const showUpload = projectType === "UPLOAD" || projectType === "MIXED";

	const { data: quizData, isLoading: isQuizLoading } = useGetQuizByIdQuery(quizId, {
		skip: !showQuiz || !quizId,
	});

	React.useEffect(() => {
		if (showQuiz && !showUpload) {
			setActiveTab("quiz");
		} else if (showUpload && !showQuiz) {
			setActiveTab("upload");
		} else if (showQuiz && showUpload && !activeTab) {
			setActiveTab("quiz");
		}
	}, [showQuiz, showUpload, activeTab]);

	if (!educationData?.data) {
		return <LoadingOverlay />;
	}

	return (
		<div className="min-h-screen text-white p-4">
			{/* Header */}
			<div className="flex items-center gap-3 mb-6">
				<BackButton />
				<h1 className="font-black text-2xl">Final Assignment</h1>
			</div>

			{/* Tab Navigation */}
			{(showQuiz || showUpload) && (
				<div className="flex gap-2 mb-6 bg-gray-800 rounded-lg p-1 w-fit">
					{showQuiz && (
						<button
							onClick={() => setActiveTab("quiz")}
							className={`px-6 py-2 rounded-md font-semibold transition-colors ${activeTab === "quiz"
								? "bg-[#1e4e9e] text-white"
								: "text-gray-300 hover:text-white"
								}`}
						>
							<div className="flex items-center gap-2">
								<Icon icon="solar:book-2-bold" width={20} />
								Quiz
							</div>
						</button>
					)}
					{showUpload && (
						<button
							onClick={() => setActiveTab("upload")}
							className={`px-6 py-2 rounded-md font-semibold transition-colors ${activeTab === "upload"
								? "bg-[#1e4e9e] text-white"
								: "text-gray-300 hover:text-white"
								}`}
						>
							<div className="flex items-center gap-2">
								<Icon icon="solar:cloud-upload-bold" width={20} />
								Upload
							</div>
						</button>
					)}
				</div>
			)}

			{!showQuiz && !showUpload && (
				<div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg">
					Final project belum dikonfigurasi.
				</div>
			)}

			{/* Tab Content */}
			{activeTab === "quiz" && showQuiz && (
				isQuizLoading ? (
					<LoadingOverlay />
				) : quizData ? (
					<QuizTab quizData={quizData} />
				) : (
					<div className="bg-white text-black rounded-xl p-6">
						<p className="text-gray-700">Quiz belum tersedia.</p>
					</div>
				)
			)}
			{activeTab === "upload" && showUpload && (
				<div className="flex flex-col gap-4 items-center">
					<div className="flex flex-col gap-2 items-center">
						<h1 className="text-center font-bold montserratFont text-xl">Final Project Instructions</h1>
						<button onClick={() => {
							if (localStorage.getItem("isCreator") !== "true") {
								window.location.href = '/register-creators';
							} else {
								setIsModalOpen(true)
							};
						}} className="bg-blue-600 w-max rounded-full outline-2 transition-all outline-blue-400 hover:bg-blue-800 px-6 py-2">Upload Konten</button>
					</div>
					<iframe
						src={`https://docs.google.com/gview?url=${encodeURIComponent(educationData?.data?.finalProjectInstructionUrl)}&embedded=true`}
						width="100%"
						className="rounded-lg border border-gray-300 2xl:h-[900px] h-[600px]"
						title="Module PDF"
					/>
				</div>
			)}

			{isModalOpen && (
				<ModalCreateContent isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} objective={'upload'} educationId={educationData?.data?.id} />
			)}
		</div>
	);
}

function ModalCreateContent({ isModalOpen, setIsModalOpen, objective, educationId }) {
	const redirect = (type, objective) => {
		setIsModalOpen(false);
		const url = objective == 'upload' ? 'upload' : 'upload/episode';
		switch (type) {
			case "movies":
				return `/movies/${url}?education=${educationId || ''}`;
			case "series":
				return `/series/${url}?education=${educationId || ''}`;
			case "podcasts":
				return `/podcasts/${url}?education=${educationId || ''}`;
			case "ebooks":
				return `/ebooks/${url}?education=${educationId || ''}`;
			case "comics":
				return `/comics/${url}?education=${educationId || ''}`;
			case "education":
				return `/education/${url}?education=${educationId || ''}`;
			default:
				return "/";
		}
	};
	return (
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
	)
}

ModalCreateContent.propTypes = {
	isModalOpen: PropTypes.bool.isRequired,
	setIsModalOpen: PropTypes.func.isRequired,
	objective: PropTypes.string.isRequired,
	educationId: PropTypes.string.isRequired,
};

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

	// Normalize quiz object for safe optional access
	const quiz = quizData?.data ?? null;

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

	// Timer countdown effect (guarded when quiz is unavailable)
	React.useEffect(() => {
		if (!quiz || !quizStarted || submitted) return;

		// Initialize timer when quiz starts
		if (timeRemaining === 0) {
			setTimeRemaining((quiz?.duration ?? 0) * 60); // Convert minutes to seconds
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
	}, [quiz, quizStarted, submitted, timeRemaining]);

	// Early fallback UI placement AFTER hooks to keep order stable
	const noQuizQuestions = !(quiz?.questions && quiz.questions.length > 0);
	if (noQuizQuestions) {
		return (
			<div className="bg-white text-black rounded-xl p-8 text-center">
				<p className="text-gray-500">Tidak ada quiz untuk tugas akhir ini</p>
			</div>
		);
	}

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
						<div className={`${score >= quiz.passingScore
							? 'bg-green-100 text-green-700'
							: 'bg-red-100 text-red-700'
							} rounded-lg p-3 text-center`}>
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

/* ===================================================== */
/* ===================== UPLOAD TAB ==================== */
/* ===================================================== */

function UploadTab({ educationId }) {
	const [file, setFile] = React.useState(null);
	const [fileName, setFileName] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [isLoading, setIsLoading] = React.useState(false);
	const [uploadSuccess, setUploadSuccess] = React.useState(false);
	const [error, setError] = React.useState("");
	const fileInputRef = React.useRef(null);

	const handleFileSelect = (event) => {
		const selectedFile = event.target.files?.[0];
		if (selectedFile) {
			// Validate file size (max 50MB)
			if (selectedFile.size > 50 * 1024 * 1024) {
				setError("Ukuran file terlalu besar. Maksimal 50MB.");
				return;
			}
			setFile(selectedFile);
			setFileName(selectedFile.name);
			setError("");
		}
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const droppedFile = e.dataTransfer.files?.[0];
		if (droppedFile) {
			// Validate file size
			if (droppedFile.size > 50 * 1024 * 1024) {
				setError("Ukuran file terlalu besar. Maksimal 50MB.");
				return;
			}
			setFile(droppedFile);
			setFileName(droppedFile.name);
			setError("");
		}
	};

	const handleUpload = async () => {
		if (!file) {
			setError("Pilih file terlebih dahulu");
			return;
		}

		if (!description.trim()) {
			setError("Deskripsi tidak boleh kosong");
			return;
		}

		try {
			setIsLoading(true);
			setError("");

			const formData = new FormData();
			formData.append("file", file);
			formData.append("description", description);
			formData.append("educationId", educationId);

			// TODO: Replace with actual API endpoint
			const response = await fetch("/api/assignment/upload", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Upload gagal");
			}

			setUploadSuccess(true);
			setFile(null);
			setFileName("");
			setDescription("");
			setTimeout(() => setUploadSuccess(false), 5000);
		} catch (err) {
			setError(err.message || "Terjadi kesalahan saat upload");
		} finally {
			setIsLoading(false);
		}
	};

	const handleClear = () => {
		setFile(null);
		setFileName("");
		setDescription("");
		setError("");
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div className="space-y-4">
			{/* Upload Instructions */}
			<div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
				<div className="flex gap-3">
					<Icon
						icon="solar:info-circle-bold"
						className="text-blue-600 flex-shrink-0 mt-0.5"
						width={24}
					/>
					<div className="text-sm text-blue-900">
						<p className="font-semibold mb-2">Panduan Upload</p>
						<ul className="space-y-1 text-xs">
							<li>• Upload file assignment Anda dalam format PDF, DOC, DOCX, atau ZIP</li>
							<li>• Ukuran file maksimal: 50 MB</li>
							<li>• Berikan deskripsi singkat tentang isi assignment</li>
							<li>• Pastikan semua file sudah disertakan sebelum upload</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Success Message */}
			{uploadSuccess && (
				<div className="bg-green-50 border border-green-200 rounded-xl p-4">
					<div className="flex gap-3">
						<Icon
							icon="solar:check-circle-bold"
							className="text-green-600 flex-shrink-0 mt-0.5"
							width={24}
						/>
						<div className="text-sm text-green-900">
							<p className="font-semibold">Upload Berhasil!</p>
							<p className="text-xs mt-1">Assignment Anda telah diterima oleh sistem.</p>
						</div>
					</div>
				</div>
			)}

			{/* Error Message */}
			{error && (
				<div className="bg-red-50 border border-red-200 rounded-xl p-4">
					<div className="flex gap-3">
						<Icon
							icon="solar:close-circle-bold"
							className="text-red-600 flex-shrink-0 mt-0.5"
							width={24}
						/>
						<div className="text-sm text-red-900">
							<p className="font-semibold">Error</p>
							<p className="text-xs mt-1">{error}</p>
						</div>
					</div>
				</div>
			)}

			{/* File Upload Area */}
			<div
				onDragOver={handleDragOver}
				onDrop={handleDrop}
				className="bg-white text-black rounded-xl p-8 border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer"
				onClick={() => fileInputRef.current?.click()}
			>
				<input
					ref={fileInputRef}
					type="file"
					onChange={handleFileSelect}
					accept=".pdf,.doc,.docx,.zip,.txt,.jpg,.jpeg,.png"
					className="hidden"
				/>

				<div className="flex flex-col items-center justify-center space-y-4">
					<div className="bg-blue-100 rounded-full p-4">
						<Icon
							icon="solar:cloud-upload-bold"
							className="text-blue-600"
							width={48}
						/>
					</div>

					<div className="text-center">
						<h3 className="font-semibold text-lg mb-1">
							Drag & drop file Anda di sini
						</h3>
						<p className="text-sm text-gray-500">
							atau klik untuk memilih file dari komputer
						</p>
					</div>

					{file && (
						<div className="bg-gray-50 border border-gray-200 rounded-lg p-3 w-full max-w-md">
							<div className="flex items-center gap-3">
								<Icon
									icon="solar:document-bold"
									className="text-blue-600 flex-shrink-0"
									width={24}
								/>
								<div className="flex-1 min-w-0">
									<p className="font-medium text-sm truncate">{fileName}</p>
									<p className="text-xs text-gray-500">
										{(file.size / 1024 / 1024).toFixed(2)} MB
									</p>
								</div>
								<Icon
									icon="solar:check-circle-bold"
									className="text-green-600 flex-shrink-0"
									width={20}
								/>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Description Section */}
			{file && (
				<div className="bg-white text-black rounded-xl p-4">
					<label className="block mb-2">
						<span className="font-semibold text-sm mb-2 block">Deskripsi Assignment</span>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Jelaskan isi dan ringkasan dari assignment Anda..."
							className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
						/>
					</label>
					<p className="text-xs text-gray-500">
						{description.length}/500 karakter
					</p>
				</div>
			)}

			{/* Action Buttons */}
			{file ? (
				<div className="bg-white text-black rounded-xl p-4 space-y-3">
					<button
						onClick={handleUpload}
						disabled={isLoading}
						className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${isLoading
							? "bg-gray-400 cursor-not-allowed"
							: "bg-[#1e4e9e] text-white hover:bg-[#163a78]"
							}`}
					>
						{isLoading ? (
							<>
								<Icon icon="solar:loading-bold" className="animate-spin" width={20} />
								Uploading...
							</>
						) : (
							<>
								<Icon icon="solar:cloud-upload-bold" width={20} />
								Upload Assignment
							</>
						)}
					</button>

					<button
						onClick={handleClear}
						disabled={isLoading}
						className="w-full py-3 rounded-lg font-semibold border-2 border-gray-300 text-black hover:bg-gray-50 transition-colors"
					>
						Batalkan
					</button>
				</div>
			) : (
				<div className="bg-white text-black rounded-xl p-4">
					<p className="text-center text-sm text-gray-500">
						Pilih file untuk melanjutkan
					</p>
				</div>
			)}
		</div>
	);
}

UploadTab.propTypes = {
	educationId: PropTypes.string
};

