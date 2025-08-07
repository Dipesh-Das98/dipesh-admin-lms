"use client";
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Edit, Trash2, MoreVertical } from 'lucide-react';
import { Subscription, SubscriptionType } from '@/types/subscription.type';

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  subscriptionTypes: { value: SubscriptionType; label: string }[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
  searchTerm: string;
  filterType: SubscriptionType | 'all';
}

export const SubscriptionTable: React.FC<SubscriptionTableProps> = ({
  subscriptions,
  subscriptionTypes,
  onEdit,
  onDelete,
  searchTerm,
  filterType,
}) => {
  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const matchesSearch = subscription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || subscription.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Discount</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredSubscriptions.map((subscription) => (
          <TableRow key={subscription.id}>
            <TableCell>
              <div>
                <div className="font-medium">{subscription.name}</div>
                <div className="text-sm text-muted-foreground">
                  {subscription.description}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="outline">
                {subscriptionTypes?.find(t => t.value === subscription?.type)?.label}
              </Badge>
            </TableCell>
            <TableCell>${subscription.price}</TableCell>
            <TableCell>{subscription.duration} months</TableCell>
            <TableCell>
              {subscription.discount ? (
                <Badge variant="secondary">{subscription.discount}%</Badge>
              ) : (
                '-'
              )}
            </TableCell>
            <TableCell>
              {new Date(subscription.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(subscription)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(subscription.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
        {filteredSubscriptions.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8">
              <div className="text-muted-foreground">
                {searchTerm || filterType !== 'all' 
                  ? 'No subscriptions found matching your criteria'
                  : 'No subscription plans created yet'
                }
              </div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default SubscriptionTable;
