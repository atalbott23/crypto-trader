
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/ui-custom/PageTransition";
import { ThemeToggle } from "@/components/ui-custom/ThemeToggle";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 p-4 md:p-6 pt-6 container max-w-7xl mx-auto">
        <PageTransition>
          {children}
        </PageTransition>
      </main>
      <footer className="border-t border-border/50 py-6 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>© 2023 Crypto Tracker. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export { Layout };