export {}

const mongoose = require("mongoose");

const { SchemaKeywords } = mongoose;
const {
  Types: { ObjectId },
} = SchemaKeywords;

const keywordSchema = new SchemaKeywords({
  keyword: String,
  category: String,
  news: {
    type: [ObjectId],
    ref: "News",
  },
});

module.exports = mongoose.model("Keywords", keywordSchema);
