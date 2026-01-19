# 🔐 Password & Email Security Analyzer

An **enterprise-grade CLI security tool** to analyze password strength and check
email / domain exposure in public data breaches using **Have I Been Pwned (HIBP)**.


## 🚀 Features

- ✅ Password strength analysis (zxcvbn)
- ✅ Password breach check (HIBP – k-Anonymity)
- ✅ Email breach detection (HIBP API)
- ✅ Domain breach detection (`@gmail.com`, `@company.com`)
- ✅ Bulk scanning (txt / csv)
- ✅ Masked email output (privacy safe)
- ✅ Combined **Overall Risk Summary**
- ✅ JSON & text report export
- ✅ Clean exit codes (CI/CD friendly)
- ✅ Windows & Linux (Kali) compatible


## 📦 Installation

### WINDOWS SETUP
🔹 STEP 1:Install Node.js

Open 👉 https://nodejs.org

Download LTS version (18 or above)
Install → Next → Next → Finish

Verify: node -v

npm -v


🔹 STEP 2: Install Git

Open 👉 https://git-scm.com

Install with Default settings

Verify:  git --version


🔹 STEP 3: Clone repository

git clone https://github.com/jagadeeshpagoti22/password-strength-analyzer.git

cd password-strength-analyzer



🔹 STEP 4: Install  Dependencies

 command:    npm install


🔹 STEP 5: Run the tool

Commands:

Password check -->  node analyzer.js -p <Yourpassword>


Email check    -->   node analyzer.js -e <email>


Email + Password check --> node analyzer.js -e <email> -p <password>


Help menu  -->  node analyzer.js -h


### KALI LINUX SETUP

STEP 1: Update system

sudo apt update


STEP 2: Install Node.js & npm

sudo apt install -y nodejs npm

Check: node -v

npm -v

STEP 3: Install Git (optional)

sudo apt install -y git


STEP 4: Go to project folder

cd ~/password-strength-analyzer


STEP 5: Install dependencies

npm install


STEP 7: Run the tool

node analyzer.js -p <password>

node analyzer.js -e <email>

node analyzer.js -e <email> -p <password>

node analyzer.js -h

### Help menu

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
  
  analyzer.js -e test@gmail.com --out report.tx
  
