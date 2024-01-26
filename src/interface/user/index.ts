import { Types } from "mongoose";
import { Platform } from "../common";

export interface UserInf {
  _id: Types.ObjectId;
  email: string;
  name: string;
  platform: Platform;
}
