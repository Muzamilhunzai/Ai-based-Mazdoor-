// app/customer/messages/[id]/page.jsx
"use client";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Chat for job #{id}</h2>
      <p className="text-outline">Coming soon – hire accepted messages will appear here.</p>
    </div>
  );
}