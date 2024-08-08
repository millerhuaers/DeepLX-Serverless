const express = require('express');
const bodyParser = require('body-parser');
const { translate } = require('../translate');

const app = express();
const PORT = 9000;

app.use(bodyParser.json());

app.post('/translate', async (req, res) => {
  const startTime = Date.now(); // 记录开始时间

  // 检查请求方法和请求体
  if (req.method !== 'POST' || !req.body || !req.body.text) {
    const duration = Date.now() - startTime;
    console.log(`[LOG] ${new Date().toISOString()} | 404 | ${duration}ms | POST "translate"`);
    return res.status(404).json({
      "code": 404,
      "message": "Path not found"
    });
  }

  const { text, source_lang = 'AUTO', target_lang = 'ZH' } = req.body;

  try {
    const result = await translate(text, source_lang, target_lang);
    const duration = Date.now() - startTime; // 计算处理时间
    console.log(`[LOG] ${new Date().toISOString()} | 200 | ${duration}ms | POST "translate"`);

    const responseData = {
      alternatives: result.alternatives,
      code: 200,
      data: result.text, // 取第一个翻译结果
      id: Math.floor(Math.random() * 10000000000), // 生成一个随机 ID
      method: 'Free',
      source_lang,
      target_lang,
    };

    res.json(responseData);
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`[ERROR] ${new Date().toISOString()} | 500 | ${duration}ms | POST "translate" | ${error.message}`);
    res.status(500).json({
      code: 500,
      message: 'Translation failed',
      error: error.message
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});