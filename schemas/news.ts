const mongooseNews = require("mongoose");

const { SchemaNews } = mongooseNews;
const newsSchema = new SchemaNews({
  title: String,
  summary: String,
  news: [{ date: Date, title: String }],
  journals: [{ press: String, title: String }],
  keywords: [String],
  state: Boolean,
  opinions: {
    left: String,
    right: String,
  },
  votes: {
    left: Number,
    right: Number,
  },
});

module.exports = mongooseNews.model("News", newsSchema);
