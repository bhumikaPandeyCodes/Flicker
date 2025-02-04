import {Match} from "./Atoms"

export interface userTypes  {
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
        show_gender: String
}
export interface MatchedUser {
        userId: String,
          about_me: String,
          email: String,
          gender: String,
          full_name: String,
          profile: String,
          dob_date: number| null,
          dob_month: number| null,
          dob_year: number| null
      }

export type MatchInfoType = {
        name: String;
        profile: String 
      }
      
export type sentMessages = {
        from_userId: String;
        timestamp: string,
        message: String;
      }
      
export type MessageHistory = {
        from_userId: String;
        timestamp: string;
        userProfile: String;
        message: String;
      }  
    