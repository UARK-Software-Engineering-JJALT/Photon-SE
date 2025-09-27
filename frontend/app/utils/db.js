import { Client } from "pg";

//Specify values if nonfunctional
//library claims to use environ variables
//to fill gaps
const client = new Client({
  //host: "127.0.0.1",
  database: "photon"
});
await client.connect();

export const add_player = async (id, player) => {
  if (id.length === 0) {
    return;
  }
  let addition_array = Array.from(id, (id_c, index) => {
    return [id_c, player[index]];
  });
  return await client.query(`INSERT INTO players (id, codename) VALUES ${addition_array.toString()
    .replace("[", "(")
    .replace("]", ")")
    .replace("\n", "")};`);
};

export const remove_player = async (id_t) => {
  let id_array = Array.from(id_t).map(_ => parseInt(_, 0)).filter(_ => _ != NaN).toString()
    .replace("[", "(")
    .replace("]", ")")
    .replace("\n", "");
  let codename_array = Array.from(id_t).map(_ => parseInt(_, 0)).filter(_ => _ == NaN).toString()
    .replace("[", "(")
    .replace("]", ")")
    .replace("\n", "");
  return await client.query(`DELETE FROM players WHERE id IN ${id_array} OR codename IN ${codename_array};`);
};

export const get_player = async (id_t) => {
  let id_array = Array.from(id_t).map(_ => parseInt(_, 0)).filter(_ => _ != NaN).toString()
    .replace("[", "(")
    .replace("]", ")")
    .replace("\n", "");
  let codename_array = Array.from(id_t).map(_ => parseInt(_, 0)).filter(_ => _ == NaN).toString()
    .replace("[", "(")
    .replace("]", ")")
    .replace("\n", "");
  return await client.query(`SELECT * FROM players WHERE id IN ${id_array} OR codename IN ${codename_array};`);
};