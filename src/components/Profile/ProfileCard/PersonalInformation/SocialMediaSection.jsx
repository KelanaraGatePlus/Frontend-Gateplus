import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

/*[--- ASSETS IMPORT ---]*/
import logoFacebook from "@@/logo/logoSosmed/icons-facebook.svg";
import logoInstagram from "@@/logo/logoSosmed/icons-instagram.svg";
import logoTikTok from "@@/logo/logoSosmed/icons-tiktok.svg";
import logoTwitter from "@@/logo/logoSosmed/icons-twitter.svg";
import PropTypes from 'prop-types';

export default function SocialMediaSection({ instagramUrl, tiktokUrl, twitterUrl, facebookUrl }) {
    return (
        <div className="flex justify-between rounded-md px-2">
            {/* Instagram */}
            <Link href={instagramUrl || "#"} target="_blank" className={!instagramUrl ? "pointer-events-none" : ""}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b ${instagramUrl ? "from-[#0395BC] to-[#0E5BA8]" : "from-[#6a6c6e] to-[#47494d]"}`}>
                    <Image
                        priority
                        className="aspect-auto"
                        height={26}
                        width={26}
                        alt="instagram"
                        src={logoInstagram}
                    />
                </div>
            </Link>

            {/* TikTok */}
            <Link href={tiktokUrl || "#"} target="_blank" className={!tiktokUrl ? "pointer-events-none" : ""}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b ${tiktokUrl ? "from-[#0395BC] to-[#0E5BA8]" : "from-[#6a6c6e] to-[#47494d]"}`}>
                    <Image
                        priority
                        className="aspect-auto"
                        height={26}
                        width={26}
                        alt="tikTok"
                        src={logoTikTok}
                    />
                </div>
            </Link>

            {/* Twitter */}
            <Link href={twitterUrl || "#"} target="_blank" className={!twitterUrl ? "pointer-events-none" : ""}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b ${twitterUrl ? "from-[#0395BC] to-[#0E5BA8]" : "from-[#6a6c6e] to-[#47494d]"}`}>
                    <Image
                        priority
                        className="aspect-auto"
                        height={20}
                        width={20}
                        alt="twitter"
                        src={logoTwitter}
                    />
                </div>
            </Link>

            {/* Facebook */}
            <Link href={facebookUrl || "#"} target="_blank" className={!facebookUrl ? "pointer-events-none" : ""}>
                <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b ${facebookUrl ? "from-[#0395BC] to-[#0E5BA8]" : "from-[#6a6c6e] to-[#47494d]"}`}>
                    <Image
                        priority
                        className="aspect-auto"
                        height={20}
                        width={20}
                        alt="facebook"
                        src={logoFacebook}
                    />
                </div>
            </Link>
        </div>
    )
}

SocialMediaSection.propTypes = {
    instagramUrl: PropTypes.string.isRequired,
    tiktokUrl: PropTypes.string.isRequired,
    twitterUrl: PropTypes.string.isRequired,
    facebookUrl: PropTypes.string.isRequired,
}
