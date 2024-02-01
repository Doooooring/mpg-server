import { Platform } from "../../interface/common";
import { userRepositories } from "../../service/user";

export const upsertUsers = async (
  email: string,
  name: string,
  platform: Platform
) => {
  try {
    const user = userRepositories.getUserInfoByEmailAndPlatform(
      email,
      platform
    );
    if (!user) {
      const response = await userRepositories.postUser(email, name, platform);
    }
    return true;
  } catch (e) {
    return e;
  }
};
