import React, { useState } from 'react'
import userAvatar from "../../assets/userAvatar.svg";
import Button from '../../components/Button';
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from 'react-redux'
import Spinner from '../../components/Button/Spinner/spinner';
import actions from '../../actions';


const { profileAction } = actions

const Profile = (props) => {
    const navigate = useNavigate();
    const state = useSelector(state => state.profileReducer)
    const s = useSelector(state => state)
    const dispatch = useDispatch()


    const [profile, setProfile] = useState(state.currentUserDetail || {})
    const [loading, setLoading] = useState(state.loading || false)

    console.log("loading->", loading)

    const goBack = (e) => {
        e && e.preventDefault()
        dispatch(profileAction.clearUserDetails())
        navigate(`/`)
    }
    console.log("STATE->", s)

    return (
        <div className='profileMainDiv'>
            <div className='picSection cursor-pointer'>
                <img src={userAvatar} width={60} height={60} className='imgAvtr' />
            </div>
            <div className='blackLine'></div>

            <div className='detailSection'>
                {state.loading ? <Spinner />
                    : <div className='userDetails'>
                        <div className='det1'>
                            <h2 style={{ marginBottom: '40px' }}>Name: {state.currentUserDetail.fullName}</h2>
                            <p style={{ marginBottom: '30px' }}>Email: {state.currentUserDetail.email}</p>
                            <p style={{ marginBottom: '30px' }}>Age: {state.currentUserDetail.age ? state.currentUserDetail.age : ''}</p>
                            <p style={{ marginBottom: '30px' }}>Gender: {state.currentUserDetail.gender ? state.currentUserDetail.gender : ''}</p>
                            <p style={{ marginBottom: '30px' }}>Phone no: {state.currentUserDetail.phoneNo ? state.currentUserDetail.phoneNo : ''}</p>
                        </div>

                    </div>}
                <div className='btnSection'>
                    <Button
                        // className="text-xs text-black-500 w-auto ml-10  bg-transparent hover:bg-black-500 font-semibold hover:text-white py-2 px-4 border border-black-500 hover:border-transparent rounded logOutBtn"
                        onClick={(e) => goBack(e)}
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