const fetch = global.fetch;

const HIBP_API_KEY = process.env.HIBP_API_KEY;

module.exports = async function emailBreachCheck(email) {
  if (!HIBP_API_KEY) {
    return { status: "UNKNOWN" };
  }

  const res = await fetch(
    `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=true`,
    {
      headers: {
        "hibp-api-key": HIBP_API_KEY,
        "user-agent": "security-audit-cli"
      }
    }
  );

  if (res.status === 404) {
    return { status: "NOT FOUND" };
  }

  if (!res.ok) {
    return { status: "UNKNOWN" };
  }

  return { status: "COMPROMISED" };
};
