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
  private isInitialized: boolean = false;

  constructor() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('❌ Missing Supabase environment variables:', {
        hasUrl: !!supabaseUrl,
        hasKey: !!supabaseAnonKey
      });
      this.isInitialized = false;
      // Create a dummy client to prevent runtime errors
      this.supabase = null;
      return;
    }
    
    try {
      this.supabase = createClient(supabaseUrl, supabaseAnonKey);
      this.isInitialized = true;
      console.log('✅ Supabase client initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Supabase client:', error);
      this.isInitialized = false;
      this.supabase = null;
    }
  }

  private checkInitialization(): boolean {
    if (!this.isInitialized || !this.supabase) {
      console.error('❌ Supabase client not initialized. Please check your environment variables.');
      return false;
    }
    return true;
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    if (!this.checkInitialization()) {
      return {
        user: null,
        error: 'Authentication service is not properly configured. Please check your environment variables.',
        success: false
      };
    }

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
    if (!this.checkInitialization()) {
      return {
        user: null,
        error: 'Authentication service is not properly configured. Please check your environment variables.',
        success: false
      };
    }

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
    if (!this.checkInitialization()) {
      throw new Error('Authentication service is not properly configured.');
    }

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
    if (!this.checkInitialization()) {
      console.error('❌ Cannot set up auth state listener - service not initialized');
      // Return a no-op unsubscribe function
      return () => {};
    }

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
    if (!this.checkInitialization()) {
      console.error('❌ Cannot get current user - service not initialized');
      return null;
    }

    try {
      const { data: { user }, error } = await this.supabase.auth.getUser();
      
      if (error) {
        // Handle "Auth session missing!" as informational rather than an error
        if (error.message === 'Auth session missing!') {
          console.info('ℹ️ No active auth session found (user not logged in)');
        } else {
          console.error('❌ Get current user error:', error);
        }
        return null;
      }
      
      return user;
    } catch (error) {
      console.error('💥 Unexpected get current user error:', error);
      return null;
    }
  }

  async resetPassword(email: string): Promise<{ success: boolean; error: string | null }> {
    if (!this.checkInitialization()) {
      return {
        success: false,
        error: 'Authentication service is not properly configured. Please check your environment variables.'
      };
    }

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
    if (!this.checkInitialization()) {
      return false;
    }

    try {
      const { data, error } = await this.supabase.auth.getSession();
      return !error;
    } catch {
      return false;
    }
  }

  // Method to check if service is properly initialized
  isServiceReady(): boolean {
    return this.isInitialized;
  }
}

export const authService = new AuthService();

// Export for debugging
(window as any).authService = authService;