import { fetchCourseById, useCourseById } from "@/hooks/courses/useCourseById";
import { useRouter } from "next/router";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { ICourse, Module } from "@/interfaces/courses/course.interface";
import { Button } from "@/components/ui/button";
import { usePostUserLectureProgress } from "@/hooks/courses/usePostUserLectureProgress";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toPng } from "html-to-image";
import {
  fetchUserCourseProgress,
  useUserCourseProgress,
} from "@/hooks/courses/useUserCourseProgress";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import {
  fetchUserCourseVerifyCertificate,
  useUserCourseVerifyCertificate,
} from "@/hooks/courses/useUserCourseVerifyCertificate";

interface SidebarContentProps {
  lectureId: string;
  courseDetails: ICourse | undefined;
  userCourseProgress: Module[] | undefined;
  userCourseVerifyCertificate: boolean | undefined;
  setIsCourseCertificateActive: Dispatch<SetStateAction<boolean>>;
}

const SidebarContent = ({
  courseDetails,
  lectureId,
  userCourseProgress,
  userCourseVerifyCertificate,
  setIsCourseCertificateActive,
}: SidebarContentProps) => {
  return (
    <>
      <div className="p-5">
        <h3 className="text-lg font-medium">{courseDetails?.title}</h3>
        <Accordion type="multiple" className="w-full mt-8">
          {userCourseProgress?.map((module) => (
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
                    <div className="relative w-[1.5px] min-h-full bg-secondary-foreground">
                      <div
                        className={cn(
                          "absolute top-[50%] left-[50%] translate-y-[-50%] translate-x-[-50%] bg-secondary w-[12px] h-[12px] border-secondary-foreground border rounded-full",
                          lecture.isWatched
                            ? "bg-green-500 border-green-500"
                            : ""
                        )}
                      ></div>
                    </div>
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
          {userCourseVerifyCertificate && (
            <Button
              type="button"
              className="px-4 w-full py-8 font-bold text-sm sm:text-base gap-3 my-10"
              onClick={() => setIsCourseCertificateActive(true)}
            >
              <Icons.trophy className="h-6 w-6 flex-shrink-0" />
              Course Certificate
            </Button>
          )}
        </Accordion>
      </div>
    </>
  );
};

const LectureContent = ({
  dehydratedState,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [content, setContent] = useState("");
  const [isLectureWatched, setIsLectureWatched] = useState(false);
  const [previousLectureId, setPreviousLectureId] = useState("");
  const [nextLectureId, setNextLectureId] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [isCourseCertificateActive, setIsCourseCertificateActive] =
    useState(false);
  const [isCertificateDownloading, setIsCertificateDownloading] =
    useState(false);

  const elementRef = useRef<HTMLDivElement>(null);

  const session = useSession();

  const router = useRouter();

  const courseId = router.query.courseId as string;
  const lectureId = router.query.lectureId as string;

  const { data: courseDetails } = useCourseById(courseId);
  const { data: userCourseProgress, refetch: refetchUserCourseProgress } =
    useUserCourseProgress(courseId);
  const {
    data: userCourseVerifyCertificate,
    refetch: refetchUserCourseVerifyCertificate,
  } = useUserCourseVerifyCertificate(courseId);
  const { mutateAsync, isPending } = usePostUserLectureProgress();
  const [isRouteChanging, setIsRouteChanging] = useState(false);

  const handleNextLecture = async () => {
    setIsRouteChanging(true);
    if (!isLectureWatched) {
      try {
        await mutateAsync({ courseId, lectureId, moduleId });
        refetchUserCourseProgress();
        refetchUserCourseVerifyCertificate();
      } catch (error) {
        errorToast(error);
        return;
      }
    }

    await router.push(`/courses/${courseId}/${nextLectureId}`);
    setIsRouteChanging(false);
  };

  const handleMarkComplete = async () => {
    if (isLectureWatched) return;

    try {
      await mutateAsync({ courseId, lectureId, moduleId });
      refetchUserCourseProgress();
      refetchUserCourseVerifyCertificate();
    } catch (error) {
      errorToast(error);
      return;
    }
  };

  const handlePreviousLecture = async () => {
    setIsRouteChanging(true);
    await router.push(`/courses/${courseId}/${previousLectureId}`);
    setIsRouteChanging(false);
  };

  const htmlToImageConvert = () => {
    if (!elementRef.current) return;

    setIsCertificateDownloading(true);
    toPng(elementRef.current, { cacheBust: false })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `${courseDetails?.title} Course Certificate - Gufhtugu.png`;
        link.href = dataUrl;
        link.click();
        setIsCertificateDownloading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setIsCourseCertificateActive(false);
  }, [lectureId]);

  useEffect(() => {
    userCourseProgress?.find((module) =>
      module.lectures.find((lecture, idx) => {
        if (lecture.id === lectureId) {
          setContent(lecture.content);
          setIsLectureWatched(lecture.isWatched);
          setModuleId(module.id);
          setNextLectureId(module.lectures[idx + 1]?.id);
          setPreviousLectureId(module.lectures[idx - 1]?.id);
          return true;
        }
      })
    );
  }, [userCourseProgress, lectureId]);

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
            <SheetContent
              className="w-1/2 min-w-[200px] px-0 pt-10 pb-0"
              side={"left"}
            >
              <ScrollArea className="h-full flex flex-col overflow-hidden">
                <SidebarContent
                  courseDetails={courseDetails}
                  lectureId={lectureId}
                  userCourseVerifyCertificate={userCourseVerifyCertificate}
                  userCourseProgress={userCourseProgress}
                  setIsCourseCertificateActive={setIsCourseCertificateActive}
                />
              </ScrollArea>
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
              userCourseVerifyCertificate={userCourseVerifyCertificate}
              userCourseProgress={userCourseProgress}
              setIsCourseCertificateActive={setIsCourseCertificateActive}
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
            {isCourseCertificateActive ? (
              <div className="p-8">
                <div className="flex gap-3 items-center mb-8 sm:text-lg text-sm font-bold">
                  <Icons.trophy className="h-6 w-6 flex-shrink-0" />
                  <h3 className="uppercase">Course Certificate</h3>
                </div>

                <div
                  ref={elementRef}
                  className="relative overflow-hidden aspect-[1/1.3] sm:h-96 h-72"
                >
                  <Image
                    src="/certificate.png"
                    alt="Certificate"
                    className="h-full w-full"
                    width={400}
                    height={400}
                  />
                  <p className="absolute top-0 left-0 right-0 bottom-0 h-fit m-auto text-center sm:text-[8px] text-[6px] px-9">
                    {session.data?.user?.name}
                  </p>
                  <p className="absolute sm:top-32 top-28 left-0 right-0 bottom-0 h-fit m-auto text-center sm:text-[8px] text-[6px] px-9">
                    {courseDetails?.title}
                  </p>
                </div>
                <Button
                  type="button"
                  variant={"outline"}
                  disabled={isCertificateDownloading}
                  className="px-4 py-6 text-sm sm:text-base gap-3 my-10"
                  onClick={htmlToImageConvert}
                >
                  {isCertificateDownloading ? (
                    <Icons.spinner className="h-6 w-6 flex-shrink-0 animate-spin" />
                  ) : (
                    <Icons.download className="h-6 w-6 flex-shrink-0" />
                  )}
                  Download Certificate
                </Button>
              </div>
            ) : (
              <>
                <article
                  dangerouslySetInnerHTML={{
                    __html: content,
                  }}
                  className="prose prose-blue min-w-full pb-12 lecture-images-container"
                />
                <div className="flex justify-between items-center gap-4 px-6">
                  {previousLectureId && (
                    <Button
                      type="button"
                      disabled={isRouteChanging}
                      className="px-4 py-2 gap-2"
                      onClick={handlePreviousLecture}
                    >
                      {isRouteChanging ? (
                        <Icons.spinner className="h-6 w-6 flex-shrink-0 animate-spin" />
                      ) : (
                        <Icons.arrowRight className="h-6 w-6 rotate-180 flex-shrink-0" />
                      )}
                      Back
                    </Button>
                  )}
                  {nextLectureId ? (
                    <Button
                      type="button"
                      disabled={isRouteChanging}
                      className="px-4 py-2 gap-2 ml-auto"
                      onClick={handleNextLecture}
                    >
                      Next
                      {isRouteChanging ? (
                        <Icons.spinner className="h-6 w-6 flex-shrink-0 animate-spin" />
                      ) : (
                        <Icons.arrowRight className="h-6 w-6 flex-shrink-0" />
                      )}
                    </Button>
                  ) : (
                    !isLectureWatched && (
                      <Button
                        type="button"
                        variant={"outline"}
                        disabled={isPending}
                        className="px-4 py-2 gap-2 ml-auto text-xs sm:text-sm"
                        onClick={handleMarkComplete}
                      >
                        {isPending ? (
                          <Icons.spinner className="h-5 w-5 flex-shrink-0 animate-spin" />
                        ) : (
                          <Icons.checkMark className="h-5 w-5 flex-shrink-0" />
                        )}
                        Mark as complete
                      </Button>
                    )
                  )}
                </div>
              </>
            )}
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

  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  await queryClient.prefetchQuery({
    ...queryKeys.courses.userCourseProgress(courseId as string),
    queryFn: ({ signal }) =>
      fetchUserCourseProgress(courseId as string, session.accessToken, signal),
  });

  await queryClient.prefetchQuery({
    ...queryKeys.courses.detail(courseId as string),
    queryFn: ({ signal }) => fetchCourseById(courseId as string, signal),
  });

  await queryClient.prefetchQuery({
    ...queryKeys.courses.userCourseVerifyCertificate(courseId as string),
    queryFn: ({ signal }) =>
      fetchUserCourseVerifyCertificate(
        courseId as string,
        session.accessToken,
        signal
      ),
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}) satisfies GetServerSideProps<{
  dehydratedState: DehydratedState;
}>;
