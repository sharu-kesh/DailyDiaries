import React from 'react'
import { ProfileUserDetails } from '../../Components/ProfileComponent/ProfileUserDetails'
import PageUserPost from '../../Components/ProfileComponent/PageUserPost'
import '../../Components/ProfileComponent/ProfileComponent.css'
const Profile = () => {
  return (
    <div className='profile-page'>
      <div>
        <ProfileUserDetails />
        <PageUserPost />
      </div>
    </div>
  )
}

export default Profile