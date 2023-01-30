import {
  IS_UPDATING_PROFILE_PICTURE,
	UPDATE_PROFILE_PICTURE_SUCCESS,
	UPDATE_PROFILE_PICTURE_FAILURE,
  IS_UPDATING_PROFILE_BANNER,
  UPDATE_PROFILE_BANNER_SUCCESS,
  UPDATE_PROFILE_BANNER_FAILURE
} from './UserActionTypes';

// Api
import { userApi } from '../../api';

export function updateProfilcePicture(fields: object) {
  return async (dispatch: any) => {
    dispatch({type: IS_UPDATING_PROFILE_PICTURE});
    try {
      await userApi.updateProfilePicture(fields);
      dispatch({
        type: UPDATE_PROFILE_PICTURE_SUCCESS,
      });
    } catch(error: any) {
      console.log('Update Profile Picture error: ', error);
      dispatch({
        type: UPDATE_PROFILE_PICTURE_FAILURE,
        error: error
      });
    }
  }
}

export function updateProfileBanner(fields: object) {
  return async (dispatch: any) => {
    dispatch({type: IS_UPDATING_PROFILE_BANNER});
    try {
      await userApi.updateProfileBanner(fields);
      dispatch({
        type: UPDATE_PROFILE_BANNER_SUCCESS,
      });
    } catch(error: any) {
      console.log('Update Profile Banner error: ', error);
      dispatch({
        type: UPDATE_PROFILE_BANNER_FAILURE,
        error: error
      });
    }
  }
}