import {
  IS_CREATING_POST,
  CREATE_POST_SUCCESS,
  CREATE_POST_FAILURE,
  IS_DELETING_POST,
  DELETE_POST_SUCCESS,
  DELETE_POST_FAILURE,
  IS_LIKING_POST,
  LIKE_POST_SUCCESS,
  LIKE_POST_FAILURE,
  IS_SEARCHING_POSTS,
  SEARCH_POSTS_SUCCESS,
  SEARCH_POSTS_FAILURE,
  IS_FETCHING_TRENDING_POSTS,
  FETCH_TRENDING_POSTS_SUCCESS,
  FETCH_TRENDING_POSTS_FAILURE,
  IS_FETCHING_FILTERED_POSTS,
  FETCH_FILTERED_POSTS_SUCCESS,
  FETCH_FILTERED_POSTS_FAILURE,
  IS_FETCHING_POST,
  FETCH_POST_SUCCESS,
  FETCH_POST_FAILURE,
  IS_FETCHING_POST_IMAGE,
  FETCH_POST_IMAGE_SUCCESS,
  FETCH_POST_IMAGE_FAILURE
} from './PostActionTypes';

// Api
import { postApi } from '../../api';

export function createPost(fields: object) {
  return async (dispatch: any) => {
    dispatch({ type: IS_CREATING_POST });
    try {
      await postApi.createPost(fields);
      dispatch({ type: CREATE_POST_SUCCESS });
    } catch (error: any) {
      console.log('Post error: ', error);
      dispatch({
        type: CREATE_POST_FAILURE,
        error: error
      });
    }
  }
}

export function deletePost(fields: object) {
  return async (dispatch: any) => {
    dispatch({ type: IS_DELETING_POST });
    try {
      await postApi.deletePost(fields);
      dispatch({ type: DELETE_POST_SUCCESS });
    } catch (error: any) {
      console.log('Delete Post error: ', error);
      dispatch({
        type: DELETE_POST_FAILURE,
        error: error
      });
    }
  }
}

export function likePost(fields: object) {
  return async (dispatch: any) => {
    dispatch({ type: IS_LIKING_POST });
    try {
      await postApi.likePost(fields);
      dispatch({ type: LIKE_POST_SUCCESS });
    } catch (error: any) {
      console.log('Like Post error: ', error);
      dispatch({
        type: LIKE_POST_FAILURE,
        error: error
      });
    }
  }
}

export function searchPosts(fields: object) {
  return async (dispatch: any) => {
    dispatch({ type: IS_SEARCHING_POSTS });
    try {
      const result = await postApi.searchPosts(fields);
      dispatch({
        type: SEARCH_POSTS_SUCCESS,
        postsResult: result
      });
      return result;
    } catch (error: any) {
      console.log('Search Posts error: ', error);
      dispatch({
        type: SEARCH_POSTS_FAILURE,
        error: error
      });
    }
  }
}

export function fetchTrendingPosts() {
  return async (dispatch: any) => {
    dispatch({ type: IS_FETCHING_TRENDING_POSTS });
    try {
      const result = await postApi.fetchTrendingPosts();
      dispatch({
        type: FETCH_TRENDING_POSTS_SUCCESS,
        trendingPosts: result
      });
      return result;
    } catch (error: any) {
      console.log('Fetch Trending posts error: ', error);
      dispatch({
        type: FETCH_TRENDING_POSTS_FAILURE,
        error: error
      });
    }
  }
}

export function fetchFilteredPosts(fields: object) {
  return async (dispatch: any) => {
    dispatch({ type: IS_FETCHING_FILTERED_POSTS });
    try {
      const result = await postApi.fetchFilteredPosts(fields);
      dispatch({
        type: FETCH_FILTERED_POSTS_SUCCESS,
        filteredPosts: result
      });
      return result;
    } catch (error: any) {
      console.log('Fetch Filtered posts error: ', error);
      dispatch({
        type: FETCH_FILTERED_POSTS_FAILURE,
        error: error
      });
    }
  }
}

export function fetchPost(fields: number) {
  return async (dispatch: any) => {
    dispatch({ type: IS_FETCHING_POST });
    try {
      const result = await postApi.fetchPost(fields);
      dispatch({
        type: FETCH_POST_SUCCESS,
        post: result
      });
      return result;
    } catch (error: any) {
      console.log('Fetch Post Error: ', error);
      dispatch({
        type: FETCH_POST_FAILURE,
        error: error
      });
    }
  }
}

export function fetchPostImage(fields: number) {
  return async (dispatch: any) => {
    dispatch({ type: IS_FETCHING_POST_IMAGE });
    try {
      const result = await postApi.fetchPostImage(fields);
      dispatch({
        type: FETCH_POST_IMAGE_SUCCESS,
        image: result
      });
      return result;
    } catch (error: any) {
      console.log('Fetch Post Image Error: ', error);
      dispatch({
        type: FETCH_POST_IMAGE_FAILURE,
        error: error
      });
    }
  }
}
