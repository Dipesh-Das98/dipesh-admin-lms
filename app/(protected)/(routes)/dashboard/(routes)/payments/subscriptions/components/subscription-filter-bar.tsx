"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { SubscriptionType } from "@/types/subscription.type";

interface SubscriptionFilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterType: SubscriptionType | "all";
  setFilterType: (value: SubscriptionType | "all") => void;
  subscriptionTypes: { value: SubscriptionType; label: string }[];
}

const SubscriptionFilterBar: React.FC<SubscriptionFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  subscriptionTypes,
}) => {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search subscriptions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select
        value={filterType}
        onValueChange={(value) => setFilterType(value as SubscriptionType | "all")}
      >
        <SelectTrigger className="w-40">
          <Filter className="w-4 h-4 mr-2" />
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {subscriptionTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SubscriptionFilterBar; 