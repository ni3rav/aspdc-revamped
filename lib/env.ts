import { z } from "zod";

//! commented out for now
// const serverSchema = z.object({
// });

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
});

// merge the schemas and infer the combined type
// const mergedSchema = serverSchema.merge(clientSchema);
// type Env = z.infer<typeof mergedSchema>;

// TODO: change the inferred type when using with server side variables if any
const parsedEnv = clientSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "❌ Invalid environment variables:",
    parsedEnv.error.flatten().fieldErrors
  );
  throw new Error("Invalid environment variables");
}

// Export the validated environment variables
export const env = parsedEnv.data;
