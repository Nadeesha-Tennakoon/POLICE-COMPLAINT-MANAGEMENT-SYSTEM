import { getCollection } from "@/lib/db";
import getAuthUser from "@/lib/getAuthUser";
import { ObjectId } from "mongodb";
import Link from "next/link";

export default async function UserDashboard() {
  const user = await getAuthUser();

  const complaintsCollection = await getCollection("complaints");
  const userComplaints = await complaintsCollection
    ?.find({
      userID: ObjectId.createFromHexString(user.userId),
    })
    .sort({ $natural: -1 })
    .toArray();
  if (!userComplaints) return <p>Failed to fetch data!</p>;
  if (userComplaints.length === 0) return <p>You don't have any complaints</p>;

  return (
    <div>
      <h1 className="title">User Dashboard</h1>

      <table>
        <thead>
          <tr>
            <th className="w-3/6">Complaint ID</th>
            <th className="w-1/6 sr-only">View</th>
          </tr>
        </thead>
        <tbody>
          {userComplaints.map((complaint) => (
            <tr key={complaint._id.toString()}>
              <td className="w-3/6">{complaint._id.toString()}</td>
              <td className="w-1/6 text-blue-500">
                <Link href={`/complaint/show/${complaint._id.toString()}`}>
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
