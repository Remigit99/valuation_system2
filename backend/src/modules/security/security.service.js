import {redisClient}
from "../../config/redis.js";

import { createAttemptIdentifier } from "../../utils/security.js";

const MAX_ATTEMPTS=5;

const LOCK_TIME=15*60;

/*
|---------------------------
| Increment Login Attempts
|---------------------------
*/

export const incrementLoginAttempts=
async(identifier)=>{

    const key=
    `login-attempt:${identifier}`;

    const attempts=
    await redisClient.incr(key);

    if(attempts===1){

        await redisClient.expire(
            key,
            LOCK_TIME
        );

    }

    return attempts;
};

/*
|--------------------
| Check Lock Status
|---------------------
*/

export const isLocked=
async(identifier)=>{

    const key=
    `login-attempt:${identifier}`;

    const attempts=
    Number(
        await redisClient.get(key)
    );

    return attempts>=MAX_ATTEMPTS;

};

/*
|-----------------
| Clear Attempts
|-----------------
*/

export const clearAttempts=
async(identifier)=>{

    await redisClient.del(
        `login-attempt:${identifier}`
    );

};