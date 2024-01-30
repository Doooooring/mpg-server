import { Request, Response } from "express";
import fs from "fs";
import { ObjectId } from "mongoose";
import path from "path";
import { category } from "../../interface/keyword";
import { Keywords } from "../../schemas/keywords";
import { News } from "../../schemas/news";
import { keywordRepositories } from "../../service/keyword";
import { newsRepositories } from "../../service/news";

export const deleteKeywordAll = async (req: Request, res: Response) => {
  const response = await Keywords.deleteMany({});
  res.send(JSON.stringify(response));
};

export const getKeywords = async (req: Request, res: Response) => {
  const { search } = req.query;
  let v =
    search === "" || search === undefined || search === null
      ? ""
      : (search as string);
  try {
    const response = await keywordRepositories.getKeywordTitlesInShort(v);
    res.send({
      success: true,
      result: {
        keywords: response,
      },
    });
  } catch (e) {
    console.log(e);
    res.send({
      success: false,
      result: {},
    });
  }
};

export const getKeywordsByFilter = async (req: Request, res: Response) => {
  const { search, offset, limit } = req.query;
  try {
    const response = await keywordRepositories.getKeywordTitlesInShort(
      search as string,
      Number(offset),
      Number(limit)
    );
  } catch (e) {
    console.log("get keywords by filter error", e);
    res.send({
      success: false,
      result: [],
    });
  }
};

// export const getKeywordIds = async (req: Request, res : Response) => {
//   try {
//     const response = await keywordRepositories.getKeyword
//   }
// }

export const getKeywordInfoByKeyword = async (req: Request, res: Response) => {
  const { keyword } = req.params;
  const decoded = keyword.replace(/\$/g, "/");

  try {
    const response = await keywordRepositories.getKeywordByKey(decoded);
    res.send({
      success: true,
      result: {
        keyword: response,
      },
    });
  } catch (e) {
    console.log(e);
    res.send({
      success: false,
      result: {},
    });
  }
};

export const getKeywordsByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const { page } = req.query;
    const response = await keywordRepositories.getKeywordsInShortByCategory(
      category,
      Number(page),
      20
    );
    res.send({
      success: true,
      result: {
        keywords: response,
      },
    });
  } catch (e) {
    console.log(e);
    res.send({
      success: false,
      result: {},
    });
  }
};

export const getKeywordsForCategories = async (req: Request, res: Response) => {
  try {
    const recent = await keywordRepositories.getKeywordByState(true, 10);
    const other = await keywordRepositories.getKeywordsInShortWithEachCateogory(
      80
    );

    const response = {
      recent: recent,
      other: other,
    };
    res.send({
      success: true,
      result: {
        keywords: response,
      },
    });
  } catch (e) {
    console.log(e);
    res.send({
      success: false,
      result: {},
    });
  }
};

export const getKeywordByKey = async (req: Request, res: Response) => {
  const { keyname } = req.params;
  const keyword = await keywordRepositories.getKeywordByKey(keyname as string);
  res.send({ success: true, result: { keyword: keyword } });
};

export const getKeywordWithNewsData = async (req: Request, res: Response) => {
  // const { page, keyword: keyname } = req.query;
  // const keyword = await keywordRepositories.getKeywordsWithNews(
  //   keyname as string
  // );

  const { page = 0, limit = 20, id } = req.query;
  const keyword = await keywordRepositories.getKeywordsWithNewsById(
    id as string
  );

  if (keyword === null) {
    res.send("none");
    return;
  }

  const { news } = keyword;
  const previews = await newsRepositories.getNewsInShortByIdList(
    Number(page),
    news,
    Number(limit)
  );
  const response = {
    keyword: keyword,
    previews: previews,
  };
  res.send({
    success: true,
    result: response,
  });
};

export const addKeyword = async (req: Request, res: Response) => {
  const newKeyword = req.body.keyword;
  const { keyword, news } = newKeyword;
  if (typeof news === "string") {
    if (news === "") {
      newKeyword["news"] = [];
    } else {
      newKeyword["news"] = news.split(".");
    }
  }

  const checkNull = await keywordRepositories.getKeywordByKey(keyword);
  if (checkNull !== null) {
    res.send(Error("Keyword already added"));
    return;
  }
  try {
    const isRecent = await newsRepositories.getNewsByIdAndState(news, true);
    console.log("isRecent", isRecent);

    const response1 = await keywordRepositories.postKeyword({
      ...newKeyword,
      recent: isRecent.length > 0,
    });

    console.log(response1);

    if (news.length !== 0) {
      const response2 = await newsRepositories.pushKeywordToNews(news, keyword);
    }

    res.send({
      success: true,
      result: response1,
    });
  } catch (e) {
    console.error(e);
    res.send(e);
  }
};

export const postKeywordImageById = async (req: Request, res: Response) => {
  try {
    const img = req.file?.buffer;
    if (img === undefined) {
      Error("image doesn't exist");
      return;
    }
    const id = req.params.id;

    // let buffer = Buffer.from(img, "base64");
    const filePath = path.join(__dirname, "../../images/keyword", id);

    fs.writeFileSync(filePath, img);
    res.send({
      success: true,
      result: {},
    });
  } catch (e) {
    console.log(e);
    res.send({
      success: false,
      result: {},
    });
    return;
  }
};

export const updateKeyword = async (req: Request, res: Response) => {
  const {
    _id,
    keyword,
    explain,
    category,
    news,
  }: {
    _id: string;
    keyword: string;
    explain: string;
    category: category;
    news: Array<string>;
  } = req.body.keyword;

  const beforeObj = await keywordRepositories.getKeywordById(_id);

  if (!beforeObj) {
    res.send(Error("is not existed"));
    return;
  }
  try {
    const isRecent = await newsRepositories.getNewsByIdAndState(news, true);
    const keywordToPut = {
      keyword: keyword,
      explain: explain,
      category: category,
      news: news,
      recent: isRecent.length > 0,
    };
    const response1 = await keywordRepositories.updateKeywordById(
      _id,
      keywordToPut
    );

    const curNews = news;
    const beforeNews = beforeObj["news"];

    const deleteNews = beforeNews.filter((key) => {
      return !curNews.includes(key);
    });
    const addNews = curNews.filter((key) => {
      return !beforeNews.includes(key);
    });
    if (deleteNews.length !== 0) {
      try {
        const response = await newsRepositories.pullKeywordFromNews(
          deleteNews,
          keyword
        );

        console.log(response);
      } catch (e) {
        console.log(e);
      }
    }

    if (addNews.length !== 0) {
      try {
        const response = await newsRepositories.pushKeywordToNews(
          addNews,
          keyword
        );
      } catch (e) {
        console.log(e);
      }
    }

    res.send({
      success: true,
      result: response1,
    });
  } catch (e) {
    console.log(e);
    res.send(Error("get some error"));
  }
};

export const deleteKeyword = async (req: Request, res: Response) => {
  try {
    const { id } = req.query;
    const deleteKeyword = await keywordRepositories.getKeywordById(
      id as string
    );
    const keyword = deleteKeyword!["keyword"];
    const deleteNews = deleteKeyword!["news"];

    const response = await keywordRepositories.deleteKeywordById(id as string);

    if (deleteNews.length !== 0) {
      try {
        const response = await newsRepositories.pullKeywordFromNews(
          deleteNews,
          keyword
        );

        console.log(response);
      } catch (e) {
        console.log(e);
        res.send({
          success: false,
          result: {},
        });
        return;
      }
    }

    res.send({
      success: true,
      result: {},
    });
  } catch {
    res.send({
      success: false,
      result: {},
    });
  }
};

export const updateKeywordsState = async (keywords: string[]) => {
  try {
    await Promise.all(
      keywords.map(async (keyword) => {
        updateKeywordState(keyword);
      })
    );
    return { success: true, result: {} };
  } catch (e) {
    console.log("keyword update error!");
    console.log(e);
    return e;
  }
};

export const updateKeywordState = async (keyword: string) => {
  const responseWithNews = await keywordRepositories.getKeywordByKey(keyword);

  if (responseWithNews === null) {
    throw new Error("none");
  }

  const newsList = responseWithNews["news"];

  const newsRecent = await News.find({
    _id: {
      $in: newsList,
    },
    state: true,
  });
  if (newsRecent.length == 0) {
    const response = await keywordRepositories.updateKeywordsState(
      [keyword],
      false
    );
  }
};

export const fixTheKeywords = async () => {
  try {
    const keywords = await keywordRepositories.getKeywordsAll();
    for (let k of keywords) {
      const { _id, news } = k as {
        _id: ObjectId;
        keyword: string;
        explain: string;
        category: category;
        recent: Boolean;
        news: Array<string>;
      };
      const newArr = [] as Array<string>;
      news.forEach((news) => {
        newArr.push(news.replace(/"/g, ""));
      });
      k.news = newArr;
      keywordRepositories.updateKeywordById(_id.toString(), k);
    }
  } catch (e) {
    console.log(e);
  }
};
