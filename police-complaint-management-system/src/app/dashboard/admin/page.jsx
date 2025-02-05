import { deleteComplaint } from "@/actions/complaint";
import { getCollection } from "@/lib/db";
import Link from "next/link";

export default async function AdminDashboard() {
  const complaintsCollection = await getCollection("complaints");
  const allComplaints = await complaintsCollection
    .find({})
    ?.sort({ $natural: -1 })
    .toArray();
  if (!allComplaints) return <p>Failed to fetch data!</p>;
  if (allComplaints.length === 0) return <p>You don't have any complaints</p>;

  return (
    <div>
      <h1 className="title">Admin Dashboard</h1>

      <table>
        <thead>
          <tr>
            <th className="w-3/6">Complaint ID</th>
            <th className="w-1/6 sr-only">View</th>
            <th className="w-1/6 sr-only">Delete</th>
          </tr>
        </thead>
        <tbody>
          {allComplaints.map((complaint) => (
            <tr key={complaint._id.toString()}>
              <td className="w-3/6">{complaint._id.toString()}</td>
              <td className="w-1/6 text-blue-500">
                <Link href={`/complaint/show/${complaint._id.toString()}`}>
                  View
                </Link>
              </td>
              <td className="w-1/6 text-red-500">
                <form action={deleteComplaint}>
                  <input
                    type="hidden"
                    name="complaintID"
                    defaultValue={complaint._id.toString()}
                  />
                  <button type="submit">Delete</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
