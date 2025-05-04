"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

interface MobileNavProps {
  items: {
    title: string
    href: string
    disabled?: boolean
  }[]
}

export function MobileNav({ items }: MobileNavProps) {
  const pathname = usePathname()
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="mr-2 flex h-8 w-8 items-center justify-center sm:hidden"
        >
          <Icons.menu className="h-6 w-6" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <SheetHeader className="text-left">
          <SheetTitle>{siteConfig.name}</SheetTitle>
          <SheetDescription>
            {siteConfig.description}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          {items?.length ? (
            <div className="grid gap-6">
              {items?.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "flex items-center text-lg font-medium",
                    pathname === item.href
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          ) : null}
          <Link href="/profile" className="text-sm font-medium hover:underline">
              Profile
            </Link>
             <Link href="/auth/login" className="text-sm font-medium hover:underline">
              Login
            </Link>
            <Link href="/auth/signup" className="text-sm font-medium hover:underline">
              Sign Up
            </Link>
        </div>
      </SheetContent>
    </Sheet>
  )
}
