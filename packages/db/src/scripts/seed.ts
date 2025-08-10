import fs from "fs";
import path from "path";
import { sql } from "@vercel/postgres";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/vercel-postgres";

import { Aircraft } from "../lib/schema/aircraft";

function initDb() {
  config();

  const value = process.env.POSTGRES_URL;
  if (!value) {
    throw new Error(`Missing required environment variable: POSTGRES_URL`);
  }

  return drizzle({
    client: sql,
    casing: "snake_case",
  });
}

async function main() {
  const db = initDb();

  console.log("Resetting Aircraft table...");
  await db.delete(Aircraft);
  console.log("Table reset complete.");

  console.log("Importing data from JSON file...");
  const absPath = path.join(process.cwd(), "./src/scripts/data/aircraft.json");
  if (!fs.existsSync(absPath)) {
    throw new Error(`JSON file not found: ${absPath}`);
  }

  console.log(`Reading data from: ${absPath}...`);
  const json = fs.readFileSync(absPath, "utf-8");
  const data = JSON.parse(json) as (typeof Aircraft.$inferInsert)[];
  if (!Array.isArray(data)) {
    throw new Error("JSON file must contain an array of objects");
  }

  console.log("Inserting data into Aircraft table...");
  await db.insert(Aircraft).values(data);
  console.log(`Imported ${data.length} records into Aircraft table.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error during seeding:", err);
    process.exit(1);
  });
