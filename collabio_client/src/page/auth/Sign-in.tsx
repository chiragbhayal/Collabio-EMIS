import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import Logo from "@/components/logo";
import GoogleOauthButton from "@/components/auth/google-oauth-button";
import { useMutation } from "@tanstack/react-query";
import { loginMutationFn } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Loader, Users } from "lucide-react";

const SignIn = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl");

  const { mutate, isPending } = useMutation({
    mutationFn: loginMutationFn,
  });

  // Test users for development with different roles and scenarios  
  const testUsers = [
    // Business Owners
    { email: "sarah.chen@techcorp.com", password: "owner123", name: "Sarah Chen", role: "Owner", company: "TechCorp Solutions" },
    { email: "michael@startupco.com", password: "startup2024", name: "Michael Rodriguez", role: "Owner", company: "StartupCo" },
    
    // Project Managers / Admins
    { email: "emily.johnson@techcorp.com", password: "projectman123", name: "Emily Johnson", role: "Admin", company: "TechCorp Solutions" },
    { email: "david.kim@startupco.com", password: "admin2024", name: "David Kim", role: "Admin", company: "StartupCo" },
    
    // Team Members / Developers
    { email: "alex.thompson@techcorp.com", password: "developer123", name: "Alex Thompson", role: "Developer", company: "TechCorp Solutions" },
    { email: "jessica.wu@techcorp.com", password: "frontend2024", name: "Jessica Wu", role: "Frontend Dev", company: "TechCorp Solutions" },
    { email: "ryan.miller@startupco.com", password: "backend123", name: "Ryan Miller", role: "Backend Dev", company: "StartupCo" },
    { email: "lisa.zhang@freelance.com", password: "designer123", name: "Lisa Zhang", role: "Designer", company: "Freelance Hub" },
    
    // QA & Marketing
    { email: "tom.anderson@techcorp.com", password: "qa123", name: "Thomas Anderson", role: "QA Tester", company: "TechCorp Solutions" },
    { email: "maria.garcia@startupco.com", password: "marketing123", name: "Maria Garcia", role: "Marketing", company: "StartupCo" },
  ];

  const formSchema = z.object({
    email: z.string().trim().email("Invalid email address").min(1, {
      message: "Email is required",
    }),
    password: z.string().trim().min(1, {
      message: "Password is required",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (isPending) return;

    mutate(values, {
      onSuccess: (data) => {
        const user = data.user;
        console.log(user);
        const decodedUrl = returnUrl ? decodeURIComponent(returnUrl) : null;
        
        if (decodedUrl) {
          navigate(decodedUrl);
        } else if (user.currentWorkspace) {
          const workspaceId = typeof user.currentWorkspace === "string"
            ? user.currentWorkspace
            : user.currentWorkspace._id;
          navigate(`/workspace/${workspaceId}`);
        } else {
          navigate("/home");
        }
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });
  };

  const handleTestUserLogin = (testUser: { email: string; password: string; name: string; role: string; company: string }) => {
    form.setValue("email", testUser.email);
    form.setValue("password", testUser.password);
    onSubmit({ email: testUser.email, password: testUser.password });
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <Logo isLink={false} />
          Collabio
        </div>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>
                Login with your Email or Google account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid gap-6">
                    <div className="flex flex-col gap-4">
                      <GoogleOauthButton label="Login" />
                    </div>
                    
                    {/* Test User Dropdown - Development Only */}
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          Quick Test Login (Development)
                        </span>
                      </div>
                      <Select onValueChange={(value) => {
                        const testUser = testUsers.find(u => u.email === value);
                        if (testUser) handleTestUserLogin(testUser);
                      }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select test user to login" />
                        </SelectTrigger>
                        <SelectContent>
                          {testUsers.map((user) => (
                            <SelectItem key={user.email} value={user.email}>
                              <div className="flex flex-col items-start">
                                <span className="font-medium">{user.name}</span>
                                <span className="text-xs text-blue-600 dark:text-blue-400">{user.role} at {user.company}</span>
                                <span className="text-xs text-muted-foreground">{user.email}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                      <span className="relative z-10 bg-background px-2 text-muted-foreground">
                        Or continue with email
                      </span>
                    </div>
                    <div className="grid gap-3">
                      <div className="grid gap-2">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                                Email
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="m@example.com"
                                  className="!h-[48px]"
                                  {...field}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid gap-2">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <div className="flex items-center">
                                <FormLabel className="dark:text-[#f1f7feb5] text-sm">
                                  Password
                                </FormLabel>
                                <a
                                  href="#"
                                  className="ml-auto text-sm underline-offset-4 hover:underline"
                                >
                                  Forgot your password?
                                </a>
                              </div>
                              <FormControl>
                                <Input
                                  type="password"
                                  className="!h-[48px]"
                                  {...field}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full"
                      >
                        {isPending && <Loader className="animate-spin" />}
                        Login
                      </Button>
                    </div>
                    <div className="text-center text-sm">
                      Don&apos;t have an account?{" "}
                      <Link
                        to="/sign-up"
                        className="underline underline-offset-4"
                      >
                        Sign up
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
            By clicking continue, you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
