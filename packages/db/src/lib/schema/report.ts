import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const Report = pgTable("report", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  estimatedTime: text("estimated_time").notNull(),
  requiredData: text("required_data").array().notNull(),
  category: text("category").notNull(),
});
