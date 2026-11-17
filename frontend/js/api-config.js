window.SMARTPLANT_API_BASE = location.hostname === "smartplant.lab"
    ? "/api"
    : "http://localhost:8080/api";
window.smartFetch = (url, options = {}) => fetch(url, { credentials: "include", ...options });
