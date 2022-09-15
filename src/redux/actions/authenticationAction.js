

export const authenticateUser = (userDetail) => {
    return {
        type: 'AUTHENTICATE_USER',
        payload: userDetail
    }
}

export const updateToken = (userDetail) => {
    return {
        type: 'UPDATE_TOKEN',
        payload: userDetail
    }
}

export const logoutUser = () => {
    return {
        type: 'LOGOUT_USER',
        payload: ''
    }
}