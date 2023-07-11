import axios from 'axios';
import { apiURL } from '../apiURL';
//7.2 게시물 댓글 삭제
export const deleteCommentAPI = async (postId, token, commentId) => {
  try {
    //오류나면 {sendData} 이렇게 감싸보기
    const response = await axios.delete(
      `${apiURL}post/${postId}/comments/${commentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'application/json',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('댓글삭제하는 API 요청 에러', error);
  }
};
