"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Globe, User } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover-old";
import { FaGlobe, FaMapMarkerAlt, FaUsers, FaCalendarAlt, FaSearch } from "react-icons/fa";
import LanguageCurrencySelector from "@/components/Language";
import { Button } from "@/components/ui/button-old"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all ${scrolled ? "bg-white shadow-sm" : "bg-white md:bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex">
            <Link href="/" className="flex items-center">
              <div className="relative h-8 w-8 mr-2">
                <Image src="/logo.png" alt="logo" fill className="h-15 w-auto object-contain" />
              </div>
              <span className="hidden md:inline-block font-bold text-[#FBBA00]">Tour</span> <span className="hidden md:inline-block font-bold ml-1.5">Sri Lanka</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link href="/experiences" className="text-sm font-medium hover:text-[#FAAF00]">
              Experiences
            </Link>
            <Link href="/trips" className="text-sm font-medium hover:text-[#FAAF00]">
              Trips
            </Link>
            <Link href="/wishlist" className="text-sm font-medium hover:text-[#FAAF00]">
              Wishlist
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center">
            <Link href="/host/experiences" className="hidden md:block mr-4">
              <Button variant="ghost" className="text-sm font-medium">
                Your Home
              </Button>
            </Link>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                  <FaGlobe size={20} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[350px] p-4 bg-white rounded-lg shadow-xl">
                <LanguageCurrencySelector />
              </PopoverContent>
            </Popover>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full border border-gray-200">
                  <User className="h-5 w-5" />
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/login">Log in</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/register">Sign up</Link>
                </DropdownMenuItem>
                <div className="w-full border-t border-gray-300 my-2"></div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/host/experiences">Service</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/help">Help Centre</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/experiences" className="text-sm font-medium py-2">
                Experiences
              </Link>
              <Link href="/trips" className="text-sm font-medium py-2">
                Trips
              </Link>
              <Link href="/wishlist" className="text-sm font-medium py-2">
                Wishlist
              </Link>
              <Link href="/host/experiences" className="text-sm font-medium py-2">
                Host an experience
              </Link>
              <Link href="/help" className="text-sm font-medium py-2">
                Help
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
