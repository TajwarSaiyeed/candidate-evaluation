import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Briefcase } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden bg-black">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent opacity-70"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center">
          <Briefcase className="h-16 w-16 mb-6 text-primary" />

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            Candidate Application System
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mb-10">
            Apply for internship positions and get AI-powered feedback on your application
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-16">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-primary transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Apply Now</h3>
                <p className="text-gray-400 text-sm mb-4">Submit your application with resume and skills</p>
                <Button className="w-full mt-auto">Start Application</Button>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-primary transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Job Listings</h3>
                <p className="text-gray-400 text-sm mb-4">Browse available internship positions</p>
                <Button variant="outline" className="w-full mt-auto border-gray-700 hover:bg-gray-800">
                  View Positions
                </Button>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-primary transition-colors">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 p-3 bg-gray-800 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Admin Dashboard</h3>
                <p className="text-gray-400 text-sm mb-4">Review and evaluate candidate applications</p>
                <Button variant="outline" className="w-full mt-auto border-gray-700 hover:bg-gray-800">
                  Admin Login
                </Button>
              </div>
            </div>
          </div>

          <div className="relative w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-gray-800">
            <Image
              src="/hero.png"
              alt="CAS Dashboard"
              width={1200}
              height={675}
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

