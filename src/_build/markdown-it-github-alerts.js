/**
 * Custom markdown-it plugin for GitHub-style alerts
 * Converts > [!NOTE], > [!TIP], etc. to proper alert divs
 */

function githubAlerts(md) {
  // Override blockquote rendering
  md.renderer.rules.blockquote_open = function(tokens, idx, options, env, renderer) {
    const token = tokens[idx];

    // Look ahead to find the content of this blockquote
    let contentFound = false;
    let alertType = null;
    let alertTitle = null;

    for (let i = idx + 1; i < tokens.length; i++) {
      const nextToken = tokens[i];

      if (nextToken.type === 'blockquote_close') {
        break;
      }

      if (nextToken.type === 'inline' && !contentFound) {
        const content = nextToken.content;
        const alertMatch = content.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/);

        if (alertMatch) {
          alertType = alertMatch[1].toLowerCase();
          alertTitle = alertMatch[1].charAt(0) + alertMatch[1].slice(1).toLowerCase();

          // Remove the alert marker from the content
          nextToken.content = content.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/, '').trim();

          // Also remove from child tokens if they exist
          if (nextToken.children && nextToken.children.length > 0) {
            // Find the first text token that contains the alert marker
            for (let j = 0; j < nextToken.children.length; j++) {
              const child = nextToken.children[j];
              if (child.type === 'text' && child.content.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/)) {
                child.content = child.content.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*/, '').trim();
                // If the text token is now empty, remove it
                if (child.content === '') {
                  nextToken.children.splice(j, 1);
                  // Also remove the following softbreak if it exists
                  if (j < nextToken.children.length && nextToken.children[j].type === 'softbreak') {
                    nextToken.children.splice(j, 1);
                  }
                }
                break;
              }
            }
          }

          // Mark this blockquote as an alert
          token.attrSet('data-alert-type', alertType);
          contentFound = true;
        }
        break;
      }
    }

    if (alertType) {
      return `<div class="markdown-alert markdown-alert-${alertType}">
<p class="markdown-alert-title">${alertTitle}</p>
`;
    }

    // If not an alert, use original blockquote
    return '<blockquote>\n';
  };

  md.renderer.rules.blockquote_close = function(tokens, idx, options, env, renderer) {
    const token = tokens[idx];

    // Check if this was an alert blockquote by looking at the opening token
    let openTokenIndex = -1;
    for (let i = idx - 1; i >= 0; i--) {
      if (tokens[i].type === 'blockquote_open') {
        openTokenIndex = i;
        break;
      }
    }

    if (openTokenIndex >= 0 && tokens[openTokenIndex].attrGet('data-alert-type')) {
      return '</div>\n';
    }

    // If not an alert, use original blockquote
    return '</blockquote>\n';
  };
}

module.exports = githubAlerts;
