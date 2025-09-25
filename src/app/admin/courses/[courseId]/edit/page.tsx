import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminGetCourse } from "@/data/admin/admin-get-course";
import { TabsContent } from "@radix-ui/react-tabs";
import EditCourseForm from "./_components/edit-course-form";
import CourseStructure from "./_components/course-structure";

type Params = Promise<{courseId: string}>
export default async function EditCoursePage({ params }: { params: Params }) {
    const { courseId } =  await params;
    const data = await adminGetCourse(courseId)


    return <div>
        <h1 className="text-3xl font-bold mb-4">
            Edit Course <span className="text-primary underline">
                {data.title}
            </span>
        </h1>
        <Tabs defaultValue={'course-structure'} className="w-full">
            <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value={'basic-info'}>Basic Info</TabsTrigger>
                <TabsTrigger value={'course-structure'}>Course Structure</TabsTrigger>

               
            </TabsList>
            <TabsContent value={'basic-info'} className="mt-4">
                <Card>
                <CardTitle> 
                    Basic Info
                </CardTitle>
                <CardDescription>
                    Edit basic info about the course

                </CardDescription>
                <CardContent>
                    <EditCourseForm data={data} />
                </CardContent>
                
                </Card>
            </TabsContent>
            <TabsContent value={'course-structure'} className="mt-4">
                <Card>
                <CardTitle> 
                    Course Structure
                </CardTitle>
                <CardDescription>
                    Edit the structure of the course
                </CardDescription>
                <CardContent>
             <CourseStructure data={data} />
                </CardContent>
                </Card>
            </TabsContent>

            



        </Tabs>
    </div>;
}

