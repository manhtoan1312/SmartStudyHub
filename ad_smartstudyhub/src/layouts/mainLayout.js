import { useState } from "react";
import Header from "~/components/Header";
import Sidebar from "~/components/SideBar";

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="dark:bg-boxdark-2 dark:text-gray-300">
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Header className="z-50" sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            <div className="mx-auto z-0 max-w-screen-2xl h-auto min-h-screen p-4 md:p-6 2xl:p-10 bg-[#F1F5F9] dark:bg-[#1A222C]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
