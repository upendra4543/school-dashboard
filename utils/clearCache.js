import redisClient from "../config/redis.js";


export const clearStudentCache = async(redisClient) =>{
    const keys = await redisClient.keys("students:*");
    if(keys.length>0){
        await redisClient.del(keys)
    }
}