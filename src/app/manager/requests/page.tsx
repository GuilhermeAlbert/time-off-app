import { ManagerRequestsClient } from "./components/manager-requests-client";

export default function ManagerRequestsPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center px-6">
          <p className="text-base font-semibold tracking-normal">ExampleHR</p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1200px] px-6 py-10">
        <section className="mb-8">
          <p className="text-sm font-medium text-zinc-500">Manager workspace</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal text-zinc-950">
            Manager Review
          </h1>
        </section>

        <ManagerRequestsClient />
      </main>
    </div>
  );
}
