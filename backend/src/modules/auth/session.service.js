import { redisClient } from "../../config/redis.js";

/*
|--------------------
| Session Expiration
|--------------------
*/

const SESSION_EXPIRATION_SECONDS =
  60 * 60 * 24 * 7;

/*
|----------------
| Create Session
|----------------
*/

export const createSession = async ({
  sessionId,
  userId,
  userAgent,
  ipAddress,
}) => {
  const sessionKey = `session:${sessionId}`;

  await redisClient.set(
    sessionKey,
    JSON.stringify({
      userId,
      userAgent,
      ipAddress,
      createdAt: new Date(),
    }),
    {
      EX: SESSION_EXPIRATION_SECONDS,
    }
  );
};

/*
|-------------
| Get Session
|-------------
*/

export const getSession = async (sessionId) => {
  const sessionKey = `session:${sessionId}`;

  const session = await redisClient.get(sessionKey);

  return session ? JSON.parse(session) : null;
};

/*
|----------------
| Delete Session
|----------------
*/

export const deleteSession = async (sessionId) => {
  const sessionKey = `session:${sessionId}`;

  await redisClient.del(sessionKey);
};