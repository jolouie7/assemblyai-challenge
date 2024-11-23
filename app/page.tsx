import FileUpload from "@/components/file-upload";

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-6">Podcast Content Generator</h1>
      <FileUpload />
    </main>
  );
}
