'use client';

import { useTRPC} from '@/trpc/client';

import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { toast } from 'sonner';


export const useSuspenseCourse = (id:string) => {
    const trpc = useTRPC()
    return useSuspenseQuery(trpc.adminRoutes.getAdminCourse.queryOptions({id}))
} //a hook to fetch single course using suspense

export type CourseDataType = ReturnType<typeof useSuspenseCourse>['data']

export const useSuspenseLesson = (id:string) => {
    const trpc = useTRPC()
    return useSuspenseQuery(trpc.adminRoutes.getAdminLesson.queryOptions({id}))
} //a hook to fetch single lesson using suspense


export const useUpdateCourseLesson = () => {
    const queryClient = useQueryClient()
    const trpc = useTRPC()
    return useMutation(
        trpc.adminRoutes.updateCourseLesson.mutationOptions({
            onSuccess:(data) => {
                toast.success(`${data.title} Lessons updated successfully`)
                  queryClient.invalidateQueries(trpc.adminRoutes.getAdminLesson.queryOptions({id:data.id})) // invalidate the id query to refetch
                  queryClient.invalidateQueries(trpc.adminRoutes.getAdminCourse.queryOptions({id:data.chapterId})) // invalidate the course chapter that has the lesson

            },
            onError:(error) => {
                toast.error(`Error updating lesson: ${error.message}`)
            },
            
            

        })
    )
}


export const useSuspenseCourses = () => {
    const trpc = useTRPC()
    return useSuspenseQuery(trpc.adminRoutes.getAdminCourses.queryOptions())
}

export const useSuspenseDashboardData = () => {
    const trpc = useTRPC()
    return useSuspenseQuery(trpc.adminRoutes.getAdminDashboardData.queryOptions())
}
export const useSuspenseDashboardStats = () => {
    const trpc = useTRPC()
    return useSuspenseQuery(trpc.adminRoutes.getEnrollmentStats.queryOptions())
}
export const useAdminGetRecentCourses = () => {
    const trpc = useTRPC()
    return useSuspenseQuery(trpc.adminRoutes.getRecentCourses.queryOptions())
}

export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  
  return useMutation(
    trpc.adminRoutes.createCourse.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Course "${data.title}" created successfully`);
        // Invalidate courses list query to refresh the data
        queryClient.invalidateQueries(trpc.adminRoutes.getAdminCourses.queryOptions());
        // Invalidate recent courses query
        queryClient.invalidateQueries(trpc.adminRoutes.getRecentCourses.queryOptions());
        // Invalidate dashboard data which might include course counts
        queryClient.invalidateQueries(trpc.adminRoutes.getAdminDashboardData.queryOptions());
      },
      onError: (error) => {
        toast.error(`Error creating course: ${error.message}`);
      }
    })
  );
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  return useMutation(
    trpc.adminRoutes.deleteCourse.mutationOptions({
      onSuccess: () => {
        toast.success(`Course deleted successfully`);
        // Invalidate courses list query to refresh the data
        queryClient.invalidateQueries(trpc.adminRoutes.getAdminCourses.queryOptions());
        // Invalidate recent courses query
        queryClient.invalidateQueries(trpc.adminRoutes.getRecentCourses.queryOptions());
        // Invalidate dashboard data which might include course counts
        queryClient.invalidateQueries(trpc.adminRoutes.getAdminDashboardData.queryOptions());
      },
      onError: (error) => {
        toast.error(`Error deleting course: ${error.message}`);
      }
    })
  );
}

export const useEditCourse = () => {
    const queryClient = useQueryClient()
    const trpc = useTRPC()

    return useMutation(
        trpc.adminRoutes.updateCourse.mutationOptions({
            onSuccess:(data) => {
                toast.success(`Course "${data.title}" updated successfully`)
                  queryClient.invalidateQueries(trpc.adminRoutes.getAdminCourse.queryOptions({id:data.id})) // invalidate the id query to refetch
                  queryClient.invalidateQueries(trpc.adminRoutes.getAdminCourses.queryOptions()) // invalidate the courses list
                  queryClient.invalidateQueries(trpc.adminRoutes.getRecentCourses.queryOptions()) // invalidate recent courses
                
            },
            onError:(error) => {
                toast.error(`Error updating course: ${error.message}`)
            },
        })
    )
}

export const useCreateChapter = () => {
    const queryClient = useQueryClient()
    const trpc = useTRPC()
    return useMutation(
        trpc.adminRoutes.createNewChapter.mutationOptions({
            onSuccess:(data) => {
                toast.success(`Chapter ${data.title} created successfully`)
                  queryClient.invalidateQueries(trpc.adminRoutes.getAdminCourse.queryOptions({id:data.courseId})) // invalidate the course query to refetch chapters
            },
            onError:(error) => {
                toast.error(`Error creating chapter: ${error.message}`)
            },
        })
    )
}

export const useCreateLesson = () => {
    const queryClient = useQueryClient()
    const trpc = useTRPC()
    return useMutation(
        trpc.adminRoutes.createNewLesson.mutationOptions({
            onSuccess:(data) => {
                toast.success(`Lesson ${data.title} created successfully`)
                  queryClient.invalidateQueries(trpc.adminRoutes.getAdminCourse.queryOptions({id:data.courseId})) // invalidate the course query to refetch lessons
            }
        })
    )
}

export const useDeleteLesson = () => {
    const queryClient = useQueryClient()
    const trpc = useTRPC()
    return useMutation(
        trpc.adminRoutes.deleteLesson.mutationOptions({
            onSuccess:(data) => {
                toast.success(`Lesson deleted successfully`)
                queryClient.invalidateQueries(trpc.adminRoutes.getAdminCourse.queryOptions({id:data.courseId})) // invalidate the course query to refetch lessons
            },
            onError:(error) => {
                toast.error(`Error deleting lesson: ${error.message}`)
            }
        })
    )
}

export const useDeleteChapter = () => {
      const queryClient = useQueryClient()
    const trpc = useTRPC()
    return useMutation(
        trpc.adminRoutes.deleteChapter.mutationOptions({
            onSuccess:(data) => {
                toast.success(`Chapter deleted successfully`)
                queryClient.invalidateQueries(trpc.adminRoutes.getAdminCourse.queryOptions({id:data.courseId})) // invalidate the course query to refetch chapters
            },
            onError:(error) => {
                toast.error(`Error deleting chapter: ${error.message}`)
            }
        })
    )

}

export const useReorderLessons = () => {
    const queryClient = useQueryClient()
    const trpc = useTRPC()
    return useMutation(
        trpc.adminRoutes.reOrderLessons.mutationOptions({
            onSuccess:(data) => {
                toast.success(`Lessons reordered successfully`)
                queryClient.invalidateQueries(trpc.adminRoutes.getAdminCourse.queryOptions({id:data.courseId})) // invalidate the course query to refetch lessons
            },
            onError:(error) => {
                toast.error(`Error reordering lessons: ${error.message}`)
            }
        })
    )
}
export const useReorderChapters = () => {
    const queryClient = useQueryClient()
    const trpc = useTRPC()  
    return useMutation(
        trpc.adminRoutes.reOrderChapters.mutationOptions({
            onSuccess:(data) => {
                toast.success(`Chapters reordered successfully`)
                queryClient.invalidateQueries(trpc.adminRoutes.getAdminCourse.queryOptions({id:data.courseId})) // invalidate the course query to refetch chapters
            },
            onError:(error) => {
                toast.error(`Error reordering chapters: ${error.message}`)
            }
        })
    )
}