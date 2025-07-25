CREATE TYPE "public"."exposure" AS ENUM('indoor', 'outdoor', 'mobile', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."model" AS ENUM('homeV2Lora', 'homeV2Ethernet', 'homeV2Wifi', 'senseBox:Edu', 'luftdaten.info', 'Custom');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('active', 'inactive', 'old');--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"unconfirmed_email" text,
	"role" text DEFAULT 'user',
	"language" text DEFAULT 'en_US',
	"email_is_confirmed" boolean DEFAULT false,
	"email_confirmation_token" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_unconfirmed_email_unique" UNIQUE("unconfirmed_email")
);
--> statement-breakpoint
CREATE TABLE "device" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"image" text,
	"description" text,
	"tags" text[] DEFAULT ARRAY[]::text[],
	"link" text,
	"use_auth" boolean,
	"exposure" "exposure",
	"status" "status" DEFAULT 'inactive',
	"model" "model",
	"public" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" date,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"user_id" text NOT NULL,
	"sensor_wiki_model" text
);
--> statement-breakpoint
CREATE TABLE "measurement" (
	"sensor_id" text NOT NULL,
	"time" timestamp (3) with time zone DEFAULT now() NOT NULL,
	"value" double precision,
	"location_id" bigint,
	CONSTRAINT "measurement_sensor_id_time_unique" UNIQUE("sensor_id","time")
);
--> statement-breakpoint
CREATE TABLE "location" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"location" geometry(point) NOT NULL,
	CONSTRAINT "location_location_unique" UNIQUE("location")
);
--> statement-breakpoint
ALTER TABLE "measurement" ADD CONSTRAINT "measurement_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "location_index" ON "location" USING gist ("location");