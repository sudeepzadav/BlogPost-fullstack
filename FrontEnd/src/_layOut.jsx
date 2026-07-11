import { Outlet } from "react-router-dom"
import { Navbar } from "./Components"

const LayOut = () => {
  return (
    <div>
      <Navbar/>
      <Outlet/>
    </div>
  )
}

export default LayOut
