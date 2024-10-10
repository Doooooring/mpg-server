import axios from "axios";
import { Transaction } from "sequelize";
import { NewsInf, commentType } from "../interface/news";
import { sequelize } from "../models";
import { Comment } from "../models/comment";
import { Keyword } from "../models/keyword";
import { MongoMq } from "../models/mongoMq";
import { News, TimelineItem } from "../models/news";
import { NewsKeyword } from "../models/newskeyword";
import { Timeline } from "../models/timeline";
import { keywordRepositories } from "../service/keyword";
import { newsRepositories } from "../service/news";

const HOST_URL = "https://api.yvoting.com";

export const deleteAllNews = async () => {
  await newsRepositories.deleteAll();
};

export const newsMongmigrate = async () => {
  await deleteAllNews();

  const response1 = await axios.get(`${HOST_URL}/news/id`);
  const ids = response1.data!.result.data;
  for (let { _id: id } of ids) {
    console.log(id);
    const response2 = await axios.get(`${HOST_URL}/admin/news/${id}`);
    const data = response2.data!.result.news;
    console.log(data);
    await newsRepositories.postNews(data);
  }
};

export const keywordMongmigrate = async () => {
  await keywordRepositories.deleteKeywordAll();

  const response1 = await axios.get(`${HOST_URL}/keywords/keyword`);
  const keywords = response1.data!.result.keywords;
  for (let { keyword } of keywords) {
    console.log(keyword);
    const response2 = await axios.get(`${HOST_URL}/admin/keywords/${keyword}`);

    const data = response2.data.result.keyword;
    console.log(data);
    await keywordRepositories.postKeyword(data);
  }
};

export const summaryToHtml = async () => {
  const ids = await newsRepositories.getNewsIds();

  const maxCnt = ids.length;
  for (let i = 0; i < maxCnt; i++) {
    const { _id } = ids[i];

    const news = await newsRepositories.getNewsById(_id.toHexString());
  }
};

export const migrateMongToMy = async () => {
  const t = await sequelize.transaction();
  try {
    console.log("save news start");
    await saveNewsMy(t);
    console.log("save keywords start");
    await saveKeywordsMy(t);
    console.log("save connect News keyword");
    await connectNewsKeyword(t);
    console.log("is done");
    t.commit();
  } catch (e) {
    console.log(e);

    t.rollback();
  }
};

const saveNewsMy = async (t: Transaction) => {
  const ids = await newsRepositories.getNewsIds();
  const maxCnt = ids.length;
  for (let i = 0; i < maxCnt; i++) {
    const { _id: id } = ids[i];
    const news = await newsRepositories.getNewsById(id.toString());
    if (!news) continue;

    const { order, title, summary, opinions, timeline, comments } = news;
    const state = news.state as boolean;
    const isPublished = news.isPublished as boolean;
    const { left, right } = opinions;

    const newsPost = await News.create(
      {
        order,
        title,
        summary,
        state,
        isPublished,
        opinion_left: left,
        opinion_right: right,
      },
      { transaction: t }
    );

    const timelinePost = await postTimeline(newsPost.id, timeline, t);

    const commentPost = await postComment(newsPost.id, comments, t);

    const mongoMqPost = await MongoMq.create(
      {
        mongoId: id.toString(),
        mqId: newsPost.id,
      },
      { transaction: t }
    );
  }
};

const getCommentDate = (title: string) => {
  const dates = title.match(/\((\d{1,2})\/(\d{1,2})\)/);
  let year, month, date;
  if (dates) {
    year = "2024";
    month = dates[1];
    date = dates[2];
  } else {
    year = "2023";
    month = "01";
    date = "01";
  }
  const commentDate = new Date(year + "/" + month + "/" + date);
  return commentDate;
};

const postTimeline = async (
  id: number,
  timeline: TimelineItem[],
  t: Transaction
) => {
  for (let tt of timeline) {
    const { date, title } = tt;
    const res = await Timeline.create(
      {
        date,
        title,
        news_id: id,
      },
      { transaction: t }
    );
  }
};

const postComment = async (
  id: number,
  comments: NewsInf["comments"],
  t: Transaction
) => {
  const keys = Object.keys(comments);
  for (let type of keys) {
    const curComment = comments[type as commentType].reverse();
    for (let order in curComment) {
      const { title, comment } = curComment[order];

      const resp = await Comment.create(
        {
          order,
          news_id: id,
          comment_type: type,
          title,
          comment,
          date: getCommentDate(title),
        },
        { transaction: t }
      );
    }
  }
};

const saveKeywordsMy = async (t: Transaction) => {
  const keywords = await keywordRepositories.getKeywordsAll();
  for (let keywordMod of keywords) {
    const { keyword, explain, category, recent, news } = keywordMod;

    const keywordPost = await Keyword.create(
      {
        keyword,
        explain,
        category,
        recent,
      },
      { transaction: t }
    );
  }
};

const connectNewsKeyword = async (t: Transaction) => {
  const ids = await newsRepositories.getNewsIds();
  for (let { id } of ids) {
    const news = await newsRepositories.getNewsById(id.toString());
    const keywords = news?.keywords ?? [];
    const newsMongoMq = await MongoMq.findOne({
      where: {
        mongoId: news?.id.toString(),
      },
    });
    const newsMqId = newsMongoMq?.mqId;
    for (let keyword of keywords) {
      const keywordMq = await Keyword.findOne({
        where: {
          keyword,
        },
      });
      const resp = await NewsKeyword.create(
        {
          news_id: newsMqId,
          keyword_id: keywordMq?.id,
        },
        { transaction: t }
      );
    }
  }
};
