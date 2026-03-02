"use client";

import React, { useState } from "react";
import Image from "next/image";
import PropTypes from "prop-types";
import RacunSangga from "@@/poster/poster-content-racunSangga.svg";
import { usePayment } from "@/hooks/api/paymentAPI";

// Import semua query
import { useGetMovieByIdQuery } from "@/hooks/api/movieSliceAPI";
import { useGetEbookByIdQuery } from "@/hooks/api/ebookSliceAPI";
import { useGetComicByIdQuery } from "@/hooks/api/comicSliceAPI";
import { useGetSeriesByIdQuery } from "@/hooks/api/seriesSliceAPI";
import { useGetPodcastByIdQuery } from "@/hooks/api/podcastSliceAPI";
import { useGetDiscountByVoucherDiscountCodeMutation } from "@/hooks/api/discountVoucherAPI";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import FlexModal from "@/components/Modal/FlexModal";
import PaymentSuccessImage from "@@/AdditionalImages/payment-success.svg";
import Link from "next/link";
import { contentType as contentTypeConst } from "@/lib/constants/contentType";
import { useGetEducationByIdQuery } from "@/hooks/api/educationSliceAPI";
import PaymentMethodSelector from "@/components/Payment/PaymentMethodSelector";
import VoucherInput from "@/components/Payment/VoucherInput";
import TipSelector from "@/components/Payment/TipSelector";
import PaymentSummary from "@/components/Payment/PaymentSummary";

export default function PaymentCheckoutPage({ params }) {
    const resolvedParams = React.use(params);
    const { contentType, id } = resolvedParams;
    const [isShowInput, setIsShowInput] = useState(true);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [voucherCode, setVoucherCode] = useState("");
    const [successModal, setSuccessModal] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

    const [selectedTip, setSelectedTip] = useState(null);
    const { pay: subscribePay } = usePayment('SUBSCRIBE');
    const { pay } = usePayment();
    const [getDiscount, { isLoading: getDiscountLoading, error: getDiscountError, isSuccess }] = useGetDiscountByVoucherDiscountCodeMutation();

    // Simulasi userId kalau diperlukan
    const userId = 1;

    // Semua query dipanggil dengan skip kecuali yang cocok dengan contentType
    const { data: movieData, isLoading: movieLoading } = useGetMovieByIdQuery(id, {
        skip: contentType !== "movie",
    });

    const { data: ebookData, isLoading: ebookLoading } = useGetEbookByIdQuery(
        { id, userId },
        { skip: contentType !== "ebooks" }
    );

    const { data: comicData, isLoading: comicLoading } = useGetComicByIdQuery(
        { id, userId },
        { skip: contentType !== "comics" }
    );

    const { data: seriesData, isLoading: seriesLoading } = useGetSeriesByIdQuery(id, {
        skip: contentType !== "series",
    });

    const { data: podcastData, isLoading: podcastLoading } = useGetPodcastByIdQuery(
        { id, userId },
        { skip: contentType !== "podcasts" }
    );

    const { data: educationData, isLoading: educationLoading } = useGetEducationByIdQuery(
        id,
        { skip: contentType !== "education" }
    );

    // Gabungkan data & loading berdasarkan contentType yang aktif
    let contentData;
    let isLoading = false;

    switch (contentType) {
        case "movie":
            contentData = movieData?.data?.data;
            isLoading = movieLoading;
            break;
        case "ebooks":
            contentData = ebookData?.data;
            isLoading = ebookLoading;
            break;
        case "comics":
            contentData = comicData?.data;
            isLoading = comicLoading;
            break;
        case "series":
            contentData = seriesData?.data?.data;
            isLoading = seriesLoading;
            break;
        case "podcasts":
            contentData = podcastData?.data;
            isLoading = podcastLoading;
            break;
        case "education":
            contentData = educationData?.data;
            isLoading = educationLoading;
            break;
        default:
            contentData = null;
    }

    async function handlePayment() {
        try {
            if (!selectedPaymentMethod) {
                alert("❌ Silakan pilih metode pembayaran.");
                return;
            }
            setIsShowInput(false);
            if (contentType == 'movie') {
                await pay({ episodeId: id, contentType: contentTypeConst[contentType]['singleName'].toUpperCase(), tip: selectedTip, voucherCode, paymentMethod: selectedPaymentMethod },
                    {
                        onSuccess: (result) => {
                            console.log("✅ Sukses:", result);
                            setSuccessModal(true);
                        },
                        onPending: (result) => console.log("⌛ Pending:", result),
                        onError: () => alert("❌ Pembayaran gagal."),
                        onClose: () => console.log("Popup ditutup."),
                    }
                );
            } else {
                await subscribePay({ contentId: id, contentType: contentTypeConst[contentType]['singleName'].toUpperCase(), tip: selectedTip, voucherCode, paymentMethod: selectedPaymentMethod },
                    {
                        onSuccess: (result) => {
                            console.log("✅ Sukses:", result);
                            setSuccessModal(true);
                        },
                        onPending: (result) => console.log("⌛ Pending:", result),
                        onError: () => alert("❌ Pembayaran gagal."),
                        onClose: () => console.log("Popup ditutup."),
                    });
            }
        } catch (error) {
            console.error("Pembayaran gagal:", error);
            setIsShowInput(true);
        }
    }

    if (isLoading) {
        return (
            <LoadingOverlay />
        );
    }

    async function handleApplyVoucher(code, amount) {
        try {
            const response = await getDiscount({ code, amount, contentType: contentTypeConst[contentType]['singleName'].toUpperCase(), contentId: id, paymentType: "SUBSCRIPTION" }).unwrap();
            setTotalDiscount(response.data || 0);
        } catch (err) {
            console.error("Failed to get discount:", err);
        }
    }

    const isSubscribe = (contentType !== 'movie' && contentType !== 'series') ? contentData?.isSubscribe : contentData?.isSubscribed;
    const price = contentType === 'movie' || contentType === 'education' ? contentData?.price : contentData?.subscriptionPrice;

    return (
        <div className="w-full h-max flex justify-center items-center mt-10 px-2">
            {isShowInput && <div className="bg-[#515151] drop-shadow-md drop-shadow-[#0000004D] min-w-full px md:min-w-3xl xl:min-w-5xl 2xl:min-w-6xl text-xs md:text-[16px] max-w-max rounded-md montserratFont text-white">
                <div className="px-8 pt-4 pb-10 flex flex-col gap-8">
                    <h1 className="zeinFont font-black text-xl md:text-3xl text-center">Konfirmasi Pesanan</h1>

                    {/* Produk */}
                    <div className="flex flex-row gap-2 md:px-8">
                        <Image
                            src={contentData?.coverImageUrl || RacunSangga}
                            alt="Poster"
                            width={100}
                            height={150}
                        />
                        <div className="flex flex-col gap-4">
                            <div>
                                <h2 className="font-bold text-[16px] md:text-xl">
                                    {contentData?.title || "Judul Konten"}
                                </h2>
                                <p className="font-normal text-sm">
                                    {contentType === "movie" ? `Durasi: ${contentData?.duration || 0} menit` : "Durasi: 48 Jam"}
                                </p>
                            </div>
                            <p className="text-[16px] md:text-xl font-bold">
                                Harga: Rp {(Number(price) || 0).toLocaleString("id-ID")}
                            </p>
                        </div>
                    </div>

                    {/* Pemilihan metode pembayaran */}
                    <PaymentMethodSelector
                        selectedPaymentMethod={selectedPaymentMethod}
                        onMethodChange={setSelectedPaymentMethod}
                        showError={!selectedPaymentMethod}
                        basePrice={Number(price) + Number(selectedTip)}
                    />

                    {/* Voucher & Tip Section */}
                    <div className="flex flex-col px-0 md:px-8 gap-8">
                        {price && (
                            <VoucherInput
                                voucherCode={voucherCode}
                                onVoucherChange={setVoucherCode}
                                onApplyVoucher={(code) =>
                                    handleApplyVoucher(code, Number(price))
                                }
                                isLoading={getDiscountLoading}
                                error={getDiscountError}
                                isSuccess={isSuccess}
                            />
                        )}

                        <TipSelector
                            selectedTip={selectedTip}
                            onTipChange={setSelectedTip}
                        />
                    </div>
                </div>

                {/* Rincian Pembayaran */}
                <PaymentSummary
                    price={price}
                    selectedTip={selectedTip}
                    totalDiscount={totalDiscount}
                    selectedPaymentMethod={selectedPaymentMethod}
                />

                {/* Payment Buttons */}
                <div className="bg-[#222222] p-8 flex flex-col gap-4">
                    {isSubscribe ? (
                        <button
                            onClick={handlePayment}
                            disabled
                            className="rounded-4xl bg-[#0076E9CC] py-4 font-semibold hover:cursor-not-allowed"
                        >
                            Kamu sudah berlangganan
                        </button>
                    ) : (
                        <button
                            onClick={handlePayment}
                            disabled={!selectedPaymentMethod}
                            className={`rounded-4xl py-4 font-semibold ${selectedPaymentMethod
                                ? "bg-[#0076E9CC] hover:bg-[#005bb5] hover:cursor-pointer"
                                : "bg-[#686868] hover:cursor-not-allowed opacity-50"
                                }`}
                        >
                            Pay Now
                        </button>
                    )}
                </div>
            </div>}
            <FlexModal isOpen={successModal} onClose={() => { setSuccessModal(false) }}>
                <div className="flex flex-col gap-6 px-4">
                    <Image
                        src={PaymentSuccessImage}
                        alt="Payment Success"
                        width={700}
                        height={500}
                        className="mx-auto"
                    />
                    <h2 className="text-center font-bold text-2xl text-[#C6C6C6]">Pembayaran Berhasil!</h2>
                    <Link href={`/${contentTypeConst[contentType]['pluralName']}/detail/${id}`}
                        onClick={() => { setSuccessModal(false) }}
                        className="rounded-4xl bg-[#0076E9CC] py-4 min-w-4xl font-semibold hover:cursor-pointer text-center text-white"
                    >
                        Lanjut Menonton
                    </Link>
                </div>
            </FlexModal>
        </div>
    );
}

PaymentCheckoutPage.propTypes = {
    params: PropTypes.shape({
        contentType: PropTypes.oneOf(["ebook", "movie", "comic", "podcast", "series"]).isRequired,
        id: PropTypes.string.isRequired,
    }).isRequired,
};
