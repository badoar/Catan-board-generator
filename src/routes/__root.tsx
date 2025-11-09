import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-7">
              <div className="flex items-center space-x-4 py-4">
                <Link
                  to="/"
                  className="px-4 py-2 text-gray-700 hover:text-blue-500 transition duration-300"
                  activeProps={{
                    className: 'text-blue-500 font-semibold',
                  }}
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="px-4 py-2 text-gray-700 hover:text-blue-500 transition duration-300"
                  activeProps={{
                    className: 'text-blue-500 font-semibold',
                  }}
                >
                  About
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </main>
      <TanStackRouterDevtools />
    </div>
  ),
})
