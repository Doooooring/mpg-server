import axios from "axios";
import { newsRepositories } from "../service/news";

const HOST_URL = "https://api.yvoting.com";

export const deleteAllNews = async () => {
  await newsRepositories.deleteAll();
};

export const mongmigrate = async () => {
  //await deleteAllNews();

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
