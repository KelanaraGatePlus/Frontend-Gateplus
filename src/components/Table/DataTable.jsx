"use client";
import React from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";
import iconDanger from "@@/icons/icons-dashboard/icon-danger.svg";
import iconCheckedCircle from "@@/icons/icons-dashboard/icons-checked-circle.svg";
import iconClock from "@@/icons/icons-dashboard/icon-clock.svg";
import Image from "next/image";
import PropTypes from "prop-types";

export default function TransactionTable({ data }) {
    const dataDummy = React.useMemo(
        () => [
            {
                id: "WD2024003",
                midtransRef: "REF121212",
                createdAt: "12-03-2025, 14:38",
                completedAt: "Senin, 22 Sep 2025, 14:00",
                platformFee: 5000000,
                method: "Bank Central Asia (BCA)",
                status: "Diproses",
                accountNumber: "1234567890",
            },
        ],
        []
    );

    const columns = React.useMemo(
        () => [
            {
                accessorKey: "id",
                header: "ID Transaksi",
                cell: (info) => (
                    <div>
                        <div className="font-semibold">{info.row.original.id}</div>
                        <div className="text-xs text-[#979797]">{info.row.original.midtransRef}</div>
                    </div>
                ),
            },
            {
                accessorKey: "createdAt",
                header: "Tanggal",
                cell: (info) => (
                    <div>
                        <div>{info.row.original.createdAt}</div>
                        <div className="text-xs text-[#979797]">
                            Selesai : {info.row.original.completedAt}
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: "platformFee",
                header: "Total Komisi yang Dibayarkan (Rp)",
                cell: (info) => (
                    <div>
                        Rp {info.getValue().toLocaleString("id-ID")}
                    </div>
                ),
            },
            {
                accessorKey: "method",
                header: "Metode Pembayaran",
                cell: (info) => (
                    <div className="flex flex-col">
                        <div className="whitespace-pre-line">{info.getValue()}</div>
                        <div className="text-[#979797] text-xs">No. Rek. {info.row.original.accountNumber}</div>
                    </div>
                ),
            },
            {
                accessorKey: "status",
                header: "Status Pembayaran",
                cell: (info) => {
                    const status = info.getValue();
                    const color =
                        status === "Diproses"
                            ? "bg-[#DFB4004D] text-[#FFDB43]"
                            : status === "Sudah Dibayar"
                                ? "bg-[#1FC16B4D] text-[#84EBB4]"
                                : "bg-[#D004164D] text-[#FB3748]";
                    return (
                        <span
                            className={`px-4 py-1 rounded-full flex gap-1.5 items-center justify-center w-fit ${color}`}
                        >
                            {status === "Diproses" ? (
                                <Image
                                    src={iconClock}
                                    alt="icon clock"
                                    width={22}
                                    height={22}
                                />
                            ) : status === "Sudah Dibayar" ? (
                                <Image
                                    src={iconCheckedCircle}
                                    alt="icon checked circle"
                                    width={22}
                                    height={22}
                                />
                            ) : (
                                <Image
                                    src={iconDanger}
                                    alt="icon danger"
                                    width={22}
                                    height={22}
                                />
                            )}
                            {status}
                        </span>
                    );
                },
            },
            {
                id: "aksi",
                header: "Aksi",
                cell: () => (
                    <button className="text-blue-400 hover:underline">
                        Lihat Rincian
                    </button>
                ),
            },
        ],
        []
    );

    const [sorting, setSorting] = React.useState([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 5,
    });

    const table = useReactTable({
        data: data ?? dataDummy,
        columns,
        state: { sorting, pagination },
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="bg-[#222222] text-white rounded-lg border border-white overflow-hidden">
            <table className="w-full">
                <thead className="bg-[#515151] py-4">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-4 py-6 text-left text-sm font-bold cursor-pointer select-none"
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                    {{
                                        asc: " ▲",
                                        desc: " ▼",
                                    }[header.column.getIsSorted()] ?? " ↕"}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map((row, i) => (
                        <tr
                            key={row.id}
                            className={i % 2 === 0 ? "bg-[#393939]" : "bg-transparent"}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="px-4 py-2">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-4">
                <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    className="px-2 py-1 bg-gray-800 rounded disabled:opacity-50"
                >
                    ⬅
                </button>
                {Array.from({ length: table.getPageCount() }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => table.setPageIndex(i)}
                        className={`px-3 py-1 rounded ${table.getState().pagination.pageIndex === i
                            ? "bg-blue-600"
                            : "bg-gray-800"
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    className="px-2 py-1 bg-gray-800 rounded disabled:opacity-50"
                >
                    ➡
                </button>
            </div>
        </div>
    );
}

TransactionTable.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            amount: PropTypes.number.isRequired,
            date: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
        })
    ).isRequired,
};
