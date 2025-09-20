import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Invoice schema
export const invoiceItemSchema = z.object({
  id: z.string(),
  description: z.string(),
  quantity: z.number().min(1),
  rate: z.number().min(0),
  amount: z.number().min(0),
});

export const invoiceSchema = z.object({
  // Invoice details
  invoiceNumber: z.string(),
  date: z.string(),
  dueDate: z.string(),
  currency: z.string().default("USD"),
  
  // From (sender) details
  fromName: z.string(),
  fromEmail: z.string().email().optional(),
  fromAddress: z.string(),
  fromCity: z.string(),
  fromPostalCode: z.string(),
  fromCountry: z.string(),
  fromLogo: z.string().optional(), // Base64 encoded logo
  
  // To (recipient) details
  toName: z.string(),
  toEmail: z.string().email().optional(),
  toAddress: z.string(),
  toCity: z.string(),
  toPostalCode: z.string(),
  toCountry: z.string(),
  
  // Items and totals
  items: z.array(invoiceItemSchema),
  subtotal: z.number().min(0),
  discountType: z.enum(["percentage", "fixed"]).default("percentage"),
  discountValue: z.number().min(0).default(0),
  discountAmount: z.number().min(0).default(0),
  taxRate: z.number().min(0).max(100),
  taxAmount: z.number().min(0),
  total: z.number().min(0),
  
  // Optional fields
  notes: z.string().optional(),
  terms: z.string().optional(),
  
  // Signature fields
  signatureName: z.string().optional(),
  signatureImage: z.string().optional(), // Base64 encoded signature
});

export type InvoiceItem = z.infer<typeof invoiceItemSchema>;
export type Invoice = z.infer<typeof invoiceSchema>;
