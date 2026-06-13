import { BalanceList } from "./components/balance-list";
import { RecentRequestsTable } from "./components/recent-requests-table";
import { RequestSection } from "./components/request-section";
import { requests } from "./data/requests";

export default function TimeOffPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-950">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center px-6">
          <p className="text-base font-semibold tracking-normal">ExampleHR</p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1200px] px-6 py-10">
        <section className="mb-8">
          <p className="text-sm font-medium text-zinc-500">Employee workspace</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal text-zinc-950">
            Time Off
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-zinc-600">
            Request time off and track balance changes.
          </p>
        </section>

        <section
          aria-labelledby="balance-cards-heading"
          className="mb-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <h2
            id="balance-cards-heading"
            className="text-lg font-semibold tracking-normal text-zinc-950"
          >
            Balance cards
          </h2>
          <div className="mt-5">
            <BalanceList />
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
          <section
            aria-labelledby="request-form-heading"
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <h2
              id="request-form-heading"
              className="text-lg font-semibold tracking-normal text-zinc-950"
            >
              Request form
            </h2>
            <div className="mt-5">
              <RequestSection />
            </div>
          </section>

          <section
            aria-labelledby="recent-requests-heading"
            className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"
          >
            <h2
              id="recent-requests-heading"
              className="text-lg font-semibold tracking-normal text-zinc-950"
            >
              Recent requests table
            </h2>
            <div className="mt-5">
              <RecentRequestsTable requests={requests} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
