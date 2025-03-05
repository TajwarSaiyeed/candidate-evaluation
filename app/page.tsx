"use client";
import Link from "next/link";
import { Briefcase, Users, BarChart3, Brain, Zap, Shield } from "lucide-react";
import HeroSection from "./components/hero-section";
import AIFeatureSection from "./components/ai-feature-section";
import TestimonialSection from "./components/testimonial-section";
import CTASection from "./components/cta-section";
import FeatureCard from "./components/feature-card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main>
        <HeroSection />

        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Streamline Your Recruitment Process
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Our AI-powered platform helps you find the perfect candidates
                while providing applicants with valuable feedback on their
                applications.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Users className="h-10 w-10 text-primary" />}
                title="Easy Application Process"
                description="Streamlined application form with resume upload and skill matching to make applying simple for candidates."
              />
              <FeatureCard
                icon={<BarChart3 className="h-10 w-10 text-primary" />}
                title="Comprehensive Dashboard"
                description="Review and evaluate applications with our intuitive admin dashboard designed for hiring managers."
              />
              <FeatureCard
                icon={<Brain className="h-10 w-10 text-primary" />}
                title="AI-Powered Evaluation"
                description="Our AI analyzes candidate applications and provides objective scoring to help with your decision making."
              />
              <FeatureCard
                icon={<Zap className="h-10 w-10 text-primary" />}
                title="Real-time Feedback"
                description="Candidates receive instant AI-powered feedback on their applications to help them improve."
              />
              <FeatureCard
                icon={<Shield className="h-10 w-10 text-primary" />}
                title="Secure & Private"
                description="Your data and candidate information are protected with enterprise-grade security measures."
              />
              <FeatureCard
                icon={<Briefcase className="h-10 w-10 text-primary" />}
                title="Job Listing Management"
                description="Easily create, edit and manage internship positions with detailed requirements and descriptions."
              />
            </div>
          </div>
        </section>

        <section className="py-20 bg-black">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How It Works
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Our platform makes it easy for both candidates and recruiters to
                streamline the internship application process.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-gray-900 rounded-xl p-8 text-center border border-gray-800 hover:border-primary transition-colors">
                <div className="bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Apply for Positions</h3>
                <p className="text-gray-400">
                  Fill out our application form and upload your resume to be
                  considered for internship positions.
                </p>
              </div>

              <div className="bg-gray-900 rounded-xl p-8 text-center border border-gray-800 hover:border-primary transition-colors">
                <div className="bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-4">AI Evaluation</h3>
                <p className="text-gray-400">
                  Our AI system analyzes your application and provides feedback
                  on your qualifications and fit.
                </p>
              </div>

              <div className="bg-gray-900 rounded-xl p-8 text-center border border-gray-800 hover:border-primary transition-colors">
                <div className="bg-gray-800 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Get Hired</h3>
                <p className="text-gray-400">
                  Recruiters review top candidates and make informed decisions
                  based on skills and AI insights.
                </p>
              </div>
            </div>
          </div>
        </section>

        <AIFeatureSection />

        <TestimonialSection />

        <CTASection />
      </main>

      <footer className="border-t border-gray-800 py-12 bg-black">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Briefcase className="h-6 w-6" />
                <span className="text-xl font-bold">CAS</span>
              </div>
              <p className="text-gray-400 mb-4">
                AI-powered candidate application system for internship
                positions.
              </p>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  <span className="sr-only">GitHub</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Apply Now
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Admin Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              © {new Date().getFullYear()} Candidate Application System. All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
