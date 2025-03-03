"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  MapPin,
  Clock,
  Calendar,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/database.types";

// Define Job type based on Supabase schema
type Job = Database["public"]["Tables"]["jobs"]["Row"];

export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJob() {
      if (!id) return;
      const jobId = Array.isArray(id) ? id[0] : id;
      setLoading(true);

      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .single();

      if (error) {
        console.error("Error fetching job:", error);
      } else {
        setJob(data);
      }
      setLoading(false);
    }

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-gray-500" size={32} />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <p>Job not found.</p>
        <Link href="/jobs">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2" /> Back to Jobs
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{job.title}</CardTitle>
          <CardDescription>{job.department}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-gray-600">
            <Badge variant="outline">
              <Briefcase className="mr-2" size={16} /> {job.type}
            </Badge>
            <Badge variant="outline">
              <MapPin className="mr-2" size={16} /> {job.location}
            </Badge>
            <Badge variant="outline">
              <Clock className="mr-2" size={16} />{" "}
              {job.is_active ? "Open" : "Closed"}
            </Badge>
            <Badge variant="outline">
              <Calendar className="mr-2" size={16} />{" "}
              {new Date(job.created_at).toDateString()}
            </Badge>
          </div>
          <Separator className="my-4" />
          <p className="text-gray-700 leading-relaxed">{job.description}</p>
          <h3 className="mt-6 font-semibold">Requirements:</h3>
          <ul className="list-disc list-inside text-gray-600">
            {job.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link href="/jobs">
            <Button variant="outline">
              <ArrowLeft className="mr-2" /> Back
            </Button>
          </Link>
          <Link href={`/apply?jobId=${job.id}`}>
            <Button>Apply Now</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
