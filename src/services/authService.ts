import { createClient, User, AuthResponse as SupabaseAuthResponse } from '@supabase/supabase-js';

export interface AuthResponse {
  user: User | null;
  error: string | null;
  success: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  created_at: string;
}

class AuthService {
  private supabase;

  constructor() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('🔐 Attempting sign in for:', email);
      
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password
      });

      if (error) {
        console.error('❌ Sign in error:', error);
        return {
          user: null,
          error: this.getReadableError(error.message),
          success: false
        };
      }

      console.log('✅ Sign in successful');
      return {
        user: data.user,
        error: null,
        success: true
      };
    } catch (error) {
      console.error('💥 Unexpected sign in error:', error);
      return {
        user: null,
        error: 'An unexpected error occurred. Please try again.',
        success: false
      };
    }
  }

  async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      console.log('📝 Attempting sign up for:', email);
      
      const { data, error } = await this.supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        console.error('❌ Sign up error:', error);
        return {
          user: null,
          error: this.getReadableError(error.message),
          success: false
        };
      }

      console.log('✅ Sign up successful');
      return {
        user: data.user,
        error: null,
        success: true
      };
    } catch (error) {
      console.error('💥 Unexpected sign up error:', error);
      return {
        user: null,
        error: 'An unexpected error occurred. Please try again.',
        success: false
      };
    }
  }

  async signOut(): Promise<void> {
    try {
      console.log('🚪 Signing out user');
      const { error } = await this.supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Sign out error:', error);
        throw new Error(this.getReadableError(error.message));
      }
      
      console.log('✅ Sign out successful');
    } catch (error) {
      console.error('💥 Unexpected sign out error:', error);
      throw error;
    }
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    console.log('👂 Setting up auth state listener');
    
    const { data: { subscription } } = this.supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email || 'no user');
        callback(session?.user || null);
      }
    );

    return () => {
      console.log('🔇 Removing auth state listener');
      subscription.unsubscribe();
    };
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();
      
      if (error) {
        console.error('❌ Get current user error:', error);
        return null;
      }
      
      return user;
    } catch (error) {
      console.error('💥 Unexpected get current user error:', error);
      return null;
    }
  }

  async resetPassword(email: string): Promise<{ success: boolean; error: string | null }> {
    try {
      console.log('🔄 Sending password reset for:', email);
      
      const { error } = await this.supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/reset-password`
        }
      );

      if (error) {
        console.error('❌ Password reset error:', error);
        return {
          success: false,
          error: this.getReadableError(error.message)
        };
      }

      console.log('✅ Password reset email sent');
      return {
        success: true,
        error: null
      };
    } catch (error) {
      console.error('💥 Unexpected password reset error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred. Please try again.'
      };
    }
  }

  private getReadableError(errorMessage: string): string {
    const errorMap: Record<string, string> = {
      'Invalid login credentials': 'Invalid email or password. Please check your credentials and try again.',
      'Email not confirmed': 'Please check your email and click the confirmation link before signing in.',
      'User already registered': 'An account with this email already exists. Please sign in instead.',
      'Password should be at least 6 characters': 'Password must be at least 6 characters long.',
      'Unable to validate email address: invalid format': 'Please enter a valid email address.',
      'signup_disabled': 'New account registration is currently disabled.',
      'email_address_invalid': 'Please enter a valid email address.',
      'weak_password': 'Password is too weak. Please choose a stronger password.',
      'too_many_requests': 'Too many requests. Please wait a moment before trying again.'
    };

    return errorMap[errorMessage] || errorMessage;
  }

  // Test connection method
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.auth.getSession();
      return !error;
    } catch {
      return false;
    }
  }
}

export const authService = new AuthService();

// Export for debugging
(window as any).authService = authService;