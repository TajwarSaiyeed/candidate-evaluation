"use client";

import { Suspense, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { supabase } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileUploader } from "@/components/file-uploader";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Database } from "@/lib/supabase/database.types";
import { toast } from "sonner";

type Job = Database["public"]["Tables"]["jobs"]["Row"];

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  linkedinUrl: z
    .string()
    .url({
      message: "Please enter a valid LinkedIn URL.",
    })
    .optional()
    .or(z.literal("")),
  skills: z.string().min(10, {
    message: "Please provide at least a few skills.",
  }),
  experience: z.string().min(20, {
    message: "Please provide some details about your experience.",
  }),
  jobId: z.string().optional(),
});

function ApplyPageContent() {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const jobId = searchParams.get("jobId");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: user?.email || "",
      linkedinUrl: "",
      skills: "",
      experience: "",
      jobId: jobId || undefined,
    },
  });

  useEffect(() => {
    if (user?.email) {
      form.setValue("email", user.email);
    }
  }, [user, form]);

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching jobs:", error);
      } else {
        setJobs(data || []);
      }
      setLoading(false);
    }

    fetchJobs();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!file) {
      toast.error("Resume Required", {
        description: "Please upload your resume before submitting.",
      });
      return;
    }

    setIsSubmitting(true);
    setParseError(null);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const parseResponse = await fetch("/api/parse-resume", {
        method: "POST",
        body: formData,
      });

      if (!parseResponse.ok) {
        throw new Error("Failed to parse resume");
      }

      const parseData = await parseResponse.json();

      if (parseData.error) {
        setParseError(parseData.error);
        toast.error("Resume Processing", {
          description:
            parseData.error ||
            "Your resume was received, but some details couldn't be automatically extracted. Your application will still be processed.",
        });
      }
      const jobIdToSave = values.jobId === "general" ? null : values.jobId;

      const { error: insertError } = await supabase
        .from("applications")
        .insert({
          user_id: user?.id || null,
          name: values.name,
          email: values.email,
          linkedin_url: values.linkedinUrl || null,
          skills: values.skills,
          experience: values.experience,
          resume_text: parseData.text || "Resume text could not be extracted",
          resume_keywords: parseData.keywords || [],
          job_id: jobIdToSave,
          status: "New",
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      toast.success("Application Submitted", {
        description: "Your application has been successfully submitted.",
      });

      router.push("/apply/confirmation");
    } catch (error) {
      console.error("Application submission error:", error);
      toast.error("Submission Failed", {
        description:
          "There was an error submitting your application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Internship Application</CardTitle>
          <CardDescription>
            Fill out the form below to apply for our internship position. All
            fields are required unless marked optional.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="john.doe@example.com"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedinUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn URL (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://linkedin.com/in/johndoe"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Your LinkedIn profile URL is optional but recommended.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="jobId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">
                          General Application
                        </SelectItem>
                        {jobs.map((job) => (
                          <SelectItem key={job.id} value={job.id}>
                            {job.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the position you&apos;re applying for, or leave as
                      &quot;General Application&quot;
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Resume (PDF)</FormLabel>
                <FileUploader
                  onFileSelect={setFile}
                  currentFile={file}
                  acceptedFileTypes={{
                    "application/pdf": [".pdf"],
                  }}
                />
                {file && (
                  <p className="text-sm text-muted-foreground">
                    Selected file: {file.name} ({Math.round(file.size / 1024)}{" "}
                    KB)
                  </p>
                )}
                {parseError && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Note: {parseError}
                  </p>
                )}
              </div>

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skills</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="List your relevant skills (e.g., JavaScript, React, Node.js, etc.)"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List your technical and soft skills relevant to the
                      position.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your relevant work experience, projects, or education"
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide details about your relevant experience, including
                      projects, internships, or coursework.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={loading || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <Button variant="outline" onClick={() => router.push("/")}>
            Cancel
          </Button>
          <p className="text-sm text-muted-foreground">
            All information will be kept confidential.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ApplyPageContent />
    </Suspense>
  );
}
