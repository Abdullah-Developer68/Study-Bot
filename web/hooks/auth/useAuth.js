"use client";

import { useAuth as useAuthContext } from "@/app/context/AuthContext";

// returns {{
//    user: object | null,
//    loading: boolean,
//    isAuthenticated: boolean,
//    userId: string | null
//  }}

const useAuth = () => {
  return useAuthContext();
};

export default useAuth;
