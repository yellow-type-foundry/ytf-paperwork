import Link from "next/link"

export default function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <img src="/YTF-LOGO.svg" alt="Yellow Type Foundry Logo" className="h-8 w-auto" />
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/quotation" className="text-sm font-medium transition-colors hover:text-primary">
              Quotation
            </Link>
            <Link href="/eula-editor" className="text-sm font-medium transition-colors hover:text-primary">
              EULA Editor
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
        </div>
      </div>
    </header>
  )
}
