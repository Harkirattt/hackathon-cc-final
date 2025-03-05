export default function DemoSection() {
  return (
    <section id="demo" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Real-Time Translation in Action
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Experience seamless multilingual communication for real estate professionals
          </p>
        </div>
        
        <div className="mt-12 lg:mt-16 bg-white shadow-lg rounded-2xl overflow-hidden">
          <div className="aspect-w-16 aspect-h-9">
            <div className="w-full h-96 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white">
              <div className="text-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-24 w-24 mx-auto mb-4 text-white opacity-80" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="22"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 22h8"/>
                </svg>
                <h3 className="text-2xl font-bold mb-2">
                  Demo Video Coming Soon
                </h3>
                <p className="text-indigo-100 max-w-md mx-auto">
                  We're preparing a comprehensive demonstration of our voice messenger in action
                </p>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-8">
            <h3 className="text-2xl font-bold text-gray-900">
              How Voice Messenger Works
            </h3>
            <p className="mt-4 text-gray-600">
              Our innovative solution leverages cutting-edge technologies to transform real estate communication:
            </p>
            <ul className="mt-4 space-y-3 text-gray-600 list-disc list-inside">
              <li>
                <strong>Speech Recognition:</strong> Converts spoken language into text with high accuracy
              </li>
              <li>
                <strong>AI Translation:</strong> Instantly translates conversations across 10+ languages
              </li>
              <li>
                <strong>Context Extraction:</strong> Generates summaries and identifies key conversation topics
              </li>
              <li>
                <strong>Real-Time Collaboration:</strong> Enables seamless communication across language barriers
              </li>
            </ul>
            
            <div className="mt-8 flex space-x-4">
              <a
                href="https://github.com/Harkirattt/hackathon-cc-final"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                View GitHub Repository
              </a>
              <a
                href="#features"
                className="inline-flex items-center px-6 py-3 border border-indigo-600 text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}