import { pgTable, boolean, text, timestamp} from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";
import { InferInsertModel, type InferSelectModel} from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export const user = pgTable("user", {
  id: text("id")
    .primaryKey()
    .notNull()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  unconfirmedEmail: text("unconfirmed_email").unique(),
  role: text("role").$type<"admin" | "user">().default("user"),
  language: text("language").default("en_US"),
  emailIsConfirmed: boolean("email_is_confirmed").default(false),
  emailConfirmationToken: text("email_confirmation_token").$defaultFn(() =>
    uuidv4(),
  ),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});


export type User = InferSelectModel<typeof user>;
export type InsertUser = InferInsertModel<typeof user>;




