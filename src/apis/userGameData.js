import axios from "axios"

const baseURL = "api/v1"

export const fetchMemberId = async(userData) => {
    try{
        const response = await axios.post(`${baseURL}/members`,
            userData
        );
        return response.data
    }catch(e){
        console.log(e);
    }
}

export const fetchGameResult = async(memberId, gameResult) =>{
    try{
        const response = await axios.post(`${baseURL}/games/${memberId}/results`,
            gameResult
        );
        return response.data
    }catch(e){
        console.log(e);
    }
}