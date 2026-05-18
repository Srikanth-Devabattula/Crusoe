import { Footer } from "./Footer";
import { Navbar } from "./Navbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-[72px] sm:pt-[78px] lg:pt-[84px] xl:pt-[88px]">
        {children}
      </main>
      <Footer />
    </div>
  );
}
