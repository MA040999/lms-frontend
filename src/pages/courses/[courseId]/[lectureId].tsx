import { fetchCourseById, useCourseById } from "@/hooks/courses/useCourseById";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import {
  dehydrate,
  DehydratedState,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeyFactory";
import Link from "next/link";
import { Icons } from "@/components/ui/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const LectureContent = ({
  dehydratedState,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [content, setContent] = useState("");
  const router = useRouter();

  const courseId = router.query.courseId as string;
  const lectureId = router.query.lectureId as string;

  const { data: courseDetails } = useCourseById(courseId);

  useEffect(() => {
    courseDetails?.modules.find((module) =>
      module.lectures.find((lecture) => {
        if (lecture.id === lectureId) {
          setContent(lecture.content);
          return true;
        }
      })
    );
  }, [courseDetails]);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="grid grid-cols-[0.3fr_1fr] grid-rows-[0fr_1fr] min-h-screen w-screen">
        <div className="sticky top-0 h-16 z-10 col-start-1 col-end-3 flex gap-6 md:gap-10 px-10 py-4 border-b bg-background">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-6 w-6 text-primary" />
          </Link>
        </div>
        <aside
          className={`h-[calc(100vh-4rem)] w-full sticky top-16 left-0 bg-secondary col-start-1 row-start-2 z-20 border-r overscroll-y-contain`}
          aria-label="Sidebar"
        >
          <ScrollArea className="h-full flex flex-col overflow-hidden">
            <Link
              className="flex border-b p-5 items-center hover:bg-secondary-foreground/10 text-sm font-medium transition-colors"
              href={`/courses/${courseId}`}
            >
              <Icons.arrowRight className="mr-3 h-10 w-10 md:h-5 md:w-5 rotate-180" />
              Back to Course Home
            </Link>
            <div className="p-5">
              <h3 className="text-lg font-medium">{courseDetails?.title}</h3>
              <Accordion type="multiple" className="w-full mt-8">
                {courseDetails?.modules.map((module) => (
                  <AccordionItem
                    key={module.id}
                    value={module.id}
                    className="py-2 border-none"
                  >
                    <AccordionTrigger className="hover:no-underline rounded-md gap-2">
                      <div className="flex flex-col items-start gap-2">
                        <p className="text-base text-left">{module.title}</p>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {module.lectures.map((lecture) => (
                        <div
                          key={lecture.id}
                          className="flex gap-1 w-full ml-2"
                        >
                          <div className="w-[1.5px] min-h-full bg-secondary-foreground"></div>
                          <Link
                            key={lecture.id}
                            className={cn(
                              "flex flex-1 ml-1 mr-7 py-2 rounded-md",
                              lecture.id === lectureId &&
                                "bg-secondary-foreground/10"
                            )}
                            href={`/courses/${module.courseId}/${lecture.id}`}
                          >
                            <p className="pl-4 pr-2">{lecture.title}</p>
                          </Link>
                        </div>
                      ))}
                      <div className="flex gap-1 w-full ml-2">
                        <div className="w-[1.5px] min-h-full bg-secondary-foreground"></div>
                        <Link
                          className={cn(
                            "flex flex-1 ml-1 mr-7 py-2 rounded-md"
                          )}
                          href={`/quizzes/${module.courseId}/${module.id}`}
                        >
                          <p className="pl-4 pr-2 text-primary font-bold">Quiz</p>
                        </Link>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </ScrollArea>
        </aside>
        <article dangerouslySetInnerHTML={{__html: content}} className="prose prose-blue p-10"/>
      </div>
    </HydrationBoundary>
  );
};

export default LectureContent;

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
