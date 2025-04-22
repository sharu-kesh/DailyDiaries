import { AiOutlineHome,AiFillHome,  AiOutlinePlusCircle, AiFillPlusCircle} from "react-icons/ai";
import { CgProfile } from "react-icons/cg";

export const menu=[
    {
        title:"Home",
        icon:<AiOutlineHome className="text-2xl mr-5"/>, 
        activeIcon : <AiFillHome className="text-2xl mr-5"></AiFillHome>},
   
    {
        title:"Create",
        icon:<AiOutlinePlusCircle className="text-2xl mr-5"/>,
        activeIcon:<AiFillPlusCircle className="text-2xl mr-5"></AiFillPlusCircle>
    },
    {
        title:"Profile",
        icon:<CgProfile className="text-2xl mr-5"/> , 
        activeIcon:<CgProfile className="text-2xl mr-5"></CgProfile>
    }
]