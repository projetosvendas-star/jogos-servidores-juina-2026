export function SiteFooter({ dark = true }: { dark?: boolean }) {
  return (
    <footer className="w-full py-4 text-center">
      <p
        className={`text-[10px] font-bold ${
          dark ? "text-gray-300" : "text-slate-500"
        }`}
      >
        Desenvolvido pelo Departamento de Tecnologia da SME.
      </p>
    </footer>
  );
}
