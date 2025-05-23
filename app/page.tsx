"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { FileIcon as FileInvoice, Calculator, FileText } from "lucide-react"

export default function PaperworkDashboard() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Yellow Type Foundry</h1>
        <p className="text-xl text-muted-foreground mt-2">Document Generator</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/eula" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">EULA</CardTitle>
              <FileText className="h-8 w-8 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base min-h-[60px]">
                Generate End User License Agreements for font licensing.
              </CardDescription>
              <Button className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600">Create EULA</Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/quotation" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Quotation</CardTitle>
              <Calculator className="h-8 w-8 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base min-h-[60px]">
                Create price quotations for font licensing and services.
              </CardDescription>
              <Button className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600">Create Quotation</Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/invoice" className="block">
          <Card className="h-full transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Invoice</CardTitle>
              <FileInvoice className="h-8 w-8 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base min-h-[60px]">
                Generate professional invoices for clients.
              </CardDescription>
              <Button className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600">Create Invoice</Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
