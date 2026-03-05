"use server";

import { createClient } from "@/utils/supabase/server";

type CreateAgentInput = {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
};

export async function createAgent(input: CreateAgentInput) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
    user_metadata: {
      role: "agent",
      name: input.name,
    },
  });

  if (error) throw new Error(error.message);

  return { userId: data.user?.id };
}
