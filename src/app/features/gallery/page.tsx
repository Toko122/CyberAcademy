import React from "react";
import GalleryComponent from "./components/GalleryComponent";
import { listGallery } from "@/lib/repositories/content";

export const revalidate = 60;

const GalleryPage = async () => {
  const rawImages = await listGallery(100);
  const images = rawImages.map((img) => ({
    id: img.id,
    title: img.title,
    description: img.description || "",
    image: img.image,
    category: img.category || "",
  }));

  return (
    <div>
      <GalleryComponent images={images} />
    </div>
  );
};

export default GalleryPage;
