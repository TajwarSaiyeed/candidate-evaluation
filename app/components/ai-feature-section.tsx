import Image from "next/image"
import { Brain, CheckCircle } from "lucide-react"

export default function AIFeatureSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
              <Brain className="h-5 w-5 mr-2" />
              <span className="text-sm font-medium">AI-Powered Evaluation</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Intelligent Candidate Assessment</h2>
            <p className="text-gray-400 mb-8">
              Our advanced AI algorithms analyze candidate applications to provide objective scoring and feedback,
              helping both recruiters make better decisions and candidates improve their applications.
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Skill Matching</h3>
                  <p className="text-gray-400">Automatically match candidate skills with job requirements</p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Resume Analysis</h3>
                  <p className="text-gray-400">Extract and evaluate key information from candidate resumes</p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Personalized Feedback</h3>
                  <p className="text-gray-400">
                    Provide candidates with actionable insights to improve their applications
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-primary mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Bias Reduction</h3>
                  <p className="text-gray-400">Minimize unconscious bias in the candidate selection process</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-xl opacity-50 rounded-xl"></div>
            <div className="relative rounded-xl overflow-hidden border border-gray-800">
              <Image
                src="/ai.png"
                alt="AI Evaluation Dashboard"
                width={600}
                height={400}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

