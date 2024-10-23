// backend/controllers/recommendationController.js

exports.getRecommendation = (req, res) => {
  const {weather, age} = req.body;

  // 간단한 예시 로직 (실제로는 AI 요청)
  let recommendation = "청바지와 가디건";
  if (weather === "비") {
    recommendation = "레인코트와 부츠";
  }

  const relatedKeywords = ["코트", "ootd", "블랙진"];
  res.json({recommendation, relatedKeywords});
};

// backend/routes/recommendationRoutes.js

const express = require("express");
const {getRecommendation} = require("../controllers/recommendationController");
const router = express.Router();

router.post("/recommendation", getRecommendation);

module.exports = router;

// backend/server.js

const express = require("express");
const app = express();
const recommendationRoutes = require("./routes/recommendationRoutes");

app.use(express.json());

app.use("/api", recommendationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
