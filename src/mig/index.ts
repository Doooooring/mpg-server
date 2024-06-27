import axios from "axios";
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

export const migrateMongToMy = async () => {
    
}