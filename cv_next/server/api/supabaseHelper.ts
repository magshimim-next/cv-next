import 'server-only'

import { createClient, SupabaseClient, PostgrestResponse } from '@supabase/supabase-js'

export default class SupabaseHelper<T> {
    private static supabase: SupabaseClient;

    /**
     * Method initiates the supabase client if not initiated yet
     * @returns supabase client
     */
    public static getSupabaseInstance(): SupabaseClient {
        if (
          SupabaseHelper.supabase === null ||
          SupabaseHelper.supabase === undefined
        ) {
            SupabaseHelper.supabase = createClient("***REMOVED***", "***REMOVED***")
        }
        return SupabaseHelper.supabase;
    }

    /**
     * Adds data to the proper table
     * @param data the model serialized to data
     * @param tableName the collection name
     * @returns true if succeeded.
     */
    public static async addData(data: any, tableName: string): Promise<string | boolean> {
        const { data: responseData, error } = await SupabaseHelper.getSupabaseInstance().from(tableName).insert(data);

        if (error) {
          console.error(`Error adding data to ${tableName}:`, error);
          return false;
        }

        return true;
    }

    /**
     * Updates data of the proper collection
     * @param id the id of the data to update
     * @param data the model serialized to data
     * @param tableName the table name
     * @returns true if succeeded.
     */
    public static async updateData(tableName: string, data: any, id: string): Promise<string | boolean> {
        const { data: responseData, error } = await SupabaseHelper.getSupabaseInstance().from(tableName).update(data).eq('id', id);

        if (error) {
          console.error(`Error updating data on ${tableName} ${id}:`, error);
          return false;
        }

        return true;
    }
}