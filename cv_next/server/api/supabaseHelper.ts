import 'server-only'

import { createClient, SupabaseClient, PostgrestResponse, SelectFromTable } from '@supabase/supabase-js'
import MyLogger from '../base/logger';
import { RateLimitError, enumToStringMap } from './utils';

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
            SupabaseHelper.supabase = createClient("url", "anon_key")
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
    public static async updateData(tableName: string, data: any, id: string): Promise<boolean> {
        const { data: responseData, error } = await SupabaseHelper.getSupabaseInstance().from(tableName).update(data).eq('id', id);
    
        if (error) {
          console.error(`Error updating data on ${tableName} ${id}:`, error);
          return false;
        }
    
        return true;
    }

     /**
   * returns the query snapshot with results(documents)
   * @param query the query
   * @returns QuerySnapshot or undefined upon error
   */
  // DENIS NOTE: DIDNT FINISH THIS FUNCTION, the implementation might be incorrect
    public static async myGetDocs(
      query: SelectFromTable<Document>
      ): Promise<any> {
      if (SupabaseHelper.getSupabaseInstance()) {
        try {
          const { data, error } = await SupabaseHelper.supabase
          .from(query.table)
          .select()
          .eq(query.columns, query.conditions);

        if (error) {
          throw new Error(error.message);
        }
        } catch (error) {
          let err = error;
          MyLogger.logInfo("Error @ SupabaseHelper::myGetDocs", error);
          throw Error(enumToStringMap[ErrorReasons.undefinedErr]);
        }
      } else {
        throw new RateLimitError();
      }
    }
  }

}
