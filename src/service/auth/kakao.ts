import axios from "axios";

export const KAKAO_API_URL = "https://kapi.kakao.com";
export const KAKAO_AUTH_URL = "https://kauth.kakao.com";

class KakaoRepositories {
  getUserInfoByToken = async (token: string, properties: string[]) => {
    try {
      const response = await axios.get(`${KAKAO_API_URL}/v2/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
        params: {
          property_keys: properties,
        },
      });
      return response.data;
    } catch (e) {
      console.log(e);
      return e;
    }
  };

  kakaoLogout = async (token: string) => {
    try {
      const response = await axios.post(`${KAKAO_AUTH_URL}/v1/user/logout`, {
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

export const kakaoRepositories = new KakaoRepositories();
