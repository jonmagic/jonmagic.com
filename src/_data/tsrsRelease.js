const fs = require("fs");
const path = require("path");
const markdownIt = require("markdown-it");

const changelogPath = process.env.TSRS_CHANGELOG_PATH
  ? path.resolve(process.env.TSRS_CHANGELOG_PATH)
  : path.resolve(__dirname, "../../../tri-state-relay-service/CHANGELOG.md");
const md = markdownIt({ html: true, linkify: true, typographer: true });

function parseCurrentRelease(changelog) {
  const match = changelog.match(/(?:^|\n)##\s+([^\n]+)\n+([\s\S]*?)(?=\n##\s+|$)/);
  if (!match) {
    throw new Error(`No release section found in ${changelogPath}`);
  }

  const heading = match[1].trim();
  const notes = match[2].trim();
  const version = heading.split(/\s+-\s+/, 1)[0].trim();

  return {
    version,
    heading,
    notes,
    notesHtml: md.render(notes),
  };
}

module.exports = () => {
  if (!fs.existsSync(changelogPath)) {
    throw new Error(`TSRS changelog not found: ${changelogPath}`);
  }

  const changelog = fs.readFileSync(changelogPath, "utf8");
  const current = parseCurrentRelease(changelog);

  return {
    changelogPath,
    current,
    downloadPath: `/downloads/Tri-State%20Relay%20Service-${current.version}-macos-arm64.zip`,
    analyticsTarget: `macos-${current.version}-arm64`,
  };
};
