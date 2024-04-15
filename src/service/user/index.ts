import mongoose from "mongoose";
import { Platform } from "../../interface/common";
import { User } from "../../schemas/user";

const ObjectId = mongoose.Types.ObjectId;

class UserRepositories {
  getUserById = async (id: string) => {
    return User.find({
      id,
    });
  };

  getUserByEmail = async (email: string) => {
    return User.find({
      email,
    });
  };

  getUserInfoById = async (id: string) => {
    return User.findOne({
      id,
    });
  };

  getUserInfoByEmailAndPlatform = async (email: string, platform: Platform) => {
    return User.findOne({
      email,
      platform,
    });
  };

  postUser = async (
    id: string,
    email: string,
    name: string,
    platform: Platform
  ) => {
    return User.create({
      id,
      email,
      name,
      platform,
    });
  };
}

export const userRepositories = new UserRepositories();
