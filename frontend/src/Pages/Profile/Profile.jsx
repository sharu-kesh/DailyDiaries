import React from 'react'
import { ProfileUserDetails } from '../../Components/ProfileComponent/ProfileUserDetails'
import PageUserPost from '../../Components/ProfileComponent/PageUserPost'
const Profile = () => {
  return (
    <div className='px-20'>
      <div>
        <ProfileUserDetails />
        <PageUserPost />
      </div>
    </div>
  )
}

export default Profile