import React, { useEffect, useState } from "react";
import {
  dehydrate,
  DehydratedState,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeyFactory";
import {
  fetchQuizByModuleId,
  useQuizByModuleId,
} from "@/hooks/quizzes/useQuizByModuleId";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import Link from "next/link";
import { Icons } from "@/components/ui/icons";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Question } from "@/interfaces/quizzes/quiz.interface";
import { fetchCourseById, useCourseById } from "@/hooks/courses/useCourseById";
import { Module } from "@/interfaces/courses/course.interface";

const FormSchema = z.object({
  answer: z.string(),
});

type OptionsStatus = {
  questions: Pick<Question, "options">[];
};

const ModuleQuiz = ({
  dehydratedState,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [optionsStatus, setOptionsStatus] = useState<OptionsStatus>();
  const [module, setModule] = useState<Module>();

  const moduleId = router.query.moduleId as string;
  const courseId = router.query.courseId as string;

  const { data: quiz } = useQuizByModuleId(moduleId);
  const { data: courseDetails } = useCourseById(courseId);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    quiz?.questions[currentIndex].options.find((option) => {
      if (option.text === data.answer) {
        optionsStatus?.questions[currentIndex].options.push({
          ...option,
        });
        return option;
      }
    });
  }

  const handleNextQuestion = () => {
    setCurrentIndex(currentIndex + 1);
    form.reset();
  };

  const handlePrevQuestion = () => {
    setCurrentIndex(currentIndex - 1);
    form.reset();
  };

  useEffect(() => {
    if (!quiz) return;

    setOptionsStatus({
      questions: quiz?.questions.map(() => ({
        options: [],
      })),
    });
  }, [quiz]);

  useEffect(() => {
    setModule(courseDetails?.modules.find((module) => module.id === moduleId));
  }, [courseDetails, moduleId]);

  return (
    <HydrationBoundary state={dehydratedState}>
      <div className="grid grid-cols-1 grid-rows-[0fr_1fr] min-h-screen w-screen">
        <div className="sticky top-0 h-16 z-10 col-start-1 col-end-2 flex justify-between gap-6 md:gap-10 px-10 py-4 border-b bg-background">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.logo className="h-6 w-6 text-primary" />
          </Link>
          <Link
            href={`/courses/${courseDetails?.id}/${
              module?.lectures[module.lectures.length - 1]?.id
            }`}
            className="flex items-center space-x-2 font-medium text-lg"
          >
            Exit
          </Link>
        </div>
        <div className="flex flex-col items-center gap-6 p-4 sm:p-10">
          {!quiz ? (
            <h1 className="text-2xl text-center font-bold">
              No Quiz Available for{" "}
              <span className="urdu leading-[initial]">{module?.title}</span>
            </h1>
          ) : (
            <>
              <h1 className="text-2xl text-center font-bold">
                Quiz on{" "}
                <span className="urdu leading-[initial]">{module?.title}</span>
              </h1>
              <Card className="overflow-hidden w-full">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <span className="min-w-[2.5rem] flex items-center justify-center h-10 bg-primary text-primary-foreground rounded-sm border">
                          {currentIndex + 1}
                        </span>
                        <p className="urdu leading-[initial]">
                          {quiz?.questions[currentIndex].question}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <FormField
                        control={form.control}
                        name="answer"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                className="space-y-4 flex flex-col"
                              >
                                {quiz?.questions[currentIndex].options.map(
                                  (option, idx) => {
                                    const currentOptionStatus =
                                      optionsStatus?.questions[
                                        currentIndex
                                      ].options.find(
                                        (optionStatus) =>
                                          optionStatus.text === option.text
                                      )?.correct;

                                    const correctOption =
                                      optionsStatus?.questions[
                                        currentIndex
                                      ].options.find(
                                        (optionStatus) => optionStatus.correct
                                      );
                                    return (
                                      <FormItem
                                        key={idx}
                                        className="flex items-center space-x-2"
                                      >
                                        <FormControl>
                                          <RadioGroupItem
                                            value={option.text}
                                            id={"r" + idx}
                                            disabled={
                                              (correctOption &&
                                                option.text !==
                                                  correctOption.text) ||
                                              currentOptionStatus === false
                                            }
                                          >
                                            <div className="min-h-[2rem] grid grid-cols-[1fr_0.05fr] justify-between gap-9 items-center">
                                              <FormLabel className="[overflow-wrap:_anywhere] urdu leading-[initial]">
                                                {option.text}
                                              </FormLabel>
                                              {currentOptionStatus ===
                                                false && (
                                                <Icons.crossFilled className="text-red-500 justify-self-end w-8 h-8" />
                                              )}
                                              {currentOptionStatus === true && (
                                                <Icons.checkBadge className="text-green-500 justify-self-end w-8 h-8" />
                                              )}
                                            </div>
                                          </RadioGroupItem>
                                        </FormControl>
                                      </FormItem>
                                    );
                                  }
                                )}
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter className="flex flex-col gap-6 justify-between pt-4 sm:flex-row">
                      <div className="flex items-center gap-4">
                        <Button
                          type="button"
                          variant={"outline"}
                          size={"icon"}
                          disabled={currentIndex === 0}
                          onClick={handlePrevQuestion}
                        >
                          <Icons.arrowRight className="h-4 w-4 sm:w-5 sm:h-5 rotate-180" />
                        </Button>
                        <span className="text-sm text-center">
                          Question {currentIndex + 1} of{" "}
                          {quiz?.questions.length}
                        </span>
                        <Button
                          type="button"
                          variant={"outline"}
                          size={"icon"}
                          disabled={currentIndex + 1 === quiz?.questions.length}
                          onClick={handleNextQuestion}
                        >
                          <Icons.arrowRight className="h-4 w-4 sm:w-5 sm:h-5" />
                        </Button>
                      </div>
                      <Button
                        type="submit"
                        disabled={
                          !form.getValues("answer") ||
                          optionsStatus?.questions[currentIndex].options.some(
                            (option) => option.correct
                          )
                        }
                      >
                        Submit Answer
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </>
          )}
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default ModuleQuiz;

export const getServerSideProps = (async (context) => {
  const queryClient = new QueryClient();

  const moduleId = context.query.moduleId;
  const courseId = context.query.courseId;

  await queryClient.prefetchQuery({
    ...queryKeys.quizzes.module(moduleId as string),
    queryFn: ({ signal }) => fetchQuizByModuleId(moduleId as string, signal),
  });

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
