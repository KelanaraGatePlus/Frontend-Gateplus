"use client";
import TransactionTable from "@/components/Table/DataTable";
import InputSelect from "@/components/UploadForm/InputSelect";
import InputText from "@/components/UploadForm/InputText";
import { useGetAllBankAccountByCreatorQuery, usePostBankAccountMutation } from "@/hooks/api/bankAccountAPI";
import { useGetAllBankQuery } from "@/hooks/api/bankSliceAPI";
import { useGetCreatorEarnedQuery } from "@/hooks/api/creatorSliceAPI";
import { useCreateWithdrawalMutation, useGetCreatorWithdrawalQuery } from "@/hooks/api/withdrawalAPI";
import { createWithdrawalSchema } from "@/lib/schemas/createWithdrawalSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Controller, useForm } from "react-hook-form";
import ImageSuccess from "@@/AdditionalImages/image-success.svg";
import ImageFailed from "@@/AdditionalImages/image-failed.svg";
import IconCopy from "@@/icons/icon-copy.svg";
import iconClock from "@@/icons/icons-dashboard/icon-clock.svg";
import IconDocs from "@@/icons/icon-docs.svg";
import iconDanger from "@@/icons/icons-dashboard/icon-danger.svg";
import Image from "next/image";
import Link from "next/link";
import HeaderUploadForm from "@/components/UploadForm/HeaderUploadForm";

export default function WithdrawalPage() {
    const [selectedMethod, setSelectedMethod] = useState("");
    const { data: earnedData } = useGetCreatorEarnedQuery();
    const { data: withdrawalData } = useGetCreatorWithdrawalQuery();
    const { data: bankData } = useGetAllBankQuery();
    const { data: bankAccountData } = useGetAllBankAccountByCreatorQuery();
    const [createWithdrawal, { isLoading }] = useCreateWithdrawalMutation();
    const [addBankAccount, { isLoading: isAddingBank }] = usePostBankAccountMutation();
    const [errorMessage, setErrorMessage] = useState("");
    const [modalType, setModalType] = useState(null);
    const [createWithdrawalData, setCreateWithdrawalData] = useState(null);
    

    const bankOption = bankData?.data.map((item) => ({
        id: item.id,
        title: item.name,
    }));

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm({
        resolver: zodResolver(createWithdrawalSchema),
        mode: "onChange",
        defaultValues: {
            bankAccountId: "",
            withdrawalAmount: 0,
        },
    });

    const {
        register: registerBank,
        handleSubmit: handleSubmitBank,
        control: controlBank,
        reset: resetBank,
        formState: { errors: errorsBank },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            bankId: "",
            accountName: "",
            accountNumber: "",
        },
    });


    const onSubmit = async (values) => {
        try {
            const response = await createWithdrawal(values).unwrap();
            setCreateWithdrawalData(response.data);
            reset();
            setModalType("success");
        } catch (err) {
            const message = err?.data?.message || "Terjadi kesalahan, coba lagi.";
            setErrorMessage(message);
            setModalType("failed");
        }
    };

    const onSubmitBankAccount = async (values) => {
        try {
            await addBankAccount(values).unwrap();
            alert("Bank account berhasil ditambahkan ✅");
            resetBank();
        } catch (err) {
            console.error(err);
            alert("Gagal menambahkan bank account ❌");
        }
    };

    return (
        <div>
            <HeaderUploadForm title={"Penarikan Dana"} />
            <div className="montserratFont flex flex-col gap-8 text-white">
                {/* Penghasilan */}
                <h1 className="zeinFont font-black text-4xl">Penghasilan</h1>
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-2 border border-[#1FC16B] bg-gradient-to-r from-[#1FC16BB2] to-[#0F5B32B2] p-4 rounded-md">
                        <h2 className="text-[16px] font-semibold">Saldo Tersedia</h2>
                        <div className="flex flex-col gap-0">
                            <h3 className="text-[#F5F5F5]">Total</h3>
                            <div className="flex flex-row items-end">
                                <p className="text-[16px] font-bold">Rp</p>
                                <p className="text-3xl font-bold">{earnedData?.data?.data?.currentBalance.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 border border-[#DFB400] bg-gradient-to-r from-[#FFD633B2] to-[#7D6400B2] p-4 rounded-md">
                        <h2 className="text-[16px] font-semibold">Dalam Proses</h2>
                        <div className="flex flex-col gap-0">
                            <h3 className="text-[#F5F5F5]">Minggu ini</h3>
                            <div className="flex flex-row items-end">
                                <p className="text-[16px] font-bold">Rp</p>
                                <p className="text-3xl font-bold">{earnedData?.data?.data?.pendingWithdrawalNoFee.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 border border-[#979797] bg-[#393939] p-4 rounded-md">
                        <h2 className="text-[16px] font-semibold">Total Saldo</h2>
                        <div className="flex flex-col gap-0">
                            <h3 className="text-[#F5F5F5]">Dalam Proses</h3>
                            <div className="flex flex-row items-end">
                                <p className="text-[16px] font-bold">Rp</p>
                                <p className="text-3xl font-bold">{(earnedData?.data?.data?.currentBalance + earnedData?.data?.data?.pendingWithdrawalNoFee)?.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Form Penarikan Saldo */}
                <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8">
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        <h1 className="zeinFont font-black text-4xl">Penarikan Saldo</h1>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Payment Methods */}
                            <div className="space-y-4">
                                <label className="text-white block font-bold text-[16px] mb-2">
                                    Metode Pembayaran
                                </label>
                                {bankAccountData?.data?.map((item) => (
                                    <WithdrawalBank
                                        key={item.id}
                                        id={item.id}
                                        selectedMethod={selectedMethod}
                                        setSelectedMethod={(val) => {
                                            setSelectedMethod(val);
                                            setValue("bankAccountId", val);
                                        }}
                                        bank={item.bank.name}
                                        accountNumber={item.accountNumber}
                                        processTime={item.bank.processTime}
                                        isVerified={item.isVerified}
                                        fee={item.bank.fee}
                                    />
                                ))}
                                {errors.bankAccountId && (
                                    <p className="text-red-400 text-sm">
                                        {errors.bankAccountId.message}
                                    </p>
                                )}
                            </div>
                            {/* Withdrawal Amount */}
                            <div className="mt-6">
                                <div className="flex justify-between items-center">
                                    <label className="text-white block font-bold text-[16px] mb-2">
                                        Jumlah Penarikan
                                    </label>
                                    <p className="text-[#AFAFAF] text-sm">Min: Rp 50.000 Max: Rp 25.000.000</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="py-4 px-8 flex flex-row gap-2 items-center bg-[#393939] rounded-md text-[16px]">
                                        <span>Rp</span>
                                        <input
                                            type="number"
                                            min={50000}
                                            max={25000000}
                                            {...register("withdrawalAmount", {
                                                valueAsNumber: true,
                                            })}
                                            required
                                            className="w-full rounded-md bg-transparent border-none outline-none text-white"
                                            placeholder="Masukkan Jumlah"
                                        />
                                    </div>
                                    {errors.withdrawalAmount && (
                                        <p className="text-red-400 text-sm">
                                            {errors.withdrawalAmount.message}
                                        </p>
                                    )}
                                    <p className="text-[#AFAFAF] text-sm">
                                        Gate+ mengenakan <span className="font-bold">biaya layanan sebesar 10%</span> yang akan dipotong secara otomatis pada saat penarikan dana.
                                    </p>
                                </div>
                            </div>
                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="mt-6 w-full py-4 bg-[#175BA6] text-white rounded-md hover:bg-[#0E4A8B] focus:outline-none"
                            >
                                {isLoading ? "Memproses..." : "Tarik Dana"}
                            </button>
                        </form>
                    </div>
                    {/* Form Mendaftarkan Rekening */}
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        <div>
                            <h1 className="zeinFont font-black text-4xl">Tambah Metode Pembayaran Baru</h1>
                            <p className="text-[#AFAFAF] text-[16px]">
                                Tambahkan rekening bank atau e-wallet baru untuk penarikan dana.
                            </p>
                        </div>
                        <form onSubmit={handleSubmitBank(onSubmitBankAccount)} className="bg-[#393939] p-4 gap-4 flex flex-col rounded-lg">
                            <Controller
                                name="bankId"
                                control={controlBank}
                                rules={{ required: "Nama bank wajib dipilih" }}
                                render={({ field, fieldState }) => (
                                    <InputSelect
                                        label="Nama Bank / E-Wallet"
                                        name="bankId"
                                        options={bankOption || []}
                                        placeholder="Pilih Nama Bank / E-Wallet"
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        error={fieldState.error?.message}
                                    />
                                )}
                            />
                            <InputText
                                label="Nama Lengkap"
                                name="accountName"
                                placeholder="Masukkan Nama Lengkap"
                                {...registerBank("accountName", { required: "Nama lengkap wajib diisi" })}
                                error={errorsBank.accountName?.message}
                            />
                            <InputText
                                label="Nomor Rekening"
                                name="accountNumber"
                                placeholder="Masukkan Nomor Rekening"
                                {...registerBank("accountNumber", { required: "Nomor rekening wajib diisi" })}
                                error={errorsBank.accountNumber?.message}
                            />
                            <button
                                type="submit"
                                disabled={isAddingBank}
                                className="border-[#1482C9] border-2 rounded-lg py-4 font-semibold text-[#1482C9] hover:cursor-pointer"
                            >
                                {isAddingBank ? "Menambahkan..." : "Tambah Metode Baru"}
                            </button>
                        </form>
                    </div>
                </div>
                {/* Riwayat Penarikan */}
                <div className="flex flex-col mt-4">
                    <h1 className="zeinFont font-black text-4xl">Riwayat Penarikan</h1>
                    <p className="text-[#AFAFAF] text-[16px] mb-2">
                        Kelola dan analisis riwayat penarikan dana Anda
                    </p>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="border border-[#1FC16BB2] bg-gradient-to-r from-[#1FC16BB2] to-[#0F5B32B2] p-4 rounded-lg flex flex-col gap-2 items-center justify-center">
                            <h2 className="font-bold text-[16px]">Total Ditarik</h2>
                            <div className="flex flex-row items-end">
                                <p className="text-[16px] font-bold">Rp</p>
                                <p className="text-3xl font-bold">{earnedData?.data?.data?.successWithdrawalNoFee.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="border border-white bg-[#393939] p-4 rounded-lg flex flex-col gap-2 items-center justify-center">
                            <h2 className="font-bold text-[16px]">Total Transaksi</h2>
                            <p className="font-bold text-3xl">{earnedData?.data?.data?.totalWithdrawalRequests.toLocaleString()}</p>
                        </div>
                        <div className="border border-white bg-[#393939] p-4 rounded-lg flex flex-col gap-2 items-center justify-center">
                            <h2 className="font-bold text-[16px]">Biaya Potongan</h2>
                            <div className="flex flex-row items-end">
                                <p className="text-[16px] font-bold">Rp</p>
                                <p className="text-3xl font-bold">{earnedData?.data?.data?.successFee.toLocaleString()}</p>
                            </div>
                        </div>
                        {/* <div className="border border-white bg-[#393939] p-4 rounded-lg flex flex-col gap-2 items-center justify-center">
                            <h2 className="font-bold text-[16px]">Rata Rata Penarikan</h2>
                            <div className="flex flex-row items-end">
                                <p className="text-[16px] font-bold">Rp</p>
                                <p className="text-3xl font-bold">10.000.000</p>
                            </div>
                        </div> */}
                    </div>
                    <div className="mt-4">
                        <TransactionTable data={withdrawalData?.data.map((item) => ({
                            id: item.id,
                            midtransRef: item.midtransRef,
                            createdAt: Date(item.createdAt).toString().slice(0, 15),
                            completedAt: Date(item.completedAt).toString().slice(0, 15),
                            platformFee: item.platformFee + item.adminFee + item.taxFee,
                            method: item.bankAccount.bank.name,
                            status: item.status == 'PENDING' ? 'Diproses' : item.status == 'SUCCESS' ? 'Sudah Dibayar' : 'Gagal',
                            accountNumber: item.bankAccount.accountNumber,
                        }))} />
                    </div>
                </div>
                {modalType === "success" && <ModalSuccess
                    data={createWithdrawalData}
                    onClose={() => {
                        setModalType(null);
                        setCreateWithdrawalData(null);
                    }}
                />}
                {modalType === "failed" && <ModalFailed currentBalance={earnedData?.data?.data?.currentBalance.toLocaleString()} errorMessage={errorMessage} onClose={() => setModalType(null)} />}
            </div>
        </div>
    );
}

function WithdrawalBank({
    id,
    selectedMethod,
    setSelectedMethod,
    bank,
    fee,
    accountNumber,
    processTime,
    isVerified,
}) {
    return (
        <div className="flex items-center">
            <input
                type="radio"
                id={id}
                name="payment-method"
                value={bank}
                checked={selectedMethod === id}
                onChange={() => setSelectedMethod(id)}
                className="peer hidden"
            />
            <label
                htmlFor={id}
                className="flex items-center justify-between w-full p-4 bg-[#393939] rounded-md cursor-pointer border-2 border-transparent peer-checked:text-white"
            >
                <div className="flex items-center gap-2">
                    <span className="flex items-center">
                        <span className="flex items-center justify-center w-5 h-5 border-2 border-white rounded-full mr-3">
                            <span className="inner-dot h-2.5 w-2.5 rounded-full bg-white transition-transform duration-150"></span>
                        </span>
                    </span>
                    <div className="flex flex-col">
                        <span className="font-medium text-2xl">{bank}</span>
                        <span className="text-xs text-[#AFAFAF]">
                            {accountNumber || "1234567890"} • {processTime || "1-3"} Hari
                            Kerja
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div
                        className={`rounded-full ${isVerified ? "bg-[#1FC16B4D]" : "bg-[#156EB780]"
                            } px-6 py-1`}
                    >
                        <span className="text-xs text-white">
                            {isVerified ? "Terverifikasi" : "Menunggu"}
                        </span>
                    </div>
                    <span className="text-[#AFAFAF] text-xs">Fee: {fee}</span>
                </div>
            </label>
        </div>
    );
}

WithdrawalBank.propTypes = {
    id: PropTypes.string.isRequired,
    selectedMethod: PropTypes.string.isRequired,
    setSelectedMethod: PropTypes.func.isRequired,
    bank: PropTypes.string.isRequired,
    fee: PropTypes.string.isRequired,
    accountNumber: PropTypes.string.isRequired,
    processTime: PropTypes.string.isRequired,
    isVerified: PropTypes.bool.isRequired,
};

function ModalSuccess({ data, onClose }) {
    return (
        <div className="fixed z-10 inset-0 flex items-center justify-center">
            <div className="bg-[#393939] rounded-sm w-[715px] flex flex-col gap-2">
                <Image
                    src={ImageSuccess}
                    alt="Success"
                    width={"100%"}
                    height={64}
                    className="w-full"
                />

                <div className="p-4 flex flex-col gap-3">
                    <div>
                        <h3 className="zeinFont font-black text-3xl text-center">Penarikan Berhasil</h3>
                        <p className="text-xs text-[#AFAFAF] text-center">Penarikan berhasil! Transaksi kamu sedang kita proses. Waktu tunggu maksimal 2 x 24jam</p>
                    </div>
                    <div className="flex flex-row justify-between items-center font-bold text-sm">
                        <h4>{data?.newWithdrawal?.createdAt}</h4>
                        <button onClick={
                            () => { navigator.clipboard.writeText(data?.newWithdrawal?.id); alert("Berhasil menyalin ID Penarikan ✅"); }
                        } className="flex flex-row gap-2 items-center">
                            <p>{data?.newWithdrawal?.id}</p>
                            <Image
                                src={IconCopy}
                                alt="Copy"
                                width={16}
                                height={16}
                                className="hover:cursor-pointer"
                            />
                        </button>
                    </div>
                    <div className="flex flex-col gap-2 items-center justify-center">
                        <h4 className="text-sm">Jumlah</h4>
                        <p className="zeinFont font-black text-5xl">Rp {data?.newWithdrawal?.withdrawalAmount.toLocaleString()}</p>
                        <p className="text-sm">{data?.bankAccount?.bank?.name} - {data?.bankAccount?.accountNumber}</p>
                        <p className="text-sm">Biaya Admin : <span className="font-bold">Rp. {(data?.newWithdrawal?.adminFee + data?.newWithdrawal?.taxFee + data?.newWithdrawal?.platformFee).toLocaleString()}</span> • Saldo Diterima: <span className="font-bold">Rp. {data?.newWithdrawal?.finalAmount.toLocaleString()}</span></p>
                        <div className="flex flex-row gap-2 items-center">
                            <div className="flex flex-row gap-2 px-4 py-1 rounded-full bg-[#DFB4004D]">
                                <Image
                                    src={iconClock}
                                    alt="icon clock"
                                    width={16}
                                    height={16}
                                />
                                <span className="text-[#FFDB43] text-sm">Diproses</span>
                            </div>
                            <p className="text-xs text-[#AFAFAF] font-normal"> Estimasi {data?.bankAccount?.bank?.withdrawalDuration} Hari Kerja</p>
                        </div>
                        <div className="flex flex-row gap-2 items-center mt-4">
                            <Link href={`/creator/withdrawal/detail/${data?.newWithdrawal?.id}`} className="flex flex-row gap-2 px-4 py-2.5 rounded-lg border border-[#175BA6] hover:cursor-pointer">
                                <Image
                                    src={IconDocs}
                                    alt="icon clock"
                                    width={16}
                                    height={16}
                                />
                                <span className="text-white text-sm font-semibold">Download Invoice</span>
                            </Link>
                            <button onClick={() => { onClose() }} className="bg-[#1482C9B2] border border-[#175BA6] font-semibold text-white text-sm px-4 py-2.5 rounded-lg hover:cursor-pointer">
                                Selesai
                            </button>
                        </div>
                        <div className="flex flex-row gap-2 items-center mt-4 text-xs">
                            <p className=" text-[#C6C6C6]">Butuh bantuan?</p>
                            <Link href="/help" className="text-[#1DBDF5] underline ">Hubungi Kami</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

ModalSuccess.propTypes = {
    data: PropTypes.shape({
        newWithdrawal: PropTypes.shape({
            createdAt: PropTypes.string,
            id: PropTypes.string,
            withdrawalAmount: PropTypes.number,
            adminFee: PropTypes.number,
            taxFee: PropTypes.number,
            platformFee: PropTypes.number,
            finalAmount: PropTypes.number,
        }),
        bankAccount: PropTypes.shape({
            bank: PropTypes.shape({
                name: PropTypes.string,
                withdrawalDuration: PropTypes.string,
            }),
            accountNumber: PropTypes.string,
        }),
    }),
    onClose: PropTypes.func.isRequired,
};

function ModalFailed({ errorMessage, currentBalance, onClose }) {
    return (
        <div className="fixed z-10 inset-0 flex items-center justify-center">
            <div className="bg-[#393939] rounded-sm w-[715px] flex flex-col gap-2">
                <Image
                    src={ImageFailed}
                    alt="Success"
                    width={"100%"}
                    height={64}
                    className="w-full"
                />

                <div className="p-4 flex flex-col gap-3">
                    <div>
                        <h3 className="zeinFont font-black text-3xl text-center">Penarikan Gagal Diproses</h3>
                        <p className="text-xs text-[#AFAFAF] text-center">Penarikan Gaga! Silahkan coba ulangi proses penarikan atau hubungi bantuan kami</p>
                    </div>
                    <div className="flex flex-col gap-2 items-center justify-center">
                        <p className="zeinFont font-black text-5xl">{errorMessage}</p>
                        <p className="text-sm">BCA - 1234567890</p>
                        <p className="text-sm">Saldo Tersedia : <span className="font-bold">Rp. {currentBalance}</span></p>
                        <div className="flex flex-row gap-2 items-center">
                            <div className="flex flex-row gap-2 px-4 py-1 rounded-full bg-[#D004164D]">
                                <Image
                                    src={iconDanger}
                                    alt="icon clock"
                                    width={16}
                                    height={16}
                                />
                                <span className="text-sm text-[#FB3748]">Gagal</span>
                            </div>
                        </div>
                        <div className="flex flex-row gap-2 items-center mt-4">
                            <button onClick={() => { onClose() }} className="flex hover:cursor-pointer flex-row gap-2 px-4 py-2.5 rounded-lg border border-[#175BA6]">
                                <span className="text-white text-sm font-semibold">Kembali</span>
                            </button>
                            <button onClick={() => { onClose() }} className="bg-[#1482C9B2] border border-[#175BA6] font-semibold text-white text-sm px-4 py-2.5 rounded-lg hover:cursor-pointer">
                                Coba Lagi
                            </button>
                        </div>
                        <div className="flex flex-row gap-2 items-center mt-4 text-xs">
                            <p className=" text-[#C6C6C6]">Butuh bantuan?</p>
                            <Link href="/help" className="text-[#1DBDF5] underline ">Hubungi Kami</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

ModalFailed.propTypes = {
    errorMessage: PropTypes.string.isRequired,
    currentBalance: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

ModalSuccess.propTypes = {
    data: PropTypes.shape({
        newWithdrawal: PropTypes.shape({
            createdAt: PropTypes.string,
            id: PropTypes.string,
            withdrawalAmount: PropTypes.number,
            adminFee: PropTypes.number,
            taxFee: PropTypes.number,
            platformFee: PropTypes.number,
            finalAmount: PropTypes.number,
        }),
        bankAccount: PropTypes.shape({
            bank: PropTypes.shape({
                name: PropTypes.string,
                withdrawalDuration: PropTypes.string,
            }),
            accountNumber: PropTypes.string,
        }),
    }),
    onClose: PropTypes.func.isRequired,
};

