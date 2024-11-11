import axios from 'axios';

const httpService = axios.create({
  baseURL: ' https://api.tokenterminal.com/v3/internal',
  // timeout: 5000,
});
// 添加请求拦截器
httpService.interceptors.request.use(
  (config) => {
    // 假设你的授权令牌存储在某个地方，这里只是示例
    const token = 'c0e5035a-64f6-4d2c-b5f6-ac1d1cb3da2f';
    if (token) {
      config.headers.authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default httpService;
