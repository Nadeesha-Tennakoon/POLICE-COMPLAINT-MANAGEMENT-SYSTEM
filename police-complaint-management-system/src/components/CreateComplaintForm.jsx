"use client";
import { useActionState } from "react";

export default function CreateComplaintForm({ handler }) {
  const [state, action, isPending] = useActionState(handler, undefined);
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" defaultValue={state?.name} />
        {state?.errors?.name && <p className="error">{state.errors.name}</p>}
      </div>
      <div>
        <label htmlFor="location">Location</label>
        <input type="text" name="location" defaultValue={state?.location} />
        {state?.errors?.location && (
          <p className="error">{state.errors.location}</p>
        )}
      </div>
      <div>
        <label htmlFor="mobileNumber">Contact Number</label>
        <input
          type="text"
          name="mobileNumber"
          defaultValue={state?.mobileNumber}
        />
        {state?.errors?.mobileNumber && (
          <p className="error">{state.errors.mobileNumber}</p>
        )}
      </div>
      <div>
        <label htmlFor="content">Content</label>
        <textarea
          name="content"
          rows="6"
          defaultValue={state?.content}
        ></textarea>
        {state?.errors?.content && (
          <p className="error">{state.errors.content}</p>
        )}
      </div>
      <button disabled={isPending} className="btn-primary">
        {isPending ? "Loading..." : "Submit"}
      </button>
    </form>
  );
}
