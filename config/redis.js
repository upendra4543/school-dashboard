import { createClient } from "redis";

const redisClient = createClient({
    url:process.env.REDIS_URL
})
redisClient.on("connect", () => {
  console.log("✅ Redis Connected Successfully");
});
redisClient.on("error",(err) =>{
      console.error("redis error",err)
})
await redisClient.connect();

export default redisClient;