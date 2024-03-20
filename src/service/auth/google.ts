import axios from "axios";

export const GOOGLE_AUTH_URL = "https://www.googleapis.com/oauth2/v1";

class GoogleRepositories {
  getUserInfoByToken = async (token: string) => {
    try {
      const response = await axios.get(
        `${GOOGLE_AUTH_URL}/userinfo?access_token=${token}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("try google login repositories !!!!!!!");
      console.log(`data  : ${response.data}`);

      return response.data;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
}

export const googleRepositories = new GoogleRepositories();
