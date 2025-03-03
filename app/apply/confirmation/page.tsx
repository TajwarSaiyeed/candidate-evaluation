import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConfirmationPage() {
  return (
    <div className="container mx-auto py-10 max-w-md">
      <Card className="text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-2xl">Application Submitted!</CardTitle>
          <CardDescription>
            Thank you for applying to our internship program
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We have received your application and will review it shortly. You will receive an email confirmation with further details.
          </p>
          <div className="border rounded-lg p-4 bg-muted/50 mb-4">
            <h3 className="font-medium mb-2">What happens next?</h3>
            <ol className="text-sm text-left list-decimal pl-5 space-y-1">
              <li>Our team will review your application</li>
              <li>We&apos;ll match your skills with our open positions</li>
              <li>Qualified candidates will be contacted for interviews</li>
              <li>You&apos;ll receive AI-powered feedback on your application</li>
            </ol>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center space-x-4">
          <Button asChild variant="outline">
            <Link href="/">Return Home</Link>
          </Button>
          <Button asChild>
            <Link href="/jobs">Browse More Positions</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}