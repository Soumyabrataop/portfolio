import Hero from "@/components/Hero";
import BlogsSection from "@/components/BlogsSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white selection:text-black">
      <Hero />
      <div className="relative z-10 bg-[#0a0a0a]">
        <BlogsSection />
      </div>
    </main>
  );
}
