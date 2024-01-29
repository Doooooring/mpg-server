import { Platform } from "../../interface/common";
import { userRepositories } from "../../service/user";

export const upsertUsers = async (
  email: string,
  name: string,
  platform: Platform
) => {
  const user = userRepositories.getUserInfoByEmailAndPlatform(email, platform);
  if (!user) {
    const response = await userRepositories.postUser(email, name, platform);
  }
  return;
};
