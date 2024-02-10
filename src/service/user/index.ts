import mongoose from "mongoose";
import { Platform } from "../../interface/common";
import { User } from "../../schemas/user";

const ObjectId = mongoose.Types.ObjectId;

class UserRepositories {
  getUserByEmail = async (email: string) => {
    return User.find({
      email,
    });
  };

  getUserInfoByEmailAndPlatform = async (email: string, platform: Platform) => {
    return User.findOne({
      email,
      platform,
    });
  };

  postUser = async (email: string, name: string, platform: Platform) => {
    return User.create({
      email,
      name,
      platform,
    });
  };
}

export const userRepositories = new UserRepositories();
