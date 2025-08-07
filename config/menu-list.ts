import {
  Users,
  Settings,
  LayoutGrid,
  LucideIcon,
  CreditCard,
  Baby,
  BookOpen,
  Music,
  Gamepad2,
  GraduationCap,
  Shield,
  Upload,
  VideoIcon,
  FolderTree,
  Library,
  Scale,
  Languages,
  Paperclip,
  BookOpenCheck,
  HeartPlus,
  ListVideo
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
  roles?: string[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
  roles?: string[];
};

export function getMenuList(): Group[] {
  return [
    {
      groupLabel: "Dashboard",
      menus: [
        {
          href: "/dashboard",
          label: "Overview",
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "User Management",
      menus: [
        {
          href: "/dashboard/parents",
          label: "Parent/Guardian",
          icon: Users,
          submenus: [],
        },
        {
          href: "/dashboard/children",
          label: "Children",
          icon: Baby,
          submenus: [
            {
              href: "/dashboard/children/add",
              label: "Add Child",
            },
            {
              href: "/dashboard/children",
              label: "Manage Children",
            },
          ],
        },
      ],
    },
    {
      groupLabel: "Content Management",
      menus: [
        {
          href: "/dashboard/categories",
          label: "Categories",
          icon: FolderTree,
        },
        {
          href: "/dashboard/course",
          label: "Courses",
          icon: GraduationCap,
          submenus: [
            {
              href: "/dashboard/course/add",
              label: "Add Course",
            },
            {
              href: "/dashboard/course",
              label: "Manage Courses",
            },
          ],
        },
        {
          href: "/dashboard/stories",
          label: "Stories",
          icon: BookOpen,
          submenus: [
            {
              href: "/dashboard/stories/add",
              label: "Add Story",
            },
            {
              href: "/dashboard/stories",
              label: "Manage Stories",
            },
          ],
        },
        {
          href: "/dashboard/movies",
          label: "Movies",
          icon: VideoIcon,
          submenus: [
            {
              href: "/dashboard/movies/add",
              label: "Add Movie",
            },
            {
              href: "/dashboard/movies",
              label: "Manage Movies",
            },
          ],
        },
        {
          href: "/dashboard/music",
          label: "Music",
          icon: Music,
          submenus: [
            {
              href: "/dashboard/music/add",
              label: "Add Music",
            },
            {
              href: "/dashboard/music",
              label: "Manage Music",
            },
          ],
        },
        {
          href: "/dashboard/games",
          label: "Games",
          icon: Gamepad2,
          submenus: [
            {
              href: "/dashboard/games/add",
              label: "Add Game",
            },
            {
              href: "/dashboard/games",
              label: "Manage Games",
            },
          ],
        },
      ],
    },
    {
      groupLabel: "Learning Resources",
      menus: [
        {
          href: "/dashboard/library",
          label: "Library",
          icon: Library,
          submenus: [
            {
              href: "/dashboard/library/add",
              label: "Add Book",
            },
            {
              href: "/dashboard/library",
              label: "Manage Books",
            },
          ],
        },
        {
          href: "/dashboard/ethics",
          label: "Ethics Corner",
          icon: Scale,
          submenus: [
            {
              href: "/dashboard/ethics/add",
              label: "Add Content",
            },
            {
              href: "/dashboard/ethics",
              label: "Manage Content",
            },
          ],
        },
        {
          href: "/dashboard/language",
          label: "Language Corner",
          icon: Languages,
          submenus: [
            {
              href: "/dashboard/language/add",
              label: "Add Content",
            },
            {
              href: "/dashboard/language",
              label: "Manage Content",
            },
          ],
        },
        {
          href: "/dashboard/readAlongWith",
          label: "Read Along With",
          icon: BookOpenCheck,
          submenus: [
            {
              href: "/dashboard/readAlongWith/add",
              label: "Add Content",
            },
            {
              href: "/dashboard/readAlongWith",
              label: "Manage Content",
            },
          ],
        },
        {
          href: "/dashboard/variety",
          label: "Variety",
          icon: ListVideo,
          submenus: [
            {
              href: "/dashboard/variety/add",
              label: "Add Content",
            },
            {
              href: "/dashboard/variety",
              label: "Manage Content",
            },
          ],
        },
        {
          href: "/dashboard/familyHealth",
          label: "Family Health",
          icon: HeartPlus,
          submenus: [
            {
              href: "/dashboard/familyHealth/add",
              label: "Add Content",
            },
            {
              href: "/dashboard/familyHealth",
              label: "Manage Content",
            },
          ],
        }
      ],
    },
    {
      groupLabel: "Financial Management",
      menus: [
        {
          href: "/dashboard/payments",
          label: "Payments",
          icon: CreditCard,
          submenus: [
            {
              href: "/dashboard/payments",
              label: "Payment History",
            },
            {
              href: "/dashboard/payments/subscriptions",
              label: "Subscriptions",
            },
            {
              href: "/dashboard/payments/refunds",
              label: "Refunds",
            },
          ],
        },
        {
          href: "/dashboard/advertisements",
          label: "Advertisements",
          icon: Paperclip,
        }
      ],
    },

    {
      groupLabel: "System Administration",
      roles: ["SUPER_ADMIN"],
      menus: [
        {
          href: "/dashboard/upload",
          label: "File Upload",
          icon: Upload,
          submenus: [],
          roles: ["SUPER_ADMIN"],
        },
        {
          href: "/dashboard/admin",
          label: "Admin Panel",
          icon: Shield,
          roles: ["SUPER_ADMIN"],
        },
      ],
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/dashboard/settings",
          label: "Account Settings",
          icon: Settings,
        },
      ],
    },
  ];
}
