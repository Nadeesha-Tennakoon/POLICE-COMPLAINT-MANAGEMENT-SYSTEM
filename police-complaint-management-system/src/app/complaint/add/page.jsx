import { createComplaint } from "@/actions/complaint";
import CreateComplaintForm from "@/components/CreateComplaintForm";

export default async function add() {
  return (
    <div className="container w-1/2">
      <h1 className="title">Create a Complaint</h1>
      <CreateComplaintForm handler={createComplaint} />
    </div>
  );
}
