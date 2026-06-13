import Link from "next/link";

export default function DevNavigationPage() {
  return (
    <div className="min-h-screen bg-[#FEFEFD] text-[#1C1A18]">
      <header className="border-b border-[#F6F0E9]">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center px-6 justify-between">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-[#1C1A18]"
          >
            <img
              src="/logo.png"
              alt="ExampleHR"
              draggable={false}
              className="h-8"
            />
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-12">
        <div className="mb-10">
          <p className="text-xs font-medium uppercase tracking-widest text-[#904209]">
            Development
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            Navigation
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            Quick access to implemented screens
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/time-off"
            className="block rounded-xl border border-[#F6F0E9] bg-[#FEFBF5] p-5 transition-colors hover:border-[#E8D8C6]"
          >
            <p className="text-xs font-medium text-[#904209]">Employee</p>
            <p className="mt-1.5 text-sm font-semibold text-[#1C1A18]">
              Employee Time Off
            </p>
            <p className="mt-1 font-mono text-xs text-zinc-400">/time-off</p>
          </Link>

          <Link
            href="/manager/requests"
            className="block rounded-xl border border-[#F6F0E9] bg-[#FEFBF5] p-5 transition-colors hover:border-[#E8D8C6]"
          >
            <p className="text-xs font-medium text-[#904209]">Manager</p>
            <p className="mt-1.5 text-sm font-semibold text-[#1C1A18]">
              Manager Requests
            </p>
            <p className="mt-1 font-mono text-xs text-zinc-400">
              /manager/requests
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
