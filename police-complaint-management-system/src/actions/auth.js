"use server";

import { getCollection } from "@/lib/db";
import { LoginFormSchema, RegisterFormSchema } from "@/lib/rules";
import { createSession } from "@/lib/sessions";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function register(state, formData) {
  //   await new Promise((resolve) => setTimeout(resolve, 3000));

  //validated form fields
  const validatedFields = RegisterFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  //If any from fields are invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      email: formData.get("email"),
    };
  }

  //Extract form fields
  const { email, password } = validatedFields.data;

  //Check if email is already registered
  const userCollection = await getCollection("users");
  if (!userCollection) {
    return { errors: { email: "Server error!" } };
  }

  const existingUser = await userCollection.findOne({ email });
  if (existingUser) {
    return {
      errors: {
        email: "Email already exists in database!",
      },
    };
  }

  //Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  //Save in DB
  const results = await userCollection.insertOne({
    email,
    password: hashedPassword,
    role: "user",
  });

  //Create a session
  await createSession(results.insertedId.toString());

  //Redirect
  redirect("dashboard/user");
}

export async function login(state, formData) {
  // Validate form fields
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  // If any form fields are invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      email: formData.get("email"),
    };
  }
  // Extract from fields
  const { email, password } = validatedFields.data;

  // Check if email is exists in our DB
  const userCollection = await getCollection("users");
  if (!userCollection) return { errors: { email: "Server error!" } };

  const existingUser = await userCollection.findOne({ email });
  if (!existingUser) return { errors: { email: "Invalid credentials" } };

  // Check password
  const matchedPassword = await bcrypt.compare(password, existingUser.password);
  if (!matchedPassword) return { errors: { email: "Invalid credentials" } };

  // create a session
  await createSession(existingUser._id.toString(), existingUser.role);

  console.log(existingUser.email);

  // Redirect
  redirect(`/dashboard/${existingUser.role}`);
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  redirect("/");
}
