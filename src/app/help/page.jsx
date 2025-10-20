"use client";

import React, { useRef } from "react";
import { Accordion, AccordionItem } from "@heroui/react";
import { ArrowDown, ChevronDown, FileIcon, ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";
import { useGetAllFaqArticlesQuery } from "@/hooks/api/faqArticleAPI";
import capitilizeFirstWord from "@/lib/helper/capitilizeFirstWord";

export default function HelpPage() {
    const firstItemRef = useRef(null);
    const { data: faqArticles } = useGetAllFaqArticlesQuery();

    const handleScrollToItem = () => {
        if (firstItemRef.current) {
            firstItemRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    function defaultContent(href, subtitle, key) {
        return (
            <Link key={key} href={href} className="text-[#F5F5F5] montserratFont flex flex-row font-normal text-sm items-center underline hover:text-[#1DBDF5]">
                <FileIcon className="w-6 h-6 mr-4 mt-1" />
                <p>
                    {subtitle}
                </p>
            </Link>
        );
    }

    return (
        <div className="px-56">
            <div className="h-screen flex flex-col items-center justify-center">
                <h1 className="zeinFont font-black text-4xl text-white">Butuh Bantuan di Gate+?</h1>
                <div className="border bg-[#424242] border-[#1DBDF5] rounded-full px-6 py-3 mt-4 w-max flex justify-between items-center gap-4 shadow-[0_0_18px_4px_var(--Color-Blue-Shade-500,_#156EB7)]">
                    <input
                        type="text"
                        placeholder="Cari pertanyaan, topik, atau masalah…"
                        className="text-[#F5F5F5] zeinFont font-bold text-xl min-w-xl border-none outline-none focus:outline-none focus:ring-0 focus:border-transparent"
                    />
                    <FaSearch className="text-[#F5F5F5] zeinFont font-bold text-lg" />
                </div>
                <div className="flex flex-wrap gap-1 text-[#F5F5F5] montserratFont mt-4 w-full max-w-xl items-center justify-center text-center">
                    <p>Topik Populer:</p>
                    <Link href="#" className="underline hover:text-[#1DBDF5]">Cara Memulai Streaming Film,</Link>
                    <Link href="#" className="underline hover:text-[#1DBDF5]">Masalah Akun,</Link>
                    <Link href="#" className="underline hover:text-[#1DBDF5]">Pembayaran,</Link>
                    <Link href="#" className="underline hover:text-[#1DBDF5]">Pemecahan Masalah,</Link>
                    <Link href="#" className="underline hover:text-[#1DBDF5]">Langganan.</Link>
                </div>
                <button onClick={handleScrollToItem} className="flex flex-col hover:cursor-pointer gap-1 items-center montserratFont font-bold text-white mt-30">
                    <span>Explore Topics</span>
                    <ArrowDown className="text-white" />
                </button>
            </div>

            {/* Item */}
            <div className="flex flex-col gap-16 mt-20">
                {faqArticles && faqArticles.data.map((item) => (
                    <div key={item.id} className="border border-[#F5F5F580] rounded-lg px-2 py-6 flex flex-col gap-2" ref={firstItemRef}>
                        <div className="flex flex-row gap-4 px-4 mx-2 items-center border-white border-b pb-4">
                            <ShoppingCartIcon className="w-8 h-8 text-white" />
                            <h2 className="text-3xl text-white font-black zeinFont">{capitilizeFirstWord(item.name.toLowerCase())}</h2>
                        </div>
                    <Accordion
                        variant="bordered"
                        className="text-white border-white"
                        isCompact
                        selectionMode="multiple"
                    >
                        {item.subcategory.map((subcategory, index) => (
                            subcategory.FaqArticle.length > 0 && (
                                <AccordionItem
                                    key={index + 1}
                                    aria-label={subcategory.name}
                                    title={subcategory.name}
                                    classNames={{
                                        base: index < subcategory.FaqArticle.length - 1 ? "border-b border-white" : "",
                                        trigger: "hover:cursor-pointer",
                                    }}
                                    indicator={({ isOpen }) => (
                                        <ChevronDown
                                            className={`w-8 h-8 transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
                                                }`}
                                        />
                                    )}
                                    className="zeinFont font-black text-xl"
                                >
                                    <div className="flex flex-col gap-1.5 mb-4">
                                        {subcategory.FaqArticle.map((faq) => (
                                            defaultContent(`/help/detail/${faq.id}`, faq.title, faq.id)
                                        ))}
                                    </div>
                                </AccordionItem>
                            )
                        ))}
                    </Accordion>
                </div>
                ))}
            </div>
            {/* End Item */}

            <div className="flex flex-col items-center justify-center gap-4 montserratFont text-white my-20 font-bold">
                <h2>Butuh Bantuan Lain?</h2>
                <Link href="#" className="rounded-lg bg-[#0E5BA8] ring-2 ring-[#1AA7E0] px-6 py-3 hover:bg-[#1AA7E0] transition-colors">
                    Hubungi Admin
                </Link>
            </div>
        </div>
    )
}