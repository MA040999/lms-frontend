import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { fetchCourseById, useCourseById } from "@/hooks/courses/useCourseById";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import {
  dehydrate,
  DehydratedState,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeyFactory";
import Link from "next/link";

const Course = ({
  dehydratedState,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const courseId = router.query.courseId as string;

  const { data: courseDetails } = useCourseById(courseId);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="flex flex-col">
        <div className="bg-primary flex min-h-[300px] justify-center gap-4 p-8 text-primary-foreground">
          {courseDetails && (
            <div className="flex w-full flex-col gap-5 justify-center">
              <Image
                alt={`${courseDetails.title} course cover`}
                src={courseDetails.imageURL}
                width={200}
                height={100}
                className="rounded-lg aspect-[2/1]"
              />
              <h1 className="text-4xl font-bold">{courseDetails.title}</h1>
              <div className="pt-6 flex justify-between items-center gap-4 flex-wrap">
                <span>{courseDetails.level}</span>
                <Button
                  variant="secondary"
                  size={"lg"}
                  type="button"
                  className="text-base"
                >
                  Start Course
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="bg-primary/10 min-h-[100px] p-8 text-secondary-foreground">
          <h3 className="text-2xl font-medium">Takeaway Skills</h3>
          <div className="sm:grid sm:grid-cols-2 flex flex-col w-full gap-6 pt-6">
            {courseDetails?.takeaways.map((takeaway, idx) => (
              <div key={idx} className="flex gap-2">
                <Icons.checkMark className="text-primary w-6 h-6" />
                <p className="w-full">{takeaway}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="p-8">
          <h3 className="text-2xl font-medium">Course Overview</h3>
          <p className="pt-6">{courseDetails?.synopsis}</p>
        </div>
        <div className="p-8">
          <h3 className="text-2xl font-medium">Course Content</h3>
          <Accordion type="multiple" className="w-full">
            {courseDetails?.modules.map((module, idx) => (
              <AccordionItem key={module.id} value={module.id} className="py-4">
                <AccordionTrigger className="hover:no-underline hover:bg-secondary p-4 rounded-md">
                  <div className="flex gap-4">
                    <span className="w-6 flex items-center justify-center h-6 rounded-sm border">
                      {idx + 1}
                    </span>
                    <div className="flex flex-col items-start gap-2">
                      <p className="text-base">{module.title}</p>
                      <p className="text-sm font-thin">
                        {module._count.lectures} Lectures
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {module.lectures.map((lecture) => (
                    <div key={lecture.id} className="flex gap-1 w-full ml-7">
                      <div className="w-[1.5px] min-h-full bg-secondary-foreground"></div>
                      <Link
                        key={lecture.id}
                        className="flex flex-1 ml-3 mr-7 py-4 hover:bg-secondary rounded-md"
                        href={`/courses/${module.courseId}/${lecture.id}`}
                      >
                        <p className="pl-4 underline">{lecture.title}</p>
                      </Link>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default Course;

export const getServerSideProps = (async (context) => {
  const queryClient = new QueryClient();

  const courseId = context.query.courseId;

  await queryClient.prefetchQuery({
    ...queryKeys.courses.detail(courseId as string),
    queryFn: ({ signal }) => fetchCourseById(courseId as string, signal),
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}) satisfies GetServerSideProps<{
  dehydratedState: DehydratedState;
}>;
