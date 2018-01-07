import axios from 'axios';
const url = process.env.REACT_APP_API;

const fetch = () => {
  const fetch = axios.create({
    baseURL: url,
    headers: {
      accept: 'application/json'
    },
  });
  return fetch;
}
export default fetch();