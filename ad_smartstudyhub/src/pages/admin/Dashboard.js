import { useEffect } from "react";
import ManageUsers from "./ManageUsers";
import UserRegistrationChart from "./StatisticUserRegister";

export default function Dashboard() {
  return (
    <div className="z-10">
      <div className="bg-white mb-8"><div className="w-1/2 p-10"><UserRegistrationChart /> </div></div>
      <ManageUsers />
    </div>
  );
}
