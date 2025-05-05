import * as React from "react"
import { Menu, Bus } from "lucide-react" // Added Bus

// Removed the duplicate Icon component declaration

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

// Added BusIcon specifically for logo usage if needed separate styling
export const BusIcon = React.forwardRef<
  React.ElementRef<"svg">,
  React.ComponentPropsWithoutRef<"svg">
>(({ className, ...props }, ref) => (
  <Bus
    ref={ref}
    className={className}
    {...props}
  />
))
BusIcon.displayName = "BusIcon"


export const Icons = {
  menu: MenuIcon,
  logo: BusIcon, // Assign the Bus icon/component to 'logo'
}
