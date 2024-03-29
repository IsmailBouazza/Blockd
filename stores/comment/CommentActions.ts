import {
  IS_ADDING_COMMENT,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE,
  IS_DELETING_COMMENT,
  DELETE_COMMENT_SUCCESS,
  DELETE_COMMENT_FAILURE,
  IS_LIKING_COMMENT,
  LIKE_COMMENT_SUCCESS,
  LIKE_COMMENT_FAILURE,
  IS_FETCHING_POST_COMMENTS,
  FETCH_POST_COMMENTS_SUCCESS,
  FETCH_POST_COMMENTS_FAILURE,
  IS_FETCHING_COMMENT_INFO,
  FETCH_COMMENT_INFO_SUCCESS,
  FETCH_COMMENT_INFO_FAILURE,
  IS_FETCHING_IS_LIKED_COMMENT,
  FETCH_IS_LIKED_COMMENT_SUCCESS,
  FETCH_IS_LIKED_COMMENT_FAILURE,
  IS_FETCHING_IS_DISLIKED_COMMENT,
  FETCH_IS_DISLIKED_COMMENT_SUCCESS,
  FETCH_IS_DISLIKED_COMMENT_FAILURE,
  IS_DISLIKING_COMMENT,
  DISLIKE_COMMENT_SUCCESS,
  DISLIKE_COMMENT_FAILURE,
  IS_REPLYING_COMMENT,
  REPLY_COMMENT_SUCCESS,
  REPLY_COMMENT_FAILURE,
  IS_FETCHING_COMMENT,
  FETCH_COMMENT_SUCCESS,
  FETCH_COMMENT_FAILURE,
  IS_FETCHING_COMMENT_REPLIES,
  FETCH_COMMENT_REPLIES_SUCCESS,
  FETCH_COMMENT_REPLIES_FAILURE,
  IS_FETCHING_REPLY_INFO,
  FETCH_REPLY_INFO_SUCCESS,
  FETCH_REPLY_INFO_FAILURE,
  IS_LIKING_REPLY,
  LIKE_REPLY_SUCCESS,
  LIKE_REPLY_FAILURE,
  IS_DISLIKING_REPLY,
  DISLIKE_REPLY_SUCCESS,
  DISLIKE_REPLY_FAILURE,
  IS_EDITING_COMMENT,
  EDIT_COMMENT_SUCCESS,
  EDIT_COMMENT_FAILURE,
  IS_DELETING_REPLY,
  DELETE_REPLY_SUCCESS,
  DELETE_REPLY_FAILURE,
  IS_EDITING_REPLY,
  EDIT_REPLY_SUCCESS,
  EDIT_REPLY_FAILURE
} from './CommentActionTypes';

// Api
import { commentApi } from '../../api';

export function addComment(fields: object) {
  return async (dispatch: any) => {
    dispatch({ type: IS_ADDING_COMMENT });
    try {
      await commentApi.addComment(fields);
      dispatch({ type: ADD_COMMENT_SUCCESS });
    } catch (error: any) {
      console.log('Add comment error: ', error?.message);
      dispatch({
        type: ADD_COMMENT_FAILURE,
        error: error?.message
      });
    }
  }
}

export function deleteComment(fields: any) {
  return async (dispatch: any) => {
    dispatch({ type: IS_DELETING_COMMENT });
    try {
      await commentApi.deleteComment(fields);
      dispatch({ type: DELETE_COMMENT_SUCCESS });
    } catch (error: any) {
      console.log('Delete comment error: ', error?.message);
      dispatch({
        type: DELETE_COMMENT_FAILURE,
        error: error?.message
      });
    }
  }
}

export function likeComment(fields: object) {
  return async (dispatch: any) => {
    dispatch({ type: IS_LIKING_COMMENT });
    try {
      await commentApi.likeComment(fields);
      dispatch({ type: LIKE_COMMENT_SUCCESS });
    } catch (error: any) {
      console.log('Like comment error: ', error?.message);
      dispatch({
        type: LIKE_COMMENT_FAILURE,
        error: error?.message
      });
    }
  }
}

export function dislikeComment(fields: object) {
  return async (dispatch: any) => {
    dispatch({ type: IS_DISLIKING_COMMENT });
    try {
      await commentApi.dislikeComment(fields);
      dispatch({ type: DISLIKE_COMMENT_SUCCESS });
    } catch (error: any) {
      console.log('Dislike comment error: ', error?.message);
      dispatch({
        type: DISLIKE_COMMENT_FAILURE,
        error: error?.message
      });
    }
  }
}

export function fetchPostComments(fields: string) {
  return async (dispatch: any) => {
    dispatch({ type: IS_FETCHING_POST_COMMENTS });
    try {
      const result = await commentApi.fetchPostComments(fields);
      dispatch({
        type: FETCH_POST_COMMENTS_SUCCESS,
        postComments: result
      });
      return result;
    } catch (error: any) {
      console.log('Fetch Post Comments error: ', error?.message);
      dispatch({
        type: FETCH_POST_COMMENTS_FAILURE,
        error: error?.message
      });
    };
  }
}

export function fetchCommentInfo(fields: string) {
  return async (dispatch: any) => {
    dispatch({ type: IS_FETCHING_COMMENT_INFO });
    try {
      const result = await commentApi.fetchCommentInfo(fields);
      dispatch({
        type: FETCH_COMMENT_INFO_SUCCESS,
        commentInfo: result
      });
      return result;
    } catch (error: any) {
      console.log('Fetch Comment Info error: ', error?.message);
      dispatch({
        type: FETCH_COMMENT_INFO_FAILURE,
        error: error?.message
      });
    }
  }
}

export function fetchIsLikedComment(fields: string) {
  return async (dispatch: any) => {
    dispatch({ type: IS_FETCHING_IS_LIKED_COMMENT });
    try {
      const result = await commentApi.fetchIsLikedComment(fields);
      dispatch({
        type: FETCH_IS_LIKED_COMMENT_SUCCESS,
        isLikedComment: result
      });
      return result;
    } catch (error: any) {
      console.log('Fetch Is Liked comment error: ', error?.message);
      dispatch({
        type: FETCH_IS_LIKED_COMMENT_FAILURE,
        // error: error?.message
      });
    }
  }
}

export function fetchIsDislikedComment(fields: any) {
  return async (dispatch: any) => {
    dispatch({ type: IS_FETCHING_IS_DISLIKED_COMMENT });
    try {
      const result = await commentApi.fetchIsDislikedComment(fields);
      dispatch({
        type: FETCH_IS_DISLIKED_COMMENT_SUCCESS,
        isDislikedComment: result
      });
      return result;
    } catch (error: any) {
      console.log('Fetch Is Disliked comment error: ', error?.message);
      dispatch({
        type: FETCH_IS_DISLIKED_COMMENT_FAILURE,
        // error: error?.message
      });
    }
  }
}

export function replyComment(fields: any) {
  return async (dispatch: any) => {
    dispatch({ type: IS_REPLYING_COMMENT });
    try {
      await commentApi.replyComment(fields);
      dispatch({
        type: REPLY_COMMENT_SUCCESS
      });
    } catch (error: any) {
      console.log('Reply Comment Error: ', error?.message);
      dispatch({
        type: REPLY_COMMENT_FAILURE,
        error: error?.message
      });
    }
  }
}

export function fetchComment(fields: any) {
  return async (dispatch: any) => {
    dispatch({ type: IS_FETCHING_COMMENT });
    try {
      const result = await commentApi.fetchComment(fields);
      dispatch({
        type: FETCH_COMMENT_SUCCESS,
        comment: result
      });
      return result;
    } catch (error: any) {
      console.log('Fetch Comment Error: ', error?.message);
      dispatch({
        type: FETCH_COMMENT_FAILURE,
        error: error?.message
      });
    }
  }
}

export function fetchCommentReplies(fields: any) {
  return async (dispatch: any) => {
    dispatch({ type: IS_FETCHING_COMMENT_REPLIES });
    try {
      const result = await commentApi.fetchCommentReplies(fields);
      dispatch({
        type: FETCH_COMMENT_REPLIES_SUCCESS,
        commentReplies: result
      });
      return result;
    } catch (error: any) {
      console.log('Fetch Comment Replies Error: ', error?.message);
      dispatch({
        type: FETCH_COMMENT_REPLIES_FAILURE,
        error: error?.message
      });
    }
  }
}

export function fetchReplyInfo(fields: any) {
  return async (dispatch: any) => {
    dispatch({ type: IS_FETCHING_REPLY_INFO });
    try {
      const result = await commentApi.fetchReplyInfo(fields);
      dispatch({
        type: FETCH_REPLY_INFO_SUCCESS,
        replyInfo: result
      });
      return result;
    } catch (error: any) {
      console.log('Fetch Reply Info Error: ', error?.message);
      dispatch({
        type: FETCH_REPLY_INFO_FAILURE,
        error: error?.message
      });
    }
  }
}

export function likeReply(fields: any) {
  return async (dispatch: any) => {
    dispatch({ type: IS_LIKING_REPLY });
    try {
      await commentApi.likeReply(fields);
      dispatch({
        type: LIKE_REPLY_SUCCESS,
      });
    } catch (error: any) {
      console.log('Like Reply Error: ', error?.message);
      dispatch({
        type: LIKE_REPLY_FAILURE,
        error: error?.message
      });
    }
  }
}

export function dislikeReply(fields: any) {
  return async (dispatch: any) => {
    dispatch({ type: IS_DISLIKING_REPLY });
    try {
      await commentApi.dislikeReply(fields);
      dispatch({
        type: DISLIKE_REPLY_SUCCESS,
      });
    } catch (error: any) {
      console.log('Dislike Reply Error: ', error?.message);
      dispatch({
        type: DISLIKE_REPLY_FAILURE,
        error: error?.message
      });
    }
  }
}

export function editComment(id: any, fields: any) {
  return async (dispatch: any) => {
    dispatch({ type: IS_EDITING_COMMENT });
    try {
      await commentApi.editComment(id, fields);
      dispatch({
        type: EDIT_COMMENT_SUCCESS
      });
    } catch (error: any) {
      console.log('Edit comment error: ', error?.message);
      dispatch({
        type: EDIT_COMMENT_FAILURE,
        error: error?.message
      });
    }
  }
}

export function deleteReply(fields: any) {
  return async (dispatch: any) => {
    dispatch({ type: IS_DELETING_REPLY });
    try {
      await commentApi.deleteReply(fields);
      dispatch({ type: DELETE_REPLY_SUCCESS });
    } catch (error: any) {
      console.log('Delete reply error: ', error?.message);
      dispatch({
        type: DELETE_REPLY_FAILURE,
        error: error?.message
      });
    }
  }
}

export function editReply(id: any, fields: any) {
  return async (dispatch: any) => {
    dispatch({ type: IS_EDITING_REPLY });
    try {
      await commentApi.editReply(id, fields);
      dispatch({
        type: EDIT_REPLY_SUCCESS
      });
    } catch (error: any) {
      console.log('Edit reply error: ', error?.message);
      dispatch({
        type: EDIT_REPLY_FAILURE,
        error: error?.message
      });
    }
  }
}
