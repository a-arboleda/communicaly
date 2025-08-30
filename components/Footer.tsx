// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="container py-10 text-sm text-gray-600">
        <p>© {new Date().getFullYear()} <strong>Communicaly</strong> — built for active listening & shadowing.</p>
      </div>
    </footer>
  )
}
