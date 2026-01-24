export default function DefaultAvatar({ src, size = 40 }) {
    return (
        <img
            src={src || '/default-avatar.png'}
            alt="Avatar"
            className="rounded-full object-cover"
            style={{ width: size, height: size }}
        />
    );
}