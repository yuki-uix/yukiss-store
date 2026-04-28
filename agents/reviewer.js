const { chatCompletion, parseJsonLoose } = require('./llm');
const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
const updatedContent = JSON.parse(process.env.UPDATED_CONTENT);

const onboardingRelative = 'docs/Onboarding.md';

async function review() {
  const prompt = fs.readFileSync(
    path.join(__dirname, '../prompts/reviewer.md'), 'utf-8'
  );

  const text = await chatCompletion({
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: prompt.replace('{{UPDATED_CONTENT}}', updatedContent)
    }]
  });

  const result = parseJsonLoose(text);

  if (result.approved) {
    // 创建 PR 提交更新
    const branch = `context-sync/${Date.now()}`;

    execSync(`git config user.email "context-sync-agent@github.com"`);
    execSync(`git config user.name "context-sync-agent"`);
    execSync(`git checkout -b ${branch}`);
    execSync(`git add ${onboardingRelative}`);
    execSync(`git commit -m "docs: auto-update onboarding context [context-sync-agent]"`);
    execSync(`git push origin ${branch}`);

    await octokit.rest.pulls.create({
      owner, repo,
      title: '[context-sync] 自动更新业务上下文',
      body: `context-sync-agent 检测到业务进展并自动更新了 onboarding 文档。\n\n**变更摘要：**\n\n${result.summary}\n\n> 由 context-sync-agent 自动生成`,
      head: branch,
      base: 'main'
    });

    console.log('Reviewer approved，PR 已创建');
  } else {
    // 退回 Writer 重新处理，开 issue 说明原因
    await octokit.rest.issues.create({
      owner, repo,
      title: '[context-sync] 更新内容需要修订',
      body: `context-sync-agent 的 Reviewer 认为本次更新需要修订。\n\n**原因：**\n\n${result.reason}\n\n> 由 context-sync-agent 自动生成`,
      labels: ['context-sync', 'needs-review']
    });

    console.log('Reviewer 要求修订，已开 issue');
    process.exit(1);
  }
}

review().catch(err => {
  console.error('Reviewer 失败：', err);
  process.exit(1);
});
