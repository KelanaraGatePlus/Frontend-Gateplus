export function storeCreatorData(data) {
    const { id, role } = data;

    localStorage.setItem("creators_id", id);
    localStorage.setItem("isCreator", JSON.stringify(true));
    localStorage.setItem("role", role);
}
