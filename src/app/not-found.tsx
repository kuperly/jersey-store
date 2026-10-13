import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4 text-center">
      <div>
        <p className="text-8xl font-black text-brand">404</p>
        <h1 className="mb-6 text-2xl font-bold">העמוד לא נמצא</h1>
        <Link href="/" className="btn-brand rounded-full px-8 py-3 font-bold">לדף הבית</Link>
      </div>
    </div>
  );
}
