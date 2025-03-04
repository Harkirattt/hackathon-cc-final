export default function HeroSection() {
    return (
      <section className="pt-24 pb-12 md:pt-32 md:pb-20 bg-gradient-to-br from-indigo-500 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6 xl:col-span-5">
              <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
                Your Amazing Hackathon Project
              </h1>
              <p className="mt-6 text-xl text-indigo-100">
                A brief, compelling description of what your project does and the problem it solves. Make it count!
              </p>
              <div className="mt-8 sm:flex">
                <div className="rounded-md shadow">
                  <a href="#demo" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 md:py-3 md:text-lg md:px-10">
                    View Demo
                  </a>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a href="https://github.com/yourusername/project" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-800 bg-opacity-60 hover:bg-opacity-70 md:py-3 md:text-lg md:px-10">
                    GitHub
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-6 xl:col-span-7">
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg shadow-xl overflow-hidden">
                {/* Replace with your project screenshot or demo */}
                <div className="h-64 md:h-80 lg:h-96 bg-gray-200 flex items-center justify-center text-gray-400">
                  [Your Project Screenshot/Demo]
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }