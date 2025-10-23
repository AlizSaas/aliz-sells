import { prefetch,trpc } from "@/trpc/server";


export const prefetchSingleCourse = async (id: string) => {
    return prefetch(trpc.adminRoutes.getAdminCourse.queryOptions({id}))

} 


export const prefetchCourseLesson = async (id: string) => {
    return prefetch(trpc.adminRoutes.getAdminLesson.queryOptions({id}))
}

export const prefetchAllCourses = async () => {
    return prefetch(trpc.adminRoutes.getAdminCourses.queryOptions())
}

export const prefetchDashboardData = async () => {
    console.log("Prefetching dashboard data")
    return prefetch(trpc.adminRoutes.getAdminDashboardData.queryOptions())
}
export const prefetchEnrollmentStats = async () => {
    console.log("Prefetching enrollment stats")
    return prefetch(trpc.adminRoutes.getEnrollmentStats.queryOptions())
}
export const prefetchRecentCourses = async () => {
    console.log("Prefetching recent courses")
    return prefetch(trpc.adminRoutes.getRecentCourses.queryOptions())
}


