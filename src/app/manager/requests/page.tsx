import { AppHeader } from "../../../components/app-header";
import { ManagerRequestsClient } from "./components/manager-requests-client";

export default function ManagerRequestsPage() {
  return (
    <div className="min-h-screen bg-[#FEFEFD] text-[#1C1A18]">
      <AppHeader showBackLink />

      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <div className="mb-8 border-b border-[#F6F0E9] pb-8">
          <p className="text-xs font-medium uppercase tracking-widest text-[#904209]">
            Manager workspace
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[#1C1A18]">
            Manager Review
          </h1>
        </div>

        <ManagerRequestsClient />
      </main>
    </div>
  );
}
