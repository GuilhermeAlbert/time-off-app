import { AppHeader } from "../../components/app-header";
import { BalanceList } from "./components/balance-list";
import { RecentRequestsTable } from "./components/recent-requests-table";
import { RequestSection } from "./components/request-section";
import { requests } from "./data/requests";

export default function TimeOffPage() {
  return (
    <div className="min-h-screen bg-[#FEFEFD] text-[#1C1A18]">
      <AppHeader showBackLink />

      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="mb-8 border-b border-[#F6F0E9] pb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-[#904209]">
            Employee workspace
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#1C1A18]">
            Time Off
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            Request time off and track balance changes.
          </p>
        </div>

        <section aria-labelledby="balance-cards-heading" className="mb-8">
          <h2
            id="balance-cards-heading"
            className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400"
          >
            Balance cards
          </h2>
          <BalanceList />
        </section>

        <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
          <section aria-labelledby="request-form-heading">
            <h2
              id="request-form-heading"
              className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400"
            >
              Request form
            </h2>
            <div className="rounded-xl border border-[#F6F0E9] bg-[#FEFBF5] p-6">
              <RequestSection />
            </div>
          </section>

          <section aria-labelledby="recent-requests-heading">
            <h2
              id="recent-requests-heading"
              className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-400"
            >
              Recent requests table
            </h2>
            <div className="overflow-hidden rounded-xl border border-[#F6F0E9] bg-[#FEFBF5]">
              <RecentRequestsTable requests={requests} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
