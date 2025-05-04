export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
  }
  mainNav: MainNavItem[]
}

export type MainNavItem = {
  title: string
  href: string
  description?: string
}

export const siteConfig: SiteConfig = {
  name: "Campus Cruiser",
  description:
    "An open source platform for ride booking",
  url: "https://localhost:3000", // Consider updating this if deployed
  ogImage: "https://ui.shadcn.com/og.jpg", // Consider creating a specific OG image
  links: {
    twitter: "https://twitter.com/shadcn", // Update with relevant links
    github: "https://github.com/shadcn/ui", // Update with relevant links
  },
  mainNav: [
    {
      title: "Booking",
      href: "/booking",
      description: "Book a new ride on campus.",
    },
    {
      title: "Chat",
      href: "/chat",
      description: "Get help via real-time chat.",
    },
    // { // Example of adding more top-level nav items if needed
    //   title: "Vehicles",
    //   href: "/vehicles",
    //   description: "View available vehicles.",
    // },
    // {
    //   title: "Settings",
    //   href: "/settings",
    //   description: "Manage your account settings.",
    // }
  ],
}
