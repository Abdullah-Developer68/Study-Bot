import axios, { isAxiosError } from "axios";

declare const process: {
  env: Record<string, string | undefined>;
};

export type SupabaseRequestOptions = {
  accessToken?: string;
};

const getEnvValue = (key: string) => {
  // Use static accesses so Next.js/Turbopack can inline NEXT_PUBLIC_* values
  // in browser bundles. Dynamic indexing (env[key]) can resolve to undefined.
  if (key === "NEXT_PUBLIC_SUPABASE_URL") {
    return process.env.NEXT_PUBLIC_SUPABASE_URL;
  }

  if (key === "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY") {
    return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  }

  return undefined;
};

export const getSupabaseUrl = () => {
  const url = getEnvValue("NEXT_PUBLIC_SUPABASE_URL");
  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured");
  }
  // Remove trailing slash if present to ensure consistent URL formatting.
  return url.replace(/\/$/, "");
};

export const getSupabasePublishableKey = () => {
  return getEnvValue("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY") || "";
};

export const buildSupabaseHeaders = (
  publishableKey: string,
  options?: SupabaseRequestOptions,
) => {
  const headers: Record<string, string> = {
    apikey: publishableKey,
  };

  const accessToken = options?.accessToken;

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  return headers;
};

export const getErrorMessage = (error: unknown, fallbackMessage: string) => {
  if (isAxiosError<{ error?: string; message?: string }>(error)) {
    return (
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      fallbackMessage
    );
  }

  if (error instanceof Error) {
    return error.message || fallbackMessage;
  }

  return fallbackMessage;
};

export const invokeSupabaseFunction = async <
  TRequest extends object,
  TResponse,
>(
  functionName: string,
  payload: TRequest,
  options?: SupabaseRequestOptions,
) => {
  const supabaseUrl = getSupabaseUrl();
  const publishableKey = getSupabasePublishableKey();

  try {
    const response = await axios.post<TResponse>(
      `${supabaseUrl}/functions/v1/${functionName}`,
      payload,
      {
        headers: {
          ...buildSupabaseHeaders(publishableKey, options),
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error: unknown) {
    throw new Error(
      getErrorMessage(error, `Request failed for ${functionName}.`),
    );
  }
};
