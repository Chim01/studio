"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation" // Import usePathname

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu" // Correct import path
import type { MainNavItem } from "@/config/site" // Import type if needed


interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  items?: MainNavItem[] // Use MainNavItem type
}

export function MainNav({ items }: MainNavProps) {
  const pathname = usePathname(); // Get current path
  const [isAdmin, setIsAdmin] = React.useState(false); // Keep admin logic if needed

  React.useEffect(() => {
    // TODO: Replace with actual authentication and role checking logic
    // For now, assume user is admin for demonstration
    setIsAdmin(true);
  }, []);

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="flex items-center space-x-2 mr-10"> {/* Increased margin */}
         {/* Consider adding a Logo component here */}
        <span className="font-bold sm:inline-block text-lg">TecoTransit</span>
      </Link>

      <NavigationMenu>
        <NavigationMenuList>
           {/* Admin Link - Render conditionally based on role */}
           {isAdmin && (
             <NavigationMenuItem>
               <Link href="/admin" legacyBehavior passHref>
                 <NavigationMenuLink
                   className={cn(
                     navigationMenuTriggerStyle(),
                     pathname === "/admin" ? "bg-accent text-accent-foreground" : "" // Active state styling
                   )}
                 >
                   Admin Dashboard
                 </NavigationMenuLink>
               </Link>
             </NavigationMenuItem>
           )}

          {/* Main Navigation Items */}
          {items?.length ? (
              items.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        pathname === item.href ? "bg-accent text-accent-foreground" : "" // Active state styling
                      )}
                    >
                      {item.title}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))
          ) : null}

        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

// ListItem component might not be needed if not using dropdowns, but keep it if planned for future use.
// const ListItem = React.forwardRef<
//   React.ElementRef<"a">,
//   React.ComponentPropsWithoutRef<"a">
// >(({ className, title, children, ...props }, ref) => {
//   return (
//     <li>
//       <NavigationMenuLink asChild>
//         <a
//           ref={ref}
//           className={cn(
//             "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
//             className
//           )}
//           {...props}
//         >
//           <div className="text-sm font-medium leading-none">{title}</div>
//           <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
//             {children}
//           </p>
//         </a>
//       </NavigationMenuLink>
//     </li>
//   )
// })
// ListItem.displayName = "ListItem"
