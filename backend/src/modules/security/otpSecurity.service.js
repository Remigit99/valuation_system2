import { redisClient } from "../../config/redis.js";
import AppError from "../../utils/AppError.js";

const RESEND_COOLDOWN = 60;

const MAX_HOURLY_REQUESTS = 5;

const MAX_DAILY_REQUESTS = 20;


/*
|--------------------------------------------------------------------------
| Check OTP Security Rules
|--------------------------------------------------------------------------
*/

export const checkOTPRequestLimit =
async(phoneNumber)=>{

    /*
    |--------------------------------------------------------------------------
    | Cooldown
    |--------------------------------------------------------------------------
    */

    const cooldownKey =
    `otp-cooldown:${phoneNumber}`;

    const cooldown =
    await redisClient.get(
        cooldownKey
    );

    if(cooldown){

        throw new AppError(
            "Please wait before requesting another OTP",
            429
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Hourly Limit
    |--------------------------------------------------------------------------
    */

    const hourlyKey =
    `otp-hourly:${phoneNumber}`;

    const hourlyCount =
    await redisClient.incr(
        hourlyKey
    );

    if(hourlyCount === 1){

        await redisClient.expire(
            hourlyKey,
            60 * 60
        );

    }

    if(
        hourlyCount >
        MAX_HOURLY_REQUESTS
    ){

        throw new AppError(
            "Hourly OTP limit exceeded",
            429
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Daily Limit
    |--------------------------------------------------------------------------
    */

    const dailyKey =
    `otp-daily:${phoneNumber}`;

    const dailyCount =
    await redisClient.incr(
        dailyKey
    );

    if(dailyCount === 1){

        await redisClient.expire(
            dailyKey,
            24 * 60 * 60
        );

    }

    if(
        dailyCount >
        MAX_DAILY_REQUESTS
    ){

        throw new AppError(
            "Daily OTP limit exceeded",
            429
        );

    }


    /*
    |--------------------------------------------------------------------------
    | Activate Cooldown
    |--------------------------------------------------------------------------
    */

    await redisClient.set(
        cooldownKey,
        "active",
        {
            EX:RESEND_COOLDOWN
        }
    );

};