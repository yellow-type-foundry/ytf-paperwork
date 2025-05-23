"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PdfTestPage() {
  const [testResults, setTestResults] = useState<string[]>([])

  const testPdfFile = async () => {
    const results: string[] = []
    const pdfUrl = "/documents/YTF-EULA.pdf"

    try {
      results.push(`Testing PDF at: ${pdfUrl}`)

      // Test 1: Check if file exists
      results.push("Test 1: Checking if file exists...")
      const headResponse = await fetch(pdfUrl, { method: "HEAD" })
      results.push(`HEAD response status: ${headResponse.status}`)
      results.push(`Content-Type: ${headResponse.headers.get("content-type") || "Not specified"}`)
      results.push(`Content-Length: ${headResponse.headers.get("content-length") || "Not specified"}`)

      if (!headResponse.ok) {
        results.push("❌ File does not exist or is not accessible")
        setTestResults(results)
        return
      }

      results.push("✅ File exists and is accessible")

      // Test 2: Fetch the file content
      results.push("Test 2: Fetching file content...")
      const response = await fetch(pdfUrl)

      if (!response.ok) {
        results.push(`❌ Failed to fetch file: ${response.statusText}`)
        setTestResults(results)
        return
      }

      const arrayBuffer = await response.arrayBuffer()
      results.push(`File size: ${arrayBuffer.byteLength} bytes`)

      if (arrayBuffer.byteLength === 0) {
        results.push("❌ File is empty")
        setTestResults(results)
        return
      }

      // Test 3: Check PDF header
      results.push("Test 3: Checking PDF header...")
      const uint8Array = new Uint8Array(arrayBuffer)
      const header = new TextDecoder().decode(uint8Array.slice(0, 10))
      results.push(`File header: "${header}"`)

      if (header.startsWith("%PDF-")) {
        results.push("✅ Valid PDF header found")
        const version = header.substring(1, 8)
        results.push(`PDF version: ${version}`)
      } else {
        results.push("❌ Invalid PDF header - this is not a PDF file")
      }

      // Test 4: Try to load with pdf-lib
      results.push("Test 4: Testing with pdf-lib...")
      try {
        const { PDFDocument } = await import("pdf-lib")
        const pdfDoc = await PDFDocument.load(arrayBuffer)
        results.push(`✅ PDF loaded successfully with pdf-lib`)
        results.push(`Number of pages: ${pdfDoc.getPageCount()}`)
      } catch (error) {
        results.push(`❌ pdf-lib failed to load PDF: ${error}`)
      }
    } catch (error) {
      results.push(`❌ Test failed with error: ${error}`)
    }

    setTestResults(results)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">PDF File Test</h1>
        <p className="text-muted-foreground">Test if your PDF file is accessible and valid</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PDF File Diagnostics</CardTitle>
          <CardDescription>This will test if your YTF-EULA.pdf file exists and can be loaded properly</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testPdfFile} className="bg-yellow-500 hover:bg-yellow-600">
            Run PDF Test
          </Button>

          {testResults.length > 0 && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <h3 className="font-medium mb-2">Test Results:</h3>
              <div className="space-y-1 font-mono text-sm">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className={result.includes("❌") ? "text-red-600" : result.includes("✅") ? "text-green-600" : ""}
                  >
                    {result}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-md">
            <h4 className="font-medium mb-2">Expected File Location:</h4>
            <code className="text-sm">public/documents/YTF-EULA.pdf</code>

            <h4 className="font-medium mb-2 mt-4">To fix the issue:</h4>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>
                Make sure your PDF file is named exactly <code>YTF-EULA.pdf</code>
              </li>
              <li>
                Place it in the <code>public/documents/</code> directory
              </li>
              <li>Ensure the file is a valid PDF (try opening it in a PDF viewer)</li>
              <li>Check file permissions (should be readable)</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
