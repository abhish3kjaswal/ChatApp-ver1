
const profileAction = {
    getUserID: (id) => (dispatch) => {
        return dispatch({
            type: 'GET_USER_ID',
            payload: id
        })

    },
    fetchUserDetails: (id) => async (dispatch) => {
        const res = await fetch(
            `${process.env.REACT_APP_API_URL}/api/users/${id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        let resp = await res.json()
        return dispatch({
            type: 'USER_DETAIL',
            payload: resp
        })
    },
    clearUserDetails: () => dispatch => {
        return dispatch({
            type: "CLEAR_USER_DETAILS"
        })
    },
    setModalCheck: (val) => dispatch => {
        return dispatch({
            type: "SET_IMG_MODAL",
            payload: val
        })
    },
    uploadProfileImage: (data, id) => async (dispatch) => {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/api/users/pic/${id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
      
          const resData = await res.json();
          console.log("RESDATA-->",resData)

        // return dispatch({
        //     type: 'USER_IMAGE_ADDED',
        //     payload: resData
        // })
    }

}

export default profileAction;