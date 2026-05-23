import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import NewsTicker from "@/components/NewsTicker";
import FeaturedArticles from "@/components/FeaturedArticles";
import TrendingQuotes from "@/components/TrendingQuotes";
import WebStories from "@/components/WebStories";
import QuizPreview from "@/components/QuizPreview";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      setTimeout(() => el?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <NewsTicker />
      <FeaturedArticles />
      <TrendingQuotes />
      <WebStories />
      <QuizPreview />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
