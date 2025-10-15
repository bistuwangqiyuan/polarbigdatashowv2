/**
 * 等待部署完成后测试
 */

console.log('⏳ 等待部署完全生效（30秒）...');
console.log('💡 Netlify CDN 需要一些时间传播更新\n');

let countdown = 30;
const interval = setInterval(() => {
  process.stdout.write(`\r⏰ 倒计时: ${countdown}秒...`);
  countdown--;
  
  if (countdown < 0) {
    clearInterval(interval);
    console.log('\n\n✅ 等待完成，开始测试...\n');
    
    // 运行测试
    const { spawn } = require('child_process');
    const test = spawn('node', ['scripts/test-deployed-site.js'], {
      stdio: 'inherit',
      shell: true
    });
    
    test.on('close', (code) => {
      if (code === 0) {
        console.log('\n✅ 基础测试通过，运行高级测试...\n');
        const advTest = spawn('node', ['scripts/test-advanced-features.js'], {
          stdio: 'inherit',
          shell: true
        });
        
        advTest.on('close', (advCode) => {
          if (advCode === 0) {
            console.log('\n✅ 所有测试通过！');
            process.exit(0);
          } else {
            process.exit(advCode);
          }
        });
      } else {
        console.log('\n❌ 基础测试失败');
        process.exit(code);
      }
    });
  }
}, 1000);

