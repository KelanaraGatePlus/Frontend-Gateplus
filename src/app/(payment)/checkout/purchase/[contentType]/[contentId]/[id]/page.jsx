"use client";

import React, { useState } from "react";
import Image from "next/image";
import PropTypes from "prop-types";
import RacunSangga from "@@/poster/poster-content-racunSangga.svg";
import { useMidtransPayment } from "@/hooks/api/midtransAPI";

// Import semua query
import { useGetEbookByIdQuery } from "@/hooks/api/ebookSliceAPI";
import { useGetComicByIdQuery } from "@/hooks/api/comicSliceAPI";
import { useGetSeriesByIdQuery } from "@/hooks/api/seriesSliceAPI";
import { useGetPodcastByIdQuery } from "@/hooks/api/podcastSliceAPI";
import { fee } from "@/lib/constants/fee";
import LoadingOverlay from "@/components/LoadingOverlay/page";
import { useGetDiscountByVoucherDiscountCodeMutation } from "@/hooks/api/discountVoucherAPI";
import FlexModal from "@/components/Modal/FlexModal";
import Link from "next/link";
import { contentType as contentTypeConst } from "@/lib/constants/contentType";
import PaymentSuccessImage from "@@/AdditionalImages/payment-success.svg";
import PaymentFailedImage from "@@/AdditionalImages/payment-failed.svg";

export default function PurchaseContentPaymentPage({ params }) {
    const resolvedParams = React.use(params);
    const { contentType, contentId, id } = resolvedParams;
    const [isShowInput, setIsShowInput] = useState(true);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [voucherCode, setVoucherCode] = useState("");
    const [successModal, setSuccessModal] = useState(false);
    const [failedModal, setFailedModal] = useState(false);

    const [selectedTip, setSelectedTip] = useState(null);
    const { pay } = useMidtransPayment();
    const [getDiscount, { isLoading: getDiscountLoading, error: getDiscountError, isSuccess }] = useGetDiscountByVoucherDiscountCodeMutation();

    // Simulasi userId kalau diperlukan
    const userId = 1;

    const { data: ebookData, isLoading: ebookLoading } = useGetEbookByIdQuery(
        { id: contentId, withEpisodes: true },
        { skip: contentType !== "ebooks" }
    );

    const { data: comicData, isLoading: comicLoading } = useGetComicByIdQuery(
        { id: contentId, userId, withEpisodes: true },
        { skip: contentType !== "comics" }
    );

    const { data: seriesData, isLoading: seriesLoading } = useGetSeriesByIdQuery({ id: contentId, withEpisodes: true }, {
        skip: contentType !== "series",
    });

    const { data: podcastData, isLoading: podcastLoading } = useGetPodcastByIdQuery(
        { id: contentId, userId, withEpisodes: true },
        { skip: contentType !== "podcasts" }
    );

    // Gabungkan data & loading berdasarkan contentType yang aktif
    let contentData;
    let isLoading = false;

    switch (contentType) {
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
            console.log("Series Data:", contentData);
            isLoading = seriesLoading;
            break;
        case "podcasts":
            contentData = podcastData?.data;
            isLoading = podcastLoading;
            break;
        default:
            contentData = null;
    }

    let episodeList = [];
    if (contentType === 'ebooks' && contentData?.episode_ebooks?.episodes) { // Asumsi nama array, sesuaikan
        episodeList = contentData.episode_ebooks.episodes;
    } else if (contentType === 'comics' && contentData?.episode_comics?.episodes) { // Asumsi nama array, sesuaikan
        episodeList = contentData.episode_comics.episodes;
    } else if (contentType === 'podcasts' && contentData?.episode_podcasts?.episodes) { // Asumsi nama array, sesuaikan
        episodeList = contentData.episode_podcasts.episodes;
    } else if (contentType === 'series' && contentData?.episodes?.episodes) { // Asumsi nama array, sesuaikan
        episodeList = contentData.episodes.episodes;
    }

    const episodeData = episodeList.find(episode => episode.id === id);

    async function handlePayment() {
        try {
            setIsShowInput(false);
            await pay(
                { episodeId: id, contentType: contentTypeConst[contentType]['singleName'].toUpperCase(), tip: selectedTip, voucherCode },
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
            {isShowInput && <div className="bg-[#0881AB] w-full md:min-w-3xl xl:min-w-5xl 2xl:min-w-6xl text-xs md:text-[16px] max-w-max rounded-md montserratFont text-white">
                <div className="px-8 pt-4 pb-10 flex flex-col gap-8">
                    <h1 className="zeinFont font-black text-xl md:text-3xl text-center">Konfirmasi Pesanan</h1>

                    {/* Produk */}
                    <div className="flex flex-row gap-2">
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
                <div className="bg-[#1A207480] p-8 flex flex-col gap-4">
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
                        <div className="flex flex-row justify-between">
                            <p>Biaya Admin</p>
                            <p className="font-bold">Rp {Math.round(((Number(price) - totalDiscount + (Number(selectedTip) || 0)) * fee.serviceFee)).toLocaleString("id-ID")}</p>
                        </div>
                        <div className="flex flex-row justify-between border-b border-white pb-2">
                            <p>Pajak</p>
                            <p className="font-bold">Rp {Math.round(((Number(price) - totalDiscount + (Number(selectedTip) || 0)) * fee.taxFee)).toLocaleString("id-ID")}</p>
                        </div>
                        <div className="flex flex-row justify-between border-white pb-2 text-xl">
                            <p>Total</p>
                            <p className="font-bold">
                                Rp {Math.round((Number(price) - totalDiscount + (Number(selectedTip) || 0) + ((Number(price) - totalDiscount + (Number(selectedTip) || 0)) * (fee.taxFee + fee.serviceFee)))).toLocaleString("id-ID")}
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
                            className="rounded-4xl bg-[#0076E9CC] py-4 font-semibold hover:cursor-pointer"
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
                    <Link href={`/${contentTypeConst[contentType]['pluralName']}/detail/${contentId}`}
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
                    <Link href={`/${contentTypeConst[contentType]['pluralName']}/detail/${contentId}`}
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
        contentType: PropTypes.oneOf(["ebook", "comic", "podcast", "series"]).isRequired,
        contentId: PropTypes.string.isRequired,
        id: PropTypes.string.isRequired,
    }).isRequired,
};
