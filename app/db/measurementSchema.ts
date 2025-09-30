import { type InferSelectModel } from 'drizzle-orm'
import {
	bigint,
	doublePrecision,
	pgTable,
	text,
	timestamp,
	unique,
} from 'drizzle-orm/pg-core'
import { location } from './locationSchema'

/**
 * Table
 */
export const measurement = pgTable(
	'measurement',
	{
		sensorId: text('sensor_id').notNull(),
		time: timestamp('time', { precision: 3, withTimezone: true })
			.defaultNow()
			.notNull(),
		value: doublePrecision('value'),
		locationId: bigint('location_id', { mode: 'bigint' }).references(
			() => location.id,
		),
	},
	(t) => ({
		unq: unique().on(t.sensorId, t.time), // Only one measurement for a sensor at the same time
	}),
)

export type Measurement = InferSelectModel<typeof measurement>
