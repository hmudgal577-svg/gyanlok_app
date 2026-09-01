import re

with open('public/script.js', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Update Chapter Titles
replacements = {
    "'कबीर: साखी'": "'साखी - कबीर'",
    "'मीरा: पद'": "'पद - मीरा'",
    "'मैथिलीशरण गुप्त: मनुष्यता'": "'मनुष्यता - मैथिलीशरण गुप्त'",
    "'सुमित्रानंदन पंत: पर्वत प्रदेश में पावस'": "'पर्वत प्रदेश में पावस - सुमित्रानंदन पंत'",
    "'वीरेन डंगवाल: तोप'": "'तोप - वीरेन डंगवाल'",
    "'कैफ़ी आज़मी: कर चले हम फ़िदा'": "'कर चले हम फ़िदा - कैफ़ी आज़मी'",
    "'रवींद्रनाथ ठाकुर: आत्मत्राण'": "'आत्मत्राण - रवींद्रनाथ ठाकुर'",
    "'प्रेमचंद: बड़े भाई साहब'": "'बड़े भाई साहब - प्रेमचंद'",
    "'सीताराम सेकसरिया: डायरी का एक पन्ना'": "'डायरी का एक पन्ना - सीताराम सेकसरिया'",
    "'लीलाधर मंडलोई: तताँरा-वामीरो कथा'": "'तताँरा-वामीरो कथा - लीलाधर मंडलोई'",
    "'प्रहलाद अग्रवाल: तीसरी कसम के शिल्पकार शैलेंद्र'": "'तीसरी कसम के शिल्पकार शैलेंद्र - प्रहलाद अग्रवाल'",
    "'निदा फ़ाज़ली: अब कहाँ दूसरे के दुख से दुखी होने वाले'": "'अब कहाँ दूसरे के दुख से दुखी होने वाले - निदा फ़ाज़ली'",
    "'रवींद्र केलेकर: पतझर में टूटी पत्तियाँ (गिन्नी का सोना / झेन की देन)'": "'पतझर में टूटी पत्तियाँ (गिन्नी का सोना / झेन की देन) - रवींद्र केलेकर'",
    "'हबीब तनवीर: कारतूस (एकांकी)'": "'कारतूस (एकांकी) - हबीब तनवीर'",
    "'मिथिलेश्वर: हरिहर काका'": "'हरिहर काका - मिथिलेश्वर'",
    "'गुरदयाल सिंह: सपनों के-से दिन'": "'सपनों के-से दिन - गुरदयाल सिंह'",
    "'राही मासूम रज़ा: टोपी शुक्ला'": "'टोपी शुक्ला - राही मासूम रज़ा'",
}

for old, new in replacements.items():
    code = code.replace(old, new)

# 2. Update Chapter Dropdown opts
old_opts = """  var opts = [
    { icon:'\\uD83D\\uDCDD', label:'\\u092A\\u093E\\u0920 \\u0938\\u093E\\u0930\\u093E\\u0902\\u0936', sub:'Summary',          cat:'summary',   color:'#2BA899' },
    { icon:'\\uD83D\\uDCC4', label:'\\u092A\\u093E\\u0920 PDF',        sub:'Chapter PDF',      cat:'pdf',       color:'#3A7BD5' },
    { icon:'\\u2753',       label:'\\u0928\\u094B\\u091F\\u094D\\u0938',     sub:'Notes',            cat:'notes',     color:'#E05555' },
    { icon:'\\uD83D\\uDCD6', label:'\\u092E\\u0941\\u0939\\u093E\\u0935\\u0930\\u0947',   sub:'Muhavre',          cat:'muhavre',   color:'#9B59B6' },
    { icon:'\\uD83D\\uDD50', label:'PYQ',             sub:'\\u092A\\u093F\u091B\u0932\u0947 \\u0935\u0930\u094D\u0937 \\u092A\u094D\u0930\u0936\u094D\u0928', cat:'pyq',       color:'#E8900A' },
    { icon:'\\u2B50',       label:'\\u0905\\u092D\\u094D\\u092F\\u093E\\u0938 \\u092A\\u094D\\u0930\\u0936\\u094D\\u0928', sub:'Extra Practice',   cat:'additional',color:'#27AE60' },
  ];"""

new_opts = """  var opts = [
    { icon:'📝', label:'पाठ सारांश', sub:'Summary',          cat:'summary',   color:'#2BA899' },
    { icon:'📄', label:'पाठ PDF',        sub:'Chapter PDF',      cat:'pdf',       color:'#3A7BD5' },
    { icon:'❓', label:'नोट्स',     sub:'Notes',            cat:'notes',     color:'#E05555' },
    { icon:'📖', label:'मुहावरे एवं शब्द-अर्थ', sub:'Word Meanings', cat:'muhavre', color:'#9B59B6' },
    { icon:'🎯', label:'CBQ',             sub:'Competency Based Qs', cat:'competency', color:'#E8900A' },
    { icon:'⭐', label:'अतिरिक्त प्रश्न', sub:'Additional Questions', cat:'additional', color:'#27AE60' },
  ];"""

if 'cat:\'pyq\'' in code:
    code = re.sub(
        r"var opts = \[[\s\S]*?\];",
        new_opts,
        code
    )

# 3. Update Fullscreen Reader catTabs
old_cat_tabs = """  const catTabs = [
    { key: 'summary',    icon: '📝', label: 'Summary' },
    { key: 'pdf',        icon: '📄', label: 'PDF' },
    { key: 'notes',      icon: '❓', label: 'Notes' },
    { key: 'competency', icon: '🎯', label: 'Competency Qs' },
    { key: 'additional', icon: '⭐', label: 'Additional Qs' },
    { key: 'muhavre',    icon: '📖', label: 'Muhavre & Word Meanings' },
  ];"""

new_cat_tabs = """  const catTabs = [
    { key: 'summary',    icon: '📝', label: 'Summary' },
    { key: 'pdf',        icon: '📄', label: 'PDF' },
    { key: 'notes',      icon: '❓', label: 'Notes' },
    { key: 'competency', icon: '🎯', label: 'CBQ (Competency Based Qs)' },
    { key: 'additional', icon: '⭐', label: 'अतिरिक्त प्रश्न (Additional Qs)' },
    { key: 'muhavre',    icon: '📖', label: 'Muhavre & Word Meanings' },
  ];"""

code = code.replace(old_cat_tabs, new_cat_tabs)

with open('public/script.js', 'w', encoding='utf-8') as f:
    f.write(code)

print("SUCCESSFULLY UPDATED script.js WITH ALL 3 REQUIREMENTS!")
