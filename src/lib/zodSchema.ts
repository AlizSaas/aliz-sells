import { description } from "@/components/sidebar/chart-area-interactive";
import {z,} from "zod";

export const courseLevels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;
export const courseStatuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED'] as const;
export const courseCategories = ['DEVELOPMENT', 'DESIGN', 'MARKETING', 'BUSINESS', 'PHOTOGRAPHY', 'MUSIC'] as const;

export const courseSchema = z.object({
  title: z.string().min(3, "Title should be at least 3 characters long").max(100, "Title should be at most 100 characters long"),
  description: z.string().min(3, {
    message: "Description should be at least 3 characters long",
  }),
  fileKey: z.string().min(1, { message: "File key is required" }),


  price: z.coerce.number().min(1), // price must be a number and at least 1
  duration: z.coerce.number().min(1),



  level: z.enum(courseLevels),
  category: z.enum(courseCategories,{
    message: 'category is required'
  }),
  smallDescription: z.string().min(3, {
    message: "Small description should be at least 3 characters long",
  }).max(200, {
    message: "Small description should be at most 200 characters long",
  }),
  slug: z.string().min(3, {
    message: "Slug should be at least 3 characters long",
  }),
  status: z.enum(courseStatuses),
});

export const chapterSchema = z.object({
name: z.string().min(3, {message:"Chapter name should be at least 3 characters long"}).max(100, "Chapter name should be at most 100 characters long"),
courseId:z.string().uuid({message:"Invalid course ID"}),










})
export const lessonSchema = z.object({
  name: z.string().min(3, {message:"Chapter name should be at least 3 characters long"}).max(100, "Chapter name should be at most 100 characters long"),
  courseId:z.string().uuid({message:"Invalid course ID"}),
  chapterId:z.string().uuid({message:"Invalid chapter ID"}),
  description: z.string().min(3).optional(),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
})

export type CourseSchemaType = z.infer<typeof courseSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;
