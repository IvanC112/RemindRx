"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { userAtom } from "@/lib/atoms";
import { useSetAtom } from "jotai";
import Loading from "@/app/components/loading";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshAuthState: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  refreshAuthState: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const setUserAtom = useSetAtom(userAtom);

  const refreshAuthState = async () => {
    console.log("Refreshing auth state");
    setIsLoading(true);
  
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
  
      if (error || !session?.user) {
        console.warn("No session found or error during session check:", error);
        setUser(null);
        setIsAuthenticated(false);
        setUserAtom({ first_name: '', last_name: '' });
      } else {
        const user = session.user;
        console.log("User authenticated:", user.id);
        setUser(user);
        setIsAuthenticated(true);
  
        const { data } = await supabase
          .from("users")
          .select("first_name, last_name")
          .eq("auth_id", user.id)
          .single();
  
        if (data) {
          setUserAtom({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
          });
        }
      }
    } catch (error) {
      console.error("Unexpected error refreshing auth:", error);
      setUser(null);
      setIsAuthenticated(false);
      setUserAtom({ first_name: '', last_name: '' });
    } finally {
      setIsLoading(false); 
    }
  };
  
  useEffect(() => {
    refreshAuthState();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);
          setIsAuthenticated(true);
          
          const { data } = await supabase
            .from('users')
            .select('first_name, last_name')
            .eq('auth_id', session.user.id)
            .single();
            
          if (data) {
            setUserAtom({
              first_name: data.first_name || '',
              last_name: data.last_name || ''
            });
          }
        } 
        else if (event === "SIGNED_OUT" || event === "USER_UPDATED") {
          console.log("User signed out event received");
          setUser(null);
          setIsAuthenticated(false);
          setUserAtom({ first_name: '', last_name: '' });
        }
        refreshAuthState();
      }
    );

    return () => {
      console.log("Cleaning up auth listener");
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        isAuthenticated, 
        refreshAuthState 
      }}
    >
      {isLoading ? <Loading /> : children}
    </AuthContext.Provider>
  );
}