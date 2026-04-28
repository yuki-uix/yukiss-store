const { chatCompletion, parseJsonLoose } = require('./llm');
const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
const eventName = process.env.EVENT_NAME;
const eventPayload = JSON.parse(process.env.EVENT_PAYLOAD);

const onboardingPath = path.join(process.cwd(), 'docs', 'Onboarding.md');

async function getRecentActivity() {
  const activity = [];

  // 根据触发事件类型获取相关内容
  if (eventName === 'milestone') {
    const milestone = eventPayload.milestone;
    activity.push(`Milestone 关闭：${milestone.title}\n描述：${milestone.description || '无'}`);

    // 获取该 milestone 下的所有 issues
    const { data: issues } = await octokit.rest.issues.listForRepo({
      owner, repo,
      milestone: milestone.number,
      state: 'all',
      per_page: 50
    });

    issues.forEach(issue => {
      activity.push(`Issue：${issue.title}\n内容：${issue.body || '无'}`);
    });
  }

  if (eventName === 'pull_request') {
    const pr = eventPayload.pull_request;
    activity.push(`PR merge：${pr.title}\n描述：${pr.body || '无'}`);
  }

  if (eventName === 'issues') {
    const issue = eventPayload.issue;
    activity.push(`Epic 关闭：${issue.title}\n内容：${issue.body || '无'}`);
  }

  return activity.join('\n\n---\n\n');
}

async function getCurrentOnboarding() {
  if (!fs.existsSync(onboardingPath)) return '（文档不存在）';
  return fs.readFileSync(onboardingPath, 'utf-8');
}

async function detect() {
  const [recentActivity, currentOnboarding] = await Promise.all([
    getRecentActivity(),
    getCurrentOnboarding()
  ]);

  const prompt = fs.readFileSync(
    path.join(__dirname, '../prompts/detector.md'), 'utf-8'
  );

  const text = await chatCompletion({
    max_tokens: 1000,
    messages: [{
      role: 'user',
      content: prompt
        .replace('{{RECENT_ACTIVITY}}', recentActivity)
        .replace('{{CURRENT_ONBOARDING}}', currentOnboarding)
    }]
  });

  const result = parseJsonLoose(text);

  // 输出给 GitHub Actions
  const output = process.env.GITHUB_OUTPUT;
  fs.appendFileSync(output, `confidence=${result.confidence}\n`);
  fs.appendFileSync(output, `has_drift=${result.has_drift}\n`);
  fs.appendFileSync(output, `drift_report=${JSON.stringify(result.drift_report)}\n`);

  console.log('Detector 完成：', result);
}

detect().catch(err => {
  console.error('Detector 失败：', err);
  process.exit(1);
});
