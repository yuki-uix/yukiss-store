const { chatCompletion } = require('./llm');
const fs = require('fs');
const path = require('path');



const driftReport = JSON.parse(process.env.DRIFT_REPORT);

const onboardingPath = path.join(process.cwd(), 'docs', 'Onboarding.md');

async function write() {
  const currentOnboarding = fs.readFileSync(onboardingPath, 'utf-8');

  const prompt = fs.readFileSync(
    path.join(__dirname, '../prompts/writer.md'), 'utf-8'
  );

  const updatedContent = await chatCompletion({
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: prompt
        .replace('{{CURRENT_ONBOARDING}}', currentOnboarding)
        .replace('{{DRIFT_REPORT}}', JSON.stringify(driftReport, null, 2))
    }]
  });

  fs.writeFileSync(onboardingPath, updatedContent, 'utf-8');

  // 输出给 GitHub Actions
  const output = process.env.GITHUB_OUTPUT;
  fs.appendFileSync(output, `updated=true\n`);
  fs.appendFileSync(output, `content=${JSON.stringify(updatedContent)}\n`);

  console.log('Writer 完成，文档已更新');
}

write().catch(err => {
  console.error('Writer 失败：', err);
  process.exit(1);
});
