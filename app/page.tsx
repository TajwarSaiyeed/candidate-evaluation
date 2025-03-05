import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { FileText, Users, Search, BriefcaseBusiness } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <header className="container mx-auto py-8 md:py-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <BriefcaseBusiness className="h-16 w-16 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Candidate Application System</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Apply for internship positions and get AI-powered feedback on your application
          </p>
        </div>
      </header>

      <main className="container mx-auto py-8 md:py-12 px-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Apply Now
              </CardTitle>
              <CardDescription>
                Submit your application with resume and skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Fill out our application form and upload your resume to be considered for our internship positions.
              </p>
              <Button asChild className="w-full">
                <Link href="/apply">Start Application</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Job Listings
              </CardTitle>
              <CardDescription>
                Browse available internship positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Explore our current internship openings and find the perfect match for your skills and career goals.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/jobs">View Positions</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Admin Dashboard
              </CardTitle>
              <CardDescription>
                Review and evaluate candidate applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Access the admin dashboard to review applications, compare candidates, and make hiring decisions.
              </p>
              <Button asChild variant="secondary" className="w-full">
                <Link href="/admin">Admin Login</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t mt-12 px-5">
        <div className="container mx-auto py-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground">
            © 2025 Candidate Application System. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}