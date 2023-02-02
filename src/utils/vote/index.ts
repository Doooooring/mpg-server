import jwt from "jsonwebtoken";

const secret = process.env.SECRET as string;

class VoteService {
  sign = (userId: string) => {
    const payload = {
      id: userId,
    };
    return jwt.sign(payload, secret, {
      algorithm: "HS256",
      expiresIn: "24h",
    });
  };

  verify = (token: string) => {
    let decoded = null;
    try {
      decoded = jwt.verify(token, secret);
      if (typeof decoded === "string") {
        console.log(decoded);
        Error();
        return false;
      }
      return true;
    } catch {
      return false;
    }
  };
}
export default new VoteService();
