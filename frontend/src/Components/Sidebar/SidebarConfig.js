import { AiOutlineHome,AiFillHome,AiOutlineSearch, AiOutlineCompass, AiOutlineMessage, AiOutlineHeart, AiOutlinePlusCircle, AiFillPlusCircle,AiFillMessage,AiFillHeart } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";

export const menu=[
    {
        title:"Home",
        icon:<AiOutlineHome className="text-2xl mr-5"/>, 
        activeIcon : <AiFillHome className="text-2xl mr-5"></AiFillHome>},
    {
        title:"Search",
        icon:<AiOutlineSearch className="text-2xl mr-5"/>, 
        activeIcon:<AiOutlineSearch className="text-2xl mr-5"></AiOutlineSearch>
    },
    {
        title:"Explore", 
        icon:<AiOutlineCompass className="text-2xl mr-5"/>, 
        activeIcon:<AiOutlineCompass className="text-2xl mr-5"></AiOutlineCompass>
    },
    {
        title:"Message",
        icon:<AiOutlineMessage className="text-2xl mr-5"/>,
        activeIcon:<AiFillMessage className="text-2xl mr-5"></AiFillMessage>
    },
    {
        title:"Notifications",
        icon:<AiOutlineHeart className="text-2xl mr-5"/> , 
        activeIcon:<AiFillHeart className="text-2xl mr-5"></AiFillHeart>
    },
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