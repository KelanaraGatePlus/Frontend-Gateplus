"use client";

import React, { useRef } from "react";
import { Tooltip } from "@heroui/react";
import { DownloadIcon, InfoIcon } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useGetCreatorWithdrawalByIdQuery } from "@/hooks/api/withdrawalAPI";
import HeaderUploadForm from "@/components/UploadForm/HeaderUploadForm";
import PropTypes from "prop-types";

export default function WithdrawalDetailPage({ params }) {
    const { id } = params;
    const { data: withdrawalDetailData } = useGetCreatorWithdrawalByIdQuery(id);
    const withdrawalData = withdrawalDetailData?.data || {};

    const slipRef = useRef();

    function formatDate(dateString) {
        if (!dateString) return "-";
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    const handleDownloadPDF = async () => {
        const element = slipRef.current;
        if (!element) return;

        // 1️⃣ Screenshot HTML
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * pageWidth) / canvas.width;
        const pageHeight = pdf.internal.pageSize.getHeight();

        let position = 0;
        let heightLeft = imgHeight;

        while (heightLeft > 0) {
            pdf.addImage(imgData, "PNG", 0, position, pageWidth, imgHeight);
            heightLeft -= pageHeight;
            position -= pageHeight;
            if (heightLeft > 0) pdf.addPage();
        }

        pdf.save(`Slip-Penarikan-${withdrawalData.id || "Transaksi"}.pdf`);
    };

    return (
        <div>
            <HeaderUploadForm title={"Detail Penarikan"}>
                <button
                    onClick={handleDownloadPDF}
                    className="border-[#156EB7] text-[#156EB7] border-4 rounded-xl hover:cursor-pointer hover:text-white px-2 py-1 shadow-md hover:bg-blue-700 transition"
                >
                    <DownloadIcon className="inline mr-2" size={24} />
                    Export PDF
                </button>
            </HeaderUploadForm>
            <div className="flex flex-col gap-9 items-center">
                {/* 🧾 Slip Penarikan */}
                <div ref={slipRef} className="w-full flex flex-col gap-9 items-center">
                    <div className="flex flex-col gap-4 rounded-sm p-16 bg-white min-w-[800px]">
                        <div className="flex flex-row justify-between">
                            <h1 className="zeinFont font-black text-3xl">Slip Penarikan</h1>
                            <p className="montserratFont">No. Transaksi: {withdrawalData.id}</p>
                        </div>
                        <div className="flex flex-row justify-between text-sm montserratFont">
                            <h1 className="font-bold">Penarikan :</h1>
                            <p>Rp{withdrawalData.withdrawalAmount?.toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col gap-2 text-sm montserratFont">
                            <div className="flex flex-row justify-between">
                                <h1 className="font-bold">Biaya Admin Penarikan :</h1>
                                <p>-Rp{withdrawalData.adminFee?.toLocaleString()}</p>
                            </div>
                            <div className="flex flex-row justify-between">
                                <h1 className="font-bold">Potongan Komisi Platform (10%) :</h1>
                                <p>-Rp{withdrawalData.platformFee?.toLocaleString()}</p>
                            </div>
                            <div className="flex flex-row justify-between">
                                <div className="flex flex-row gap-1">
                                    <h1 className="font-bold">Total Potongan Pajak</h1>
                                    <Tooltip
                                        content="Total potongan pajak adalah 5% dari total penarikan setelah dikurangi fee."
                                        placement="top"
                                        className="cursor-pointer bg-black text-white text-xs p-2 rounded"
                                    >
                                        <InfoIcon size={14} />
                                    </Tooltip>
                                </div>
                                <p>-Rp{withdrawalData.taxFee?.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="bg-[#0881AB] w-full font-semibold rounded-md p-2 flex flex-row justify-between text-3xl text-white montserratFont">
                            <h1>Total Diterima :</h1>
                            <p>Rp{withdrawalData.finalAmount?.toLocaleString()}</p>
                        </div>
                    </div>
                    {withdrawalData.status === "SUCCESS" && (
                        <div className="flex flex-col gap-4 rounded-sm p-16 bg-white min-w-[800px]">
                            <div className="flex flex-row justify-between">
                                <h1 className="zeinFont font-black text-3xl">Total Pembayaran</h1>
                                <p>Referensi ID: {withdrawalData.midtransRef || "-"}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="bg-[#0881AB] w-full font-semibold rounded-md p-2 flex flex-row justify-between text-3xl text-white montserratFont">
                                    <h1>Dibayarkan :</h1>
                                    <p>Rp{withdrawalData.finalAmount?.toLocaleString()}</p>
                                </div>
                                <p className="text-[#393939]">
                                    Metode Pembayaran : {withdrawalData.bankAccount?.bank?.name || "-"}
                                </p>
                            </div>
                            <p className="text-[#393939]">
                                Waktu Penyelesaian Pembayaran : {formatDate(withdrawalData.completedAt)}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

WithdrawalDetailPage.propTypes = {
    params: PropTypes.string,
}
