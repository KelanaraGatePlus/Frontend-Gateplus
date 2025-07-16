import React from 'react';
import PropTypes from 'prop-types';

/*[--- COMPONENT IMPORT ---]*/
import NameSection from './NameSection';
import ViewAndSubSection from './ViewAndSubSection';
import DescriptionSection from './DescriptionSection';
import SocialMediaSection from './SocialMediaSection';
import ButtonSection from './ButtonSection';

export default function PersonalInformationSection({ data, totalSubsribers, isOwnProfile, isSubscribed, isSubsribing, handleToggleSubscribe }) {
    return (
        <div className="flex w-full flex-col gap-3">
            <NameSection profileName={data.profileName} username={data.username} />
            <ViewAndSubSection totalViews={data.totalViews} totalSubsribers={totalSubsribers} />
            <DescriptionSection description={data.description} />
            <SocialMediaSection instagramUrl={data.instagramUrl} tiktokUrl={data.tiktokUrl} twitterUrl={data.twitterUrl} facebookUrl={data.facebookUrl} />
            <ButtonSection isOwnProfile={isOwnProfile} isSubscribed={isSubscribed} isSubscribing={isSubsribing} handleToggleSubscribe={handleToggleSubscribe} />
        </div>
    )
}

PersonalInformationSection.propTypes = {
    data: PropTypes.object.isRequired,
    totalSubsribers: PropTypes.number.isRequired,
    isOwnProfile: PropTypes.bool.isRequired,
    isSubscribed: PropTypes.bool.isRequired,
    isSubsribing: PropTypes.bool.isRequired,
    
    handleToggleSubscribe: PropTypes.func.isRequired
}
