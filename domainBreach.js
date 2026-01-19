const fetch = global.fetch;

const API_KEY = process.env.HIBP_API_KEY || null;

module.exports = async function domainBreachCheck(domain) {
  if (!API_KEY) {
    return {
      status: "UNKNOWN",
      reason: "HIBP_API_KEY_MISSING"
    };
  }

  const res = await fetch(
    `https://haveibeenpwned.com/api/v3/breaches`,
    {
      headers: {
        "hibp-api-key": API_KEY,
        "user-agent": "enterprise-security-cli"
      }
    }
  );

  if (!res.ok) {
    return {
      status: "UNKNOWN",
      reason: `HIBP_API_ERROR_${res.status}`
    };
  }

  const breaches = await res.json();

  const domainBreaches = breaches.filter(b =>
    b.Domain && b.Domain.toLowerCase() === domain.toLowerCase()
  );

  if (domainBreaches.length > 0) {
    return {
      status: "COMPROMISED",
      breaches: domainBreaches
    };
  }

  return {
    status: "SAFE"
  };
};
