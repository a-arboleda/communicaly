// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="border-t mt-16 print:hidden">
      <div className="container py-10 text-sm text-gray-600">
        <p>© {new Date().getFullYear()} <strong>Communicaly</strong> — built for clear, real-life English.</p>
        <p className="mt-2">English doesn’t have to feel rushed to be real.</p>
      </div>
    </footer>
  )
}
