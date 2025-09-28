const axios = require('axios');

/**
 * Vercel API 函数 - 处理 AI 聊天请求
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
export default async function handler(req, res) {
    // 设置 CORS 头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 只允许 POST 请求
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        console.log('收到AI请求:', {
            body: req.body,
            authorization: req.headers.authorization
        });

        const response = await axios.post(
            'https://api.deepseek.com/v1/chat/completions',
            req.body,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': req.headers.authorization || `Bearer ${process.env.DEEPSEEK_API_KEY}`
                }
            }
        );

        console.log('AI响应成功:', response.data);
        res.status(200).json(response.data);

    } catch (error) {
        console.error('AI请求失败:', error.response ? error.response.data : error.message);
        res.status(error.response ? error.response.status : 500).json({
            message: 'AI请求失败',
            error: error.response ? error.response.data : error.message
        });
    }
}
