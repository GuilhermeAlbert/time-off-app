import Link from "next/link";

type Props = {
  showBackLink?: boolean;
};

export function AppHeader({ showBackLink = false }: Props) {
  return (
    <header className="border-b border-[#F6F0E9]">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-6">
        <Link href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="ExampleHR"
            draggable={false}
            className="h-8 w-auto"
          />
        </Link>
        {showBackLink && (
          <Link href="/" className="text-sm text-zinc-500">
            Back to navigation
          </Link>
        )}
      </div>
    </header>
  );
}
