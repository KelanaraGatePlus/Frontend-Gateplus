export default function DefaultProgressBar({ progress = 0, backgroundColor = '#1FC16B' }) {
    return (
        <div className="w-full rounded-full bg-[#515151]">
            <div className="h-4 rounded-full" style={{ width: `${progress}%`, backgroundColor: backgroundColor }}></div>
        </div>
    )
}