import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PDFEula } from "./pdf-eula"

const formSchema = z.object({
  licenseHolder: z.object({
    companyName: z.string().min(1, "Company name is required"),
    brandName: z.string().min(1, "Brand name is required"),
    address: z.string().min(1, "Address is required"),
    taxId: z.string().min(1, "Tax ID is required"),
    contactName: z.string().min(1, "Contact name is required"),
    email: z.string().email("Invalid email address"),
  }),
  billingParty: z.object({
    companyName: z.string().min(1, "Company name is required"),
    taxId: z.string().min(1, "Tax ID is required"),
    address: z.string().min(1, "Address is required"),
    contactName: z.string().min(1, "Contact name is required"),
    email: z.string().email("Invalid email address"),
  }),
  licenseInfo: z.object({
    date: z.string().min(1, "Date is required"),
    licenseNo: z.string().min(1, "License number is required"),
  }),
  licenseDetails: z.object({
    fontName: z.string().min(1, "Font name is required"),
    languages: z.string().min(1, "Languages are required"),
    styles: z.string().min(1, "Styles are required"),
    fileFormats: z.string().min(1, "File formats are required"),
    licenseDuration: z.string().min(1, "License duration is required"),
    licenseHolderBusinessSize: z.string().min(1, "Business size is required"),
    grantedLicense: z.string().min(1, "Granted license is required"),
    totalFeeVND: z.string().min(1, "VND fee is required"),
    totalFeeUSD: z.string().min(1, "USD fee is required"),
    licenseExtensions: z.object({
      included: z.string().min(1, "Included extensions are required"),
      excluded: z.string().min(1, "Excluded extensions are required"),
    }),
  }),
})

export function EulaEditor() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      licenseHolder: {
        companyName: "",
        brandName: "",
        address: "",
        taxId: "",
        contactName: "",
        email: "",
      },
      billingParty: {
        companyName: "",
        taxId: "",
        address: "",
        contactName: "",
        email: "",
      },
      licenseInfo: {
        date: new Date().toISOString().split("T")[0],
        licenseNo: "",
      },
      licenseDetails: {
        fontName: "",
        languages: "",
        styles: "",
        fileFormats: "",
        licenseDuration: "",
        licenseHolderBusinessSize: "",
        grantedLicense: "",
        totalFeeVND: "",
        totalFeeUSD: "",
        licenseExtensions: {
          included: "",
          excluded: "",
        },
      },
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* License Holder Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">License Holder</h2>
                <FormField
                  control={form.control}
                  name="licenseHolder.companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licenseHolder.brandName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Name (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licenseHolder.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licenseHolder.taxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licenseHolder.contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licenseHolder.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Billing Party Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Billing Party</h2>
                <FormField
                  control={form.control}
                  name="billingParty.companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="billingParty.taxId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax ID</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="billingParty.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="billingParty.contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="billingParty.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* License Info Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">License Information</h2>
                <FormField
                  control={form.control}
                  name="licenseInfo.date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licenseInfo.licenseNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* License Details Section */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">License Details</h2>
                <FormField
                  control={form.control}
                  name="licenseDetails.fontName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Font Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licenseDetails.languages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Languages</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licenseDetails.styles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Styles</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licenseDetails.fileFormats"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>File Formats</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licenseDetails.licenseDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Duration</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licenseDetails.licenseHolderBusinessSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Business Size</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licenseDetails.grantedLicense"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Granted License</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licenseDetails.totalFeeVND"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Fee (VND)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="licenseDetails.totalFeeUSD"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Fee (USD)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  <h3 className="text-md font-semibold">License Extensions</h3>
                  <FormField
                    control={form.control}
                    name="licenseDetails.licenseExtensions.included"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Included Extensions</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="licenseDetails.licenseExtensions.excluded"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excluded Extensions</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit">Generate EULA</Button>
            </form>
          </Form>
        </div>

        {/* Preview Section */}
        <div className="sticky top-4">
          <PDFEula formData={form.watch()} />
        </div>
      </div>
    </div>
  )
} 