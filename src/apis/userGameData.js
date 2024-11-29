import axios from "axios"

const baseURL = "https://rightly-sweet-alien.ngrok-free.app/api/v1"


export const fetchMemberId = async (userData) => {
    try {
      const response = await axios.post(
        `${baseURL}/members`,
        userData, 
        {
          headers: {
            "ngrok-skip-browser-warning": "69420", // 헤더 설정
          },
        }
      );
      return response.data; 
    } catch (e) {
      console.error("Error in fetchMemberId:", e); // 에러 메시지 출력
      throw e; 
    }
  };

export const fetchGameResult = async(memberId, gameResult) =>{
    try{
        const response = await axios.post(`${baseURL}/games/${memberId}/results`,
            gameResult,
            {
                headers: {
                  "ngrok-skip-browser-warning": "69420", // 헤더 설정
                },
              }
        );
        return response.data
    }catch(e){
        console.log(e);
    }
}