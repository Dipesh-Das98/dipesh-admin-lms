// Form configuration options for dropdowns and select fields

export enum Language {
  ENGLISH = "ENGLISH",
  AMHARIC = "AMHARIC",
  AFAAN_OROMOO = "AFAAN_OROMOO",
  TEGRENA = "TEGRENA",
  SOMALIA = "SOMALIA",
}

export enum Gender {
  Male = "Male",
  Female = "Female",
}

export enum PARENT_ROLE {
  MOM = "MOM",
  DAD = "DAD",
  RELATIVE = "RELATIVE",
  GRANDPA = "GRANDPA",
  GRANDMA = "GRANDMA",
  OTHERS = "OTHERS",
}

export const genderOptions = [
  { value: Gender.Male, label: "Male" },
  { value: Gender.Female, label: "Female" },
] as const;

export const parentRoleOptions = [
  { value: PARENT_ROLE.MOM, label: "Mom" },
  { value: PARENT_ROLE.DAD, label: "Dad" },
  { value: PARENT_ROLE.RELATIVE, label: "Relative" },
  { value: PARENT_ROLE.GRANDPA, label: "Grandpa" },
  { value: PARENT_ROLE.GRANDMA, label: "Grandma" },
  { value: PARENT_ROLE.OTHERS, label: "Others" },
] as const;

export const avatars = [
  "https://01vu1om9by.ufs.sh/f/STh4zlB6r4ySUoSPg06kxsifvbZcm5otaY6QuHw8n9ldgJj0",
  "https://01vu1om9by.ufs.sh/f/STh4zlB6r4ySSrDm5yB6r4ySi7mZ8XMtDBlxdFjboKCOp0s9",
  "https://01vu1om9by.ufs.sh/f/STh4zlB6r4ySfG0Sm5NskOhWazXRUuCIEP6Ayr7DNM2i4QTo",
  "https://01vu1om9by.ufs.sh/f/STh4zlB6r4ySLv2B6XZ017IJKQTyxgVNkdA6jCHLBvef9i4a",
  "https://01vu1om9by.ufs.sh/f/STh4zlB6r4ySEYsFtpDIdlmf8HAKGMJrLzcOtT6Bs1h2gxvY",
];

// Type helpers for form validation
export type LanguageType = keyof typeof Language;
export type GenderType = keyof typeof Gender;
export type ParentRoleType = keyof typeof PARENT_ROLE;
