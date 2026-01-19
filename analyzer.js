#!/usr/bin/env node

const fs = require("fs");
const zxcvbn = require("zxcvbn");
const chalk = require("chalk");
const os = require("os");

const breachCheck = require("./breach");
const emailBreachCheck = require("./emailBreach");
const domainBreachCheck = require("./domainBreach");

const HIBP_MANUAL_URL = "https://haveibeenpwned.com";

/* =========================
   COLOR THEME
========================= */
const colors = {
  header: chalk.bold.cyan,
  label: chalk.gray,
  success: chalk.green,
  danger: chalk.red,
  warning: chalk.yellow,
  info: chalk.cyan
};

/* =========================
   HELP MENU
========================= */
const HELP_TEXT = `
Password & Email Security Analyzer
----------------------------------
Usage:
  analyzer.js [options]

Options:
  -p <password>       Check password strength & breach
  -e <email>          Check email breach (HIBP)
  --out <file>        Save report (.txt / .json)
  -h, --help          Show help

Examples:
  analyzer.js -p MyPass@123
  analyzer.js -e test@gmail.com
  analyzer.js -e test@gmail.com -p MyPass@123
  analyzer.js -e test@gmail.com --out report.txt
`;

const args = process.argv.slice(2);
if (args.includes("-h") || args.includes("--help")) {
  console.log(HELP_TEXT);
  process.exit(0);
}

/* =========================
   ARG PARSING
========================= */
let password = null;
let email = null;
let outFile = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === "-p") password = args[i + 1];
  if (args[i] === "-e") email = args[i + 1];
  if (args[i] === "--out") outFile = args[i + 1];
}

if (!password && !email) {
  console.log(HELP_TEXT);
  process.exit(1);
}

/* =========================
   HELPERS
========================= */
const maskEmail = (email) => {
  const [user, domain] = email.split("@");
  if (!domain) return "***";
  if (user.length <= 3) return "***@" + domain;
  return user.slice(0, 2) + "***" + user.slice(-2) + "@" + domain;
};

const writeReport = (content) => {
  if (outFile) fs.writeFileSync(outFile, content);
};

/* =========================
   MAIN
========================= */
(async () => {
  const timestamp = new Date().toISOString();
  const hostname = os.hostname();
  const platform = `${os.platform()} ${os.release()}`;

  let emailStatus = "NOT CHECKED";
  let passwordStatus = "NOT CHECKED";
  let overallRisk = "LOW";

  let outputText = [];
  let jsonOutput = { timestamp, hostname, platform };

  /* ================= EMAIL ================= */
  if (email) {
    const masked = maskEmail(email);
    const domain = email.split("@")[1];

    const emailRes = await emailBreachCheck(email);
    const domainRes = domain ? await domainBreachCheck(domain) : null;

    outputText.push("📧 EMAIL SECURITY REPORT");
    outputText.push(`Email Checked          : ${masked}`);

    /* ---- EMAIL BREACH ---- */
    if (emailRes.status === "UNKNOWN") {
      outputText.push("Email Breach Status    : UNKNOWN");
      outputText.push("Reason                 : HIBP API key missing / error");
      outputText.push(`Manual Check           : ${HIBP_MANUAL_URL}`);
      emailStatus = "UNKNOWN";
    }
    else if (emailRes.status === "COMPROMISED") {
      outputText.push("Email Breach Status    : COMPROMISED");
      emailRes.breaches.forEach(b =>
        outputText.push(` • ${b.Name} (${b.BreachDate})`)
      );
      emailStatus = "COMPROMISED";
      overallRisk = "HIGH";
    }
    else {
      outputText.push("Email Breach Status    : SAFE");
      emailStatus = "SAFE";
    }

    /* ---- DOMAIN BREACH ---- */
    if (domainRes?.breached) {
      outputText.push("");
      outputText.push("⚠ DOMAIN BREACH DETECTED");
      domainRes.breaches.forEach(b =>
        outputText.push(` • ${b.Name} (${b.BreachDate})`)
      );
      overallRisk = "HIGH";
    }

    outputText.push("");
    jsonOutput.email = {
      masked,
      status: emailStatus,
      domainBreached: !!domainRes?.breached
    };
  }

  /* ================= PASSWORD ================= */
  if (password) {
    const zResult = zxcvbn(password);
    const breached = await breachCheck(password);

    passwordStatus = breached ? "COMPROMISED" : "SAFE";
    if (breached) overallRisk = "HIGH";

    outputText.push("🔐 PASSWORD SECURITY REPORT");
    outputText.push(`Password Length        : ${password.length}`);
    outputText.push(`Strength Score         : ${zResult.score} / 4`);
    outputText.push(`Password Status        : ${passwordStatus}`);
    outputText.push("");

    jsonOutput.password = {
      length: password.length,
      score: zResult.score,
      status: passwordStatus
    };
  }

  /* ================= OVERALL SUMMARY ================= */
  outputText.push("OVERALL RISK SUMMARY");
  outputText.push("-------------------");
  outputText.push(`Email Status           : ${emailStatus}`);
  outputText.push(`Password Status        : ${passwordStatus}`);
  outputText.push(`Overall Risk Level     : ${overallRisk}`);
  outputText.push(
    `Recommended Action     : ${
      overallRisk === "HIGH"
        ? "Change password immediately"
        : "No immediate action required"
    }`
  );

  console.log("\n" + colors.header("══════════════════════════════════════════════"));
  outputText.forEach(line => console.log(line));
  console.log(colors.header("══════════════════════════════════════════════"));

  /* ================= SAVE REPORT ================= */
  if (outFile) {
    writeReport(
      outFile.endsWith(".json")
        ? JSON.stringify(jsonOutput, null, 2)
        : outputText.join("\n")
    );
  }

  /* ✅ CLEAN EXIT */
  process.exitCode = overallRisk === "HIGH" ? 2 : 0;
})();
