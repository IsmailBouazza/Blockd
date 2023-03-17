import {
  IS_CREATING_MESSAGE,
  CREATE_MESSAGE_SUCCESS,
  CREATE_MESSAGE_FAILURE,
  IS_FETCHING_MESSAGES,
  FETCH_MESSAGES_SUCCESS,
  FETCH_MESSAGES_FAILURE,
  IS_CREATING_CHAT,
  CREATE_CHAT_SUCCESS,
  CREATE_CHAT_FAILURE,
  IS_DELETING_CHAT,
  DELETE_CHAT_SUCCESS,
  DELETE_CHAT_FAILURE,
  IS_FETCHING_CHAT,
  FETCH_CHAT_SUCCESS,
  FETCH_CHAT_FAILURE,
  IS_MUTING_CHAT,
  MUTE_CHAT_SUCCESS,
  MUTE_CHAT_FAILURE,
  IS_CREATING_CHATROOM,
  CREATE_CHATROOM_SUCCESS,
  CREATE_CHATROOM_FAILURE,
  IS_DELETING_CHATROOM,
  DELETE_CHATROOM_SUCCESS,
  DELETE_CHATROOM_FAILURE,
  IS_ADDING_MEMBER,
  ADD_MEMBER_SUCCESS,
  ADD_MEMBER_FAILURE,
  IS_REMOVING_MEMBER,
  REMOVE_MEMBER_SUCCESS,
  REMOVE_MEMBER_FAILURE,
  IS_CREATING_CHATROOM_MESSAGE,
  CREATE_CHATROOM_MESSAGE_SUCCESS,
  CREATE_CHATROOM_MESSAGE_FAILURE,
  IS_FETCHING_USER_CHATROOMS,
  FETCH_USER_CHATROOMS_SUCCESS,
  FETCH_USER_CHATROOMS_FAILURE,
  IS_FETCHING_CHATROOM_MEMBERS,
  FETCH_CHATROOM_MEMBERS_SUCCESS,
  FETCH_CHATROOM_MEMBERS_FAILURE,
  IS_FETCHING_CHATROOM_MESSAGES,
  FETCH_CHATROOM_MESSAGES_SUCCESS,
  FETCH_CHATROOM_MESSAGES_FAILURE
} from './ChatActionTypes';

// Api
import { chatApi } from '../../api';

export function createMessage(fields: any) {
  return async (dispatch: any) => {
    dispatch({ type: IS_CREATING_MESSAGE });
    try {
      await chatApi.createMessage(fields);
      dispatch({
        type: CREATE_MESSAGE_SUCCESS,
      });
    } catch (error: any) {
      console.log('Create message error: ', error);
      dispatch({
        type: CREATE_MESSAGE_FAILURE,
        error: error.message
      });
    }
  }
}

export function fetchMessages(fields: any) {
  return async (dispatch: any) => {
    dispatch({ type: IS_FETCHING_MESSAGES });
    try {
      const result = await chatApi.fetchMessages(fields);
      dispatch({
        type: FETCH_MESSAGES_SUCCESS,
        messages: result
      });
      return result;
    } catch (error: any) {
      console.log('Fetch messages error: ', error.message);
      dispatch({
        type: FETCH_MESSAGES_FAILURE,
        error: error.message
      });
    }
  }
}

export function createChat(fields: any) {
  return async (dispatch: any) => {
    dispatch({ type: IS_CREATING_CHAT });
    try {
      const result = await chatApi.createChat(fields);
      dispatch({ type: CREATE_CHAT_SUCCESS });
      return result;
    } catch (error: any) {
      console.log('Create chat error: ', error);
      dispatch({
        type: CREATE_CHAT_FAILURE,
        error: error.message
      });
    }
  }
}

export function deleteChat(fields: any) {
  return async (dispatch: any) => {
    dispatch({ type: IS_DELETING_CHAT });
    try {
      await chatApi.deleteChat(fields);
      dispatch({ type: DELETE_CHAT_SUCCESS });
    } catch (error: any) {
      console.log('Delete chat error: ', error);
      dispatch({
        type: DELETE_CHAT_FAILURE,
        error: error.message
      });
    }
  }
}

export function fetchChat() {
  return async (dispatch: any) => {
    dispatch({ type: IS_FETCHING_CHAT });
    try {
      const result = await chatApi.getChat();
      dispatch({
        type: FETCH_CHAT_SUCCESS,
        chat: result
      });
      return result;
    } catch (error: any) {
      console.log('Fetch chat error: ', error);
      dispatch({
        type: FETCH_CHAT_FAILURE,
        error: error.message
      });
    }
  }
}

export function muteChat(fields: any) {
  return async (dispatch: any) => {
    dispatch({ type: IS_MUTING_CHAT });
    try {
      await chatApi.muteChat(fields);
      dispatch({ type: MUTE_CHAT_SUCCESS });
    } catch (error: any) {
      console.log('Mute chat error: ', error);
      dispatch({
        type: MUTE_CHAT_FAILURE,
        error: error.message
      });
    }
  }
}

export function createChatroom(fields: any) {
  return async (dispatch: any) => {
    dispatch({ type: IS_CREATING_CHATROOM });
    try {
      await chatApi.createChatroom(fields);
      dispatch({ type: CREATE_CHATROOM_SUCCESS });
    } catch (error: any) {
      console.log('Create chatroom error: ', error.message);
      dispatch({
        type: CREATE_CHATROOM_FAILURE,
        error: error.message
      });
    }
  }
}

export function deleteChatroom(fields: any) {
  return async (dispatch: any) => {
    dispatch({ type: IS_DELETING_CHATROOM });
    try {
      await chatApi.deleteChatroom(fields);
      dispatch({ type: DELETE_CHATROOM_SUCCESS });
    } catch (error: any) {
      console.log('Delete chatroom error: ', error.message);
      dispatch({
        type: DELETE_CHATROOM_FAILURE,
        error: error.message
      });
    }
  }
}

export function addMember(id: any, fields: any) {
  return async (dispatch: any) => {
    dispatch({ type: IS_ADDING_MEMBER });
    try {
      await chatApi.addMember(id, fields);
      dispatch({ type: ADD_MEMBER_SUCCESS });
    } catch (error: any) {
      console.log('Add member error: ', error.message);
      dispatch({
        type: ADD_MEMBER_FAILURE,
        error: error.message
      });
    }
  }
}

export function removeMember(id: any, fields: any) {
  return async (dispatch: any) => {
    dispatch({ type: IS_REMOVING_MEMBER });
    try {
      await chatApi.removeMember(id, fields);
      dispatch({ type: REMOVE_MEMBER_SUCCESS });
    } catch (error: any) {
      console.log('Remove member error: ', error.message);
      dispatch({
        type: REMOVE_MEMBER_FAILURE,
        error: error.message
      });
    }
  }
}

export function createChatroomMessage(id: any, fields: any) {
  return async (dispatch: any) => {
    dispatch({ type: IS_CREATING_CHATROOM_MESSAGE });
    try {
      await chatApi.createChatroomMessage(id, fields);
      dispatch({ type: CREATE_CHATROOM_MESSAGE_SUCCESS });
    } catch (error: any) {
      console.log('Create chatroom message error: ', error.message);
      dispatch({
        type: CREATE_CHATROOM_MESSAGE_FAILURE,
        error: error.message
      });
    }
  }
}

export function fetchUserChatrooms() {
  return async (dispatch: any) => {
    dispatch({ type: IS_FETCHING_USER_CHATROOMS });
    try {
      const result = await chatApi.fetchUserChatrooms();
      dispatch({
        type: FETCH_USER_CHATROOMS_SUCCESS,
        chatrooms: result
      });
      return result;
    } catch (error: any) {
      console.log('Fetch user chatrooms error: ', error.message);
      dispatch({
        type: FETCH_USER_CHATROOMS_FAILURE,
        error: error.message
      });
    }
  }
}

export function fetchChatroomMembers(fields: any) {
  return async (dispatch: any) => {
    dispatch({ type: IS_FETCHING_CHATROOM_MEMBERS });
    try {
      const result = await chatApi.fetchChatroomMembers(fields);
      dispatch({
        type: FETCH_CHATROOM_MEMBERS_SUCCESS,
        members: result
      });
      return result;
    } catch (error: any) {
      console.log('Fetch chatroom members error: ', error.message);
      dispatch({
        type: FETCH_CHATROOM_MEMBERS_FAILURE,
        error: error.message
      });
    }
  }
}

export function fetchChatroomMessages(id: any, fields: any) {
  return async (dispatch: any) => {
    dispatch({ type: IS_FETCHING_CHATROOM_MESSAGES });
    try {
      const result = await chatApi.fetchChatroomMessages(id, fields);
      dispatch({
        type:  FETCH_CHATROOM_MESSAGES_SUCCESS,
        chatroomMessages: result
      });
      return result;
    } catch (error: any) {
      console.log('Fetch chatroom messages error: ', error.message);
      dispatch({
        type: FETCH_CHATROOM_MESSAGES_FAILURE,
        error: error.message
      })
    }
  }
}
