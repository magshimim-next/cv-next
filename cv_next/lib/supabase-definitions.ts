export const Tables: {
  cvs: "cvs";
  cv_comments: "cv_comments";
  profiles: "profiles";
  profile_perms: "profile_perms";
  randomized_cvs: "randomized_cvs";
} = {
  cvs: "cvs",
  cv_comments: "cv_comments",
  profiles: "profiles",
  profile_perms: "profile_perms",
  randomized_cvs: "randomized_cvs",
};

export const CvKeys: {
  cv_categories: "cv_categories";
  updated_at: "updated_at";
  deleted: "deleted";
  description: "description";
  document_link: "document_link";
  unique_cv_id: "unique_cv_id";
  unique_profile_id: "unique_profile_id";
  publishable: "publishable";
} = {
  cv_categories: "cv_categories",
  updated_at: "updated_at",
  deleted: "deleted",
  description: "description",
  document_link: "document_link",
  unique_cv_id: "unique_cv_id",
  unique_profile_id: "unique_profile_id",
  publishable: "publishable",
};

export const ProfileKeys: {
  avatar_url: "avatar_url";
  socials: "socials";
  display_name: "display_name";
  updated_at: "updated_at";
  username: "username";
  unique_profile_id: "unique_profile_id";
  email: "email";
  phone_number: "phone_number";
  hebrew_name: "hebrew_name";
  english_name: "english_name";
  work_status: {
    open_for_work: "open for work";
    not_sharing: "not sharing";
    hiring: "hiring";
    enlisted: "enlisted";
    employed: "employed";
  };
} = {
  avatar_url: "avatar_url",
  socials: "socials",
  display_name: "display_name",
  updated_at: "updated_at",
  username: "username",
  unique_profile_id: "unique_profile_id",
  email: "email",
  phone_number: "phone_number",
  hebrew_name: "hebrew_name",
  english_name: "english_name",
  work_status: {
    open_for_work: "open for work",
    not_sharing: "not sharing",
    hiring: "hiring",
    enlisted: "enlisted",
    employed: "employed",
  },
};

export const CommentKeys: {
  data: "data";
  parent_comment_id: "parent_comment_id";
  updated_at: "updated_at";
  deleted: "deleted";
  upvotes: "upvotes";
  unique_cv_id: "unique_cv_id";
  unique_cv_comment_id: "unique_cv_comment_id";
  resolved: "resolved";
  unique_profile_id: "unique_profile_id";
} = {
  data: "data",
  parent_comment_id: "parent_comment_id",
  updated_at: "updated_at",
  deleted: "deleted",
  upvotes: "upvotes",
  unique_cv_id: "unique_cv_id",
  unique_cv_comment_id: "unique_cv_comment_id",
  resolved: "resolved",
  unique_profile_id: "unique_profile_id",
};

export const PermsKeys: {
  unique_profile_id: "unique_profile_id";
  role: "role";
  roles_enum: {
    banned: "banned";
    pending: "pending";
    external: "external";
    member: "member";
    moderator: "moderator";
    admin: "admin";
  };
} = {
  unique_profile_id: "unique_profile_id",
  role: "role",
  roles_enum: {
    banned: "banned",
    pending: "pending",
    external: "external",
    member: "member",
    moderator: "moderator",
    admin: "admin",
  },
};

export const Storage: {
  cvs: "cvs";
} = {
  cvs: "cvs",
};
