import {
	bigserial,
	geometry,
	index,
	pgTable,
	unique,
} from 'drizzle-orm/pg-core'
/**
 * Table
 */
export const location = pgTable(
	'location',
	{
		id: bigserial('id', { mode: 'bigint' }).primaryKey(),
		location: geometry('location', {
			type: 'point',
			mode: 'xy',
			srid: 4326,
		}).notNull(),
	},
	(t) => ({
		locationIndex: index('location_index').using('gist', t.location),
		unique_location: unique().on(t.location),
	}),
)

