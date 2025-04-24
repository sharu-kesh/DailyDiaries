import { AiOutlineHome, AiFillHome } from 'react-icons/ai';
import { CgProfile, CgAdd } from 'react-icons/cg';
import { MdOutlinePeopleAlt } from 'react-icons/md';
import { BiLogOut } from 'react-icons/bi';

export const menu = [
  { title: 'Home', icon: <AiOutlineHome />, activeIcon: <AiFillHome /> },
  { title: 'Profile', icon: <CgProfile />, activeIcon: <CgProfile /> },
  { title: 'Create', icon: <CgAdd />, activeIcon: <CgAdd /> },
  { title: 'Bloggers', icon: <MdOutlinePeopleAlt />, activeIcon: <MdOutlinePeopleAlt /> },
  { title: 'Logout', icon: <BiLogOut />, activeIcon: <BiLogOut /> },
];
