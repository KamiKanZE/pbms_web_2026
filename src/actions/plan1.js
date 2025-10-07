import { ADD_POST, DELETE_POST, FETCH_POST } from './types';
import axios from 'axios';

export const createPost = ({ plan_id, plan_name }) => {
  return dispatch => {
    return axios
      .post(process.env.REACT_APP_SOURCE_URL + '/dataPlans', {
        plan_id,
        plan_name,
      })
      .then(response => {
        // dispatch(createPostSuccess(response.data));
        dispatch(fetchAllPosts(response.data));
      })
      .catch(error => {
        throw error;
      });
  };
};

export const createPostSuccess = data => {
  return {
    type: ADD_POST,
    payload: {
      _id: data._id,
      plan_id: data.plan_id,
      plan_name: data.plan_name,
    },
  };
};

export const deletePostSuccess = id => {
  return {
    type: DELETE_POST,
    payload: {
      id,
    },
  };
};

export const deletePost = id => {
  return dispatch => {
    return axios
      .delete(process.env.REACT_APP_SOURCE_URL + '/dataPlans/' + id)
      .then(response => {
        //dispatch(deletePostSuccess(response.data));
        dispatch(fetchAllPosts(response.data));
      })
      .catch(error => {
        throw error;
      });
  };
};

export const fetchPosts = posts => {
  return {
    type: FETCH_POST,
    posts,
  };
};

export const fetchAllPosts = () => {
  return dispatch => {
    return axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataPlans/list')
      .then(response => {
        dispatch(fetchPosts(response.data));
      })
      .catch(error => {
        throw error;
      });
  };
};
