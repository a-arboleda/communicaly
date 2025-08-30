type Props = { title: string; children: React.ReactNode; open?: boolean }

export default function Details({ title, children, open = false }: Props) {
  return (
    <details className="my-4" open={open}>
      <summary className="cursor-pointer list-none font-medium">{title}</summary>
      <div className="mt-2">{children}</div>
    </details>
  )
}
