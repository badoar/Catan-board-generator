import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  const features = [
    {
      icon: '🎲',
      title: 'Random Generation',
      description: 'Generate balanced and fair Catan boards with intelligent randomization algorithms.',
      color: 'from-primary-500 to-primary-600',
    },
    {
      icon: '⚖️',
      title: 'Perfect Balance',
      description: 'Ensure every player has equal opportunities with our advanced balancing system.',
      color: 'from-secondary-500 to-secondary-600',
    },
    {
      icon: '🎨',
      title: 'Beautiful Design',
      description: 'Modern, clean interface inspired by the best design practices in the industry.',
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Built with React and Vite for instant load times and smooth interactions.',
      color: 'from-yellow-500 to-orange-600',
    },
  ]

  const techStack = [
    { name: 'React 18', icon: '⚛️', description: 'Modern UI library' },
    { name: 'TypeScript', icon: '📘', description: 'Type-safe code' },
    { name: 'TanStack Router', icon: '🚀', description: 'Type-safe routing' },
    { name: 'Tailwind CSS', icon: '🎨', description: 'Utility-first styling' },
    { name: 'ESLint', icon: '✅', description: 'Code quality' },
    { name: 'Vite', icon: '⚡', description: 'Fast build tool' },
  ]

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center animate-slide-up">
            <div className="inline-block mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-semibold border border-primary-200">
                <span className="animate-pulse mr-2">✨</span>
                Welcome to the future of Catan
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-neutral-900 mb-6 leading-tight">
              Create Amazing
              <span className="block bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
                Catan Boards
              </span>
            </h1>

            <p className="text-xl sm:text-2xl text-neutral-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Generate perfectly balanced game boards with our modern, intuitive tool.
              Built with the latest technologies for the best experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="btn-primary text-lg px-8 py-4">
                Start Generating
              </button>
              <Link to="/about">
                <button className="btn-secondary text-lg px-8 py-4">
                  Learn More
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-75"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-neutral-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Everything you need to create the perfect Catan game board
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card p-8 group hover:scale-105 transition-transform duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-medium group-hover:shadow-large transition-shadow duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-display font-bold text-neutral-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-neutral-900 mb-4">
              Built with Modern Tech
            </h2>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Powered by the best tools and frameworks available today
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className="card p-6 text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="text-4xl mb-3">{tech.icon}</div>
                <h4 className="font-semibold text-neutral-900 mb-1">{tech.name}</h4>
                <p className="text-xs text-neutral-600">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-br from-primary-500 to-secondary-500 p-12 text-center">
              <h2 className="text-4xl font-display font-bold text-white mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Join thousands of players creating better Catan experiences
              </p>
              <button className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-neutral-50 active:scale-95 transition-all duration-200 shadow-large">
                Create Your First Board
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
