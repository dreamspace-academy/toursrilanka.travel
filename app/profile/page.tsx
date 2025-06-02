"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await updateProfile(formData)
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (err) {
      toast({
        title: "Update failed",
        description: err instanceof Error ? err.message : "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  if (!user) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>You need to be logged in to view your profile.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/login")}>Log in</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
          <CardDescription>Manage your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" value={formData.bio || ""} onChange={handleChange} rows={4} />
            </div>

            <div className="flex justify-between">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>

              <Button type="button" variant="outline" onClick={handleLogout}>
                Log Out
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-start border-t pt-6">
          <h3 className="text-lg font-medium">Account Information</h3>
          <div className="w-full mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Type:</span>
              <span className="font-medium capitalize">{user.role}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">User ID:</span>
              <span className="font-medium">{user.id}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
