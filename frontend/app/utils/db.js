import { Client } from "pg";

const client = new Client({
  host: "127.0.0.1",
  database: "photon",
  password: "student"
});
await client.connect();

export const add_player = async (id, codename) => {
  return client.query(
    "INSERT INTO players (id, codename) VALUES ($1, $2) RETURNING *",
    [id, codename]
  );
};

export const remove_player = async (id) => {
  return client.query("DELETE FROM players WHERE id = $1 RETURNING *", [id]);
};

export const get_player = async (id) => {
  const res = await client.query("SELECT * FROM players WHERE id = $1", [id]);
  return res.rows[0] || null;
};

export const update_player = async (id, codename) => {
  return client.query(
    "UPDATE players SET codename = $2 WHERE id = $1 RETURNING *",
    [id, codename]
  );
};

export const get_all_players = async () => {
  const res = await client.query("SELECT * FROM players ORDER BY id ASC");
  return res.rows;
};