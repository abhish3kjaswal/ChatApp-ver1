import React, { useState } from 'react'
import userAvatar from "../../assets/userAvatar.svg";
import Button from '../../components/Button';
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'
import Spinner from '../../components/Button/Spinner/spinner';
import actions from '../../actions';


const { profileAction } = actions

const Profile = (props) => {
    const navigate = useNavigate();
    const state = useSelector(state => state.profileReducer)
    const dispatch = useDispatch()


    const [profile, setProfile] = useState(state.currentUserDetail || {})
    const [loading, setLoading] = useState(state.loading || false)


    console.log("loading->", loading)
    console.log("state->", state)

    const goBack = (e) => {
        e && e.preventDefault()
        dispatch(profileAction.clearUserDetails())
        navigate(`/`)
    }

    const editImgHandler = (e) => {
        e && e.preventDefault()
        console.log("EDIT IMG")
        dispatch(profileAction.setModalCheck(true))
    }

    return <>
        <div className='profileMainDiv'>
            <div className='picSection cursor-pointer'>
                <img src={userAvatar} width={60} height={60} className='imgAvtr' />

                <svg xmlns="http://www.w3.org/2000/svg" onClick={editImgHandler} class="icon icon-tabler icon-tabler-edit editIcon" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                    <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                    <path d="M16 5l3 3" />
                </svg>
                {/* <input type='file' onChange={() => { }} /> */}
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
        <ImageUploadModal flag={state.imgModalCheck}/>
    </>


}

const ImageUploadModal = (props) => {
    const dispatch = useDispatch()

    return <div className='imageModal' style={{ display: `${props.flag ? 'flex' : 'none'}` }}>
        <div className='imageModalContent'>
            <div className='topCon'>
                Upload Profile Image
                <button onClick={() =>
                    dispatch(profileAction.setModalCheck(false))
                } label='X' className='crossBTN'>X</button>
            </div>
            <hr></hr>
            <div className='bottomCon'>
                <input type='file' />
                <Button label='Upload' onClick={() => { }} className='contentBTN'/>
            </div>
        </div>
    </div>
}

export default Profile