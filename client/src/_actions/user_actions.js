import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    CHANGEPASS_USER,
    RESETPASS_USER,
    ADD_OFFER
} from './types';
import { USER_SERVER, OFFER_SERVER } from '../components/Config.js';

export function registerUser(dataToSubmit) {
    const request = axios.post(`${USER_SERVER}/register`, dataToSubmit)
        .then(response => response.data);

    return {
        type: REGISTER_USER,
        payload: request
    }
}

export function loginUser(dataToSubmit) {
    const request = axios.post(`${USER_SERVER}/login`, dataToSubmit)
        .then(response => response.data);

    return {
        type: LOGIN_USER,
        payload: request
    }
}
export function resetPass(dataToSubmit) {
    const request = axios.post(`${USER_SERVER}/resetPass`, dataToSubmit)
        .then(response => response.data);

    return {
        type: RESETPASS_USER,
        payload: request
    }
}
export function changePass(dataToSubmit) {
    const request = axios.post(`${USER_SERVER}/changePass`, dataToSubmit)
        .then(response => response.data);

    return {
        type: CHANGEPASS_USER,
        payload: request
    }
}

export function auth() {
    const request = axios.get(`${USER_SERVER}/auth`)
        .then(response => response.data);

    return {
        type: AUTH_USER,
        payload: request
    }
}

export function logoutUser() {
    const request = axios.get(`${USER_SERVER}/logout`)
        .then(response => response.data);

    return {
        type: LOGOUT_USER,
        payload: request
    }
}


export function addOffer(offerData) {
    const request = axios.post(`${OFFER_SERVER}/addOffer`, offerData)
        .then(response => {
            return response.data
        });
    return {
        type: ADD_OFFER,
        payload: request
    }
}
