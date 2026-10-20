import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-2xl font-bold">Not found</h1>
      <p className="mt-2 text-neutral-600">That page doesn&apos;t exist.</p>
      <Link href="/" className="btn mt-6">Back to recipes</Link>
    </div>
  );
}
