import {
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAILURE,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  LOGOUT_USER_FAILURE,
  IS_FETCHING_AUTH_USER,
  FETCH_AUTH_USER_SUCCESS,
  FETCH_AUTH_USER_FAILURE,
  REGISTER_USER,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_FAILURE,
  FETCH_USER_MESSAGE,
  FETCH_USER_MESSAGE_SUCCESS,
  FETCH_USER_MESSAGE_FAILURE,
  IS_SENDING_VERIFICATION,
  SEND_VERIFICATION_SUCCESS,
  SEND_VERIFICATION_FAILURE,
  IS_GENERATING_TOKEN,
  GENERATE_TOKEN_SUCCESS,
  GENERATE_TOKEN_FAILURE,
  IS_RESENDING_VERIFICATION,
  RESEND_VERIFICATION_SUCCESS,
  RESEND_VERIFICATION_FAILURE,
} from "./AuthUserActionTypes";
import { setCookie, deleteCookie, getCookie } from "cookies-next";
import { isEmpty } from "../../utils";

// Api
import { authUserApi } from "../../api";

export function fetchAuthUser() {
  return async (dispatch: any) => {
    dispatch({ type: IS_FETCHING_AUTH_USER });

    try {
      const result = await authUserApi.fetchAuthUser();
      dispatch({
        type: FETCH_AUTH_USER_SUCCESS,
        user: result,
      });
      if (!isEmpty(result)) {
        localStorage.setItem("authUser", JSON.stringify(result));
        if (!getCookie("token")) {
          setCookie("token", localStorage.getItem("token"),  { maxAge: 60 * 60 * 24 * 360 });
        }
      }
      return result;
    } catch (error: any) {
      console.log("Auth User Error: ", error);

      dispatch({
        type: FETCH_AUTH_USER_FAILURE,
        error: error?.message,
      });
    }
  };
}

export function loginUser(fields: any) {
  return async (dispatch: any) => {
    dispatch({ type: LOGIN_USER });

    try {
      const result: any = await authUserApi.loginUser(fields);
      dispatch({
        type: LOGIN_USER_SUCCESS,
        user: result,
      });

      if (!isEmpty(result.token)) {
        localStorage.setItem("token", JSON.stringify(result.token));
        setCookie("token", result.token,  { maxAge: 60 * 60 * 24 * 360 });
      }

      return result;
    } catch (error: any) {
      console.log("Login error: ", error);

      dispatch({
        type: LOGIN_USER_FAILURE,
        error: error.message,
      });

      return { errors: error?.message };
    }
  };
}

export function registerUser(fields: object) {
  return async (dispatch: any) => {
    dispatch({ type: REGISTER_USER });
    try {
      const result: any = await authUserApi.registerUser(fields);
      dispatch({
        type: REGISTER_USER_SUCCESS,
      });
      if (!isEmpty(result?.token)) {
        localStorage.setItem("token", JSON.stringify(result?.token));
        setCookie("token", result.token,  { maxAge: 60 * 60 * 24 * 360 });
      }
      return result;
    } catch (error: any) {
      console.log("Register user Error: ", error);

      dispatch({
        type: REGISTER_USER_FAILURE,
        error: error?.message,
      });

      return { errors: error?.message };
    }
  };
}

export function logoutUser() {
  return async (dispatch: any) => {
    dispatch({ type: LOGOUT_USER });

    try {
      const result = await authUserApi.logoutUser();
      localStorage.removeItem("token");
      localStorage.removeItem("authUser");
      deleteCookie("token");
      dispatch({ type: LOGOUT_USER_SUCCESS });
    } catch (error: any) {
      dispatch({
        type: LOGOUT_USER_FAILURE,
        error: error.message,
      });
    }
  };
}

export function fetchUserMessage() {
  return async (dispatch: any) => {
    dispatch({ type: FETCH_USER_MESSAGE });

    try {
      const result = await authUserApi.fetchUserMessage();
      dispatch({
        type: FETCH_USER_MESSAGE_SUCCESS,
        message: result,
      });
      return result;
    } catch (error: any) {
      dispatch({
        type: FETCH_USER_MESSAGE_FAILURE,
        error: error?.message,
      });
    }
  };
}

export function sendVerification(fields: any) {
  return async (dispatch: any) => {
    dispatch({ type: IS_SENDING_VERIFICATION });
    try {
      await authUserApi.sendVerification(fields);
      dispatch({
        type: SEND_VERIFICATION_SUCCESS,
      });
    } catch (error: any) {
      console.log("Send verification error: ", error.message);
      dispatch({
        type: SEND_VERIFICATION_FAILURE,
        error: error?.message,
      });
    }
  };
}

export function resendVerification(fields: any) {
  return async (dispatch: any) => {
    dispatch({ type: IS_RESENDING_VERIFICATION });
    try {
      await authUserApi.resendVerification(fields);
      dispatch({
        type: RESEND_VERIFICATION_SUCCESS,
      });
    } catch (error: any) {
      console.log("Resend verification error: ", error.message);
      dispatch({
        type: RESEND_VERIFICATION_FAILURE,
        error: error?.message,
      });
    }
  };
}

export function subscribeToken() {
  return async (dispatch: any) => {
    dispatch({ type: IS_GENERATING_TOKEN });
    try {
      const result = await authUserApi.subscribeToken();
      dispatch({
        type: GENERATE_TOKEN_SUCCESS,
        token: result,
      });
      return result;
    } catch (error: any) {
      console.log("Subscribe token error: ", error.message);
      dispatch({
        type: GENERATE_TOKEN_FAILURE,
        error: error?.message,
      });
    }
  };
}
