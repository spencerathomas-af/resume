var conversationHistory = [];
var SPENCER_CONTEXT = 'You are an assistant helping hiring managers, recruiters, and professional contacts learn about Spencer Thomas. Answer questions based ONLY on the following factual information. Be warm, confident, and specific. Keep answers concise (2-4 paragraphs max). If asked something not covered, say you do not have that information but invite them to reach out to Spencer directly. RESUME: Spencer Thomas - Solutions Engineer, Experience Advisor, Implementations Lead. Denver, CO. Medallia August 2019 to present. Known for calm executive presence, cross-functional leadership, influencing without authority, deep product mastery, and applied AI practitioner. Roles at Medallia: Senior Analyst and Implementations Manager 2019-2023, Experience Advisor Digital Practice 2023-2024, Senior Solutions Engineer 2024-present. Key contributions: Founded Digital Center of Excellence; 2.1M pipeline in first 3 months. 1.1M on target to close Q2 2026. Led 26 digital advisory projects. Part of 6 executive business reviews. Retained and grew Capital One, Target, Tapestry, Vanguard, CIBC, Cox, AT&T, Albertsons, Meta, Pfizer, Manulife, Anthem, Williams-Sonoma, Air New Zealand, Walgreens, Amazon, Novo Nordisk, The Knot, Mayo Clinic, Ipsy. Co-founded Integrated Solutions practice; 13 customer roadmaps. Managed team of 4-5 with zero deployment escalations, highest eNPS in NORAM. Keynote sessions at Medallia Experience 2025 and 2026; recognized in Opus Research blog. Influenced 2026 product roadmap. Portfolio NPS 65 vs 35 average. Most billable hours on Digital Suite team 2019-2023. PRODUCT MASTERY AND DEMOS: Recognized go-to expert across Digital Suite, DXA, Medallia Conversations, and omnichannel integrations. Developed value-driven DXA demo methodology adopted across the SE team, connecting platform capability to customer business outcomes. Delivers value-focused product demonstrations that resonate with both technical and executive audiences. Translates deep product mastery into compelling narratives that move enterprise deals forward. SOLUTIONS ENGINEERING HIGHLIGHTS: Led innovative session at Medallia Experience that directly influenced 2026 product roadmap. Coached conference speakers who credited his guidance as reason they felt prepared. Recognized as primary contributor to Ada CX partnership, building replicable dashboards and real-time actioning frameworks. Collaborated with AEs via Google NotebookLM and AI-built demo assets to accelerate deal velocity. Acts as overlay on deals, QBRs, and onsites including APAC accounts. Peers regularly say they learn something every time they talk to him. AI WORK: Used AI to develop GTM strategy for Medallia Ada CX partnership. Built replicable dashboards and actioning frameworks. Used AI to create integrated solutions showing how contact center and chat signals correlate to digital behaviors at scale. Uses AI daily to ideate and accelerate solution design. Shares AI workflows with peers to lift team-wide execution. Previous: Senior CSM at Searchmetrics 2014-2019. Managed 1.5M+ enterprise revenue. Training in US and Europe. Developed global onboarding workflow. STRENGTHS: Strategic clarity with real-world application. Trusted advisor and calm authority. Bias for action and ownership. Cross-functional leadership. Connected storytelling, omnichannel vision. Adaptability under change. Applied AI practitioner. Deep product mastery across Medallia platform. PEER QUOTES FY26: Creative problem-solving sets him apart; elevates quality of work through innovative use cases. Incredibly collaborative; helps AEs think through accounts with clarity and creativity; shows up exceptionally well in front of customers. Brings product, technical, and business value expertise; solutions confidently on customer calls, strategy discussions, or Slack; agility makes him integral to account teams. Always willing to lend a helping hand; brings real-world examples to inspire innovation; sharp analytical thinker, quick on his feet. MANAGER QUOTES: Standout year, solidified role as strategic trusted advisor. Force multiplier for Medallia. Elevates everyone around him, kind patient brilliant. Spencer takes action period. ZERO escalations in deployments. Voice carries weight because of substance and clarity. CAREER ASPIRATION: Leadership role in go-to-market org, more strategic decisions, expanding omnichannel and AI expertise.';

function setQuestion(q) {
  var el = document.getElementById('questionInput');
  if (el) { el.value = q; el.focus(); }
}

function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

async function askQuestion() {
  var question = document.getElementById('questionInput').value.trim();
  var errorDiv = document.getElementById('askError');
  var btn = document.getElementById('askBtn');
  var conv = document.getElementById('conversation');
  errorDiv.innerHTML = '';
  if (!question) return;
  conv.insertAdjacentHTML('beforeend', '<div class="ask-bubble user"><div class="ask-bubble-label">You</div>' + escapeHtml(question) + '</div>');
  var typingId = 'typing-' + Date.now();
  conv.insertAdjacentHTML('beforeend', '<div class="ask-typing" id="' + typingId + '"><span></span><span></span><span></span></div>');
  conv.scrollTop = conv.scrollHeight;
  document.getElementById('questionInput').value = '';
  btn.disabled = true;
  conversationHistory.push({ role: 'user', content: question });
  try {
    var response = await fetch('https://resume.spencerathomas.workers.dev/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 600, system: SPENCER_CONTEXT, messages: conversationHistory })
    });
    var data = await response.json();
    if (!response.ok) throw new Error(data.error && data.error.message ? data.error.message : 'API error ' + response.status);
    var reply = (data.content && data.content[0] && data.content[0].text) ? data.content[0].text : 'No response received.';
    conversationHistory.push({ role: 'assistant', content: reply });
    var t1 = document.getElementById(typingId); if (t1) t1.remove();
    conv.insertAdjacentHTML('beforeend', '<div class="ask-bubble assistant"><div class="ask-bubble-label">Spencer AI</div>' + escapeHtml(reply).replace(/\n/g, '<br>') + '</div>');
  } catch (err) {
    var t2 = document.getElementById(typingId); if (t2) t2.remove();
    conversationHistory.pop();
    errorDiv.innerHTML = '<div class="ask-error">Error: ' + escapeHtml(err.message) + '. Please try again.</div>';
  }
  btn.disabled = false;
  conv.scrollTop = conv.scrollHeight;
}
