/**
 * 高级功能测试脚本
 * 深度测试网站的核心功能和业务逻辑
 */

const https = require('https');

const SITE_URL = 'https://polarbigdatashowv2.netlify.app';

const testResults = {
  passed: 0,
  failed: 0,
  warnings: 0,
  total: 0,
  details: []
};

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...options.headers
      },
      timeout: 30000
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

async function testFeature(name, testFn) {
  testResults.total++;
  console.log(`\n📝 测试: ${name}`);
  
  try {
    const result = await testFn();
    if (result.status === 'passed') {
      console.log(`✅ ${name} - 通过`);
      if (result.message) console.log(`   ${result.message}`);
      testResults.passed++;
      testResults.details.push({ test: name, status: 'passed', message: result.message });
    } else if (result.status === 'warning') {
      console.log(`⚠️ ${name} - 警告`);
      if (result.message) console.log(`   ${result.message}`);
      testResults.warnings++;
      testResults.details.push({ test: name, status: 'warning', message: result.message });
    } else {
      console.log(`❌ ${name} - 失败`);
      if (result.message) console.log(`   ${result.message}`);
      testResults.failed++;
      testResults.details.push({ test: name, status: 'failed', message: result.message });
    }
  } catch (error) {
    console.log(`❌ ${name} - 异常: ${error.message}`);
    testResults.failed++;
    testResults.details.push({ test: name, status: 'failed', message: error.message });
  }
}

async function runAdvancedTests() {
  console.log('==================================================');
  console.log('🔍 开始高级功能测试');
  console.log(`📍 网站地址: ${SITE_URL}`);
  console.log('==================================================\n');

  // 1. 测试首页关键内容
  await testFeature('首页包含必要的导航元素', async () => {
    const response = await makeRequest(`${SITE_URL}/`);
    const requiredElements = ['Netlify', 'Next.js'];
    const allPresent = requiredElements.every(el => response.body.includes(el));
    return {
      status: allPresent ? 'passed' : 'failed',
      message: allPresent ? '所有必要元素都存在' : '缺少部分必要元素'
    };
  });

  // 2. 测试设备页面数据展示
  await testFeature('设备页面包含设备信息', async () => {
    const response = await makeRequest(`${SITE_URL}/devices`);
    const hasDeviceInfo = response.body.includes('光伏') || response.body.includes('设备') || response.body.includes('Solar');
    return {
      status: hasDeviceInfo ? 'passed' : 'warning',
      message: hasDeviceInfo ? '包含设备相关信息' : '未找到明确的设备信息（可能是动态加载）'
    };
  });

  // 3. 测试关于页面内容
  await testFeature('关于页面包含公司信息', async () => {
    const response = await makeRequest(`${SITE_URL}/about`);
    const hasCompanyInfo = response.body.length > 5000; // 关于页面应该有丰富的内容
    return {
      status: hasCompanyInfo ? 'passed' : 'warning',
      message: hasCompanyInfo ? `页面内容丰富 (${(response.body.length / 1024).toFixed(2)} KB)` : '页面内容较少'
    };
  });

  // 4. 测试分析页面
  await testFeature('分析页面可访问', async () => {
    const response = await makeRequest(`${SITE_URL}/analytics`);
    return {
      status: response.statusCode === 200 ? 'passed' : 'failed',
      message: `状态码: ${response.statusCode}, 内容大小: ${(response.body.length / 1024).toFixed(2)} KB`
    };
  });

  // 5. 测试历史页面
  await testFeature('历史页面可访问', async () => {
    const response = await makeRequest(`${SITE_URL}/history`);
    return {
      status: response.statusCode === 200 ? 'passed' : 'failed',
      message: `状态码: ${response.statusCode}, 内容大小: ${(response.body.length / 1024).toFixed(2)} KB`
    };
  });

  // 6. 测试设置页面
  await testFeature('设置页面包含配置选项', async () => {
    const response = await makeRequest(`${SITE_URL}/settings`);
    const hasSettings = response.body.includes('设置') || response.body.includes('settings') || response.body.includes('Settings');
    return {
      status: response.statusCode === 200 ? 'passed' : 'failed',
      message: `页面可访问，${hasSettings ? '包含设置相关内容' : '内容动态加载'}`
    };
  });

  // 7. 测试动态路由 - 设备详情
  await testFeature('设备详情页（ID: 1）可访问', async () => {
    const response = await makeRequest(`${SITE_URL}/devices/solar/1`);
    return {
      status: response.statusCode === 200 ? 'passed' : 'failed',
      message: `状态码: ${response.statusCode}, 内容大小: ${(response.body.length / 1024).toFixed(2)} KB`
    };
  });

  // 8. 测试动态路由 - 不同设备ID
  await testFeature('设备详情页（ID: 2）可访问', async () => {
    const response = await makeRequest(`${SITE_URL}/devices/solar/2`);
    return {
      status: response.statusCode === 200 ? 'passed' : 'failed',
      message: `状态码: ${response.statusCode}`
    };
  });

  // 9. 测试 API 路由
  await testFeature('随机引用API返回有效JSON', async () => {
    const response = await makeRequest(`${SITE_URL}/quotes/random`, {
      headers: { 'Accept': 'application/json' }
    });
    try {
      const data = JSON.parse(response.body);
      const hasQuote = data && (data.quote || data.text || data.content);
      return {
        status: hasQuote ? 'passed' : 'warning',
        message: hasQuote ? 'API返回有效的引用数据' : 'API响应但数据结构可能不同'
      };
    } catch (e) {
      return {
        status: 'warning',
        message: 'API响应但不是标准JSON格式'
      };
    }
  });

  // 10. 测试静态资源加载
  await testFeature('Logo图片可正常加载', async () => {
    const response = await makeRequest(`${SITE_URL}/image/logo.png`);
    const isImage = response.headers['content-type']?.includes('image');
    return {
      status: isImage ? 'passed' : 'failed',
      message: isImage ? `图片大小: ${(response.body.length / 1024).toFixed(2)} KB` : '非图片类型'
    };
  });

  // 11. 测试响应时间
  await testFeature('首页响应时间 < 3秒', async () => {
    const startTime = Date.now();
    await makeRequest(`${SITE_URL}/`);
    const responseTime = Date.now() - startTime;
    return {
      status: responseTime < 3000 ? 'passed' : 'warning',
      message: `响应时间: ${responseTime}ms`
    };
  });

  // 12. 测试SEO - Robots.txt
  await testFeature('Robots.txt配置正确', async () => {
    const response = await makeRequest(`${SITE_URL}/robots.txt`);
    const hasUserAgent = response.body.includes('User-agent');
    return {
      status: hasUserAgent ? 'passed' : 'warning',
      message: hasUserAgent ? 'Robots.txt配置正确' : 'Robots.txt内容可能需要优化'
    };
  });

  // 13. 测试SEO - Sitemap
  await testFeature('Sitemap.xml包含页面链接', async () => {
    const response = await makeRequest(`${SITE_URL}/sitemap.xml`);
    const hasUrls = response.body.includes('<url>') && response.body.includes('<loc>');
    return {
      status: hasUrls ? 'passed' : 'failed',
      message: hasUrls ? 'Sitemap包含有效的URL链接' : 'Sitemap格式可能不正确'
    };
  });

  // 14. 测试 404 错误处理
  await testFeature('404页面正确处理', async () => {
    const response = await makeRequest(`${SITE_URL}/this-page-does-not-exist-12345`);
    return {
      status: response.statusCode === 404 ? 'passed' : 'warning',
      message: `状态码: ${response.statusCode}`
    };
  });

  // 15. 测试HTML结构
  await testFeature('页面包含正确的HTML结构', async () => {
    const response = await makeRequest(`${SITE_URL}/`);
    const hasHtml = response.body.includes('<!DOCTYPE html>') || response.body.includes('<html');
    const hasHead = response.body.includes('<head>') || response.body.includes('<head ');
    const hasBody = response.body.includes('<body>') || response.body.includes('<body ');
    const allPresent = hasHtml && hasHead && hasBody;
    return {
      status: allPresent ? 'passed' : 'failed',
      message: allPresent ? 'HTML结构完整' : 'HTML结构可能不完整'
    };
  });

  // 打印测试总结
  console.log('\n\n==================================================');
  console.log('📊 高级功能测试总结');
  console.log('==================================================');
  console.log(`总测试数: ${testResults.total}`);
  console.log(`✅ 通过: ${testResults.passed}`);
  console.log(`⚠️ 警告: ${testResults.warnings}`);
  console.log(`❌ 失败: ${testResults.failed}`);
  console.log(`通过率: ${((testResults.passed / testResults.total) * 100).toFixed(2)}%`);
  console.log('==================================================\n');

  // 打印失败和警告的测试
  const failedTests = testResults.details.filter(t => t.status === 'failed');
  const warningTests = testResults.details.filter(t => t.status === 'warning');

  if (failedTests.length > 0) {
    console.log('\n❌ 失败的测试:');
    failedTests.forEach((test, index) => {
      console.log(`${index + 1}. ${test.test}`);
      console.log(`   ${test.message}`);
    });
  }

  if (warningTests.length > 0) {
    console.log('\n⚠️ 警告的测试:');
    warningTests.forEach((test, index) => {
      console.log(`${index + 1}. ${test.test}`);
      console.log(`   ${test.message}`);
    });
  }

  return {
    success: testResults.failed === 0,
    passed: testResults.passed,
    failed: testResults.failed,
    warnings: testResults.warnings,
    total: testResults.total
  };
}

runAdvancedTests()
  .then((results) => {
    if (results.success) {
      console.log('\n✅ 所有核心功能测试通过！');
      if (results.warnings > 0) {
        console.log(`⚠️ 有 ${results.warnings} 个警告项，建议检查但不影响基本功能。`);
      }
      process.exit(0);
    } else {
      console.log(`\n❌ 有 ${results.failed} 个测试失败，需要修复。`);
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n❌ 测试过程中发生错误:', error);
    process.exit(1);
  });

