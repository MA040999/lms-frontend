import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Icons } from "@/components/ui/icons";
import { useCourses } from "@/hooks/courses/useCourses";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const session = useSession();

  const { data: courses, isLoading } = useCourses();

  return (
    <div className="flex flex-col items-center pt-8 max-h-full">
      <h2 className="text-2xl font-medium">
        Greetings, {session.data?.user?.name}!
      </h2>
      <Tabs defaultValue="all" className="w-full px-4 pt-10">
        <TabsList className="grid grid-cols-2 w-[400px] mx-auto">
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
        </TabsList>
        <TabsContent
          className="py-8 grid auto-rows-min justify-center items-center grid-cols-[repeat(auto-fit,_minmax(350px,_0.2fr))] gap-x-8 gap-y-12"
          value="all"
        >
          {isLoading
            ? Array.from(Array(5)).map((_, idx) => {
                return (
                  <Skeleton
                    key={idx}
                    className="flex flex-col space-x-4 w-[350px]"
                  >
                    <Skeleton className="h-36 w-full" />
                    <Skeleton className="h-4 w-[250px] mt-6" />
                    <div className="flex pr-4 mt-6">
                      <Skeleton className="h-4 w-[100px] mt-6" />
                      <Skeleton className="h-10 w-[150px] my-6 ml-auto" />
                    </div>
                  </Skeleton>
                );
              })
            : courses?.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.id}`}
                  className="w-[350px]"
                >
                  <Card key={course.id} className="overflow-hidden w-full">
                    <CardHeader className="relative h-36">
                      <Image
                        alt={`${course.title} course cover`}
                        src={course.imageURL}
                        width={200}
                        height={200}
                        className="w-full absolute top-0 left-0 h-full object-cover"
                      />
                    </CardHeader>
                    <CardContent className="pt-6">
                      <CardTitle>{course.title}</CardTitle>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-4">
                      <span>{course.level}</span>
                      <Button
                        variant="outline"
                        type="button"
                        className="text-base"
                      >
                        Get Started
                        <Icons.arrowRight className="ml-3 h-6 w-6" />
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
        </TabsContent>
        <TabsContent value="enrolled"></TabsContent>
      </Tabs>
    </div>
  );
}
