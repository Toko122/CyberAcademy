import React from "react";
import CoursesClient from "./components/CoursesComponent";
import { listCourses } from "@/lib/repositories/content";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const CoursesPage = async () => {
  const [coursesData, admin] = await Promise.all([listCourses(50), requireAdmin()]);
  const courses = coursesData.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description,
    image: course.image,
    totalPrice: course.total_price,
    monthlyPrice: course.monthly_price,
    duration: course.duration ?? "",
    category: course.category ?? "",
    teacher: course.teacher_id && course.teacher_name ? {
      id: course.teacher_id,
      name: course.teacher_name,
      image: course.teacher_image,
    } : null,
  }));

  return (
    <div>
      <CoursesClient courses={courses} isAdmin={Boolean(admin)} />
    </div>
  );
};

export default CoursesPage;

