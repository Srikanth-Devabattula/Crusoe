export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
}

export type BlogCategory =
  | "technology"
  | "engineering"
  | "company-news"
  | "insights"
  | "product";

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: BlogCategory;
  coverImage?: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFormData {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  category: BlogCategory;
  coverImage?: string;
  featured: boolean;
  published: boolean;
}

export interface Job {
  _id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  experience: string;
  location: string;
  department?: string;
  type: "full-time" | "part-time" | "contract" | "remote";
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobFormData {
  title: string;
  shortDescription: string;
  longDescription: string;
  experience: string;
  location: string;
  department?: string;
  type: Job["type"];
  published: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface ApplicationFormData {
  jobId: string;
  name: string;
  email: string;
  phone?: string;
  resume?: File;
}

export interface JobApplication {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  resume: string;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  createdAt: string;
}

export interface JobWithApplications {
  job: Pick<
    Job,
    "_id" | "title" | "experience" | "location" | "department" | "type"
  >;
  applications: JobApplication[];
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}
