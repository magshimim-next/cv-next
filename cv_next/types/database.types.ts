export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  pgbouncer: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_auth: {
        Args: { p_usename: string }
        Returns: {
          password: string
          username: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      cv_comments: {
        Row: {
          data: string
          deleted: boolean
          parent_comment_id: string | null
          resolved: boolean
          unique_cv_comment_id: string
          unique_cv_id: string | null
          unique_profile_id: string | null
          updated_at: string
          upvotes: string[] | null
        }
        Insert: {
          data: string
          deleted?: boolean
          parent_comment_id?: string | null
          resolved?: boolean
          unique_cv_comment_id?: string
          unique_cv_id?: string | null
          unique_profile_id?: string | null
          updated_at?: string
          upvotes?: string[] | null
        }
        Update: {
          data?: string
          deleted?: boolean
          parent_comment_id?: string | null
          resolved?: boolean
          unique_cv_comment_id?: string
          unique_cv_id?: string | null
          unique_profile_id?: string | null
          updated_at?: string
          upvotes?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "cv_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            referencedRelation: "cv_comments"
            referencedColumns: ["unique_cv_comment_id"]
          },
          {
            foreignKeyName: "cv_comments_unique_cv_id_fkey"
            columns: ["unique_cv_id"]
            referencedRelation: "cvs"
            referencedColumns: ["unique_cv_id"]
          },
          {
            foreignKeyName: "cv_comments_unique_cv_id_fkey"
            columns: ["unique_cv_id"]
            referencedRelation: "randomized_cvs"
            referencedColumns: ["unique_cv_id"]
          },
          {
            foreignKeyName: "cv_comments_unique_profile_id_fkey"
            columns: ["unique_profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["unique_profile_id"]
          },
        ]
      }
      cvs: {
        Row: {
          cv_categories: Database["public"]["Enums"]["Categories"][]
          deleted: boolean
          description: string
          document_link: string
          publishable: boolean
          unique_cv_id: string
          unique_profile_id: string | null
          updated_at: string
        }
        Insert: {
          cv_categories: Database["public"]["Enums"]["Categories"][]
          deleted?: boolean
          description: string
          document_link: string
          publishable?: boolean
          unique_cv_id?: string
          unique_profile_id?: string | null
          updated_at?: string
        }
        Update: {
          cv_categories?: Database["public"]["Enums"]["Categories"][]
          deleted?: boolean
          description?: string
          document_link?: string
          publishable?: boolean
          unique_cv_id?: string
          unique_profile_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cvs_unique_profile_id_fkey"
            columns: ["unique_profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["unique_profile_id"]
          },
        ]
      }
      forms: {
        Row: {
          created_at: string
          expires_at: string | null
          forms_data: Json
          id: string
          needed_role: Database["public"]["Enums"]["ProfileRoles"]
          responses_db: string | null
          title: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          forms_data: Json
          id?: string
          needed_role: Database["public"]["Enums"]["ProfileRoles"]
          responses_db?: string | null
          title: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          forms_data?: Json
          id?: string
          needed_role?: Database["public"]["Enums"]["ProfileRoles"]
          responses_db?: string | null
          title?: string
        }
        Relationships: []
      }
      magshimim_data: {
        Row: {
          graduation_year: number
          instructor: boolean
          moked: Database["public"]["Enums"]["Moked"]
          student: boolean
          unique_profile_id: string
          updated_at: string
        }
        Insert: {
          graduation_year: number
          instructor: boolean
          moked: Database["public"]["Enums"]["Moked"]
          student: boolean
          unique_profile_id: string
          updated_at?: string
        }
        Update: {
          graduation_year?: number
          instructor?: boolean
          moked?: Database["public"]["Enums"]["Moked"]
          student?: boolean
          unique_profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "magshimim_data_unique_profile_id_fkey"
            columns: ["unique_profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["unique_profile_id"]
          },
        ]
      }
      notifications_settings: {
        Row: {
          comment_interactions: boolean
          new_events: boolean
          new_forms: boolean
          newsletter: boolean
          personal_cv_interactions: boolean
          submission_confirmation: boolean
          unique_profile_id: string
          updated_at: string
        }
        Insert: {
          comment_interactions?: boolean
          new_events?: boolean
          new_forms?: boolean
          newsletter?: boolean
          personal_cv_interactions?: boolean
          submission_confirmation?: boolean
          unique_profile_id: string
          updated_at?: string
        }
        Update: {
          comment_interactions?: boolean
          new_events?: boolean
          new_forms?: boolean
          newsletter?: boolean
          personal_cv_interactions?: boolean
          submission_confirmation?: boolean
          unique_profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_settings_unique_profile_id_fkey"
            columns: ["unique_profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["unique_profile_id"]
          },
        ]
      }
      profile_perms: {
        Row: {
          role: Database["public"]["Enums"]["ProfileRoles"]
          unique_profile_id: string
        }
        Insert: {
          role?: Database["public"]["Enums"]["ProfileRoles"]
          unique_profile_id: string
        }
        Update: {
          role?: Database["public"]["Enums"]["ProfileRoles"]
          unique_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_perms_unique_profile_id_fkey"
            columns: ["unique_profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["unique_profile_id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string
          email: string
          english_name: string | null
          hebrew_name: string | null
          phone_number: string
          socials: Json | null
          unique_profile_id: string
          updated_at: string
          username: string | null
          work_categories: Database["public"]["Enums"]["Categories"][] | null
          work_status: Database["public"]["Enums"]["EmploymentStatus"]
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name: string
          email: string
          english_name?: string | null
          hebrew_name?: string | null
          phone_number: string
          socials?: Json | null
          unique_profile_id: string
          updated_at?: string
          username?: string | null
          work_categories?: Database["public"]["Enums"]["Categories"][] | null
          work_status?: Database["public"]["Enums"]["EmploymentStatus"]
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string
          email?: string
          english_name?: string | null
          hebrew_name?: string | null
          phone_number?: string
          socials?: Json | null
          unique_profile_id?: string
          updated_at?: string
          username?: string | null
          work_categories?: Database["public"]["Enums"]["Categories"][] | null
          work_status?: Database["public"]["Enums"]["EmploymentStatus"]
        }
        Relationships: []
      }
    }
    Views: {
      randomized_cvs: {
        Row: {
          deleted: boolean | null
          description: string | null
          document_link: string | null
          publishable: boolean | null
          rnd: number | null
          unique_cv_id: string | null
          unique_profile_id: string | null
          updated_at: string | null
        }
        Insert: {
          deleted?: boolean | null
          description?: string | null
          document_link?: string | null
          publishable?: boolean | null
          rnd?: never
          unique_cv_id?: string | null
          unique_profile_id?: string | null
          updated_at?: string | null
        }
        Update: {
          deleted?: boolean | null
          description?: string | null
          document_link?: string | null
          publishable?: boolean | null
          rnd?: never
          unique_cv_id?: string | null
          unique_profile_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cvs_unique_profile_id_fkey"
            columns: ["unique_profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["unique_profile_id"]
          },
        ]
      }
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      is_external: { Args: never; Returns: boolean }
      is_member: { Args: never; Returns: boolean }
      is_moderator: { Args: never; Returns: boolean }
    }
    Enums: {
      Categories:
        | "general"
        | "medical"
        | "insurance"
        | "financial"
        | "legal"
        | "education"
        | "fullstack"
        | "frontend"
        | "backend"
        | "devops"
        | "cybersecurity"
        | "freelance"
      EmploymentStatus:
        | "not sharing"
        | "open for work"
        | "enlisted"
        | "employed"
        | "hiring"
      Moked:
        | "TEL_HAI"
        | "KARMIEL"
        | "KINNERET"
        | "AKKO_WESTERN_GALILEE"
        | "BET_SHEAN"
        | "AFULA_JEZREEL_VALLEY"
        | "KRAYOT"
        | "HAIFA_CARMEL"
        | "BAT_YAM_SOUTH_TEL_AVIV"
        | "RAMLA_LOD"
        | "OR_AKIVA"
        | "NETANYA"
        | "HADERA_PARDES_HANNA_KARKUR"
        | "BET_SHEMESH"
        | "JERUSALEM"
        | "ASHDOD"
        | "BBER_SHEVA"
        | "ASHKELON"
        | "KIRYAT_GAT"
        | "WESTERN_NEGEV_SDEROT"
        | "ACHVA_KIRYAT_MALACHI"
        | "EILAT"
        | "EASTERN_NEGEV_DIMONA_ARAD"
      ProfileRoles:
        | "banned"
        | "pending"
        | "external"
        | "member"
        | "moderator"
        | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Relationships: []
      }
      buckets_analytics: {
        Row: {
          created_at: string
          deleted_at: string | null
          format: string
          id: string
          name: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      buckets_vectors: {
        Row: {
          created_at: string
          id: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      iceberg_namespaces: {
        Row: {
          bucket_name: string
          catalog_id: string
          created_at: string
          id: string
          metadata: Json
          name: string
          updated_at: string
        }
        Insert: {
          bucket_name: string
          catalog_id: string
          created_at?: string
          id?: string
          metadata?: Json
          name: string
          updated_at?: string
        }
        Update: {
          bucket_name?: string
          catalog_id?: string
          created_at?: string
          id?: string
          metadata?: Json
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_namespaces_catalog_id_fkey"
            columns: ["catalog_id"]
            referencedRelation: "buckets_analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      iceberg_tables: {
        Row: {
          bucket_name: string
          catalog_id: string
          created_at: string
          id: string
          location: string
          name: string
          namespace_id: string
          remote_table_id: string | null
          shard_id: string | null
          shard_key: string | null
          updated_at: string
        }
        Insert: {
          bucket_name: string
          catalog_id: string
          created_at?: string
          id?: string
          location: string
          name: string
          namespace_id: string
          remote_table_id?: string | null
          shard_id?: string | null
          shard_key?: string | null
          updated_at?: string
        }
        Update: {
          bucket_name?: string
          catalog_id?: string
          created_at?: string
          id?: string
          location?: string
          name?: string
          namespace_id?: string
          remote_table_id?: string | null
          shard_id?: string | null
          shard_key?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_tables_catalog_id_fkey"
            columns: ["catalog_id"]
            referencedRelation: "buckets_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iceberg_tables_namespace_id_fkey"
            columns: ["namespace_id"]
            referencedRelation: "iceberg_namespaces"
            referencedColumns: ["id"]
          },
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          metadata: Json | null
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          metadata?: Json | null
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          metadata?: Json | null
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      vector_indexes: {
        Row: {
          bucket_id: string
          created_at: string
          data_type: string
          dimension: number
          distance_metric: string
          id: string
          metadata_configuration: Json | null
          name: string
          updated_at: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          data_type: string
          dimension: number
          distance_metric: string
          id?: string
          metadata_configuration?: Json | null
          name: string
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          data_type?: string
          dimension?: number
          distance_metric?: string
          id?: string
          metadata_configuration?: Json | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vector_indexes_bucket_id_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets_vectors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      allow_any_operation: {
        Args: { expected_operations: string[] }
        Returns: boolean
      }
      allow_only_operation: {
        Args: { expected_operation: string }
        Returns: boolean
      }
      can_insert_object: {
        Args: { bucketid: string; metadata: Json; name: string; owner: string }
        Returns: undefined
      }
      extension: { Args: { name: string }; Returns: string }
      filename: { Args: { name: string }; Returns: string }
      foldername: { Args: { name: string }; Returns: string[] }
      get_common_prefix: {
        Args: { p_delimiter: string; p_key: string; p_prefix: string }
        Returns: string
      }
      get_level: { Args: { name: string }; Returns: number }
      get_prefix: { Args: { name: string }; Returns: string }
      get_prefixes: { Args: { name: string }; Returns: string[] }
      get_size_by_bucket: {
        Args: never
        Returns: {
          bucket_id: string
          size: number
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
          prefix_param: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          _bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_token?: string
          prefix_param: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      operation: { Args: never; Returns: string }
      search: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_by_timestamp: {
        Args: {
          p_bucket_id: string
          p_level: number
          p_limit: number
          p_prefix: string
          p_sort_column: string
          p_sort_column_after: string
          p_sort_order: string
          p_start_after: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_legacy_v1: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v2: {
        Args: {
          bucket_name: string
          levels?: number
          limits?: number
          prefix: string
          sort_column?: string
          sort_column_after?: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      buckettype: "STANDARD" | "ANALYTICS" | "VECTOR"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  verification: {
    Tables: {
      verification_data: {
        Row: {
          gov_id: string | null
          unique_profile_id: string
          updated_at: string
        }
        Insert: {
          gov_id?: string | null
          unique_profile_id: string
          updated_at?: string
        }
        Update: {
          gov_id?: string | null
          unique_profile_id?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  pgbouncer: {
    Enums: {},
  },
  public: {
    Enums: {
      Categories: [
        "general",
        "medical",
        "insurance",
        "financial",
        "legal",
        "education",
        "fullstack",
        "frontend",
        "backend",
        "devops",
        "cybersecurity",
        "freelance",
      ],
      EmploymentStatus: [
        "not sharing",
        "open for work",
        "enlisted",
        "employed",
        "hiring",
      ],
      Moked: [
        "TEL_HAI",
        "KARMIEL",
        "KINNERET",
        "AKKO_WESTERN_GALILEE",
        "BET_SHEAN",
        "AFULA_JEZREEL_VALLEY",
        "KRAYOT",
        "HAIFA_CARMEL",
        "BAT_YAM_SOUTH_TEL_AVIV",
        "RAMLA_LOD",
        "OR_AKIVA",
        "NETANYA",
        "HADERA_PARDES_HANNA_KARKUR",
        "BET_SHEMESH",
        "JERUSALEM",
        "ASHDOD",
        "BBER_SHEVA",
        "ASHKELON",
        "KIRYAT_GAT",
        "WESTERN_NEGEV_SDEROT",
        "ACHVA_KIRYAT_MALACHI",
        "EILAT",
        "EASTERN_NEGEV_DIMONA_ARAD",
      ],
      ProfileRoles: [
        "banned",
        "pending",
        "external",
        "member",
        "moderator",
        "admin",
      ],
    },
  },
  storage: {
    Enums: {
      buckettype: ["STANDARD", "ANALYTICS", "VECTOR"],
    },
  },
  verification: {
    Enums: {},
  },
} as const
