"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToastContext } from "@/contexts/toast-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, ArrowLeft, Save, Trash2, Upload } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface User {
  _id?: string
  auth0Id?: string
  name: string
  email: string
  role: string
  avatar: string
  bio?: string
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
    country?: string
  }
  isVerified: boolean
  status: string
}

export default function UserFormPage({ params }: { params: { id: string } }) {
  const isNew = params.id === "new"
  const [user, setUser] = useState<User>({
    name: "",
    email: "",
    role: "guest",
    avatar: "",
    isVerified: true,
    status: "Active",
    address: {},
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const { showToast } = useToastContext()
  const router = useRouter()

  useEffect(() => {
    if (!isNew) {
      fetchUser()
    }
  }, [params.id])

  const fetchUser = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/proxy/users/${params.id}`)
      if (!response.ok) {
        throw new Error("Failed to fetch user")
      }
      const data = await response.json()
      setUser(data.data)
    } catch (error) {
      console.error("Error fetching user:", error)
      showToast("Error", "Failed to load user", "destructive")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUser((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setUser((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setUser((prev) => ({ ...prev, [name]: checked }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const uploadAvatar = async () => {
    if (!avatarFile) return null

    const formData = new FormData()
    formData.append("image", avatarFile)

    try {
      const response = await fetch("/api/proxy/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload avatar")
      }

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error("Error uploading avatar:", error)
      showToast("Error", "Failed to upload avatar", "destructive")
      return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Upload avatar if a new one is selected
      if (avatarFile) {
        const avatarUrl = await uploadAvatar()
        if (avatarUrl) {
          setUser((prev) => ({ ...prev, avatar: avatarUrl }))
        }
      }

      const method = isNew ? "POST" : "PUT"
      const url = isNew ? "/api/proxy/users" : `/api/proxy/users/${params.id}`

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isNew ? "create" : "update"} user`)
      }

      const data = await response.json()
      showToast("Success", `User ${isNew ? "created" : "updated"} successfully`, "success")

      if (isNew) {
        router.push(`/admin/users/${data.data._id}`)
      }
    } catch (error) {
      console.error(`Error ${isNew ? "creating" : "updating"} user:`, error)
      showToast("Error", `Failed to ${isNew ? "create" : "update"} user`, "destructive")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = () => {
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    try {
      const response = await fetch(`/api/proxy/users/${params.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete user")
      }

      showToast("Success", "User deleted successfully", "success")
      router.push("/admin/users")
    } catch (error) {
      console.error("Error deleting user:", error)
      showToast("Error", "Failed to delete user", "destructive")
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/users">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Users
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && (
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      <h1 className="text-3xl font-bold tracking-tight">{isNew ? "Create User" : `Edit User: ${user.name}`}</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={user.name} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={user.email} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={user.role} onValueChange={(value) => handleSelectChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="guest">Guest</SelectItem>
                    <SelectItem value="host">Host</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={user.status} onValueChange={(value) => handleSelectChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" value={user.phone || ""} onChange={handleChange} />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isVerified"
                  checked={user.isVerified}
                  onCheckedChange={(checked) => handleSwitchChange("isVerified", checked)}
                />
                <Label htmlFor="isVerified">Verified User</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="avatarUpload">Avatar</Label>
                <div className="flex items-center gap-4">
                  <div className="relative h-24 w-24 rounded-full overflow-hidden border">
                    <Image
                      src={avatarPreview || user.avatar || "/placeholder.svg?height=96&width=96"}
                      alt="User avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Input
                        id="avatarUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" disabled={!avatarFile}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Recommended size: 200x200 pixels. Max file size: 2MB.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={user.bio || ""}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="street">Street</Label>
                <Input id="street" name="street" value={user.address?.street || ""} onChange={handleAddressChange} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" value={user.address?.city || ""} onChange={handleAddressChange} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input id="state" name="state" value={user.address?.state || ""} onChange={handleAddressChange} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip/Postal Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={user.address?.zipCode || ""}
                    onChange={handleAddressChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={user.address?.country || ""}
                    onChange={handleAddressChange}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save User
              </>
            )}
          </Button>
        </div>
      </form>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
