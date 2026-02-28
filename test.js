import { createClient } from "redis";

const client = createClient({
  url: "redis://default:QF4BSW0T2iP5jzcwJSWtw7nS6winE3JB@redis-12553.crce206.ap-south-1-1.ec2.cloud.redislabs.com:12553",
});

await client.connect();
console.log("Connected!");