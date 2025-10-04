"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, MessageSquare, Eye, Heart, Share } from "lucide-react";
import { TrendingDiscussion } from "@/types/community-dashboard.type";
import { cn } from "@/lib/utils";

interface TrendingDiscussionsProps {
  discussions: TrendingDiscussion[];
}

interface DiscussionCardProps {
  discussion: TrendingDiscussion;
}

const DiscussionCard = ({ discussion }: DiscussionCardProps) => {
  return (
    <div className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-sm line-clamp-2 mb-1">
            {discussion.title}
          </h4>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {discussion.content}
          </p>
        </div>
        {discussion.isTrending && (
          <Badge variant="secondary" className="ml-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Trending
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span>by {discussion.author}</span>
          <span>•</span>
          <span>{discussion.category}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>{discussion.comments}</span>
          </div>
          {discussion.views && (
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{discussion.views}</span>
            </div>
          )}
          {discussion.likes && (
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              <span>{discussion.likes}</span>
            </div>
          )}
          {discussion.shares && (
            <div className="flex items-center gap-1">
              <Share className="h-3 w-3" />
              <span>{discussion.shares}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <Badge
          variant="outline"
          className={cn(
            "text-xs",
            discussion.engagementScore > 150
              ? "border-green-500 text-green-600"
              : discussion.engagementScore > 100
              ? "border-yellow-500 text-yellow-600"
              : "border-gray-500 text-gray-600"
          )}
        >
          Score: {discussion.engagementScore}
        </Badge>

        {discussion.createdAt && (
          <span className="text-xs text-muted-foreground">
            {new Date(discussion.createdAt).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

export const TrendingDiscussions = ({
  discussions,
}: TrendingDiscussionsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Trending Discussions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {discussions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No trending discussions at the moment</p>
            </div>
          ) : (
            discussions.map((discussion) => (
              <DiscussionCard key={discussion.id} discussion={discussion} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
