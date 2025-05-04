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
  url: "https://localhost:3000",
  ogImage: "https://ui.shadcn.com/og.jpg",
  links: {
    twitter: "https://twitter.com/shadcn",
    github: "https://github.com/shadcn/ui",
  },
  mainNav: [
    {
      title: "Booking",
      href: "/booking",
    },
    {
      title: "Chat",
      href: "/chat",
    }
  ],
}
