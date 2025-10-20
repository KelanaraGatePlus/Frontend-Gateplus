"use client";
import HeaderUploadForm from "@/components/UploadForm/HeaderUploadForm";
import { useGetFaqArticlesByCategoryQuery, useGetFaqArticlesByIdQuery } from "@/hooks/api/faqArticleAPI";
import formatDate from "@/lib/helper/formatDateHelper";
import { FileIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function DetailPage({ params }) {
    const { id } = React.use(params);
    const { data: faqArticles } = useGetFaqArticlesByIdQuery(id);
    const { data: similarArticlesData } = useGetFaqArticlesByCategoryQuery({ category: faqArticles?.data?.subcategory?.category, id: faqArticles?.data?.id });

    const defaultContent = (subtitle, href, key) => (
        <Link href={href} key={key} className="text-[#F5F5F5] montserratFont flex flex-row font-normal text-sm items-center underline hover:text-[#1DBDF5]">
            <FileIcon className="w-6 h-6 mr-4 mt-1" />
            <p>
                {subtitle}
            </p>
        </Link>
    );

    return (
        <div>
            <HeaderUploadForm title={faqArticles?.data?.title} titlePosition="start" subtitle={faqArticles?.data?.subcategory?.category} />
            <div className="flex w-full flex-col px-8 mt-20">
                <div className="flex flex-col md:grid md:grid-cols-7 montserratFont text-[#979797] gap-6">
                    <div className="md:col-span-5 flex flex-col gap-10">
                        <div>
                            <h1 className="zeinFont font-black text-4xl text-white">{faqArticles?.data?.title}</h1>
                            <p>Terakhir diperbarui: {formatDate(faqArticles?.data?.updatedAt)}</p>
                        </div>
                        <div
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: faqArticles?.data?.content }}
                        />
                    </div>
                    <div className="flex md:col-span-2 h-max flex-col p-4 gap-2 items-start shrink-0 rounded-[8px] bg-[#393939] shadow-[inset_0_8px_8px_-6px_#0395BC]">
                        <h2 className="zeinFont font-black text-lg text-white">Artikel Serupa</h2>
                        {similarArticlesData?.data?.map((item, index) => defaultContent(item.title, "/help/detail/" + item.id, index))}
                    </div>

                </div>
            </div>
        </div>

    );
}