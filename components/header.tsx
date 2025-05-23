import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">YTF</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/eula" className="text-sm font-medium transition-colors hover:text-primary">
              EULA
            </Link>
            <Link href="/quotation" className="text-sm font-medium transition-colors hover:text-primary">
              Quotation
            </Link>
            <Link href="/invoice" className="text-sm font-medium transition-colors hover:text-primary">
              Invoice
            </Link>
            <Link href="/eula-editor" className="text-sm font-medium transition-colors hover:text-primary">
              EULA Editor
            </Link>
            <Link href="/eula-field-finder" className="text-sm font-medium transition-colors hover:text-primary">
              Field Finder
            </Link>
            <Link href="/pdf-test" className="text-sm font-medium transition-colors hover:text-primary">
              PDF Test
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
