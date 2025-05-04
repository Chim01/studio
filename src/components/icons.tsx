import * as React from "react"
import { Menu } from "lucide-react"

export function Icon({
  icon,
  className,
  ...props
}: {
  icon: "logo" | "spinner" | "arrowRight" | "chevronLeft" | "chevronRight"
} & React.HTMLAttributes<SVGElement>) {
  switch (icon) {
    default:
      return <Menu className={className} {...props} />;
  }
}

export const MenuIcon = React.forwardRef<
  React.ElementRef<"svg">,
  React.ComponentPropsWithoutRef<"svg">
>(({ className, ...props }, ref) => (
  <Menu
    ref={ref}
    className={className}
    {...props}
  />
))
MenuIcon.displayName = "MenuIcon"


export const IconsMenu = {
  menu: MenuIcon,
}

export const Icons = {
  ...IconsMenu
}
