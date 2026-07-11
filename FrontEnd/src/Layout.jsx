import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className=" h-full w-full ">
      <Navbar />
      <div className="px-6 py-2">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;