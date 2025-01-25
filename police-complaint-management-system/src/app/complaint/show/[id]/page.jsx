import ComplaintCard from "@/components/ComplaintCard";
import { getCollection } from "@/lib/db";
import { ObjectId } from "mongodb";

export default async function Show({ params }) {
  const { id } = await params;

  const complaintsCollection = await getCollection("complaints");
  const complaint =
    id.length === 24
      ? await complaintsCollection?.findOne({
          _id: ObjectId.createFromHexString(id),
        })
      : null;

  return (
    <div className="container w-1/2">
      {complaint ? (
        <ComplaintCard complaint={complaint} />
      ) : (
        <p>Failed to fetch data</p>
      )}
    </div>
  );
}
