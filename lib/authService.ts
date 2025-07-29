import { supabase } from './supabase';

export class AuthService {
  static loginWithEmail = async (email: string, password: string): Promise<{user: any, error: any}> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error };
      }

      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }

  static registerWithEmail = async (email: string, password: string, username: string, companyName: string): Promise<{user: any, error: any}> => {
    try {
      // First, create the user account
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { user: null, error };
      }

      // If user creation is successful, insert profile data
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              username: username,
              company_name: companyName,
              email: email,
            },
          ]);

        if (profileError) {
          // If profile creation fails, we should handle this appropriately
          // For now, we'll return the error but the user account was created
          console.error('Profile creation failed:', profileError);
          return { user: data.user, error: profileError };
        }
      }

      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }


  static signOut = async (): Promise<{error: any}> => {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  }


  static getCurrentUser = async (): Promise<{user: any, error: any}> => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      return { user, error };
    } catch (error) {
      return { user: null, error };
    }
  }

  static getCurrentSession = async (): Promise<{session: any, error: any}> => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      return { session, error };
    } catch (error) {
      return { session: null, error };
    }
  }
} 