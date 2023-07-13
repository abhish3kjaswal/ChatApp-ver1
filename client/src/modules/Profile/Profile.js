import React, { useState } from 'react'
import userAvatar from "../../assets/userAvatar.svg";
import Button from '../../components/Button';
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux'

const Profile = (props) => {
    const navigate = useNavigate();
    const state = useSelector(state => state.profileReducer)


    const [profile, setprofile] = useState(state.currentUserDetail || {})

    return (
        <div className='profileMainDiv'>
            <div className='picSection'>
                <img src={userAvatar} width={60} height={60} className='imgAvtr' />
            </div>
            <div className='blackLine'></div>

            <div className='detailSection'>
                <div className='userDetails'>
                    <div className='det1'>
                        <h2 style={{ marginBottom: '40px' }}>Name: {profile.fullName}</h2>
                        <p style={{ marginBottom: '30px' }}>Email: {profile.email}</p>
                        <p style={{ marginBottom: '30px' }}>Age: {profile.age ? profile.age : ''}</p>
                        <p style={{ marginBottom: '30px' }}>Gender: {profile.gender ? profile.gender : ''}</p>
                        <p style={{ marginBottom: '30px' }}>Phone no: {profile.phoneNo ? profile.phoneNo : ''}</p>
                    </div>

                </div>
                <div className='btnSection'>
                    <Button
                        // className="text-xs text-black-500 w-auto ml-10  bg-transparent hover:bg-black-500 font-semibold hover:text-white py-2 px-4 border border-black-500 hover:border-transparent rounded logOutBtn"
                        onClick={(e) => navigate(`/`)
                        }
                        label={"Back"}
                    ></Button>
                    {/* <Button
                className="text-xs text-black-500 w-auto ml-10  bg-transparent hover:bg-black-500 font-semibold hover:text-white py-2 px-4 border border-black-500 hover:border-transparent rounded logOutBtn"
                onClick={(e) => {
                    console.log("Edit")
                }}
                label={"Edit"}
              ></Button> */}
                </div>
            </div>
        </div>
    )
}

export default Profile