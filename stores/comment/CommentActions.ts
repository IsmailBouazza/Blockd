import {
  IS_ADDING_COMMENT,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_FAILURE,
  IS_DELETING_COMMENT,
  DELETE_COMMENT_SUCCESS,
  DELETE_COMMENT_FAILURE,
  IS_LIKING_COMMENT,
  LIKE_COMMENT_SUCCESS,
  LIKE_COMMENT_FAILURE
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
      console.log('Add comment error: ', error);
      dispatch({
        type: ADD_COMMENT_FAILURE,
        error: error?.message
      });
    }
  }
}

export function deleteComment(fields: object) {
  return async (dispatch: any) => {
    dispatch({ type: IS_DELETING_COMMENT });
    try {
      await commentApi.deleteComment(fields);
      dispatch({ type: DELETE_COMMENT_SUCCESS });
    } catch (error: any) {
      console.log('Delete comment error: ', error);
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
      console.log('Like comment error: ', error);
      dispatch({
        type: LIKE_COMMENT_FAILURE,
        error: error?.message
      });
    }
  }
}