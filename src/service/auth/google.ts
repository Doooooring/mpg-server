import axios from "axios";

export const GOOGLE_AUTH_URL = "https://www.googleapis.com/Oauth2/";

class GoogleRepositories {
  getUserInfoByToken = async (token: string) => {
    try {
      const response = await axios.get(`${GOOGLE_AUTH_URL}/userinfo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (e) {
      console.log(e);
      return e;
    }
  };
  
}

export const googleRepositories = new GoogleRepositories();
