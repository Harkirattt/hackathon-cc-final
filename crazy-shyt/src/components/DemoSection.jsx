export default function DemoSection() {
    return (
      <section id="demo" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              See it in Action
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Watch how our project works or try it yourself
            </p>
          </div>
          
          <div className="mt-12 lg:mt-16 bg-white shadow rounded-lg overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              {/* Replace with your demo video, GIF, or interactive element */}
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center text-gray-400">
                [Your Demo Video/Interactive Demo Goes Here]
              </div>
            </div>
            
            <div className="px-6 py-8">
              <h3 className="text-2xl font-bold text-gray-900">
                How It Works
              </h3>
              <p className="mt-4 text-gray-600">
                Explain the key steps or processes that make your project work. You could include:
              </p>
              <ul className="mt-4 space-y-2 text-gray-600 list-disc list-inside">
                <li>Technical overview of your solution</li>
                <li>Key technologies or algorithms used</li>
                <li>User flow or system architecture</li>
                <li>Challenges overcome during development</li>
              </ul>
              
              <div className="mt-8">
                <a
                  href="https://github.com/yourusername/project"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Try it yourself
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }