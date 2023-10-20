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

export default function Home() {
  const session = useSession();

  const handleCourseClick = () => {};

  return (
    <div className="flex flex-col items-center pt-8">
      <h2 className="text-2xl font-medium">
        Greetings, {session.data?.user?.name}!
      </h2>
      <Tabs defaultValue="all" className="w-full px-4 pt-10">
        <TabsList className="grid grid-cols-2 w-[400px] mx-auto">
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="enrolled">Enrolled Courses</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <Card className="w-[350px] overflow-hidden">
            <CardHeader className="relative h-36">
              <Image
                alt="asdasd"
                src={"/logo.svg"}
                width={100}
                height={100}
                className="w-full absolute top-0 left-0 h-full"
              />
            </CardHeader>
            <CardContent className="pt-6">
              <CardTitle>
                Data Structures with Generic Types in Python
              </CardTitle>
            </CardContent>
            <CardFooter className="flex justify-between pt-4">
              <span>BEGINNER</span>
              <Button
                onClick={() => handleCourseClick()}
                variant="outline"
                type="button"
                className="text-base"
              >
                Get Started
                <Icons.arrowRight className="ml-3 h-6 w-6" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="enrolled">wadadnakjsndkja</TabsContent>
      </Tabs>
    </div>
  );
}
