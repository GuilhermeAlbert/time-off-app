import Link from "next/link";

export default function DevNavigationPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center px-6">
          <p className="text-base font-semibold tracking-normal">ExampleHR</p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1200px] px-6 py-10">
        <section className="mb-8">
          <h1 className="text-4xl font-semibold tracking-normal text-zinc-950">
            ExampleHR Development Navigation
          </h1>
          <p className="mt-3 text-base text-zinc-600">
            Quick access to implemented screens
          </p>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/time-off"
            className="block rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:border-zinc-400 hover:shadow-md"
          >
            <p className="text-sm font-medium text-zinc-500">Employee</p>
            <p className="mt-1 text-lg font-semibold text-zinc-950">
              Employee Time Off
            </p>
            <p className="mt-1 text-sm text-zinc-600">/time-off</p>
          </Link>

          <Link
            href="/manager/requests"
            className="block rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:border-zinc-400 hover:shadow-md"
          >
            <p className="text-sm font-medium text-zinc-500">Manager</p>
            <p className="mt-1 text-lg font-semibold text-zinc-950">
              Manager Requests
            </p>
            <p className="mt-1 text-sm text-zinc-600">/manager/requests</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
