import React from "react";
import PropTypes from "prop-types";

/*[--- COMPONENT IMPORT ---]*/
import NameSection from "./NameSection";
import ViewAndSubSection from "./ViewAndSubSection";
import DescriptionSection from "./DescriptionSection";
import SocialMediaSection from "./SocialMediaSection";
import ButtonSection from "./ButtonSection";

export default function PersonalInformationSection({
  data,
  totalSubsribers,
  profileFor,
  isOwnProfile,
  isSubscribed,
  isSubsribing,
  handleToggleSubscribe,
  isLinkedWithGoogle = false,
}) {
  return (
    <div className="flex w-full flex-col gap-3">
      <NameSection profileName={data.profileName} username={data.username} isVerified={data.isVerified} />
      {profileFor === "creator" && (
        <ViewAndSubSection
          totalViews={data.totalViews}
          totalSubsribers={totalSubsribers}
        />
      )}
      {/* kode ini yang berubah ya bang, sisanya prettier */}
      <DescriptionSection
        description={data?.bio && data.bio !== "null" ? data.bio : null} //
      />
      {profileFor === "creator" && (
        <SocialMediaSection
          instagramUrl={data.instagramUrl == "null" ? null : data.instagramUrl}
          tiktokUrl={data.tiktokUrl == "null" ? null : data.tiktokUrl}
          twitterUrl={data.twitterUrl == "null" ? null : data.twitterUrl}
          facebookUrl={data.facebookUrl == "null" ? null : data.facebookUrl}
        />
      )}
      <ButtonSection
        profileFor={profileFor}
        isOwnProfile={isOwnProfile}
        isSubscribed={isSubscribed}
        isSubscribing={isSubsribing}
        handleToggleSubscribe={handleToggleSubscribe}
        isLinkedWithGoogle={isLinkedWithGoogle}
      />
    </div>
  );
}

PersonalInformationSection.propTypes = {
  data: PropTypes.object.isRequired,
  totalSubsribers: PropTypes.number.isRequired,
  profileFor: PropTypes.oneOf(["creator", "user"]).isRequired,
  isOwnProfile: PropTypes.bool.isRequired,
  isSubscribed: PropTypes.bool.isRequired,
  isSubsribing: PropTypes.bool.isRequired,
  handleToggleSubscribe: PropTypes.func.isRequired,
  isLinkedWithGoogle: PropTypes.bool,
};
