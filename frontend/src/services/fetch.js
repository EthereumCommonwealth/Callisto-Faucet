import axios from 'axios';
const url = 'http://localhost:8080';

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