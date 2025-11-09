import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-soft">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center space-x-2 group"
            >
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-medium group-hover:shadow-large transition-shadow duration-300">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
              </div>
              <span className="text-xl font-display font-bold text-primary-500 hidden sm:block">
                Catan Board
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center space-x-1">
              <Link
                to="/"
                className="px-4 py-2 rounded-xl text-neutral-700 hover:bg-neutral-100 font-medium transition-all duration-200"
                activeProps={{
                  className: 'bg-neutral-100 text-primary-500 font-semibold',
                }}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="px-4 py-2 rounded-xl text-neutral-700 hover:bg-neutral-100 font-medium transition-all duration-200"
                activeProps={{
                  className: 'bg-neutral-100 text-primary-500 font-semibold',
                }}
              >
                About
              </Link>
              <button className="ml-4 btn-primary hidden sm:block">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-5rem)]">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-display font-bold text-lg mb-4 text-neutral-900">
                Catan Board Generator
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                Create beautiful and balanced Catan game boards with our modern, easy-to-use tool.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-neutral-900">Quick Links</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>
                  <Link to="/" className="hover:text-primary-500 transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-primary-500 transition-colors">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-neutral-900">Built With</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>React + TypeScript</li>
                <li>TanStack Router</li>
                <li>Tailwind CSS</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-200 mt-8 pt-8 text-center text-sm text-neutral-500">
            © {new Date().getFullYear()} Catan Board Generator. Built with care.
          </div>
        </div>
      </footer>

      <TanStackRouterDevtools />
    </div>
  ),
})
