import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-600 mb-4">
          Hello World!
        </h1>
        <p className="text-xl text-gray-700 mb-8">
          Welcome to React + TypeScript + TanStack Router + Tailwind CSS
        </p>
        <div className="space-y-2 text-left bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⚛️</span>
            <span className="font-semibold">React 18</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">📘</span>
            <span className="font-semibold">TypeScript</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🚀</span>
            <span className="font-semibold">TanStack Router</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🎨</span>
            <span className="font-semibold">Tailwind CSS</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">✅</span>
            <span className="font-semibold">ESLint</span>
          </div>
        </div>
      </div>
    </div>
  )
}
