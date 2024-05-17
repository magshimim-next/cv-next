export default class SupabaseDefinitions {
  public static readonly Tables: {
    cvs: "cvs";
    comments: "comments";
    profiles: "profiles";
  };

  public static readonly CvKeys: {
    category_id: "category_id";
    created_at: "created_at";
    deleted: "deleted";
    description: "description";
    document_link: "document_link";
    id: "id";
    resolved: "resolved";
    user_id: "user_id";
  };
}
