import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <main>
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          Welcome to Sales Dashboard
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Analyze your sales data with ease and efficiency.
        </p>
      </main>
    </div>
  );
}
