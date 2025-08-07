export enum ProductStatus {
  todo = 'todo',
  inProgress = 'inProgress',
  done = 'done',
  canceled = 'canceled',
}

export enum ProductLabel {
  bug = 'bug',
  feature = 'feature',
  documentation = 'documentation',
  enhancement = 'enhancement',
}

export enum ProductPriority {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

export type Product = {
  id: string;
  code: string;
  title: string;
  status: ProductStatus;
  label: ProductLabel;
  priority: ProductPriority;
  archived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ProductApiResponse = {
  success: boolean;
  data: Product[];
  message: string;
};

export type ProductCreateRequest = {
  code: string;
  title: string;
  status: ProductStatus;
  label: ProductLabel;
  priority: ProductPriority;
};

export type ProductUpdateRequest = {
  code?: string;
  title?: string;
  status?: ProductStatus;
  label?: ProductLabel;
  priority?: ProductPriority;
  archived?: boolean;
};

export type ProductFilters = {
  status?: ProductStatus;
  label?: ProductLabel;
  priority?: ProductPriority;
  archived?: boolean;
  search?: string;
};
