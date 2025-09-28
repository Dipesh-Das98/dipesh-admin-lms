import React from "react";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface DashboardPageHeaderProps {
  title: string;
  href: string;
  type: "game" | "music" | "video" | "story" | "movie" | "library" | "ethics" |"language"|"category" |"payment";
}

const DashboardPageHeader = ({
  title,
  href,
  type,
}: DashboardPageHeaderProps) => {
  return (
    <div className="flex items-center gap-4 justify-between">
      <div>
        <h1 className="text-2xl font-bold">
          Edit {type?.charAt(0).toUpperCase() + type?.slice(1)}
        </h1>
        <p className="text-sm text-muted-foreground">
          Edit the details for &ldquo;{title}&rdquo;
        </p>
      </div>

      <Button variant="outline" size="sm" asChild>
        <Link href={href}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to {type}
        </Link>
      </Button>
    </div>
  );
};

export default DashboardPageHeader;
