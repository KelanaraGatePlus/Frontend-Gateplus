import React from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';

/*[--- UTILITY IMPORT ---]*/
import { formatFollowersCount } from "@/lib/followersCount";

/*[--- ASSETS IMPORT ---]*/
import FollowingIcon from "@@/icons/following-icon.svg";
import ViewsIcon from "@@/icons/views-icon.svg";

export default function ViewAndSubSection({ totalViews, totalSubsribers }) {
    return (
        <div className="grid grid-cols-2 text-white">
            <div className="flex h-6 items-center justify-center gap-1">
                <Image
                    src={ViewsIcon}
                    alt="views-icon"
                    width={24}
                    height={24}
                    className="object-cover"
                    priority
                />
                <p>{totalViews}</p>
            </div>

            <div className="flex h-6 items-center justify-center gap-1">
                <Image
                    src={FollowingIcon}
                    alt="views-icon"
                    width={24}
                    height={24}
                    className="object-cover"
                    priority
                />
                <p className="font-light">
                    {formatFollowersCount(parseInt(totalSubsribers))}
                </p>
            </div>
        </div>
    )
}

ViewAndSubSection.propTypes = {
    totalViews: PropTypes.number.isRequired,
    totalSubsribers: PropTypes.number.isRequired,
}
