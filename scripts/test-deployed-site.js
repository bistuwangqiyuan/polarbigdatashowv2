/**
 * 部署网站测试脚本
 * 测试已部署到 Netlify 的网站功能
 */

const https = require('https');
const http = require('http');

const SITE_URL = 'https://polarbigdatashowv2.netlify.app';

// 测试结果统计
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: []
};

/**
 * 发起 HTTP 请求
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...options.headers
      },
      timeout: 30000
    };

    const req = protocol.request(requestOptions, (res) => {
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

    req.on('error', (error) => {
      reject(error);
    });

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

/**
 * 测试页面是否可访问
 */
async function testPageAccess(pageName, path, expectedStatus = 200) {
  testResults.total++;
  console.log(`\n📝 测试 ${pageName} (${path})...`);
  
  try {
    const url = `${SITE_URL}${path}`;
    const response = await makeRequest(url);
    
    if (response.statusCode === expectedStatus) {
      console.log(`✅ ${pageName} - 访问成功 (状态码: ${response.statusCode})`);
      testResults.passed++;
      testResults.details.push({
        test: `${pageName} 页面访问`,
        status: 'passed',
        message: `状态码: ${response.statusCode}`
      });
      
      // 检查页面内容
      if (response.body.length > 0) {
        console.log(`   内容大小: ${(response.body.length / 1024).toFixed(2)} KB`);
      }
      
      return true;
    } else {
      console.log(`❌ ${pageName} - 状态码错误: 期望 ${expectedStatus}, 实际 ${response.statusCode}`);
      testResults.failed++;
      testResults.details.push({
        test: `${pageName} 页面访问`,
        status: 'failed',
        message: `状态码错误: 期望 ${expectedStatus}, 实际 ${response.statusCode}`
      });
      return false;
    }
  } catch (error) {
    console.log(`❌ ${pageName} - 请求失败: ${error.message}`);
    testResults.failed++;
    testResults.details.push({
      test: `${pageName} 页面访问`,
      status: 'failed',
      message: error.message
    });
    return false;
  }
}

/**
 * 测试页面内容
 */
async function testPageContent(pageName, path, expectedContent) {
  testResults.total++;
  console.log(`\n📝 测试 ${pageName} 内容...`);
  
  try {
    const url = `${SITE_URL}${path}`;
    const response = await makeRequest(url);
    
    if (response.statusCode === 200) {
      const containsContent = expectedContent.every(content => 
        response.body.includes(content)
      );
      
      if (containsContent) {
        console.log(`✅ ${pageName} - 内容验证通过`);
        testResults.passed++;
        testResults.details.push({
          test: `${pageName} 内容验证`,
          status: 'passed',
          message: '所有预期内容都存在'
        });
        return true;
      } else {
        console.log(`❌ ${pageName} - 内容验证失败，缺少预期内容`);
        testResults.failed++;
        testResults.details.push({
          test: `${pageName} 内容验证`,
          status: 'failed',
          message: '缺少部分预期内容'
        });
        return false;
      }
    } else {
      console.log(`❌ ${pageName} - 无法访问页面 (状态码: ${response.statusCode})`);
      testResults.failed++;
      testResults.details.push({
        test: `${pageName} 内容验证`,
        status: 'failed',
        message: `无法访问页面 (状态码: ${response.statusCode})`
      });
      return false;
    }
  } catch (error) {
    console.log(`❌ ${pageName} - 测试失败: ${error.message}`);
    testResults.failed++;
    testResults.details.push({
      test: `${pageName} 内容验证`,
      status: 'failed',
      message: error.message
    });
    return false;
  }
}

/**
 * 测试响应头
 */
async function testResponseHeaders(pageName, path, expectedHeaders) {
  testResults.total++;
  console.log(`\n📝 测试 ${pageName} 响应头...`);
  
  try {
    const url = `${SITE_URL}${path}`;
    const response = await makeRequest(url);
    
    let allHeadersPresent = true;
    const missingHeaders = [];
    
    for (const [header, expectedValue] of Object.entries(expectedHeaders)) {
      const actualValue = response.headers[header.toLowerCase()];
      if (!actualValue) {
        allHeadersPresent = false;
        missingHeaders.push(header);
      } else if (expectedValue && !actualValue.includes(expectedValue)) {
        allHeadersPresent = false;
        missingHeaders.push(`${header} (值不匹配)`);
      }
    }
    
    if (allHeadersPresent) {
      console.log(`✅ ${pageName} - 响应头验证通过`);
      testResults.passed++;
      testResults.details.push({
        test: `${pageName} 响应头验证`,
        status: 'passed',
        message: '所有必需的响应头都存在'
      });
      return true;
    } else {
      console.log(`⚠️ ${pageName} - 缺少响应头: ${missingHeaders.join(', ')}`);
      testResults.passed++; // 响应头缺失作为警告，不算失败
      testResults.details.push({
        test: `${pageName} 响应头验证`,
        status: 'warning',
        message: `缺少响应头: ${missingHeaders.join(', ')}`
      });
      return false;
    }
  } catch (error) {
    console.log(`❌ ${pageName} - 测试失败: ${error.message}`);
    testResults.failed++;
    testResults.details.push({
      test: `${pageName} 响应头验证`,
      status: 'failed',
      message: error.message
    });
    return false;
  }
}

/**
 * 主测试函数
 */
async function runTests() {
  console.log('==================================================');
  console.log('🚀 开始测试部署的网站');
  console.log(`📍 网站地址: ${SITE_URL}`);
  console.log('==================================================\n');

  // 1. 测试主要页面访问
  console.log('\n==================== 页面访问测试 ====================');
  await testPageAccess('首页', '/');
  await testPageAccess('关于页面', '/about');
  await testPageAccess('设备页面', '/devices');
  await testPageAccess('分析页面', '/analytics');
  await testPageAccess('历史页面', '/history');
  await testPageAccess('设置页面', '/settings');
  
  // 2. 测试动态路由
  console.log('\n==================== 动态路由测试 ====================');
  await testPageAccess('设备详情页', '/devices/solar/1');
  
  // 3. 测试 API 路由
  console.log('\n==================== API 路由测试 ====================');
  await testPageAccess('随机引用 API', '/quotes/random');
  
  // 4. 测试静态资源
  console.log('\n==================== 静态资源测试 ====================');
  await testPageAccess('Logo 图片', '/image/logo.png');
  await testPageAccess('Robots.txt', '/robots.txt');
  await testPageAccess('Sitemap.xml', '/sitemap.xml');
  
  // 5. 测试 404 页面
  console.log('\n==================== 错误处理测试 ====================');
  await testPageAccess('404页面', '/non-existent-page', 404);

  // 6. 测试页面内容
  console.log('\n==================== 内容验证测试 ====================');
  await testPageContent('首页', '/', ['Netlify', 'Next.js']);
  
  // 打印测试总结
  console.log('\n\n==================================================');
  console.log('📊 测试总结');
  console.log('==================================================');
  console.log(`总测试数: ${testResults.total}`);
  console.log(`✅ 通过: ${testResults.passed}`);
  console.log(`❌ 失败: ${testResults.failed}`);
  console.log(`通过率: ${((testResults.passed / testResults.total) * 100).toFixed(2)}%`);
  console.log('==================================================\n');

  // 打印失败的测试详情
  const failedTests = testResults.details.filter(t => t.status === 'failed');
  if (failedTests.length > 0) {
    console.log('\n❌ 失败的测试详情:');
    failedTests.forEach((test, index) => {
      console.log(`${index + 1}. ${test.test}`);
      console.log(`   原因: ${test.message}`);
    });
  }

  // 返回测试结果
  return {
    success: testResults.failed === 0,
    passed: testResults.passed,
    failed: testResults.failed,
    total: testResults.total,
    details: testResults.details
  };
}

// 运行测试
runTests()
  .then((results) => {
    if (results.success) {
      console.log('\n✅ 所有测试通过！网站部署成功！');
      process.exit(0);
    } else {
      console.log('\n❌ 部分测试失败，请检查上述错误并修复。');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n❌ 测试过程中发生错误:', error);
    process.exit(1);
  });

