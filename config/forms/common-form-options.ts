import { Language } from "./child-form-options";

export const gradeOptions = [
  { value: "Pre-K", label: "PreSchool" },
  { value: "Grade 1", label: "Grade 1" },
  { value: "Grade 2", label: "Grade 2" },
  { value: "Grade 3", label: "Grade 3" },
  { value: "Grade 4", label: "Grade 4" },
  { value: "Grade 5", label: "Grade 5" },
] as const;


// Helper objects for form options with display labels
export const languageOptions = [
  { value: Language.ENGLISH, label: "English" },
  { value: Language.AMHARIC, label: "Amharic" },
  { value: Language.AFAAN_OROMOO, label: "Afaan Oromoo" },
  { value: Language.TEGRENA, label: "Tigrinya" },
  { value: Language.SOMALIA, label: "Somali" },
] as const;
