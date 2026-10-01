import json, sys

sys.stdout.reconfigure(encoding='utf-8')

with open('grammar_converted_data.json', 'r', encoding='utf-8') as f:
    g_data = json.load(f)

# Add SAMAS content
g_data['cbse_samas_rules'] = {
    'title': 'समास - नियम एवं 6 भेद',
    'html': '''<div class="docx-exact-container" style="background:#FFFFFF; padding:1.8rem; border-radius:14px; border:1px solid #E2E8F0;">
  <h2 style="color:#1E3A5F; font-size:1.35rem; margin-top:0;">🔗 समास (Samas) — नियम, भेद एवं विग्रह उदाहरण</h2>
  <p style="font-size:0.95rem; line-height:1.7; color:#334155;">
    <strong>परिभाषा:</strong> दो या दो से अधिक शब्दों का परस्पर मेल करके नया सार्थक शब्द बनाने की प्रक्रिया को <strong>समास</strong> कहते हैं। समास प्रक्रिया से बने शब्द को 'समस्त पद' (सामासिक पद) तथा उसके पदों को अलग करने की विधि को 'समास-विग्रह' कहते हैं।
  </p>
  
  <h3 style="color:#2563EB; font-size:1.15rem; margin-top:1.5rem;">समास के 6 मुख्य भेद:</h3>
  
  <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1rem; margin:1.25rem 0;">
    <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:1.2rem; border-radius:10px;">
      <h4 style="margin:0 0 0.5rem; color:#1E3A5F;">1. तत्पुरुष समास</h4>
      <p style="font-size:0.88rem; color:#475569; margin:0;">जिस समास में उत्तर पद (दूसरा पद) प्रधान हो तथा कारक चिह्नों का लोप हो।<br><strong>उदाहरण:</strong> राजपुत्र (राजा का पुत्र), देशभक्ति (देश के लिए भक्ति)।</p>
    </div>
    <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:1.2rem; border-radius:10px;">
      <h4 style="margin:0 0 0.5rem; color:#1E3A5F;">2. द्विगु समास</h4>
      <p style="font-size:0.88rem; color:#475569; margin:0;">जिस समास का पूर्व पद संख्यावाचक विशेषण हो और समूह का बोध कराए।<br><strong>उदाहरण:</strong> चौराहा (चार राहों का समूह), नवरत्न (नौ रत्नों का समूह)।</p>
    </div>
    <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:1.2rem; border-radius:10px;">
      <h4 style="margin:0 0 0.5rem; color:#1E3A5F;">3. द्वंद्व समास</h4>
      <p style="font-size:0.88rem; color:#475569; margin:0;">जिस समास में दोनों पद प्रधान हों तथा विग्रह करने पर 'और', 'या' लगे।<br><strong>उदाहरण:</strong> माता-पिता (माता और पिता), सुख-दुख (सुख या दुख)।</p>
    </div>
    <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:1.2rem; border-radius:10px;">
      <h4 style="margin:0 0 0.5rem; color:#1E3A5F;">4. बहुव्रीहि समास</h4>
      <p style="font-size:0.88rem; color:#475569; margin:0;">जिस समास में दोनों पद मिलकर किसी तीसरे अन्य अर्थ का बोध कराते हैं।<br><strong>उदाहरण:</strong> लंबोदर (लंबा है जिनका उदर - गणेश), नीलकंठ (नीला है कंठ जिनका - शिव)।</p>
    </div>
    <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:1.2rem; border-radius:10px;">
      <h4 style="margin:0 0 0.5rem; color:#1E3A5F;">5. कर्मधारय समास</h4>
      <p style="font-size:0.88rem; color:#475569; margin:0;">जिस समास में पूर्व पद विशेषण तथा उत्तर पद विशेष्य हो।<br><strong>उदाहरण:</strong> चरणकमल (कमल के समान चरण), महात्मा (महान है जो आत्मा)।</p>
    </div>
    <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:1.2rem; border-radius:10px;">
      <h4 style="margin:0 0 0.5rem; color:#1E3A5F;">6. अव्ययीभाव समास</h4>
      <p style="font-size:0.88rem; color:#475569; margin:0;">जिस समास का पहला पद अव्यय हो और समस्त पद अव्यय बन जाए।<br><strong>उदाहरण:</strong> यथाशक्ति (शक्ति के अनुसार), प्रतिदिन (हर दिन)।</p>
    </div>
  </div>
</div>'''
}

g_data['cbse_samas_worksheets'] = {
    'title': 'समास अभ्यास कार्य-पत्रक',
    'html': '''<div class="docx-exact-container" style="background:#FFFFFF; padding:1.8rem; border-radius:14px; border:1px solid #E2E8F0;">
  <h2 style="color:#1E3A5F; font-size:1.35rem; margin-top:0;">📝 समास अभ्यास कार्य-पत्रक (Samas Practice Worksheet)</h2>
  <p style="font-size:0.92rem; color:#64748B;">कक्षा 10 हिंदी कोर्स-बी | पूर्णांक: 20 अंक | बहुविकल्पीय एवं विग्रह प्रश्न</p>
  
  <div style="margin-top:1.5rem;">
    <div style="background:#F8FAFC; padding:1rem 1.25rem; border-radius:8px; margin-bottom:1rem; border-left:4px solid #2563EB;">
      <strong>प्रश्न 1:</strong> निम्नलिखित समस्त पदों का समास-विग्रह करके समास का नाम लिखिए:<br>
      (i) त्रिफला &nbsp;&nbsp;&nbsp; (ii) चंद्रमुखी &nbsp;&nbsp;&nbsp; (iii) भाई-बहन &nbsp;&nbsp;&nbsp; (iv) पीतांबर
    </div>
    <div style="background:#F8FAFC; padding:1rem 1.25rem; border-radius:8px; margin-bottom:1rem; border-left:4px solid #2563EB;">
      <strong>प्रश्न 2:</strong> 'महान है जो आत्मा' का समस्त पद क्या होगा?<br>
      (क) महाआत्मा &nbsp;&nbsp; (ख) महात्मा &nbsp;&nbsp; (ग) महानआत्मा &nbsp;&nbsp; (घ) महाआत्मीय
    </div>
  </div>
</div>'''
}

# Add RACHNA KE ADHAAR PAR VAKYA content
g_data['cbse_vakya_rules'] = {
    'title': 'रचना के आधार पर वाक्य रूपांतरण - नियम',
    'html': '''<div class="docx-exact-container" style="background:#FFFFFF; padding:1.8rem; border-radius:14px; border:1px solid #E2E8F0;">
  <h2 style="color:#1E3A5F; font-size:1.35rem; margin-top:0;">🔄 रचना के आधार पर वाक्य रूपांतरण (Vakya Rupantar)</h2>
  <p style="font-size:0.95rem; line-height:1.7; color:#334155;">
    वाक्य रचना की दृष्टि से वाक्य के तीन मुख्य भेद होते हैं:
  </p>
  
  <div style="margin:1.25rem 0;">
    <div style="background:#EFF6FF; border:1px solid #BFDBFE; padding:1.2rem; border-radius:10px; margin-bottom:1rem;">
      <h4 style="margin:0 0 0.5rem; color:#1D4ED8;">1. सरल वाक्य (Simple Sentence)</h4>
      <p style="font-size:0.9rem; color:#1E3A5F; margin:0;">जिस वाक्य में एक ही मुख्य क्रिया और एक ही उद्देश्य-विधेय होता है।<br><strong>उदाहरण:</strong> सूर्योदय होते ही पक्षी चहचहाने लगे।</p>
    </div>
    <div style="background:#FEF3C7; border:1px solid #FDE68A; padding:1.2rem; border-radius:10px; margin-bottom:1rem;">
      <h4 style="margin:0 0 0.5rem; color:#B45309;">2. संयुक्त वाक्य (Compound Sentence)</h4>
      <p style="font-size:0.9rem; color:#78350F; margin:0;">जिस वाक्य में दो या अधिक स्वतंत्र उपवाक्य 'और', 'परंतु', 'इसलिए', 'किंतु' योजकों द्वारा जुड़े हों।<br><strong>उदाहरण:</strong> सूर्योदय हुआ और पक्षी चहचहाने लगे।</p>
    </div>
    <div style="background:#F0FDF4; border:1px solid #BBF7D0; padding:1.2rem; border-radius:10px;">
      <h4 style="margin:0 0 0.5rem; color:#15803D;">3. मिश्र वाक्य (Complex Sentence)</h4>
      <p style="font-size:0.9rem; color:#14532D; margin:0;">जिस वाक्य में एक प्रधान उपवाक्य हो और अन्य आश्रित उपवाक्य 'कि', 'जो', 'जैसे ही...वैसे ही' द्वारा जुड़े हों।<br><strong>उदाहरण:</strong> जैसे ही सूर्योदय हुआ, वैसे ही पक्षी चहचहाने लगे।</p>
    </div>
  </div>
</div>'''
}

g_data['cbse_vakya_worksheets'] = {
    'title': 'वाक्य रूपांतरण अभ्यास कार्य-पत्रक',
    'html': '''<div class="docx-exact-container" style="background:#FFFFFF; padding:1.8rem; border-radius:14px; border:1px solid #E2E8F0;">
  <h2 style="color:#1E3A5F; font-size:1.35rem; margin-top:0;">📝 रचना के आधार पर वाक्य रूपांतरण अभ्यास कार्य-पत्रक</h2>
  <p style="font-size:0.92rem; color:#64748B;">कक्षा 10 हिंदी कोर्स-बी | 40 अंक | 60 मिनट</p>
  
  <div style="margin-top:1.5rem;">
    <div style="background:#F8FAFC; padding:1rem 1.25rem; border-radius:8px; margin-bottom:1rem; border-left:4px solid #2563EB;">
      <strong>प्रश्न 1:</strong> 'सूर्यास्त हुआ और चारों ओर अंधेरा छा गया।' (मिश्र वाक्य में बदलिए)
    </div>
    <div style="background:#F8FAFC; padding:1rem 1.25rem; border-radius:8px; margin-bottom:1rem; border-left:4px solid #2563EB;">
      <strong>प्रश्न 2:</strong> 'जो व्यक्ति परिश्रमी होता है, वह सफल होता है।' (सरल वाक्य में बदलिए)
    </div>
  </div>
</div>'''
}

# Add WRITING SKILLS content
g_data['cbse_writing_paragraph'] = {
    'title': 'अनुच्छेद लेखन (Paragraph Writing)',
    'html': '''<div class="docx-exact-container" style="background:#FFFFFF; padding:1.8rem; border-radius:14px; border:1px solid #E2E8F0;">
  <h2 style="color:#1E3A5F; font-size:1.35rem; margin-top:0;">📝 अनुच्छेद लेखन (Paragraph Writing) — 5 अंक</h2>
  <p style="font-size:0.95rem; line-height:1.7; color:#334155;">
    <strong>प्रारूप एवं नियम:</strong> दिए गए विषय एवं संकेत बिंदुओं के आधार पर लगभग 100-120 शब्दों में प्रभावशाली अनुच्छेद लिखें।
  </p>
  <div style="background:#EFF6FF; padding:1.2rem; border-radius:10px; border-left:4px solid #2563EB; margin:1rem 0;">
    <h4 style="margin:0 0 0.5rem; color:#1D4ED8;">अंक विभाजन एवं संकेत बिंदु:</h4>
    <ul style="margin:0; padding-left:1.2rem; color:#1E3A5F; font-size:0.9rem;">
      <li>विषय प्रवेश एवं भूमिका (1 अंक)</li>
      <li>विषय का सुसंगत विस्तार (2 अंक)</li>
      <li>निष्कर्ष व संदेश (1 अंक)</li>
      <li>भाषा शुद्धता व वर्तनी (1 अंक)</li>
    </ul>
  </div>
</div>'''
}

g_data['cbse_writing_letter'] = {
    'title': 'पत्र लेखन (Letter Writing)',
    'html': '''<div class="docx-exact-container" style="background:#FFFFFF; padding:1.8rem; border-radius:14px; border:1px solid #E2E8F0;">
  <h2 style="color:#1E3A5F; font-size:1.35rem; margin-top:0;">✉️ पत्र लेखन (Letter Writing) — 5 अंक</h2>
  <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1rem; margin:1.25rem 0;">
    <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:1.2rem; border-radius:10px;">
      <h4 style="color:#1E3A5F; margin-top:0;">1. औपचारिक पत्र (Formal Letter)</h4>
      <p style="font-size:0.88rem; color:#475569;">प्रधानाचार्य, संपादक, नगर निगम अधिकारी, बैंक प्रबंधक आदि को लिखे जाने वाले पत्र।<br><strong>प्रारूप:</strong> सेवा में ➔ पद व पता ➔ विषय ➔ महोदय ➔ मुख्य भाग ➔ सधन्यवाद ➔ भवदीय/भवदीया।</p>
    </div>
    <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:1.2rem; border-radius:10px;">
      <h4 style="color:#1E3A5F; margin-top:0;">2. अनौपचारिक पत्र (Informal Letter)</h4>
      <p style="font-size:0.88rem; color:#475569;">माता-पिता, मित्र, भाई-बहन, रिश्तेदारों को लिखे जाने वाले पत्र।<br><strong>प्रारूप:</strong> प्रेषक का पता ➔ दिनांक ➔ आदरणीय/प्रिय ➔ सादर प्रणाम/सस्नेह ➔ मुख्य संदेश ➔ आपका/तुम्हारा।</p>
    </div>
  </div>
</div>'''
}

g_data['cbse_writing_email'] = {
    'title': 'ईमेल लेखन (Email Writing)',
    'html': '''<div class="docx-exact-container" style="background:#FFFFFF; padding:1.8rem; border-radius:14px; border:1px solid #E2E8F0;">
  <h2 style="color:#1E3A5F; font-size:1.35rem; margin-top:0;">📧 ईमेल लेखन (Email Writing) — 5 अंक</h2>
  <div style="background:#F8FAFC; padding:1.2rem; border-radius:10px; border:1px solid #CBD5E1; font-family:monospace;">
    <p style="margin:0.3rem 0;"><strong>To (प्रेषिती):</strong> principal@school.edu.in</p>
    <p style="margin:0.3rem 0;"><strong>CC / BCC:</strong> (यदि आवश्यक हो)</p>
    <p style="margin:0.3rem 0;"><strong>Subject (विषय):</strong> छात्रवृत्ति हेतु प्रार्थना पत्र</p>
    <hr style="border:none; border-top:1px solid #CBD5E1; margin:0.8rem 0;">
    <p style="margin:0.3rem 0;">आदरणीय महोदय,</p>
    <p style="margin:0.5rem 0;">सविनय निवेदन है कि मैं कक्षा 10 (वर्ग ब) का छात्र हूँ...</p>
    <p style="margin:0.5rem 0;">धन्यवाद,<br>क ख ग<br>अनुक्रमांक: 12</p>
  </div>
</div>'''
}

with open('grammar_converted_data.json', 'w', encoding='utf-8') as f:
    json.dump(g_data, f, ensure_ascii=False, indent=2)

print('Successfully updated grammar_converted_data.json!')
