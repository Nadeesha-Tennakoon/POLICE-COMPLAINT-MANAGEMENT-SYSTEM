import Link from "next/link";

export default function ComplaintCard({ complaint }) {
  return (
    <div className="border border-slate-400 border-dashed p-4 rounded-md h-full">
      <p className="text-slate-600 text-xs">{complaint.timestamp}</p>
      <Link
        href={`/complaints/${complaint.id}`}
        className="block text-sm font-semibold"
      >
        Complaint ID: {complaint.id}
      </Link>
      <p className="text-sm text-slate-500">Name: {complaint.name}</p>

      <p className="text-sm text-slate-500">Location: {complaint.location}</p>
      <p className="text-sm text-slate-500">
        Contact Number: {complaint.mobileNumber}
      </p>
      <p className="text-sm my-4">{complaint.content}</p>
    </div>
  );
}
