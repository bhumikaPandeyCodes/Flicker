import {atom} from 'recoil'

export const isLogedIn = atom<boolean>({
    key:"isLogedIn",
    default:false
})

export const showModal = atom({
    key:"showModal",
    default:false
})

export const isSignup = atom({
    key:"modalStatus",
    default: false
})