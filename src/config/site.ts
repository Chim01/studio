export type SiteConfig = {
  name: string
  description: string
  url: string
  ogImage: string
  links: {
    twitter: string
    github: string
    whatsapp?: string // Added optional whatsapp link
    instagram?: string // Added optional instagram link
    x?: string // Added optional x link
  }
  mainNav: MainNavItem[]
}

export type MainNavItem = {
  title: string
  href: string
  description?: string
  adminOnly?: boolean // Flag for admin-only links
}

export const siteConfig: SiteConfig = {
  name: "TecoTransit",
  description:
    "An open source platform for ride booking",
  url: "https://localhost:3000", // Consider updating this if deployed
  ogImage: "https://ui.shadcn.com/og.jpg", // Consider creating a specific OG image
  links: {
    twitter: "https://twitter.com/shadcn", // Update with relevant links
    github: "https://github.com/shadcn/ui", // Update with relevant links
    whatsapp: "#", // Placeholder link
    instagram: "#", // Placeholder link
    x: "https://twitter.com/shadcn", // Placeholder link (can be same as twitter initially)
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
     {
      title: "Admin", // Add Admin link back
      href: "/admin",
      description: "Manage application settings and users.",
      adminOnly: true, // Mark as admin only
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