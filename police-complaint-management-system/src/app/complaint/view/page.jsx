import ComplaintCard from "@/components/ComplaintCard";
import { getCollection } from "@/lib/db";

export default async function view() {
  const complaintsCollection = await getCollection("complaints");
  const complaints = await complaintsCollection
    ?.find()
    .sort({ $natural: -1 })
    .toArray();

  if (complaints) {
    const serializedComplaints = complaints.map((complaint) => ({
      ...complaint,
      _id: complaint._id.toString(),
      timestamp: complaint._id.getTimestamp().toString(),
    }));
    return (
      <div className="grid grid-cols-2 gap-6">
        {serializedComplaints.map((complaint) => (
          <div key={complaint._id}>
            <ComplaintCard complaint={complaint} />
          </div>
        ))}
      </div>
    );
  } else {
    return <p>Failed to fetch the data from database.</p>;
  }
}
