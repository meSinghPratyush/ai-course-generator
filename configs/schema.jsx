import { pgTable, serial, varchar, json, integer, boolean } from 'drizzle-orm/pg-core';

export const CourseList=pgTable('courseList',{
    id:serial('id').primaryKey(),
    courseId:varchar('courseId').notNull(),
    name:varchar('name').notNull(),
    category:varchar('category').notNull(),
    level:varchar('level').notNull(),
    includeVideo:varchar('includeVideo').notNull().default('Yes'),
    courseOutput:json('courseOutput').notNull(),
    createdBy:varchar('createdBy').notNull(),
    userName:varchar('userName'),
    userProfileImage:varchar('userProfileImage'),
    courseBanner:varchar('courseBanner').default('/online-lesson.png'),
    publish:boolean('publish').default(false)
})

export const ChapterContent=pgTable('chapterContent',{
    id:serial('id').primaryKey(),
    courseId:varchar('courseId').notNull(),
    chapterIndex:integer('chapterIndex').notNull(),
    content:json('content').notNull(),
    videoId:varchar('videoId').default('')
})

export const UserQuizResult = pgTable('userQuizResult', {
    id: serial('id').primaryKey(),
    courseId: varchar('courseId').notNull(),
    chapterIndex: integer('chapterIndex').notNull(),
    userEmail: varchar('userEmail').notNull(),
    score: integer('score').notNull(),
    passed: boolean('passed').notNull().default(false)
})

export const User = pgTable('user', {
    id: serial('id').primaryKey(),
    name: varchar('name').notNull(),
    email: varchar('email').notNull().unique(),
    imageUrl: varchar('imageUrl'),
    credits: integer('credits').notNull().default(5)
})