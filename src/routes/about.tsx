import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  const technologies = [
    {
      name: 'React 18',
      icon: '⚛️',
      description: 'A modern JavaScript library for building user interfaces with components',
      benefits: ['Component-based', 'Virtual DOM', 'Rich ecosystem', 'Strong community'],
    },
    {
      name: 'TypeScript',
      icon: '📘',
      description: 'JavaScript with syntax for types, providing better tooling and safer code',
      benefits: ['Type safety', 'Better IDE support', 'Fewer runtime errors', 'Self-documenting'],
    },
    {
      name: 'TanStack Router',
      icon: '🚀',
      description: 'A fully type-safe React router with built-in data loading',
      benefits: ['Type-safe routes', 'Code splitting', 'Data loading', 'Developer tools'],
    },
    {
      name: 'Tailwind CSS',
      icon: '🎨',
      description: 'A utility-first CSS framework for rapidly building custom designs',
      benefits: ['Utility classes', 'Responsive design', 'Custom theming', 'Small bundle size'],
    },
    {
      name: 'Vite',
      icon: '⚡',
      description: 'Next generation frontend tooling with lightning fast HMR',
      benefits: ['Fast dev server', 'Optimized builds', 'Plugin ecosystem', 'Modern defaults'],
    },
    {
      name: 'ESLint',
      icon: '✅',
      description: 'Pluggable linting utility for identifying and fixing code problems',
      benefits: ['Code quality', 'Consistent style', 'Error prevention', 'Customizable rules'],
    },
  ]

  const values = [
    {
      title: 'Modern',
      icon: '✨',
      description: 'Built with the latest web technologies and best practices',
    },
    {
      title: 'Fast',
      icon: '⚡',
      description: 'Optimized for performance with Vite and modern build tools',
    },
    {
      title: 'Type-Safe',
      icon: '🛡️',
      description: 'Full TypeScript support for safer, more maintainable code',
    },
    {
      title: 'Beautiful',
      icon: '🎨',
      description: 'Designed with attention to detail and user experience',
    },
  ]

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="py-20 px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold border border-primary-200">
              About This Project
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-display font-bold text-neutral-900 mb-6">
            Built with
            <span className="block bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
              Modern Excellence
            </span>
          </h1>
          <p className="text-xl text-neutral-600 leading-relaxed max-w-3xl mx-auto">
            This is a professional-grade starter template showcasing the power of modern web development.
            Designed with Airbnb-inspired aesthetics and built with industry-leading technologies.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="card p-8 text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-display font-bold text-neutral-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-neutral-900 mb-4">
              Technology Stack
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Each technology was carefully selected to provide the best developer and user experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="card p-8 hover:scale-105 transition-transform duration-300"
              >
                <div className="flex items-center mb-4">
                  <span className="text-5xl mr-4">{tech.icon}</span>
                  <h3 className="text-2xl font-display font-bold text-neutral-900">
                    {tech.name}
                  </h3>
                </div>
                <p className="text-neutral-600 mb-6 leading-relaxed">
                  {tech.description}
                </p>
                <div className="space-y-2">
                  {tech.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center text-sm text-neutral-700">
                      <svg
                        className="w-5 h-5 text-primary-500 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold text-neutral-900 mb-6">
                What Makes This Special?
              </h2>
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">Lightning Fast</h3>
                    <p className="text-neutral-600">
                      Vite provides instant server start and lightning-fast HMR for the best developer experience.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">Type-Safe</h3>
                    <p className="text-neutral-600">
                      Full TypeScript integration with TanStack Router ensures type safety across your entire application.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">Beautiful Design</h3>
                    <p className="text-neutral-600">
                      Airbnb-inspired theme with carefully crafted colors, shadows, and animations.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-12 bg-gradient-to-br from-primary-500 to-secondary-500">
              <div className="text-center text-white">
                <h3 className="text-3xl font-display font-bold mb-4">
                  Ready to Build?
                </h3>
                <p className="text-white/90 mb-8 text-lg">
                  This template is production-ready and perfect for your next project.
                </p>
                <Link to="/">
                  <button className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-neutral-50 active:scale-95 transition-all duration-200 shadow-large">
                    Back to Home
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GitHub Pages Info */}
      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 md:p-12">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="ml-6">
                <h3 className="text-2xl font-display font-bold text-neutral-900 mb-3">
                  Configured for GitHub Pages
                </h3>
                <p className="text-neutral-600 mb-4 leading-relaxed">
                  This project uses hash-based routing to work seamlessly with GitHub Pages static hosting.
                  It includes a GitHub Actions workflow for automatic deployment on every push to the main branch.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-lg font-medium">
                    Hash Routing
                  </span>
                  <span className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-lg font-medium">
                    GitHub Actions
                  </span>
                  <span className="px-3 py-1 bg-neutral-100 text-neutral-700 text-sm rounded-lg font-medium">
                    Auto Deploy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
