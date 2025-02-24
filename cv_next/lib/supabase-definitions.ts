export const Tables: {
  cvs: "cvs";
  comments: "comments";
  profiles: "profiles";
  whitelisted: "whitelisted";
  admins: "admins";
  profiles_perms: "profiles_perms";
} = {
  cvs: "cvs",
  comments: "comments",
  profiles: "profiles",
  whitelisted: "whitelisted",
  admins: "admins",
  profiles_perms: "profiles_perms",
};

export const CvKeys: {
  cv_categories: "cv_categories";
  created_at: "created_at";
  deleted: "deleted";
  description: "description";
  document_link: "document_link";
  id: "id";
  resolved: "resolved";
  user_id: "user_id";
} = {
  cv_categories: "cv_categories",
  created_at: "created_at",
  deleted: "deleted",
  description: "description",
  document_link: "document_link",
  id: "id",
  resolved: "resolved",
  user_id: "user_id",
};

export const ProfileKeys: {
  avatar_url: "avatar_url";
  display_name: "display_name";
  updated_at: "updated_at";
  username: "username";
  id: "id";
  work_status: {
    open_to_work: "open to work";
    hiring: "hiring";
    nothing: "nothing";
  };
} = {
  avatar_url: "avatar_url",
  display_name: "display_name",
  updated_at: "updated_at",
  username: "username",
  id: "id",
  work_status: {
    open_to_work: "open to work",
    hiring: "hiring",
    nothing: "nothing",
  },
};

export const CommentKeys: {
  data: "data";
  parent_comment_id: "parent_comment_id";
  last_update: "last_update";
  deleted: "deleted";
  upvotes: "upvotes";
  document_id: "document_id";
  id: "id";
  resolved: "resolved";
  user_id: "user_id";
} = {
  data: "data",
  parent_comment_id: "parent_comment_id",
  last_update: "last_update",
  deleted: "deleted",
  upvotes: "upvotes",
  document_id: "document_id",
  id: "id",
  resolved: "resolved",
  user_id: "user_id",
};

export const PermsKeys: {
  id: "id";
  user_type: "user_type";
  user_types_enum: {
    inactive: "inactive";
    active: "active";
    admin: "admin";
  };
} = {
  id: "id",
  user_type: "user_type",
  user_types_enum: {
    inactive: "inactive",
    active: "active",
    admin: "admin",
  },
};

export const Storage: {
  cvs: "cvs";
} = {
  cvs: "cvs",
};
