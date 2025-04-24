import { AiOutlineHome, AiFillHome, AiOutlinePlusCircle, AiFillPlusCircle } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { BsPeople, BsPeopleFill } from "react-icons/bs"; // Added icons for followers

export const menu = [
  {
    title: "Home",
    icon: <AiOutlineHome className="text-2xl mr-5" />,
    activeIcon: <AiFillHome className="text-2xl mr-5" />,
  },
  {
    title: "Create",
    icon: <AiOutlinePlusCircle className="text-2xl mr-5" />,
    activeIcon: <AiFillPlusCircle className="text-2xl mr-5" />,
  },
  {
    title: "Profile",
    icon: <CgProfile className="text-2xl mr-5" />,
    activeIcon: <CgProfile className="text-2xl mr-5" />,
  },
  {
    title: "Bloggers",
    icon: <BsPeople className="text-2xl mr-5" />, // Inactive state icon
    activeIcon: <BsPeopleFill className="text-2xl mr-5" />, // Active state icon
  },
];