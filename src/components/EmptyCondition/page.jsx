import React from "react";
import emptyWorkCreator from "@@/icons/empty-work-creator.svg";
import Image from "next/image";
import PropTypes from "prop-types";

import ContentUnavailableMessage from "./ContentUnavailableMessage";

export default function EmptySection({
    headerMessage = "Konten Lagi On Progress!",
    descriptionMessage = "Sedang disiapin nih, cek lagi nanti buat yang seru-seru!",
}) {
    return (
        <div className="col-span-full flex w-full flex-col items-center">
            {/* Image */}
            <div className="relative h-[280px] w-[230px] md:h-[400px] md:w-[330px]">
                <Image
                    src={emptyWorkCreator}
                    alt="belum ada karya"
                    fill
                    priority
                    className="object-cover object-center"
                />
            </div>
            {/* Text */}
            <ContentUnavailableMessage
                headerMessage={headerMessage}
                descriptionMessage={descriptionMessage}
            />
        </div>
    )
}

EmptySection.propTypes = {
    headerMessage: PropTypes.string,
    descriptionMessage: PropTypes.string,
}

