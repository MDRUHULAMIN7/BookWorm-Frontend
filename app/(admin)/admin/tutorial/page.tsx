import Header from "../../_components/Header";
import TutorialsTable from "./_components/TutorialsTable";


export default function AdminTutorialPage() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Header title="Tutorials Management" subtitle="Manage tutorial Create Update Delete " />
      <TutorialsTable />
    </div>
  );
}
