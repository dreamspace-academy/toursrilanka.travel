"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { CalendarIcon, ChevronLeft, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { experiences } from "@/data/experiences"
import { useToast } from "@/components/ui/use-toast"

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const id = params.id as string

  const experience = experiences.find((exp) => exp.id === id)

  const [date, setDate] = useState<Date | undefined>(undefined)
  const [guests, setGuests] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [isLoading, setIsLoading] = useState(false)

  if (!experience) {
    return <div>Experience not found</div>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date) {
      toast({
        title: "Please select a date",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Booking confirmed!",
      description: `Your booking for ${experience.title} on ${format(date, "MMMM d, yyyy")} has been confirmed.`,
    })

    router.push("/trips")
  }

  const subtotal = experience.price * guests
  const serviceFee = Math.round(subtotal * 0.15)
  const total = subtotal + serviceFee

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6 pl-0" onClick={() => router.back()}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to experience
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-2xl font-semibold mb-6">Confirm and pay</h1>

          <form onSubmit={handleSubmit}>
            {/* Trip Details */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">Your trip</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">Date</h3>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !date && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {date ? format(date, "MMMM d, yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <h3 className="font-medium">Guests</h3>
                    <div className="flex items-center mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => guests > 1 && setGuests(guests - 1)}
                        disabled={guests <= 1}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </Button>
                      <span className="mx-4">{guests}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => guests < experience.maxGuests && setGuests(guests + 1)}
                        disabled={guests >= experience.maxGuests}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Payment Method */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">Pay with</h2>
              <Tabs defaultValue="card" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="card">Credit Card</TabsTrigger>
                  <TabsTrigger value="paypal">PayPal</TabsTrigger>
                  <TabsTrigger value="apple">Apple Pay</TabsTrigger>
                </TabsList>
                <TabsContent value="card" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardName">Cardholder name</Label>
                      <Input id="cardName" placeholder="Name on card" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card number</Label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expMonth">Expiration month</Label>
                      <Input id="expMonth" placeholder="MM" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expYear">Expiration year</Label>
                      <Input id="expYear" placeholder="YYYY" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input id="cvc" placeholder="123" required />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="paypal" className="mt-4">
                  <div className="text-center p-8">
                    <div className="mb-4">
                      <Image
                        src="/placeholder.svg?height=60&width=120&text=PayPal"
                        alt="PayPal"
                        width={120}
                        height={60}
                        className="mx-auto"
                      />
                    </div>
                    <p className="text-gray-600 mb-4">You will be redirected to PayPal to complete your payment.</p>
                    <Button type="button" className="w-full">
                      Continue with PayPal
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="apple" className="mt-4">
                  <div className="text-center p-8">
                    <div className="mb-4">
                      <Image
                        src="/placeholder.svg?height=60&width=120&text=Apple+Pay"
                        alt="Apple Pay"
                        width={120}
                        height={60}
                        className="mx-auto"
                      />
                    </div>
                    <p className="text-gray-600 mb-4">You will be redirected to Apple Pay to complete your payment.</p>
                    <Button type="button" className="w-full">
                      Continue with Apple Pay
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <Separator className="my-8" />

            {/* Cancellation Policy */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">Cancellation policy</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">
                  Free cancellation up to 24 hours before the experience starts. Cancel up to 24 hours before the start
                  time for a full refund.
                </p>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Terms */}
            <div className="mb-8">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-gray-500 mt-0.5" />
                <p className="text-sm text-gray-600">
                  By selecting the button below, I agree to the Host's House Rules, Ground rules for all experiences,
                  Tour Sri Lanka's Rebooking and Refund Policy, and that Tour Sri Lanka can charge my payment method if
                  I'm responsible for damage.
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Processing..." : "Confirm and pay"}
            </Button>
          </form>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg border-gray-200">
            <CardHeader className="pb-4">
              <div className="flex items-start gap-4">
                <div className="relative h-20 w-20 rounded-lg overflow-hidden">
                  <Image
                    src={experience.imageUrl || "/placeholder.svg"}
                    alt={experience.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-sm text-gray-500">{experience.category}</div>
                  <CardTitle className="text-base">{experience.title}</CardTitle>
                  <div className="text-sm mt-1">
                    <span className="font-medium">{experience.duration} hours</span>
                    <span className="mx-2">•</span>
                    <span>{experience.location}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Separator />

              <div>
                <h3 className="font-medium mb-2">Price details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      ${experience.price} × {guests} {guests === 1 ? "person" : "people"}
                    </span>
                    <span>${subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service fee</span>
                    <span>${serviceFee}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold">
                <span>Total (USD)</span>
                <span>${total}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
