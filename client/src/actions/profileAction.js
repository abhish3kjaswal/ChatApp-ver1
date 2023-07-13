
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
    }

}

export default profileAction;