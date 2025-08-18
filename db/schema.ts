import {
    pgTable,
    uuid,
    text,
    timestamp,
    integer,
    varchar,
    date,
} from 'drizzle-orm/pg-core'

// Events table
export const events = pgTable('events', {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    date: timestamp().notNull(),
    details: text().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    imageUrls: text().array().default([]),
})

// Projects table
export const projects = pgTable('projects', {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    author: text().notNull(),
    description: text().notNull(),
    liveLink: text(),
    githubUrl: text(),
    createdAt: timestamp().defaultNow().notNull(),
    projectBannerUrl: varchar({ length: 255 }),
})

// Leaderboard table
export const leaderboard = pgTable('leaderboard', {
    id: uuid().defaultRandom().primaryKey(),
    rank: integer().notNull(),
    username: text().notNull(),
    rating: integer().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
})

// Achievements table
export const achievements = pgTable('achievements', {
    id: uuid().defaultRandom().primaryKey(),
    title: text().notNull(),
    description: text().notNull(),
    date: date().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    imageUrl: varchar({ length: 255 }),
})

// Upcoming events table
export const upcomingEvents = pgTable('upcoming_events', {
    id: uuid().defaultRandom().primaryKey(),
    name: text().notNull(),
    date: timestamp().notNull(),
    description: text().notNull(),
    location: text(),
    registrationLink: text(),
    createdAt: timestamp().defaultNow().notNull(),
    eventImageUrl: varchar({ length: 255 }),
})

// Blogs table
export const blogs = pgTable('blogs', {
    id: uuid().defaultRandom().primaryKey(),
    title: text().notNull(),
    author: text().notNull(),
    link: text().notNull(),
    publishDate: timestamp('publish_date').notNull(), // custom column name
    coverImage: text(),
    createdAt: timestamp().defaultNow().notNull(),
})
