const init = {
    currentUserId: null,
    currentUserDetail: {},
    loading: true,
    imgModalCheck: false
}

const profileReducer = (state = init, action) => {
    console.log("REDUCER-->", action)
    switch (action.type) {
        case 'init': return { state: {} }
        case 'GET_USER_ID':
            return { ...state, currentUserId: action.payload, loading: false }
        case 'USER_DETAIL':
            return { ...state, currentUserDetail: action.payload, loading: false }
        case 'LOADER':
            return { ...state, loading: action.payload, loading: false }
        case 'CLEAR_USER_DETAILS':
            return { ...state, currentUserDetail: {}, loading: false }
        case 'SET_IMG_MODAL':
            return { ...state, imgModalCheck:action.payload , loading: false }

        default:
            return state;
    }
}

export default profileReducer