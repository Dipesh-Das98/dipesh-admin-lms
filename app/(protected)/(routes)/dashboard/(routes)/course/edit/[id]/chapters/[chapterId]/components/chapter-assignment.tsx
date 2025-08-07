"use client";

import React from "react";
import Link from "next/link";
import { 
  Pencil, 
  FileQuestion, 
  CheckCircle, 
  Plus,
  BookOpen,
  Clock,
  Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Chapter } from "@/types";

interface ChapterAssignmentProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
}

const ChapterAssignment: React.FC<ChapterAssignmentProps> = ({
  initialData,
  courseId,
  chapterId,
}) => {
  const assignmentData = {
    isPublished: initialData.assignments?.isPublished || false,
    questionCount: initialData.assignments?.questions?.length || 0,
    hasAssignment: !!initialData.assignments,
    title: initialData.assignments?.title || "Quiz Assignment",
    type: initialData.assignments?.type || "QUIZ",
  };

  return (
    <Card className="mt-6 border-2 border-dashed border-muted-foreground/20 hover:border-muted-foreground/40 transition-colors duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Chapter Assignment</h3>
              <p className="text-sm text-muted-foreground">
                {assignmentData.hasAssignment 
                  ? "Manage your quiz assignment" 
                  : "Create an interactive quiz for this chapter"
                }
              </p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {assignmentData.hasAssignment ? (
          <div className="space-y-4">
            {/* Assignment Overview */}
            <div className="bg-muted/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Assignment Title</span>
                <span className="text-sm font-medium">{assignmentData.title}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Type</span>
                <Badge variant="outline" className="bg-background">
                  <Target className="w-3 h-3 mr-1" />
                  {assignmentData.type}
                </Badge>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Published Status */}
              <div className="bg-gradient-to-br from-background to-muted/20 rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Status
                  </span>
                  {assignmentData.isPublished ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-500" />
                  )}
                </div>
                <Badge
                  variant={assignmentData.isPublished ? "default" : "secondary"}
                  className={`w-full justify-center ${
                    assignmentData.isPublished 
                      ? "bg-green-500 hover:bg-green-600" 
                      : "bg-amber-500 hover:bg-amber-600"
                  }`}
                >
                  {assignmentData.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>

              {/* Number of Questions */}
              <div className="bg-gradient-to-br from-background to-muted/20 rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Questions
                  </span>
                  <FileQuestion className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-foreground">
                  {assignmentData.questionCount}
                </div>
                <p className="text-xs text-muted-foreground">
                  {assignmentData.questionCount === 1 ? "Question" : "Questions"} prepared
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2">
              <Button asChild className="w-full" size="sm">
                <Link
                  href={`/dashboard/course/edit/${courseId}/chapters/${chapterId}/assignment`}
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Manage Assignment
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                <FileQuestion className="w-8 h-8 text-muted-foreground" />
              </div>
              <h4 className="text-lg font-semibold mb-2">No Assignment Yet</h4>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
                Create an interactive quiz assignment to test your students&apos; understanding of this chapter content.
              </p>
            </div>
            
            <div className="space-y-3">
              <Button asChild size="default" className="w-full max-w-xs">
                <Link
                  href={`/dashboard/course/edit/${courseId}/chapters/${chapterId}/assignment`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Assignment
                </Link>
              </Button>
              
              <p className="text-xs text-muted-foreground">
                Add multiple-choice questions with explanations
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChapterAssignment;
