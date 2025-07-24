export function storeUserData(data) {
    const { token, id, image, role, creator } = data;

    if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("theme", "dark");
        localStorage.setItem("users_id", id);
        localStorage.setItem("image_users", image);
        localStorage.setItem("role", role);

        if (creator !== null) {
            localStorage.setItem("image_creators", creator.imageUrl);
            localStorage.setItem("creators_id", creator.id);
            localStorage.setItem("isCreator", JSON.stringify(true));
        }

        document.cookie = `token=${token}; path=/`;
    } else {
        throw new Error("Token not found in response");
    }
}
