"use client";
import { useApplyRedeemVoucherMutation } from "@/hooks/api/redeemVoucherAPI";
import FlexModal from "./FlexModal";
import React, { useState } from "react";
import PropTypes from "prop-types";

export default function RedeemVoucherModal({ isModalRedeemOpen, setIsModalRedeemOpen }) {
    const [redeemCode, setRedeemCode] = useState("");
    const [applyRedeemVoucher, { isLoading, error, isSuccess }] = useApplyRedeemVoucherMutation();

    return (
        <FlexModal isOpen={isModalRedeemOpen} onClose={() => {
            setIsModalRedeemOpen(false);
        }}>
            <div className="flex flex-col w-full items-start text-white text-xs md:text-sm">
                <h1 className="zeinFont font-black text-5xl">
                    Redeem Voucher
                </h1>
                <p className="text-[#1DBDF5]">
                    {isSuccess ? 'Your Redeem Code Has Been Success Fully Claimed' : `Masukan Kode Voucher Kamu & Pastikan Kode Yang Kamu Masukan Sesuai`}
                </p>

                {!isSuccess && <input
                    type="text"
                    value={redeemCode}
                    onChange={(e) => setRedeemCode(e.target.value)}
                    placeholder="Redeem Code"
                    className="mt-4 p-4 rounded-md text-black md:min-w-2xl w-full bg-white text-center montserratFont font-bold"
                />}

                <p className="text-red-700">
                    {error?.data?.message}
                </p>



                <button
                    onClick={() => {
                        if (!isSuccess) {
                            applyRedeemVoucher({ code: redeemCode });
                        } else {
                            setIsModalRedeemOpen(false);
                            window.location.reload();
                        }
                    }}
                    className="mt-4 md:min-w-2xl w-full px-6 md:px-12 py-1 bg-[#0075e9c4] text-2xl zeinFont font-black whitespace-nowrap rounded-sm hover:cursor-pointer"
                >
                    {isLoading ? 'Processing...' : isSuccess ? 'Done' : 'Confirm'}
                </button>
            </div>
        </FlexModal>
    );
}

RedeemVoucherModal.propTypes = {
    isModalRedeemOpen: PropTypes.bool.isRequired,
    setIsModalRedeemOpen: PropTypes.func.isRequired,
};