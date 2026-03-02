import CreatorIsVerified from '@@/AdditionalImages/verifiedCreator2.png';

export default function VerifiedCreator({ isVerified, width = 32, height = 32 }) {
    if (!isVerified) return null;

    return (
        <span className="group relative ml-1 inline-flex items-center align-middle">
            <img src={CreatorIsVerified.src} alt="Verified Creator" className="inline-block" width={width} height={height} />

            <span
                className="pointer-events-none absolute -top-10 left-1/2 z-20 hidden -translate-x-1/2 whitespace-nowrap rounded-md border bg-black/90 px-2 py-1 text-xs font-medium text-white shadow-md group-hover:block"
                style={{ borderColor: '#EEC105' }}
            >
                Verified Creator
            </span>
        </span>
    );
}