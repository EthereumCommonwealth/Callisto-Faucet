import fetch from '../services/fetch';

const endpoints = {
  faucet: '/faucet/',
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