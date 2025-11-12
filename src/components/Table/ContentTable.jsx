"use client";
import React from "react";
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    flexRender,
} from "@tanstack/react-table";
import Image from "next/image";
import PropTypes from "prop-types";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import formatDate from "@/lib/helper/formatDateHelper";
import DefaultProgressBar from "../ProgressBar/DefaultProgressBar";

/* --- TABLE COMPONENT --- */
export default function ContentTable({ data }) {
    const dataDummy = React.useMemo(
        () => [
            {
                id: 1,
                title: "Sorgum & Manfaatnya",
                visibility: "Publik",
                restriction: "Tidak Ada",
                releaseDate: "5 Nov 2025",
                comments: 12,
                likePercentage: 89,
                posterImageUrl: "/path/to/image.jpg",
            },
            {
                id: 2,
                title: "Cara Mengolah Sorgum Jadi Tepung",
                visibility: "Pribadi",
                restriction: "Usia 18+",
                releaseDate: "3 Nov 2025",
                comments: 5,
                likePercentage: 72,
                posterImageUrl: "/path/to/image2.jpg",
            },
        ],
        []
    );

    const columns = React.useMemo(
        () => [
            {
                accessorKey: "title",
                header: "Konten",
                cell: ({ row, getValue }) => (
                    <div className="items-start gap-4 w-[280px] grid grid-cols-2 montserratFont">
                        <div className="relative aspect-[9/12] w-full overflow-hidden bg-gray-800">
                            <Image
                                src={row.original.posterImageUrl || "/fallback.jpg"}
                                alt={getValue()}
                                fill
                                sizes="160px"
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col justify-center gap-2">
                            <h2 className="font-semibold text-white text-sm">
                                {getValue()}
                            </h2>
                            <p className="text-xs font-semibold text-[#F5F5F5]">
                                {row.original.description || "Deskripsi tidak tersedia"}
                            </p>
                        </div>
                    </div>
                ),
            },
            {
                accessorKey: "visibility",
                header: "Visibilitas",
                cell: (info) => {
                    const value = info.getValue();
                    const icon =
                        value == "Publik"
                            ? <EyeIcon size={18} />
                            : <EyeOffIcon size={18} />

                    return (
                        <div className="flex items-center gap-2 justify-center bg-[#F5F5F54D] rounded-xl">
                            {icon}
                            <span>{value}</span>
                        </div>
                    );
                },
            },
            {
                accessorKey: "restriction",
                header: "Pembatasan",
                cell: (info) =>
                    <div className="flex flex-row justify-center items-center">
                        <span className="montserratFont">{info.getValue()}</span>
                    </div>,
            },
            {
                accessorKey: "releaseDate",
                header: "Tanggal Rilis",
                cell: (info) =>
                    <div className="flex flex-row justify-center items-center">
                        <span className="font-semibold montserratFont w-full text-center">{formatDate(info.getValue())}</span>
                    </div>,
            },
            {
                accessorKey: "comments",
                header: "Komentar",
                cell: (info) => (
                    <div className="flex items-center w-full text-semibold montserratFont">
                        <span className="text-center w-full">{info.getValue()}</span>
                    </div>
                ),
            },
            {
                accessorKey: "likePercentage",
                header: "Presentase Like",
                cell: (info) => (
                    <div className="flex flex-col items-center w-full text-semibold montserratFont gap-1">
                        <span className="text-center w-full font-semibold">{info.getValue()}%</span>
                        <span className="text-center w-full text-[10px]">{info.row.original.totalLikes} Likes</span>
                        <DefaultProgressBar progress={info.getValue()} backgroundColor="#8EDEFA66" barColor="#8EDEFA" borderColor="#8EDEFA" />
                    </div>
                ),
            },
            {
                id: "action",
                header: "Aksi",
                cell: ({ row }) => (
                    row.original.action
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
                <thead className="bg-[#515151]">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className="px-4 py-4 text-center text-sm font-bold cursor-pointer select-none"
                                    onClick={header.column.getToggleSortingHandler()}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                    {header.column.getIsSorted()
                                        ? header.column.getIsSorted() === "asc"
                                            ? " ▲"
                                            : " ▼"
                                        : " ↕"}
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
                                <td key={cell.id} className="px-4 py-3">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-4 pb-4">
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

ContentTable.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            visibility: PropTypes.string.isRequired,
            restriction: PropTypes.string.isRequired,
            releaseDate: PropTypes.string.isRequired,
            comments: PropTypes.number.isRequired,
            likePercentage: PropTypes.number.isRequired,
            posterImageUrl: PropTypes.string,
            action: PropTypes.node.isRequired,
        })
    ),
};
