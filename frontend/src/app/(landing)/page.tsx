import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock, Pill } from "lucide-react"

export default function Home() {
  return (
    <div >
       <div className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4 md:px-6">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold sm:text-5xl xl:text-6xl">
                Never Miss a Medication Again
              </h1>
              <p className="max-w-[600px] md:text-xl">
                Our solution helps you stay on top of your prescriptions.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/signin">
                <Button size="lg">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button size="lg" variant="outline">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
       </div>
    </div>
  );
}
