import axios from 'axios';
import { Config } from '../config';

let conf = new Config();
const axiosInstance = axios.create({
    baseURL: conf.baseURL,
});

axiosInstance.defaults.timeout = 1000;

module.exports = { axiosInstance };
