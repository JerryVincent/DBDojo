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
CREATE TABLE "device_to_location" (
	"device_id" text NOT NULL,
	"location_id" bigint NOT NULL,
	"time" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "device_to_location_device_id_location_id_time_pk" PRIMARY KEY("device_id","location_id","time"),
	CONSTRAINT "device_to_location_device_id_location_id_time_unique" UNIQUE("device_id","location_id","time")
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
CREATE TABLE "log_entry" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"public" boolean DEFAULT false NOT NULL,
	"device_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refresh_token" (
	"user_id" text NOT NULL,
	"token" text,
	"expires_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "token_revocation" (
	"hash" text NOT NULL,
	"token" json NOT NULL,
	"expires_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password" (
	"hash" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_reset_request" (
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "password_reset_request_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "sensor" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text,
	"unit" text,
	"sensor_type" text,
	"status" "status" DEFAULT 'inactive',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"device_id" text NOT NULL,
	"sensor_wiki_type" text,
	"sensor_wiki_phenomenon" text,
	"sensor_wiki_unit" text,
	"lastMeasurement" json,
	"data" json
);
--> statement-breakpoint
CREATE TABLE "profile_image" (
	"id" text PRIMARY KEY NOT NULL,
	"alt_text" text,
	"content_type" text NOT NULL,
	"blob" "bytea" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"profile_id" text
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" text PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"public" boolean DEFAULT false,
	"user_id" text,
	CONSTRAINT "profile_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "device_to_location" ADD CONSTRAINT "device_to_location_device_id_device_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."device"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "device_to_location" ADD CONSTRAINT "device_to_location_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "measurement" ADD CONSTRAINT "measurement_location_id_location_id_fk" FOREIGN KEY ("location_id") REFERENCES "public"."location"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refresh_token" ADD CONSTRAINT "refresh_token_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "password" ADD CONSTRAINT "password_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "password_reset_request" ADD CONSTRAINT "password_reset_request_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sensor" ADD CONSTRAINT "sensor_device_id_device_id_fk" FOREIGN KEY ("device_id") REFERENCES "public"."device"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profile_image" ADD CONSTRAINT "profile_image_profile_id_profile_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profile"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "location_index" ON "location" USING gist ("location");