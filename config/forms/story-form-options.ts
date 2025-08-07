// Story form configuration options for dropdowns and select fields



export interface StoryCategory {
  id: string;
  name: string;
  type: string;
  description: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export const backgroundColorOptions = [
  { value: "#FF5733", label: "Warm Orange", color: "#FF5733" },
  { value: "#33C3FF", label: "Sky Blue", color: "#33C3FF" },
  { value: "#33FF57", label: "Fresh Green", color: "#33FF57" },
  { value: "#FF33F5", label: "Bright Pink", color: "#FF33F5" },
  { value: "#FFFF33", label: "Sunshine Yellow", color: "#FFFF33" },
  { value: "#8033FF", label: "Purple", color: "#8033FF" },
  { value: "#FF3333", label: "Red", color: "#FF3333" },
  { value: "#33FF8B", label: "Mint Green", color: "#33FF8B" },
  { value: "#FF8C33", label: "Orange", color: "#FF8C33" },
  { value: "#337AFF", label: "Blue", color: "#337AFF" },
] as const;
