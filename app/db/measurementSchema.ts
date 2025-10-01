import { type InferSelectModel } from 'drizzle-orm'
import {
	bigint,
	doublePrecision,
	integer,
	pgMaterializedView,
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

/**
 * Views
 */
export const measurements10minView = pgMaterializedView('measurement_10min', {
	sensorId: text('sensor_id'),
	time: timestamp('time', { precision: 3, withTimezone: true }),
	value: doublePrecision('avg_value'),
	total_values: integer('total_values'),
	min_value: doublePrecision('min_value'),
	max_value: doublePrecision('max_value'),
}).existing()

export const measurements1hourView = pgMaterializedView('measurement_1hour', {
	sensorId: text('sensor_id'),
	time: timestamp('time', { precision: 3, withTimezone: true }),
	value: doublePrecision('avg_value'),
	total_values: integer('total_values'),
	min_value: doublePrecision('min_value'),
	max_value: doublePrecision('max_value'),
}).existing()

export const measurements1dayView = pgMaterializedView('measurement_1day', {
	sensorId: text('sensor_id'),
	time: timestamp('time', { precision: 3, withTimezone: true }),
	value: doublePrecision('avg_value'),
	total_values: integer('total_values'),
	min_value: doublePrecision('min_value'),
	max_value: doublePrecision('max_value'),
}).existing()

export const measurements1monthView = pgMaterializedView('measurement_1month', {
	sensorId: text('sensor_id'),
	time: timestamp('time', { precision: 3, withTimezone: true }),
	value: doublePrecision('avg_value'),
	total_values: integer('total_values'),
	min_value: doublePrecision('min_value'),
	max_value: doublePrecision('max_value'),
}).existing()

export const measurements1yearView = pgMaterializedView('measurement_1year', {
	sensorId: text('sensor_id'),
	time: timestamp('time', { precision: 3, withTimezone: true }),
	value: doublePrecision('avg_value'),
	total_values: integer('total_values'),
	min_value: doublePrecision('min_value'),
	max_value: doublePrecision('max_value'),
}).existing()

export type Measurement = InferSelectModel<typeof measurement>
