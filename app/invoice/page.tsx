"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FontSelector } from "@/components/font-selector"
import { Plus, Trash2 } from "lucide-react"
import { PDFRenderer } from "@/components/pdf-renderer"

// Import the document component but don't render it directly
import { InvoiceDocument } from "@/components/pdf-templates/invoice-document"

export default function InvoicePage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [formData, setFormData] = useState({
    clientName: "",
    clientCompany: "",
    clientEmail: "",
    clientAddress: "",
    projectName: "",
    invoiceNumber: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    selectedFonts: [],
    items: [{ description: "", quantity: 1, unitPrice: 0, total: 0 }],
    subtotal: 0,
    tax: 0,
    total: 0,
    notes: "Payment due within 14 days.\nPlease include the invoice number with your payment.",
    paymentDetails: "Bank: Yellow Bank\nAccount: 1234567890\nIBAN: YT12 3456 7890 1234",
  })

  // Enable client-side rendering detection
  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFontSelection = (selectedFonts) => {
    setFormData((prev) => ({ ...prev, selectedFonts }))
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]

    // Convert to number if the field is quantity or unitPrice
    if (field === "quantity" || field === "unitPrice") {
      value = Number.parseFloat(value) || 0
    }

    newItems[index][field] = value

    // Calculate the total for this item
    newItems[index].total = newItems[index].quantity * newItems[index].unitPrice

    // Calculate subtotal, tax, and total
    const subtotal = newItems.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * 0.1 // Assuming 10% tax
    const total = subtotal + tax

    setFormData((prev) => ({
      ...prev,
      items: newItems,
      subtotal,
      tax,
      total,
    }))
  }

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { description: "", quantity: 1, unitPrice: 0, total: 0 }],
    }))
  }

  const removeItem = (index) => {
    if (formData.items.length === 1) return

    const newItems = formData.items.filter((_, i) => i !== index)

    // Recalculate totals
    const subtotal = newItems.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * 0.1
    const total = subtotal + tax

    setFormData((prev) => ({
      ...prev,
      items: newItems,
      subtotal,
      tax,
      total,
    }))
  }

  const isFormValid = () => {
    return (
      formData.clientName &&
      formData.clientCompany &&
      formData.clientEmail &&
      formData.invoiceNumber &&
      formData.items.some((item) => item.description && item.total > 0)
    )
  }

  // Factory function to create the PDF document only when needed
  const createPdfDocument = () => {
    return <InvoiceDocument data={formData} />
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Generate Invoice</h1>
        <p className="text-muted-foreground">Create a professional invoice for your clients</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Information</CardTitle>
              <CardDescription>Enter the invoice details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="invoiceNumber">Invoice Number</Label>
                  <Input
                    id="invoiceNumber"
                    name="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoiceDate">Invoice Date</Label>
                  <Input
                    id="invoiceDate"
                    name="invoiceDate"
                    type="date"
                    value={formData.invoiceDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </CardContent>

            <CardHeader className="pt-6">
              <CardTitle>Client Information</CardTitle>
              <CardDescription>Enter the client details for the invoice</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input
                    id="clientName"
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleInputChange}
                    placeholder="John Smith"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientCompany">Company</Label>
                  <Input
                    id="clientCompany"
                    name="clientCompany"
                    value={formData.clientCompany}
                    onChange={handleInputChange}
                    placeholder="Acme Inc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email</Label>
                  <Input
                    id="clientEmail"
                    name="clientEmail"
                    type="email"
                    value={formData.clientEmail}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    placeholder="Brand Redesign"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientAddress">Address</Label>
                <Textarea
                  id="clientAddress"
                  name="clientAddress"
                  value={formData.clientAddress}
                  onChange={handleInputChange}
                  placeholder="123 Main St, City, Country"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Selected Fonts</Label>
                <FontSelector onSelectionChange={handleFontSelection} />
              </div>
            </CardContent>

            <CardHeader className="pt-6">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Invoice Items</CardTitle>
                  <CardDescription>Add items to your invoice</CardDescription>
                </div>
                <Button size="sm" onClick={addItem} className="bg-yellow-500 hover:bg-yellow-600">
                  <Plus className="h-4 w-4 mr-1" /> Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-5 space-y-2">
                    <Label htmlFor={`item-${index}-desc`}>Description</Label>
                    <Input
                      id={`item-${index}-desc`}
                      value={item.description}
                      onChange={(e) => handleItemChange(index, "description", e.target.value)}
                      placeholder="Font license / Service"
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor={`item-${index}-qty`}>Quantity</Label>
                    <Input
                      id={`item-${index}-qty`}
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor={`item-${index}-price`}>Unit Price</Label>
                    <Input
                      id={`item-${index}-price`}
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, "unitPrice", e.target.value)}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Total</Label>
                    <div className="h-10 px-3 py-2 rounded-md border bg-muted/50">${item.total.toFixed(2)}</div>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(index)}
                      disabled={formData.items.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Subtotal:</span>
                  <span>${formData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Tax (10%):</span>
                  <span>${formData.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${formData.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Additional notes and payment terms"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentDetails">Payment Details</Label>
                  <Textarea
                    id="paymentDetails"
                    name="paymentDetails"
                    value={formData.paymentDetails}
                    onChange={handleInputChange}
                    placeholder="Bank account details for payment"
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/")}>
                Cancel
              </Button>
              {isClient && (
                <PDFRenderer
                  documentFactory={createPdfDocument}
                  fileName={`Invoice-${formData.invoiceNumber}-${formData.clientCompany.replace(/\s+/g, "-")}.pdf`}
                  disabled={!isFormValid()}
                />
              )}
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Invoice Preview</CardTitle>
              <CardDescription>Preview of how your document will look</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="w-full aspect-[1/1.414] bg-muted rounded-md flex items-center justify-center">
                {formData.items.some((item) => item.description) && formData.clientName ? (
                  <div className="p-4 text-center">
                    <p className="text-sm font-medium">Invoice #{formData.invoiceNumber}</p>
                    <p className="text-xs text-muted-foreground mt-1">For {formData.clientCompany}</p>
                    <div className="mt-4 border-t pt-4">
                      <p className="text-xs">Items:</p>
                      <ul className="text-xs mt-2 text-left">
                        {formData.items.map(
                          (item, index) =>
                            item.description && (
                              <li key={index} className="flex justify-between">
                                <span>{item.description}</span>
                                <span>${item.total.toFixed(2)}</span>
                              </li>
                            ),
                        )}
                      </ul>
                      <div className="mt-4 pt-2 border-t text-right">
                        <p className="text-xs font-bold">Total: ${formData.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Fill out the form to see a preview</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
