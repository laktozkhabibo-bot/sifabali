import { PageTransition } from "@/components/motion/PageTransition";

// A template re-mounts on every navigation → perfect hook for page transitions
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
