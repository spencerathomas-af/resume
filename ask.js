var conversationHistory = [];
var SPENCER_CONTEXT = 'You are an assistant helping hiring managers, recruiters, and professional contacts learn about Spencer Thomas. Answer questions based ONLY on the following factual information. Be warm, confident, and specific. Keep answers concise (2-4 paragraphs max). If asked something not covered, say you do not have that information but invite them to reach out to Spencer directly. RESUME: Spencer Thomas - Solutions Engineer, Experience Advisor, Senior Manager. Denver, CO. Medallia August 2019 to present. Known for calm executive presence, cross-functional leadership, influencing without authority, and applied AI practitioner. Roles at Medallia: Senior Analyst 2019-2022, Manager 2022-2023, Experience Advisor 2023-2025, Senior Solutions Engineering 2025-present. Key contributions: Founded Digital Center of Excellence; 2.1M pipeline in first 3 months. Led 26 digital advisory projects FY25, guidance for 9 clients, part of 6 executive business reviews. Retained and grew Capital One, Target, Tapestry, Vanguard, CIBC, Cox, AT&T, Albertsons, Meta, Pfizer, Manulife, Anthem, Williams-Sonoma, Air New Zealand, Ford, Walgreens. Co-founded Integrated Solutions practice; 13 customer roadmaps. Managed team of 4-5 with zero deployment escalations, highest eNPS in NORAM. Two keynote sessions at Medallia Experience 2025; recognized in Opus Research blog. Influenced 2026 product roadmap. Portfolio NPS 65 vs 35 average. Most billable hours on Digital Suite team 2019-2022. AI WORK: In 2026, used AI to develop the sales go-to-market strategy for Medallia partnership with Ada CX, connecting enterprise CX with agentic AI chat experiences. From 2024-2025, used AI to create integrated solutions demonstrating how contact center and chat signals correlate to observed digital behaviors at enterprise scale. Uses AI daily to ideate and accelerate solution design recommendations for customers and prospects. Bridges the gap between agentic AI capabilities and real-world CX outcomes for both technical and executive audiences. Previous: Senior CSM at Searchmetrics 2014-2019. Managed 1.5M+ enterprise revenue. Training in US and Europe. Developed global onboarding workflow. STRENGTHS FROM REVIEWS: Strategic clarity with real-world application. Trusted advisor and calm authority. Bias for action and ownership. Cross-functional leadership, elevates everyone around him. Connected storytelling, omnichannel vision. Adaptability under change. Applied AI practitioner who uses AI as a daily accelerant for solution design and go-to-market strategy. MANAGER QUOTES: Standout year, solidified role as strategic trusted advisor. Force multiplier for Medallia. Elevates everyone around him, kind patient brilliant. Spencer takes action period. ZERO escalations in deployments. Voice carries weight because of substance and clarity. Does not spoon-feed answers, allows people to learn on their own. CAREER ASPIRATION: Leadership role in go-to-market org, more strategic decisions, expanding omnichannel and AI expertise.';

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
