import GallerySection from "@/components/gallery/Gallery";
import CoursesSection from "../components/hero/Hero";
import MentorsSection from "@/components/mentors/Mentors";

export default function Home() {
  return (
    <>
      <CoursesSection/>
      <GallerySection />
      <MentorsSection />
    </>
  );
}
