import React from "react";
import PropTypes from "prop-types";
import { formatDateTime } from "@/lib/timeFormatter";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { DEFAULT_AVATAR } from "@/lib/defaults";

export const CommentHeader = ({ user, isAuthor, createdAt, isDark }) => (
    <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2 ">
            <figure>
                <Image
                    priority
                    className="h-10 w-10 rounded-full bg-blue-300 object-cover object-center"
                    src={
                        user.imageUrl
                            ? user.imageUrl
                            : DEFAULT_AVATAR
                    }
                    alt="logo-usercomment"
                    width={40}
                    height={40}
                />
            </figure>

            <div>
                <h5 className={`text-xs font-medium ${isDark ? "text-white" : "text-[#1A1A1A]"}`}>
                    {user.profileName
                        ? user.profileName
                        : user.username}{" "}
                    {isAuthor && "(Author)"}
                </h5>
                <p className={`text-[10px] font-normal ${isDark ? "text-white/50" : "text-[#1A1A1A]/50"}`}>
                    {formatDateTime(createdAt)}
                </p>
            </div>
        </div>

        <div className="">
            <Icon
                priority
                className="h-8 w-8"
                icon={'solar:menu-dots-bold-duotone'}
                alt="logo-more-menu-comment"
            />
        </div>
    </div>
);

CommentHeader.propTypes = {
    user: PropTypes.shape({
        profileName: PropTypes.string,
        username: PropTypes.string.isRequired,
        imageUrl: PropTypes.string,
    }).isRequired,
    isAuthor: PropTypes.bool,
    createdAt: PropTypes.string.isRequired,
    isDark: PropTypes.bool,
};