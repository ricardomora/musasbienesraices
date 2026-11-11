import Link from "next/link";

const LINKS = [
  { href: "/dashboard/inmuebles", label: "Mis inmuebles" },
  { href: "/dashboard/mensajes", label: "Mensajes" },
  { href: "/dashboard/preferencial", label: "Preferencial" },
  { href: "/publicar", label: "Publicar" },
  { href: "/admin", label: "Admin" },
];

export function DashboardNav() {
  return (
    <nav className="flex flex-wrap gap-4 border-b border-white/10 px-5 py-4 text-sm sm:px-8">
      <Link href="/" className="font-semibold text-white">
        musas<span className="text-neon">.</span>
      </Link>
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="text-white/70 hover:text-neon"
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
