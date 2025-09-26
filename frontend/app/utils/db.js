import { Client } from "pg";

const client = new Client({
  user: "database-user",
  password: "secretpassword!!",
  host: "my.database-server.com",
  port: 5334,
  database: "database-name",
});
await client.connect();

const res = await client.query("SELECT $1::text as message", ["Hello world!"]);
console.log(res.rows[0].message); // Hello world!
await client.end();
