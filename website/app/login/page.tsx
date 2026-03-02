
import Link from "next/link";
import { Suspense } from "react";
import LoginForm from "./LoginForm";


export default function LoginPage() {




  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-12 font-body">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <Link href="/" className="mx-auto mb-2">
            <h1 className="font-headline text-3xl font-bold tracking-tight">
              <span className="text-primary">TribeX</span>
              <span className="text-foreground">eSports</span>
            </h1>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Enter your email to sign in to your account</p>
        </div>

        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>




        <p className="px-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-primary underline-offset-4 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
