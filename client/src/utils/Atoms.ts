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
    default: true
})

export interface Match{
    userId: String
}

interface UserInterface { 
    userId: String,
    about_me: String,
    dob_date: number | null,
    dob_month: number | null,
    dob_year: number | null,
    full_name: String,
    gender: String,
    interest_gender: String,
    matches: Match[],
    liked_profiles: Match[],
    profile: String,
    show_gender: Boolean
}

export const userInfo = atom<UserInterface>({
    key:"userInfo",
    default:{ 
        userId: '',
        about_me: '',
        dob_date: null,
        dob_month: null ,
        dob_year:null ,
        full_name: '',
        gender: '',
        interest_gender: '',
        matches: [],
        liked_profiles: [],
        profile: '',
        show_gender: false}
})

export const showMatches =atom({
    key:"show-matches",
    default:false
})