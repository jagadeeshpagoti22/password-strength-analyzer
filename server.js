const express = require("express");
const zxcvbn = require("zxcvbn");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/analyze", (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password required" });
  }

  const result = zxcvbn(password);

  res.json({
    score: result.score, // 0 - 4
    strength:
      ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"][result.score],
    feedback: result.feedback,
    crackTime: result.crack_times_display,
    entropy: result.guesses_log10.toFixed(2),
  });
});

app.listen(3000, () =>
  console.log("🔐 Password Analyzer running on http://localhost:3000")
);
