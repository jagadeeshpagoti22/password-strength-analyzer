const { exec } = require("child_process");
const readline = require("readline");

const HIBP_URL = "https://haveibeenpwned.com";

function openBrowser(url) {
  const cmd =
    process.platform === "win32" ? `start ${url}` :
    process.platform === "darwin" ? `open ${url}` :
    `xdg-open ${url}`;

  exec(cmd);
}

module.exports = async function manualEmailCheck(email) {
  console.log("Manual Check Required  :", HIBP_URL);
  console.log("Opening browser for manual verification...\n");

  openBrowser(HIBP_URL);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const answer = await new Promise(resolve => {
    rl.question(
      "Was this email found in a breach? (y/n): ",
      ans => resolve(ans.trim().toLowerCase())
    );
  });

  rl.close();

  if (answer === "y" || answer === "yes") {
    return { breached: true };
  }

  if (answer === "n" || answer === "no") {
    return { breached: false };
  }

  return { error: "INVALID_INPUT" };
};
