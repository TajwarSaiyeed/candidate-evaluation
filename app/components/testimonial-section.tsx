export default function TestimonialSection() {
  return (
    <section className="py-20 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Users Say
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Hear from recruiters and candidates who have transformed their
            hiring process with our platform.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <div className="flex items-center mb-6">
              <div className="mr-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  TR
                </div>
              </div>
              <div>
                <h4 className="font-semibold">Taylor Rodriguez</h4>
                <p className="text-gray-400 text-sm">HR Manager</p>
              </div>
            </div>
            <p className="text-gray-300">
              &quot;The AI evaluation has saved our team countless hours in the
              initial screening process. We&apos;re now able to focus on the
              most promising candidates and make better hiring decisions.&quot;
            </p>
            <div className="flex mt-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="h-5 w-5 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <div className="flex items-center mb-6">
              <div className="mr-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  JP
                </div>
              </div>
              <div>
                <h4 className="font-semibold">Jamie Park</h4>
                <p className="text-gray-400 text-sm">
                  Software Engineering Intern
                </p>
              </div>
            </div>
            <p className="text-gray-300">
              &quot;The feedback I received from the AI helped me improve my
              resume and application. I was able to highlight my relevant skills
              better and eventually landed my dream internship.&quot;
            </p>
            <div className="flex mt-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="h-5 w-5 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <div className="flex items-center mb-6">
              <div className="mr-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                  AS
                </div>
              </div>
              <div>
                <h4 className="font-semibold">Alex Smith</h4>
                <p className="text-gray-400 text-sm">Technical Recruiter</p>
              </div>
            </div>
            <p className="text-gray-300">
              &quot;The dashboard makes it so easy to compare candidates and see
              their skill matches. The AI scoring has been surprisingly accurate
              in predicting which candidates will perform well.&quot;
            </p>
            <div className="flex mt-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className="h-5 w-5 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
