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
import { cn, errorToast } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ICourse } from "@/interfaces/courses/course.interface";
import { Button } from "@/components/ui/button";
import { usePostUserLectureProgress } from "@/hooks/courses/usePostUserLectureProgress";

interface SidebarContentProps {
  lectureId: string;
  courseDetails: ICourse | undefined;
}

const SidebarContent = ({ courseDetails, lectureId }: SidebarContentProps) => {
  return (
    <>
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
                  <div key={lecture.id} className="flex gap-1 w-full ml-2">
                    <div className="w-[1.5px] min-h-full bg-secondary-foreground"></div>
                    <Link
                      key={lecture.id}
                      className={cn(
                        "flex flex-1 ml-1 mr-7 py-2 rounded-md",
                        lecture.id === lectureId && "bg-secondary-foreground/10"
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
                    className={cn("flex flex-1 ml-1 mr-7 py-2 rounded-md")}
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
    </>
  );
};

const LectureContent = ({
  dehydratedState,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [content, setContent] = useState("");
  const [previousLectureId, setPreviousLectureId] = useState("");
  const [nextLectureId, setNextLectureId] = useState("");
  const [moduleId, setModuleId] = useState("");

  const router = useRouter();

  const courseId = router.query.courseId as string;
  const lectureId = router.query.lectureId as string;

  const { data: courseDetails } = useCourseById(courseId);
  const { mutateAsync, isPending } = usePostUserLectureProgress();

  const handleNextLecture = async () => {
    try {
      await mutateAsync({ courseId, lectureId, moduleId });
    } catch (error) {
      errorToast(error);
      return;
    }

    router.push(`/courses/${courseId}/${nextLectureId}`);
  };

  const handlePreviousLecture = async () => {
    router.push(`/courses/${courseId}/${previousLectureId}`);
  };

  useEffect(() => {
    courseDetails?.modules.find((module) =>
      module.lectures.find((lecture, idx) => {
        if (lecture.id === lectureId) {
          setContent(lecture.content);
          setModuleId(module.id);
          setNextLectureId(module.lectures[idx + 1]?.id);
          setPreviousLectureId(module.lectures[idx - 1]?.id);
          return true;
        }
      })
    );
  }, [courseDetails, lectureId]);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="grid grid-cols-[0.3fr_1fr] grid-rows-[0fr_1fr] min-h-screen w-screen">
        <div className="sticky top-0 h-16 z-10 col-start-1 col-end-3 flex gap-6 md:gap-10 px-5 py-4 border-b bg-background">
          <Sheet>
            <SheetTrigger className="md:hidden" asChild>
              <Button
                variant="ghost"
                size={"icon"}
                className="h-full rounded-sm"
              >
                <Icons.menuIcon className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-1/2 min-w-[200px] px-2" side={"left"}>
              <SidebarContent
                courseDetails={courseDetails}
                lectureId={lectureId}
              />
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center space-x-2 md:pl-6">
            <Icons.logo className="h-6 w-6 text-primary" />
          </Link>
        </div>
        <aside
          className={`hidden md:block h-[calc(100vh-4rem)] w-full sticky top-16 left-0 bg-secondary col-start-1 row-start-2 z-20 border-r overscroll-y-contain`}
          aria-label="Sidebar"
        >
          <ScrollArea className="h-full flex flex-col overflow-hidden">
            <Link
              className="flex border-b p-5 items-center hover:bg-secondary-foreground/10 text-sm font-medium transition-colors"
              href={`/courses/${courseId}`}
            >
              <Icons.arrowRight className="mr-3 h-6 w-6 rotate-180 flex-shrink-0" />
              Back to Course Home
            </Link>
            <SidebarContent
              courseDetails={courseDetails}
              lectureId={lectureId}
            />
          </ScrollArea>
        </aside>
        <div className="col-span-3 md:col-span-1">
          <Link
            className="md:hidden flex border-b p-5 py-3 items-center hover:bg-secondary-foreground/10 text-sm font-medium transition-colors"
            href={`/courses/${courseId}`}
          >
            <Icons.arrowRight className="mr-3 h-6 w-6 rotate-180 flex-shrink-0" />
            Back to Course Home
          </Link>
          <div className="pb-28">
            <article
              dangerouslySetInnerHTML={{
                __html: content,
              }}
              className="prose prose-blue p-6 pb-12"
            />
            <div className="flex justify-between items-center gap-4 px-6">
              {previousLectureId && (
                <Button
                  type="button"
                  disabled={isPending}
                  className="px-4 py-2 gap-2"
                  onClick={handlePreviousLecture}
                >
                  <Icons.arrowRight className="h-6 w-6 rotate-180 flex-shrink-0" />
                  Back
                </Button>
              )}
              {nextLectureId && (
                <Button
                  type="button"
                  disabled={isPending}
                  className="px-4 py-2 gap-2 ml-auto"
                  onClick={handleNextLecture}
                >
                  Next
                  {isPending ? (
                    <Icons.spinner className="h-6 w-6 flex-shrink-0 animate-spin" />
                  ) : (
                    <Icons.arrowRight className="h-6 w-6 flex-shrink-0" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
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
