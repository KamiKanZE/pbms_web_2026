import { ADD_POST, DELETE_POST, FETCH_POST } from './types';
import axios from 'axios';

export const createPost = ({ budget_source_id, budget_source_name }) => {
  return dispatch => {
    return axios
      .post(process.env.REACT_APP_SOURCE_URL + '/dataBudgetSources', {
        budget_source_id,
        budget_source_name,
      })
      .then(response => {
        //dispatch(createPostSuccess(response.data));
        dispatch(fetchAllPosts1(response.data));
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
      budget_source_id: data.budget_source_id,
      budget_source_name: data.budget_source_name,
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
      .delete(process.env.REACT_APP_SOURCE_URL + '/dataBudgetSources/' + id)
      .then(response => {
        //dispatch(deletePostSuccess(response.data));
        dispatch(fetchAllPosts1(response.data));
      })
      .catch(error => {
        throw error;
      });
  };
};

export const fetchPosts1 = posts => {
  return {
    type: FETCH_POST,
    posts,
  };
};

export const fetchAllPosts1 = () => {
  return dispatch => {
    return axios
      .get(process.env.REACT_APP_SOURCE_URL + '/dataBudgetSources/list')
      .then(response => {
        dispatch(fetchPosts1(response.data));
      })
      .catch(error => {
        throw error;
      });
  };
};
