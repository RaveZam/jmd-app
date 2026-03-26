"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

type CreateAdminInput = {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
};

export async function createAdmin(input: CreateAdminInput) {
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: {
      role: "admin",
      name: input.name,
    },
  });

  if (error) throw new Error(error.message);

  return { userId: data.user?.id };
}
