"use client";

import React, { useState } from "react";
import Image from "next/image";
import PropTypes from "prop-types";
import RacunSangga from "@@/poster/poster-content-racunSangga.svg";
import { usePayment } from "@/hooks/api/paymentAPI";

// Import semua query
import { fee } from "@/lib/constants/fee";
import { countAdminFee, paymentMethods } from "@/lib/constants/paymentMethod";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import { useGetDiscountByVoucherDiscountCodeMutation } from "@/hooks/api/discountVoucherAPI";
import FlexModal from "@/components/Modal/FlexModal";
import Link from "next/link";
import { contentType as contentTypeConst } from "@/lib/constants/contentType";
import PaymentSuccessImage from "@@/AdditionalImages/payment-success.svg";
import PaymentFailedImage from "@@/AdditionalImages/payment-failed.svg";
import { useSearchParams } from "next/navigation";
import { useGetPublicEpisodeComicsByIdQuery, useGetPublicEpisodeEbookByIdQuery, useGetPublicEpisodePodcastByIdQuery, useGetPublicEpisodeSeriesByIdQuery } from "@/hooks/api/contentSliceAPI";

export default function PurchaseContentPaymentPage({ params }) {
    const resolvedParams = React.use(params);
    const { contentType, id } = resolvedParams;
    const searchParams = useSearchParams();
    const isSuccessParams = searchParams.get("isSuccess");
    const isFailedParams = searchParams.get("isFailed");
    const [isShowInput, setIsShowInput] = useState(true);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [voucherCode, setVoucherCode] = useState("");
    const [successModal, setSuccessModal] = useState(isSuccessParams === "true" ? true : false);
    const [failedModal, setFailedModal] = useState(isFailedParams === "true" ? true : false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

    const [selectedTip, setSelectedTip] = useState(null);
    const { pay } = usePayment();
    const [getDiscount, { isLoading: getDiscountLoading, error: getDiscountError, isSuccess }] = useGetDiscountByVoucherDiscountCodeMutation();

    const { data: ebookData, isLoading: ebookLoading } = useGetPublicEpisodeEbookByIdQuery(
        { id },
        { skip: contentType !== "ebooks" }
    );

    const { data: comicData, isLoading: comicLoading } = useGetPublicEpisodeComicsByIdQuery(
        { id },
        { skip: contentType !== "comics" }
    );

    const { data: seriesData, isLoading: seriesLoading } = useGetPublicEpisodeSeriesByIdQuery({ id, withEpisodes: true }, {
        skip: contentType !== "series",
    });

    const { data: podcastData, isLoading: podcastLoading } = useGetPublicEpisodePodcastByIdQuery(
        { id },
        { skip: contentType !== "podcasts" }
    );

    // Gabungkan data & loading berdasarkan contentType yang aktif
    let contentData;
    let isLoading = false;

    switch (contentType) {
        case "ebooks":
            contentData = ebookData?.data?.data?.ebooks;
            isLoading = ebookLoading;
            break;
        case "comics":
            contentData = comicData?.data?.data?.comics;
            isLoading = comicLoading;
            break;
        case "series":
            contentData = seriesData?.data?.data?.series;
            isLoading = seriesLoading;
            break;
        case "podcasts":
            contentData = podcastData?.data?.data?.podcasts;
            isLoading = podcastLoading;
            break;
        default:
            contentData = null;
    }

    let episodeData = null;
    if (contentType === 'ebooks' && ebookData?.data?.data) { // Asumsi nama array, sesuaikan
        episodeData = ebookData.data.data;
    } else if (contentType === 'comics' && comicData?.data?.data) { // Asumsi nama array, sesuaikan
        episodeData = comicData.data.data;
    } else if (contentType === 'podcasts' && podcastData?.data?.data) { // Asumsi nama array, sesuaikan
        episodeData = podcastData.data.data;
    } else if (contentType === 'series' && seriesData?.data?.data) { // Asumsi nama array, sesuaikan
        episodeData = seriesData.data.data;
    }

    async function handlePayment() {
        try {
            if (!selectedPaymentMethod) {
                alert("❌ Silakan pilih metode pembayaran.");
                return;
            }
            setIsShowInput(false);
            await pay(
                { episodeId: id, contentType: contentTypeConst[contentType]['singleName'].toUpperCase(), tip: selectedTip, voucherCode, paymentMethod: selectedPaymentMethod },
                {
                    onSuccess: (result) => {
                        console.log("✅ Sukses:", result);
                        setSuccessModal(true);
                    },
                    onPending: (result) => console.log("⌛ Pending:", result),
                    onError: (err) => {
                        setFailedModal(true);
                        console.log("❌ Error:", err);
                    },
                    onClose: () => {
                        setFailedModal(true);
                        console.log("🛑 Customer closed the popup without finishing the payment");
                    },
                }
            );
        } catch (error) {
            console.log(error.message);
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
            const response = await getDiscount({ code, amount }).unwrap();
            setTotalDiscount(response.data || 0);
        } catch (err) {
            console.error("Failed to get discount:", err);
        }
    }

    const isPurchased = episodeData?.isPurchased || false;
    const price = episodeData?.price || 0;

    return (
        <div className="w-full h-max flex justify-center items-center mt-10">
            {isShowInput && <div className="bg-[#515151] drop-shadow-md drop-shadow-[#0000004D] w-full md:min-w-3xl xl:min-w-5xl 2xl:min-w-6xl text-xs md:text-[16px] max-w-max rounded-md montserratFont text-white">
                <div className="px-8 pt-4 pb-10 flex flex-col gap-8">
                    <h1 className="zeinFont font-black text-xl md:text-3xl text-center">Konfirmasi Pesanan</h1>

                    {/* Produk */}
                    <div className="flex flex-row gap-2 md:px-8">
                        <Image
                            src={contentData?.coverImageUrl || contentData?.coverPodcastImage || RacunSangga}
                            alt="Poster"
                            width={100}
                            height={150}
                        />
                        <div className="flex flex-col gap-4">
                            <div>
                                <h2 className="font-bold text-[16px] md:text-xl">
                                    {contentData?.title || "Judul Konten"}
                                </h2>
                                <h3>
                                    {episodeData?.title || "Judul Episode"}
                                </h3>
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
                    <div className="flex flex-col gap-2 md:px-8">
                        <div className="bg-[#2222224D] p-4 rounded-md">
                            <p className="font-bold">Pilih Metode Pembayaran</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2.5">
                            {Object.entries(paymentMethods)
                                .filter(([_, method]) => method.isActive)
                                .map(([key, method]) => {
                                    const isSelected = selectedPaymentMethod === key;
                                    return (
                                        <button
                                            key={method.midtrans_code}
                                            onClick={() => setSelectedPaymentMethod(prev => prev === key ? null : key)}
                                            className={`py-4 px-2 drop-shadow-md drop-shadow-[#00000040] rounded-md font-semibold transition hover:cursor-pointer ${
                                                isSelected ? "bg-[#0075e9]" : "bg-[#686868] hover:bg-[#686868]"
                                            }`}
                                        >
                                            {method.display_name}
                                        </button>
                                    );
                                })}
                        </div>
                        {!selectedPaymentMethod && <p className="text-red-500 text-sm font-semibold">❌ Pilih metode pembayaran terlebih dahulu</p>}
                    </div>

                    {/* Voucher & Tip Section */}
                    <div className="flex flex-col px-0 md:px-8 gap-8">
                        <div className="flex flex-col gap-2">
                            {price && <div className="flex md:flex-row flex-col bg-[#DEDEDE4D] rounded-lg overflow-hidden">
                                <button disabled={!voucherCode} onClick={() => handleApplyVoucher(voucherCode, Number(price))} className="px-6 md:px-12 py-3 bg-[#0075e9c4] font-semibold whitespace-nowrap rounded-sm hover:cursor-pointer">
                                    Gunakan Voucher
                                </button>
                                <input
                                    type="text"
                                    className="flex-1 text-center placeholder:text-center px-2 py-3 outline-none"
                                    placeholder="Gunakan / Masukan Kode Voucher"
                                    onChange={
                                        (e) => setVoucherCode(e.target.value)
                                    }
                                />
                            </div>}
                            <div className="flex items-center">
                                {getDiscountLoading && <LoadingOverlay />}
                                {getDiscountError && <p className="text-red-500">{getDiscountError.data.message}</p>}
                                {isSuccess && <p className="text-green-500">Voucher applied successfully!</p>}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="bg-[#2222224D] p-4 rounded-md">
                                <p><b>Sawerkuy!</b> kasih tip biar kreator hepi</p>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                                {[5000, 10000, 15000, 20000].map((amount) => {
                                    const isSelected = selectedTip === amount;
                                    return (
                                        <button
                                            key={amount}
                                            onClick={() => setSelectedTip(prev => prev === amount ? null : amount)}
                                            className={`py-4 rounded-md font-semibold transition hover:cursor-pointer ${isSelected ? "bg-[#1A207480]" : "bg-[#0075E9C4] hover:bg-[#0075e9]"
                                                }`}
                                        >
                                            Rp {amount.toLocaleString("id-ID")}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rincian Pembayaran */}
                <div className="bg-[#222222] p-8 flex flex-col gap-4">
                    <h2 className="font-bold text-2xl">Rincian</h2>
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-row justify-between">
                            <p>Harga konten</p>
                            <p className="font-bold">
                                Rp {(Number(price) || 0).toLocaleString("id-ID")}
                            </p>
                        </div>
                        <div className="flex flex-row justify-between">
                            <p>Sawerin</p>
                            <p className="font-bold">Rp {selectedTip ? Number(selectedTip).toLocaleString("id-ID") : "0"}</p>
                        </div>
                        <div className="flex flex-row justify-between">
                            <p>Voucher</p>
                            <p className="font-bold text-red-600">- Rp {Math.round(totalDiscount).toLocaleString("id-ID")}</p>
                        </div>
                        <div className="flex flex-row justify-between border-white">
                            <p>Biaya Transfer</p>
                            <p className="font-bold">Rp {Math.round((Number(price) - totalDiscount + (Number(selectedTip) || 0)) === 0 ? 0 : countAdminFee(Number(price) - totalDiscount + (Number(selectedTip) || 0), selectedPaymentMethod)).toLocaleString("id-ID")}</p>
                        </div>
                        <div className="flex flex-row justify-between border-b border-white pb-2">
                            <p>Biaya Layanan</p>
                            <p className="font-bold">Rp {Math.round((Number(price) - totalDiscount + (Number(selectedTip) || 0)) === 0 ? 0 : fee.serviceFee).toLocaleString("id-ID")}</p>
                        </div>
                        <div className="flex flex-row justify-between border-white pb-2 text-xl">
                            <p>Total</p>
                            <p className="font-bold">
                                Rp {Math.round((Number(price) - totalDiscount + (Number(selectedTip) || 0)) === 0 ? 0 : (Number(price) - totalDiscount + (Number(selectedTip) || 0) + countAdminFee(Number(price) - totalDiscount + (Number(selectedTip) || 0), selectedPaymentMethod) + fee.serviceFee)).toLocaleString("id-ID")}
                            </p>
                        </div>
                    </div>
                    {isPurchased ?
                        <button
                            onClick={handlePayment}
                            disabled
                            className="rounded-4xl bg-[#0076E9CC] py-4 font-semibold hover:cursor-not-allowed"
                        >
                            Kamu sudah berlangganan
                        </button> : <button
                            onClick={handlePayment}
                            disabled={!selectedPaymentMethod}
                            className={`rounded-4xl py-4 font-semibold ${
                                selectedPaymentMethod
                                    ? "bg-[#0076E9CC] hover:bg-[#005bb5] hover:cursor-pointer"
                                    : "bg-[#686868] hover:cursor-not-allowed opacity-50"
                            }`}
                        >
                            Pay Now
                        </button>
                    }
                </div>
            </div>}

            {/* Is Success */}
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
                    <Link href={`/${contentTypeConst[contentType]['pluralName']}/detail/${contentData?.id}`}
                        className="rounded-4xl bg-[#0076E9CC] py-4 min-w-4xl font-semibold hover:cursor-pointer text-center text-white"
                    >
                        Lanjut Menonton
                    </Link>
                </div>
            </FlexModal>

            {/* Is Failed */}
            <FlexModal isOpen={failedModal} onClose={() => { setFailedModal(false) }}>
                <div className="flex flex-col gap-4 px-4">
                    <Image
                        src={PaymentFailedImage}
                        alt="Payment Failed"
                        width={200}
                        height={500}
                        className="mx-auto"
                    />
                    <h2 className="text-center font-bold text-2xl text-[#C6C6C6]">Pembayaran Gagal Dilakukan</h2>
                    <button onClick={() => {
                        window.location.reload();
                    }}
                        className="rounded-4xl bg-[#0076E9CC] py-4 min-w-4xl font-semibold hover:cursor-pointer text-center text-white"
                    >
                        Ulangi Pesanan
                    </button>
                    <Link href={`/${contentTypeConst[contentType]['pluralName']}/detail/${contentData?.id}`}
                        className="rounded-4xl bg-[#686868] py-4 min-w-4xl font-semibold hover:cursor-pointer text-center text-white"
                    >
                        Kembali
                    </Link>
                </div>
            </FlexModal>
        </div>
    );
}

PurchaseContentPaymentPage.propTypes = {
    params: PropTypes.shape({
        contentType: PropTypes.oneOf(["ebooks", "comics", "podcasts", "series"]).isRequired,
        contentId: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
    }).isRequired,
};
