export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      comments: {
        Row: {
          data: string;
          deleted: boolean;
          document_id: string;
          id: string;
          last_update: string;
          parent_comment_Id: string | null;
          resolved: boolean;
          upvotes: string[] | null;
          user_id: string;
        };
        Insert: {
          data: string;
          deleted?: boolean;
          document_id: string;
          id?: string;
          last_update?: string;
          parent_comment_Id?: string | null;
          resolved?: boolean;
          upvotes?: string[] | null;
          user_id: string;
        };
        Update: {
          data?: string;
          deleted?: boolean;
          document_id?: string;
          id?: string;
          last_update?: string;
          parent_comment_Id?: string | null;
          resolved?: boolean;
          upvotes?: string[] | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_comments_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "cvs";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_comments_parent_comment_Id_fkey";
            columns: ["parent_comment_Id"];
            isOneToOne: false;
            referencedRelation: "comments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "admins";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "whitelisted";
            referencedColumns: ["id"];
          },
        ];
      };
      cvs: {
        Row: {
          category_id: number;
          created_at: string;
          deleted: boolean;
          description: string;
          document_link: string;
          id: string;
          resolved: boolean;
          user_id: string | null;
        };
        Insert: {
          category_id: number;
          created_at?: string;
          deleted?: boolean;
          description: string;
          document_link: string;
          id?: string;
          resolved?: boolean;
          user_id?: string | null;
        };
        Update: {
          category_id?: number;
          created_at?: string;
          deleted?: boolean;
          description?: string;
          document_link?: string;
          id?: string;
          resolved?: boolean;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "cvs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          full_name: string | null;
          id: string;
          updated_at: string | null;
          user_type: Database["public"]["Enums"]["user_type"];
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          full_name?: string | null;
          id: string;
          updated_at?: string | null;
          user_type?: Database["public"]["Enums"]["user_type"];
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          full_name?: string | null;
          id?: string;
          updated_at?: string | null;
          user_type?: Database["public"]["Enums"]["user_type"];
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      admins: {
        Row: {
          id: string | null;
        };
        Insert: {
          id?: string | null;
        };
        Update: {
          id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      whitelisted: {
        Row: {
          id: string | null;
        };
        Insert: {
          id?: string | null;
        };
        Update: {
          id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Functions: {
      get_admins: {
        Args: Record<PropertyKey, never>;
        Returns: string[];
      };
      get_whitelisted: {
        Args: Record<PropertyKey, never>;
        Returns: string[];
      };
    };
    Enums: {
      user_type: "inactive" | "active" | "admin";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
