import React from "react";
import CoursesClient from "./components/CoursesComponent";
import { listCourses } from "@/lib/repositories/content";
import { requireAdmin } from "@/lib/auth";

export const revalidate = 60;
export const dynamic = "force-dynamic";

const CoursesPage = async () => {
  const [coursesData, admin] = await Promise.all([listCourses(50), requireAdmin()]);
  const courses = coursesData.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    image: course.image,
    price: String(course.price ?? ""),
    duration: course.duration ?? "",
    category: course.category ?? "",
  }));

  return (
    <div>
      <CoursesClient courses={courses} isAdmin={Boolean(admin)} />
    </div>
  );
};

export default CoursesPage;

