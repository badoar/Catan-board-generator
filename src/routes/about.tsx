import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">About</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-700 mb-4">
          This is a starter template for building modern web applications with:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
          <li>React for building user interfaces</li>
          <li>TypeScript for type safety</li>
          <li>TanStack Router for type-safe routing</li>
          <li>Tailwind CSS for styling</li>
          <li>ESLint for code quality</li>
          <li>Vite for fast development and building</li>
        </ul>
        <p className="text-gray-700">
          Navigate between pages using the navigation menu above to see routing in action!
        </p>
      </div>
    </div>
  )
}
