// ===== URL state helpers =====

export function readState() {
    const p = new URLSearchParams(window.location.search);
    return {
        year: p.get("year") || "",
        tags: p.get("tag") ? p.get("tag").split(",") : [],
        page: Math.max(1, parseInt(p.get("page"), 10) || 1),
    };
}

export function writeState(state) {
    const p = new URLSearchParams();
    if (state.year) p.set("year", state.year);
    if (state.tags.length) p.set("tag", state.tags.join(","));
    if (state.page > 1) p.set("page", String(state.page));
    const qs = p.toString();
    const url = window.location.pathname + (qs ? `?${qs}` : "");
    history.pushState(null, "", url);
}
