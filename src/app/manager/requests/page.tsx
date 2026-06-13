import Link from "next/link";
import { ManagerRequestsClient } from "./components/manager-requests-client";

export default function ManagerRequestsPage() {
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

          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-[#1C1A18]"
          >
            <p className="mt-1.5 text-sm text-zinc-500">Back to navigation</p>
          </Link>
        </div>
      </header>

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
