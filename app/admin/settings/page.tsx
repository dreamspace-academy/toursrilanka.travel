"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSettings } from "@/contexts/SettingsContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Save } from "lucide-react"

export default function SettingsPage() {
  const { settings, loading, updateSettings } = useSettings()
  const [formData, setFormData] = useState({
    siteName: "",
    siteDescription: "",
    logo: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    socialLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
    },
    colors: {
      primary: "",
      secondary: "",
    },
    currency: "",
    bookingFee: 0,
    taxRate: 0,
    maintenanceMode: false,
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (settings) {
      setFormData({
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        logo: settings.logo,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
        address: settings.address,
        socialLinks: {
          facebook: settings.socialLinks.facebook,
          twitter: settings.socialLinks.twitter,
          instagram: settings.socialLinks.instagram,
        },
        colors: {
          primary: settings.colors.primary,
          secondary: settings.colors.secondary,
        },
        currency: settings.currency,
        bookingFee: settings.bookingFee,
        taxRate: settings.taxRate,
        maintenanceMode: settings.maintenanceMode,
      })
    }
  }, [settings])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [name]: value,
      },
    }))
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [name]: value,
      },
    }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: Number.parseFloat(value),
    }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      maintenanceMode: checked,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      await updateSettings(formData)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p>Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Site Settings</h1>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage your site's basic information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    name="siteName"
                    value={formData.siteName}
                    onChange={handleChange}
                    placeholder="Enter your site name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    name="siteDescription"
                    value={formData.siteDescription}
                    onChange={handleChange}
                    placeholder="Enter a brief description of your site"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    name="logo"
                    value={formData.logo}
                    onChange={handleChange}
                    placeholder="Enter the URL for your logo"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Manage your contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    placeholder="Enter your contact email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    placeholder="Enter your contact phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your business address"
                    rows={3}
                  />
                </div>

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-4">Social Media Links</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        name="facebook"
                        value={formData.socialLinks.facebook}
                        onChange={handleSocialChange}
                        placeholder="Enter your Facebook page URL"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="twitter">Twitter</Label>
                      <Input
                        id="twitter"
                        name="twitter"
                        value={formData.socialLinks.twitter}
                        onChange={handleSocialChange}
                        placeholder="Enter your Twitter profile URL"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        name="instagram"
                        value={formData.socialLinks.instagram}
                        onChange={handleSocialChange}
                        placeholder="Enter your Instagram profile URL"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of your site</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="primary">Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="primary"
                        name="primary"
                        type="color"
                        value={formData.colors.primary}
                        onChange={handleColorChange}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={formData.colors.primary}
                        onChange={handleColorChange}
                        name="primary"
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="secondary">Secondary Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="secondary"
                        name="secondary"
                        type="color"
                        value={formData.colors.secondary}
                        onChange={handleColorChange}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={formData.colors.secondary}
                        onChange={handleColorChange}
                        name="secondary"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Configure payment options and fees</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
                    placeholder="Enter your currency code (e.g., USD, EUR)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bookingFee">Booking Fee (%)</Label>
                  <Input
                    id="bookingFee"
                    name="bookingFee"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.bookingFee}
                    onChange={handleNumberChange}
                    placeholder="Enter booking fee percentage"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    name="taxRate"
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.taxRate}
                    onChange={handleNumberChange}
                    placeholder="Enter tax rate percentage"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Configure advanced site options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="maintenanceMode"
                    checked={formData.maintenanceMode}
                    onCheckedChange={handleSwitchChange}
                  />
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                </div>
                {formData.maintenanceMode && (
                  <p className="text-yellow-600 text-sm">
                    Warning: Enabling maintenance mode will make your site inaccessible to regular users. Only
                    administrators will be able to access the site.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  )
}
