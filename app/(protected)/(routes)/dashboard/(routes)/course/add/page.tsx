import React from "react";
import { ContentLayout } from "@/components/dashboard-panel/content-layout";
import { BookOpen } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateCourseWrapper from "./compnents/create-course-wrapper";

const CreateCoursePage = () => {
  return (
    <ContentLayout
      breadcrumbItems={[
        { label: "Dashboard", href: "/dashboard" },
        { label: "Courses", href: "/dashboard/course" },
        { label: "Create Course" },
      ]}
      className="space-y-6"
    >
      <div>
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Create New Course</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Fill in the details below to create a new course. All fields marked
          with an asterisk (*) are required.
        </p>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        {/* Main Content Area */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
            <CardDescription>
              Provide the essential details about your course
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/*---------------------------------------create course wrapper---------------------------------------*/}
            <CreateCourseWrapper />
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Creation Checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Course Title</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Course Category</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <span>Course Grade</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </ContentLayout>
  );
};

export default CreateCoursePage;
