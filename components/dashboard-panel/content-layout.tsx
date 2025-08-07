import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { ChevronRight } from "lucide-react";

interface ContentLayoutProps {
  children: React.ReactNode;
  className?: string;
  breadcrumbItems?: { label: string; href?: string }[];
  showBreadcrumb?: boolean;
}

export function ContentLayout({
  children,
  className,
  breadcrumbItems,
  showBreadcrumb = true,
}: ContentLayoutProps) {
  return (
    <div>
      <div className={cn("container mx-auto pt-8 pb-8 px-4", className)}>
        {showBreadcrumb && breadcrumbItems && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item, index) => (
                <BreadcrumbItem key={index}>
                  {item.href ? (
                    <BreadcrumbLink href={item.href}>
                      {item.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                  {index < breadcrumbItems.length - 1 && (
                    <BreadcrumbSeparator>
                      <ChevronRight className="h-4 w-4" />
                    </BreadcrumbSeparator>
                  )}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        {children}
      </div>
    </div>
  );
}
