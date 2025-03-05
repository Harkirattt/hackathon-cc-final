export default function HeroSection() {
  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20 bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6 xl:col-span-5">
            <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
              Real Estate Voice Messenger
            </h1>
            <p className="mt-6 text-xl text-indigo-100">
              Break language barriers in real estate communication with AI-powered multilingual voice translation. Seamlessly connect with clients and colleagues across different languages.
            </p>
            <div className="mt-8 sm:flex">
              <div className="rounded-md shadow">
                <a href="#demo" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 md:py-3 md:text-lg md:px-10">
                  Watch Demo
                </a>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <a href="https://github.com/Harkirattt/hackathon-cc-final" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-800 bg-opacity-60 hover:bg-opacity-70 md:py-3 md:text-lg md:px-10">
                  GitHub Repository
                </a>
              </div>
            </div>
            <div className="mt-6 flex items-center space-x-4">
              <span className="text-sm text-indigo-100">
                Built by passionate developers at Cyber Cypher 4.0
              </span>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:col-span-6 xl:col-span-7">
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg shadow-xl overflow-hidden">
              <div className="h-64 md:h-80 lg:h-96 bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="mb-4 flex justify-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="100" 
                      height="100" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="1" 
                      className="text-white"
                    >
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                      <line x1="12" y1="19" x2="12" y2="22"/>
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold mb-2">
                    Multilingual Voice Messenger
                  </h2>
                  <p className="text-indigo-100 max-w-md mx-auto">
                    Real-time speech recognition and translation for seamless global communication
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}