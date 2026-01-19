const crypto = require("crypto");

module.exports = async function breachCheck(password) {
  const hash = crypto
    .createHash("sha1")
    .update(password)
    .digest("hex")
    .toUpperCase();

  const prefix = hash.slice(0, 5);
  const suffix = hash.slice(5);

  const res = await fetch(
  `https://api.pwnedpasswords.com/range/${prefix}`,
  { cache: "no-store" }
);

  const text = await res.text();
  return text.includes(suffix);
};
