/**
 * reporter/issue-reporter.js
 * Custom Playwright reporter — writes one .md file per component
 * plus a SUMMARY.md at the end showing all issues.
 */
import fs   from 'fs';
import path from 'path';

export default class IssueReporter {
  constructor() {
    this.issues    = {};   // { componentName: [{ title, error, duration }] }
    this.passed    = {};   // { componentName: [title] }
    this.skipped   = {};
    this.startTime = Date.now();
    this.reportsDir = path.join(process.cwd(), 'reports');
  }

  onBegin() {
    fs.mkdirSync(this.reportsDir, { recursive: true });
    // Wipe old reports so stale results don't linger
    try {
      fs.readdirSync(this.reportsDir)
        .filter((f) => f.endsWith('.md'))
        .forEach((f) => fs.unlinkSync(path.join(this.reportsDir, f)));
    } catch {}
    console.log('\n🤖 Bot is live — watching for issues…\n');
  }

  onTestEnd(test, result) {
    const component = this._name(test.location.file);

    if (result.status === 'failed' || result.status === 'timedOut') {
      (this.issues[component] ??= []).push({
        title:    test.title,
        error:    (result.error?.message || 'Unknown error').split('\n')[0].slice(0, 250),
        fullErr:  (result.error?.message || '').slice(0, 1000),
        duration: result.duration,
      });
    } else if (result.status === 'passed') {
      (this.passed[component] ??= []).push(test.title);
    } else {
      (this.skipped[component] ??= []).push(test.title);
    }
  }

  async onEnd() {
    const all = new Set([
      ...Object.keys(this.issues),
      ...Object.keys(this.passed),
      ...Object.keys(this.skipped),
    ]);

    for (const comp of all) {
      const content = this._componentReport(
        comp,
        this.issues[comp]  ?? [],
        this.passed[comp]  ?? [],
        this.skipped[comp] ?? [],
      );
      fs.writeFileSync(path.join(this.reportsDir, `${comp}.md`), content, 'utf8');
    }

    fs.writeFileSync(path.join(this.reportsDir, 'SUMMARY.md'), this._summary(), 'utf8');

    const totalIssues = Object.values(this.issues).flat().length;
    const totalPassed = Object.values(this.passed).flat().length;

    console.log('\n' + '─'.repeat(58));
    console.log('📋  TEST BOT RESULTS');
    console.log(`    ✅  Passed  : ${totalPassed} checks`);
    console.log(`    ❌  Issues  : ${totalIssues} across ${Object.keys(this.issues).length} component(s)`);
    console.log(`    📁  Reports : ${this.reportsDir}`);
    console.log('─'.repeat(58) + '\n');
  }

  // ─── helpers ────────────────────────────────────────────────────

  _name(file) {
    return path.basename(file, '.spec.js').replace(/^\d+_/, '');
  }

  _componentReport(comp, issues, passed, skipped) {
    const title = comp.replace(/_/g, ' ');
    const date  = new Date().toLocaleString('en-IN');

    let md = `# ${title} — E2E Report\n\n`;
    md += `| Metric | Value |\n|---|---|\n`;
    md += `| Date | ${date} |\n`;
    md += `| Passed | ${passed.length} |\n`;
    md += `| Issues | ${issues.length} |\n`;
    md += `| Skipped | ${skipped.length} |\n\n`;

    if (issues.length === 0) {
      md += `## ✅ All Checks Passed\n\n`;
      md += passed.map((t) => `- ✅ ${t}`).join('\n') + '\n';
    } else {
      md += `## ❌ Issues — Fix These\n\n`;
      issues.forEach((iss, i) => {
        md += `### Issue ${i + 1}: ${iss.title}\n\n`;
        md += `**Error:**\n\`\`\`\n${iss.error}\n\`\`\`\n\n`;
        if (iss.fullErr && iss.fullErr !== iss.error) {
          md += `<details><summary>Full stack</summary>\n\n\`\`\`\n${iss.fullErr}\n\`\`\`\n</details>\n\n`;
        }
        md += `_Duration: ${(iss.duration / 1000).toFixed(1)}s_\n\n---\n\n`;
      });

      if (passed.length) {
        md += `## ✅ Checks That Passed\n\n`;
        md += passed.map((t) => `- ✅ ${t}`).join('\n') + '\n\n';
      }
    }

    if (skipped.length) {
      md += `## ⏭️ Skipped\n\n`;
      md += skipped.map((t) => `- ⏭️ ${t}`).join('\n') + '\n';
    }

    return md;
  }

  _summary() {
    const date        = new Date().toLocaleString('en-IN');
    const allIssues   = Object.values(this.issues).flat();
    const allPassed   = Object.values(this.passed).flat();
    const duration    = ((Date.now() - this.startTime) / 1000).toFixed(0);
    const total       = allIssues.length + allPassed.length;

    let md = `# E2E Bot — Summary Report\n\n`;
    md += `| | |\n|---|---|\n`;
    md += `| Run at | ${date} |\n`;
    md += `| Duration | ${duration}s |\n`;
    md += `| Total checks | ${total} |\n`;
    md += `| ✅ Passed | ${allPassed.length} |\n`;
    md += `| ❌ Failed | ${allIssues.length} |\n\n`;

    if (allIssues.length === 0) {
      md += `## 🎉 Everything is Working!\n\nAll **${total}** checks passed. No issues found.\n`;
      return md;
    }

    md += `## 🔴 Components With Issues\n\n`;
    md += `> Fix these, then re-run \`npm test\` to confirm.\n\n`;

    for (const [comp, issues] of Object.entries(this.issues)) {
      md += `### ${comp}  _(${issues.length} issue${issues.length !== 1 ? 's' : ''})_\n\n`;
      issues.forEach((iss) => {
        md += `- ❌ **${iss.title}**\n  > \`${iss.error}\`\n`;
      });
      md += '\n';
    }

    const clean = Object.keys(this.passed).filter((c) => !this.issues[c]);
    if (clean.length) {
      md += `## ✅ Components — All Clear\n\n`;
      clean.forEach((c) => {
        md += `- ✅ **${c}** — ${this.passed[c].length} checks passed\n`;
      });
      md += '\n';
    }

    md += `---\n_Individual reports are in the same \`reports/\` folder._\n`;
    return md;
  }
}
