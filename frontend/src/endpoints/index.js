import fetch from '../services/fetch';

const endpoints = {
  faucet: process.env.REACT_APP_API_TARGET,
};

function faucet(data) {
  return fetch.post(endpoints.faucet, data)
  .then((res) => {
    return res.data;
  })
  .catch((error) => {
    return error;
  });
}

export default {
  faucet,
};