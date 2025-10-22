"use client";

import React, { useState } from "react";
import Image from "next/image";
import PropTypes from "prop-types";
import RacunSangga from "@@/poster/poster-content-racunSangga.svg";
import { useMidtransPayment } from "@/hooks/api/midtransAPI";

// Import semua query
import { useGetMovieByIdQuery } from "@/hooks/api/movieSliceAPI";
import { useGetEbookByIdQuery } from "@/hooks/api/ebookSliceAPI";
import { useGetComicByIdQuery } from "@/hooks/api/comicSliceAPI";
import { useGetSeriesByIdQuery } from "@/hooks/api/seriesSliceAPI";
import { useGetPodcastByIdQuery } from "@/hooks/api/podcastSliceAPI";
import { fee } from "@/lib/constants/fee";
import { useGetDiscountByVoucherDiscountCodeMutation } from "@/hooks/api/discountVoucherAPI";

export default function PaymentCheckoutPage({ params }) {
    const resolvedParams = React.use(params);
    const { contentType, id } = resolvedParams;
    const [isShowInput, setIsShowInput] = useState(true);
    const [totalDiscount, setTotalDiscount] = useState(0);
    const [voucherCode, setVoucherCode] = useState("");

    const [selectedTip, setSelectedTip] = useState(null);
    const { pay: subscribePay } = useMidtransPayment('SUBSCRIBE');
    const { pay } = useMidtransPayment();
    const [getDiscount] = useGetDiscountByVoucherDiscountCodeMutation();

    // Simulasi userId kalau diperlukan
    const userId = 1;

    // Semua query dipanggil dengan skip kecuali yang cocok dengan contentType
    const { data: movieData, isLoading: movieLoading } = useGetMovieByIdQuery(id, {
        skip: contentType !== "movie",
    });

    const { data: ebookData, isLoading: ebookLoading } = useGetEbookByIdQuery(
        { id, userId },
        { skip: contentType !== "ebook" }
    );

    const { data: comicData, isLoading: comicLoading } = useGetComicByIdQuery(
        { id, userId },
        { skip: contentType !== "comic" }
    );

    const { data: seriesData, isLoading: seriesLoading } = useGetSeriesByIdQuery(id, {
        skip: contentType !== "series",
    });

    const { data: podcastData, isLoading: podcastLoading } = useGetPodcastByIdQuery(
        { id, userId },
        { skip: contentType !== "podcast" }
    );

    // Gabungkan data & loading berdasarkan contentType yang aktif
    let contentData;
    let isLoading = false;

    switch (contentType) {
        case "movie":
            contentData = movieData?.data?.data;
            isLoading = movieLoading;
            break;
        case "ebook":
            contentData = ebookData?.data?.data;
            isLoading = ebookLoading;
            break;
        case "comic":
            contentData = comicData?.data?.data;
            isLoading = comicLoading;
            break;
        case "series":
            contentData = seriesData?.data?.data;
            isLoading = seriesLoading;
            break;
        case "podcast":
            contentData = podcastData?.data?.data;
            isLoading = podcastLoading;
            break;
        default:
            contentData = null;
    }

    async function handlePayment() {
        try {
            setIsShowInput(false);
            if (contentType == 'movie') {
                await pay({ episodeId: id, contentType: contentType.toUpperCase(), tip: selectedTip, voucherCode });
            } else {
                await subscribePay({ contentId: id, contentType: contentType.toUpperCase(), tip: selectedTip, voucherCode });
            }
        } catch (error) {
            console.error("Pembayaran gagal:", error);
            setIsShowInput(true);
        }
    }

    if (isLoading) {
        return (
            <div className="w-full h-screen flex justify-center items-center text-white">
                Loading...
            </div>
        );
    }

    async function handleApplyVoucher(code, amount) {
        try {
            const response = await getDiscount({ code, amount }).unwrap();
            setTotalDiscount(response.data.data || 0);
        } catch (err) {
            console.error("Failed to get discount:", err);
        }
    }

    const isSubscribe = contentType !== 'movie' ? contentData?.isSubscribe : contentData?.isSubscribed;
    const price = contentType === 'movie' ? contentData?.price : contentData?.subscriptionPrice;

    return (
        <div className="w-full h-screen flex justify-center items-center">
            {isShowInput && <div className="bg-[#0881AB] min-w-6xl max-w-max rounded-md montserratFont text-white">
                <div className="px-8 pt-4 pb-10 flex flex-col gap-8">
                    <h1 className="zeinFont font-black text-3xl text-center">Konfirmasi Pesanan</h1>

                    {/* Produk */}
                    <div className="flex flex-row gap-2">
                        <Image
                            src={RacunSangga}
                            alt="Poster"
                            width={100}
                            height={150}
                        />
                        <div className="flex flex-col gap-4">
                            <div>
                                <h2 className="font-bold text-xl">
                                    {contentData?.title || "Judul Konten"}
                                </h2>
                                <p className="font-normal text-sm">
                                    {contentType === "movie" ? `Durasi: ${contentData?.duration || 0} menit` : "Durasi: 48 Jam"}
                                </p>
                            </div>
                            <p className="text-xl font-bold">
                                Harga: Rp {(Number(price) || 0).toLocaleString("id-ID")}
                            </p>
                        </div>
                    </div>

                    {/* Voucher & Tip Section */}
                    <div className="flex flex-col px-8 gap-8">
                        {price && <div className="flex flex-row bg-[#DEDEDE4D] rounded-lg overflow-hidden">
                            <button onClick={() => handleApplyVoucher(voucherCode, Number(price))} className="px-6 md:px-12 py-3 bg-[#0075e9c4] font-semibold whitespace-nowrap rounded-sm hover:cursor-pointer">
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

                        <div className="flex flex-col gap-2">
                            <div className="bg-[#2222224D] p-4 rounded-md">
                                <p><b>Sawerkuy!</b> kasih tip biar kreator hepi</p>
                            </div>
                            <div className="grid grid-cols-4 gap-2.5">
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
                    {isSubscribe ?
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
        </div>
    );
}

PaymentCheckoutPage.propTypes = {
    params: PropTypes.shape({
        contentType: PropTypes.oneOf(["ebook", "movie", "comic", "podcast", "series"]).isRequired,
        id: PropTypes.string.isRequired,
    }).isRequired,
};
