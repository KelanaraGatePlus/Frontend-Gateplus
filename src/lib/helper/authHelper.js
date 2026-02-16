export function storeUserData(data) {
  if (!data) return;

  const { token, id, image, role, creator, dateOfBirth } = data;
  if (token) {
    localStorage.setItem("token", token);

    // set cookie expires in 1 day
    const expires = new Date();
    expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
    document.cookie = `token=${token};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
  }

  if (id) localStorage.setItem("users_id", id);
  localStorage.setItem("image_users", image || "");
  localStorage.setItem("role", role || "");

  if (dateOfBirth) {
    localStorage.setItem("date_of_birth", dateOfBirth);
  }

  if (creator) {
    localStorage.setItem("creators_id", creator.id);
    localStorage.setItem("image_creators", creator.imageUrl || "");
    localStorage.setItem("isCreator", JSON.stringify(true));
  }
}

export function getUserData() {
  return {
    token: localStorage.getItem("token"),
    users_id: localStorage.getItem("users_id"),
    image_users: localStorage.getItem("image_users"),
    role: localStorage.getItem("role"),
    dateOfBirth: localStorage.getItem("date_of_birth"),
    isCreator: JSON.parse(localStorage.getItem("isCreator") || "false"),
    creators_id: localStorage.getItem("creators_id"),
    image_creators: localStorage.getItem("image_creators"),
  };
}

export function clearUserData() {
  const lastSeen = localStorage.getItem("last_seen_content");
  localStorage.clear();
  if (lastSeen) localStorage.setItem("last_seen_content", lastSeen);

  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0].trim();
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
  });
}
