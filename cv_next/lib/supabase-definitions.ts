export const Tables = {
  cvs: "cvs" as const,
  comments: "comments" as const,
  profiles: "profiles" as const,
};

export const CvKeys = {
  category_id: "category_id",
  created_at: "created_at",
  deleted: "deleted",
  description: "description",
  document_link: "document_link",
  id: "id",
  resolved: "resolved",
  user_id: "user_id",
};

export const ProfileKeys = {
  avatar_url: "avatar_url",
  full_name: "full_name",
  updated_at: "updated_at",
  user_type: "user_type",
  username: "username",
  id: "id",
  work_status: {
    open_to_work: "Open to work",
    hiring: "Hiring",
    nothing: "Nothing",
  },
  user_types: {
    inactive: "inactive",
    active: "active",
    admin: "admin",
  },
};
