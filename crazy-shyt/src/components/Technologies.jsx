export default function Technologies() {
    const technologies = [
      {
        name: "Next.js",
        description: "React framework for production",
        icon: "/api/placeholder/48/48", // Replace with actual logo
        url: "https://nextjs.org/",
      },
      {
        name: "React",
        description: "JavaScript library for building user interfaces",
        icon: "/api/placeholder/48/48", // Replace with actual logo
        url: "https://reactjs.org/",
      },
      {
        name: "Tailwind CSS",
        description: "Utility-first CSS framework",
        icon: "/api/placeholder/48/48", // Replace with actual logo
        url: "https://tailwindcss.com/",
      },
      {
        name: "Your Technology",
        description: "Add any other tech you used",
        icon: "/api/placeholder/48/48", // Replace with actual logo
        url: "#",
      },
    ];
  
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Technologies Used
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Built with the latest and greatest tools
            </p>
          </div>
          
          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {technologies.map((tech) => (
                <div key={tech.name} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                      <img
                        src={tech.icon}
                        alt={tech.name}
                        className="h-8 w-8"
                      />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                      {tech.name}
                    </p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    {tech.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    );
  }
  