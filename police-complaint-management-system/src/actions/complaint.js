"use server";
import { getCollection } from "@/lib/db";
import getAuthUser from "@/lib/getAuthUser";
import { CreateComplaintFormSchema } from "@/lib/rules";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createComplaint(state, formData) {
  //Check is user is signed in
  const user = await getAuthUser();
  if (!user) return redirect("/");
  //Validation from fields
  const name = formData.get("name");
  const content = formData.get("content");
  const location = formData.get("location");
  const mobileNumber = formData.get("mobileNumber");
  const validatedFields = CreateComplaintFormSchema.safeParse({
    name,
    content,
    location,
    mobileNumber,
  });
  //If any form fields are invalid
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  //Save the new post in DB
  try {
    const complaintsCollection = await getCollection("complaints");
    const complaint = {
      name: validatedFields.data.name,
      location: validatedFields.data.location,
      mobileNumber: validatedFields.data.mobileNumber,
      content: validatedFields.data.content,
      userID: ObjectId.createFromHexString(user.userId),
    };
    await complaintsCollection.insertOne(complaint);
  } catch (error) {
    return {
      errors: { title: error.message },
    };
  }
  return redirect(`/dashboard/${user.role}`);
}

export async function deleteComplaint(formData) {
  //Check is user is signed in
  const user = await getAuthUser();
  if (!user) return redirect("/");

  //Find the complaint
  const complaintsCollection = await getCollection("complaints");
  const complaint = await complaintsCollection.findOne({
    _id: ObjectId.createFromHexString(formData.get("complaintID")),
  });

  // Delete the complaint
  complaintsCollection.findOneAndDelete({ _id: complaint._id });

  revalidatePath(`/dashboard/${user.role}`);
}
