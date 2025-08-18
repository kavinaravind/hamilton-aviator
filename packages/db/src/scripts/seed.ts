import fs from "fs";
import path from "path";
import type { PgTable } from "drizzle-orm/pg-core";
import { sql } from "@vercel/postgres";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/vercel-postgres";

import { Aircraft } from "../lib/schema/aircraft";
import { DutyLog } from "../lib/schema/duty-log";
import { Logbook } from "../lib/schema/logbook";
import { Report } from "../lib/schema/report";

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

async function seedTable<T>(table: PgTable, file: string, label: string) {
  const db = initDb();

  console.log(`Resetting ${label} table...`);
  await db.delete(table);
  console.log(`Table reset complete.`);

  const absPath = path.join(process.cwd(), file);
  if (!fs.existsSync(absPath)) {
    throw new Error(`JSON file not found: ${absPath}`);
  }

  console.log(`Reading data from: ${absPath}...`);
  const json = fs.readFileSync(absPath, "utf-8");
  const data = JSON.parse(json) as T[];
  if (!Array.isArray(data)) {
    throw new Error("JSON file must contain an array of objects");
  }

  if (label === "Logbook") {
    data.forEach((row) => {
      row.date = new Date(row.date);
      row.arrivalTime = new Date(row.arrivalTime);
      row.departureTime = new Date(row.departureTime);
    });
  }

  if (label === "DutyLog") {
    data.forEach((row) => {
      row.startTime = new Date(row.startTime);
      row.endTime = row.endTime ? new Date(row.endTime) : null;
    });
  }

  console.log(`Inserting data into ${label} table...`);
  await db.insert(table).values(data);
  console.log(`Imported ${data.length} records into ${label} table.`);
}

async function main() {
  await seedTable<typeof Aircraft.$inferInsert>(
    Aircraft,
    "./src/scripts/data/aircraft.json",
    "Aircraft",
  );
  await seedTable<typeof Logbook.$inferInsert>(
    Logbook,
    "./src/scripts/data/logbook.json",
    "Logbook",
  );
  await seedTable<typeof DutyLog.$inferInsert>(
    DutyLog,
    "./src/scripts/data/duty-log.json",
    "DutyLog",
  );
  await seedTable<typeof Report.$inferInsert>(
    Report,
    "./src/scripts/data/report.json",
    "Report",
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error during seeding:", err);
    process.exit(1);
  });
