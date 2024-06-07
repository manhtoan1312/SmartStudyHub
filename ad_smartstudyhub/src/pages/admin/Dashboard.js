import { useEffect } from "react";
import ManageUsers from "./ManageUsers";
import UserRegistrationChart from "./StatisticUserRegister";
import StatisticRole from "./StatisticRole";
import Revenue from "./Revenue";

export default function Dashboard() {
  return (
    <div className="z-10">
      <div className="bg-white mb-8 flex flex-row dark:border-[#2E3A47] dark:bg-[#24303F] ">
        <div className="w-1/2 p-10 justify-between items-center">
          <div className="border-b-2 border-black"><UserRegistrationChart /></div>
          <Revenue />
        </div>
        <div className="w-1/2 p-10">
          <StatisticRole />
        </div>
      </div>
      <ManageUsers />
    </div>
  );
}
