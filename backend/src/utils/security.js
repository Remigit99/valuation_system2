import crypto from "crypto";

/*
|----------------------------------
| Create Login Attempt Identifier
|-----------------------------------
|
*/

export const createAttemptIdentifier = ({
  username,
  ipAddress,
}) => {
  return crypto
    .createHash("sha256")
    .update(
      `${username.toLowerCase()}:${ipAddress}`
    )
    .digest("hex");
};