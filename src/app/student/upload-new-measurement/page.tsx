import AddMetricsForm from "@/components/add-metrics-form";

export default function UploadHeightImagePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <h1 className="mb-4 text-3xl font-bold">Upload New Measurement</h1>
      <AddMetricsForm />
    </div>
  );
}
