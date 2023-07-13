
const profileReducer = (state = { currentUserId: null, currentUserDetail: {} }, action) => {
    switch (action.type) {
        case 'init': return { state: {} }
        case 'GET_USER_ID':
            return { ...state, currentUserId: action.payload }
        case 'USER_DETAIL':
            return { ...state, currentUserDetail: action.payload }
        default:
            return { state }
    }
}

export default profileReducer