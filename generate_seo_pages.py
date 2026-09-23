"""
EkShala SEO Static Site Generator (generate_seo_pages.py)
Generates permanent, crawlable, pre-rendered HTML pages for:
- CBSE Class 10 Hindi Hub (/cbse/class-10/hindi/)
- ICSE Class 10 Hindi Hub (/icse/class-10/hindi/)
- 20 CBSE Chapter Pages (/cbse/class-10/hindi/[chapter-slug]/)
- 8 ICSE Chapter Pages (/icse/class-10/hindi/[chapter-slug]/)
- Worksheets Hub (/worksheets/)
- Hindi Grammar Hub (/hindi-grammar/) and Topic Pages (/hindi-grammar/muhavare/, /hindi-grammar/padbandh/)
- PYQ Hub (/pyq/, /cbse/class-10/hindi/pyq/, /icse/class-10/hindi/pyq/)
- About, Contact, Privacy Policy, Terms & Conditions
- Custom 404 Page (/404.html)
- Dynamic sitemap.xml & robots.txt
"""

import os, json, re, sys
from datetime import datetime

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

WORKSPACE_DIR = os.path.dirname(os.path.abspath(__file__))
PUBLIC_DIR = os.path.join(WORKSPACE_DIR, 'public')
BASE_URL = 'https://ekshala.in'

# Load Content JSONs
with open(os.path.join(PUBLIC_DIR, 'chapter_html_content.json'), 'r', encoding='utf-8') as f:
    CHAPTERS_DATA = json.load(f)

with open(os.path.join(PUBLIC_DIR, 'worksheets_html_content.json'), 'r', encoding='utf-8') as f:
    WORKSHEETS_DATA = json.load(f)

# Verified Chapter Catalog
CBSE_CHAPTERS = [
    {
        'key': 'cbse_10_hindi_kabir',
        'title': 'साखी',
        'author': 'कबीरदास',
        'book': 'स्पर्श (भाग-2)',
        'book_en': 'Sparsh Part 2',
        'num': 1,
        'type': 'पद्य खंड',
        'slug': 'sakhi-kabir',
        'board': 'CBSE',
        'desc': 'कक्षा 10 हिंदी (कोर्स बी) स्पर्श भाग-2 के पाठ साखी (कबीरदास) का सम्पूर्ण भावार्थ, व्याख्या, मुख्य बिंदु, योग्यता-आधारित प्रश्न एवं मुहावरे।'
    },
    {
        'key': 'cbse_10_hindi_meera',
        'title': 'पद',
        'author': 'मीराबाई',
        'book': 'स्पर्श (भाग-2)',
        'book_en': 'Sparsh Part 2',
        'num': 2,
        'type': 'पद्य खंड',
        'slug': 'pad-meera',
        'board': 'CBSE',
        'desc': 'कक्षा 10 हिंदी स्पर्श भाग-2 पाठ पद (मीराबाई) का सरल भावार्थ, सप्रसंग व्याख्या, परीक्षा उपयोगी महत्वपूर्ण प्रश्न-उत्तर और शब्दार्थ।'
    },
    {
        'key': 'cbse_10_hindi_manushyata',
        'title': 'मनुष्यता',
        'author': 'मैथिलीशरण गुप्त',
        'book': 'स्पर्श (भाग-2)',
        'book_en': 'Sparsh Part 2',
        'num': 3,
        'type': 'पद्य खंड',
        'slug': 'manushyata',
        'board': 'CBSE',
        'desc': 'राष्ट्रकवि मैथिलीशरण गुप्त द्वारा रचित कविता मनुष्यता की सप्रसंग व्याख्या, केंद्रीय भाव, योग्यता-आधारित प्रश्न एवं अभ्यास प्रश्न।'
    },
    {
        'key': 'cbse_10_hindi_pavas',
        'title': 'पर्वत प्रदेश में पावस',
        'author': 'सुमित्रानंदन पंत',
        'book': 'स्पर्श (भाग-2)',
        'book_en': 'Sparsh Part 2',
        'num': 4,
        'type': 'पद्य खंड',
        'slug': 'parvat-pradesh-mein-pavas',
        'board': 'CBSE',
        'desc': 'पर्वत प्रदेश में पावस (सुमित्रानंदन पंत) कविता का भावार्थ, प्राकृतिक सौंदर्य का मानवीकरण, शब्दार्थ एवं महत्वपूर्ण प्रश्नोत्तर।'
    },
    {
        'key': 'cbse_10_hindi_top',
        'title': 'तोप',
        'author': 'वीरेन डंगवाल',
        'book': 'स्पर्श (भाग-2)',
        'book_en': 'Sparsh Part 2',
        'num': 5,
        'type': 'पद्य खंड',
        'slug': 'top',
        'board': 'CBSE',
        'desc': 'कविता तोप (वीरेन डंगवाल) का ऐतिहासिक संदर्भ, भावार्थ, संदेश, परीक्षा उपयोगी प्रश्न-उत्तर एवं योग्यता-आधारित प्रश्न।'
    },
    {
        'key': 'cbse_10_hindi_fida',
        'title': 'कर चले हम फ़िदा',
        'author': 'कैफ़ी आज़मी',
        'book': 'स्पर्श (भाग-2)',
        'book_en': 'Sparsh Part 2',
        'num': 6,
        'type': 'पद्य खंड',
        'slug': 'kar-chale-hum-fida',
        'board': 'CBSE',
        'desc': 'कर चले हम फ़िदा (कैफ़ी आज़मी) का देशभक्ति भावार्थ, सैनिकों का बलिदान, सप्रसंग व्याख्या, महत्वपूर्ण प्रश्न और बोर्ड समाधान।'
    },
    {
        'key': 'cbse_10_hindi_aatmtran',
        'title': 'आत्मत्राण',
        'author': 'रवींद्रनाथ ठाकुर',
        'book': 'स्पर्श (भाग-2)',
        'book_en': 'Sparsh Part 2',
        'num': 7,
        'type': 'पद्य खंड',
        'slug': 'aatmtran',
        'board': 'CBSE',
        'desc': 'कविवर रवींद्रनाथ ठाकुर द्वारा रचित प्रार्थना गीत आत्मत्राण की सरल व्याख्या, केंद्रीय भाव, कठिन शब्दार्थ एवं बोर्ड प्रश्न।'
    },
    {
        'key': 'cbse_10_hindi_badebhai',
        'title': 'बड़े भाई साहब',
        'author': 'प्रेमचंद',
        'book': 'स्पर्श (भाग-2)',
        'book_en': 'Sparsh Part 2',
        'num': 8,
        'type': 'गद्य खंड',
        'slug': 'bade-bhai-sahab',
        'board': 'CBSE',
        'desc': 'मुंशी प्रेमचंद की प्रसिद्ध कहानी बड़े भाई साहब का विस्तृत सारांश, चरित्र-चित्रण, मुहावरे, योग्यता-आधारित प्रश्न एवं संपूर्ण नोट्स।'
    },
    {
        'key': 'cbse_10_hindi_diary',
        'title': 'डायरी का एक पन्ना',
        'author': 'सीताराम सेकसरिया',
        'book': 'स्पर्श (भाग-2)',
        'book_en': 'Sparsh Part 2',
        'num': 9,
        'type': 'गद्य खंड',
        'slug': 'diary-ka-ek-panna',
        'board': 'CBSE',
        'desc': 'डायरी का एक पन्ना (26 जनवरी 1931 कोलकाता स्वतंत्रता दिवस) का पाठ सारांश, ऐतिहासिक पृष्ठभूमि, प्रश्नोत्तर एवं शब्दार्थ।'
    },
    {
        'key': 'cbse_10_hindi_tantara',
        'title': 'तताँरा-वामीरो कथा',
        'author': 'लीलाधर मंडलोई',
        'book': 'स्पर्श (भाग-2)',
        'book_en': 'Sparsh Part 2',
        'num': 10,
        'type': 'गद्य खंड',
        'slug': 'tatara-vamiro-katha',
        'board': 'CBSE',
        'desc': 'अंडमान-निकोबार की लोककथा तताँरा-वामीरो कथा का सारांश, मानवीय प्रेम, त्याग, रूढ़ियों का विरोध, प्रश्नोत्तर एवं बोर्ड नोट्स।'
    },
    {
        'key': 'cbse_10_hindi_shailendra',
        'title': 'तीसरी कसम के शिल्पकार शैलेंद्र',
        'author': 'प्रहलाद अग्रवाल',
        'book': 'स्पर्श (भाग-2)',
        'book_en': 'Sparsh Part 2',
        'num': 11,
        'type': 'गद्य खंड',
        'slug': 'teesri-kasam-ke-shilpkar-shailendra',
        'board': 'CBSE',
        'desc': 'गीतकार शैलेंद्र और फिल्म तीसरी कसम के निर्माण पर आधारित संस्मरण का सारांश, सिनेमाई कला दृष्टि, प्रश्न-उत्तर एवं नोट्स।'
    },
    {
        'key': 'cbse_10_hindi_abkahan',
        'title': 'अब कहाँ दूसरे के दुख से दुखी होने वाले',
        'author': 'निदा फ़ाज़ली',
        'book': 'स्पर्श (भाग-2)',
        'book_en': 'Sparsh Part 2',
        'num': 12,
        'type': 'गद्य खंड',
        'slug': 'ab-kahan-doosre-ke-dukh-se-dukhi-hone-wale',
        'board': 'CBSE',
        'desc': 'प्रकृति और जीवों के प्रति मानवीय संवेदनशीलता पर आधारित पाठ अब कहाँ दूसरे के दुख से दुखी होने वाले का सारांश और प्रश्न-उत्तर।'
    },
    {
        'key': 'cbse_10_hindi_patjhar',
        'title': 'पतझर में टूटी पत्तियाँ (गिन्नी का सोना / झेन की देन)',
        'author': 'रवींद्र केलेकर',
        'book': 'स्पर्श (भाग-2)',
        'book_en': 'Sparsh Part 2',
        'num': 13,
        'type': 'गद्य खंड',
        'slug': 'patjhar-mein-tooti-pattiyan',
        'board': 'CBSE',
        'desc': 'गिन्नी का सोना (आदर्श बनाम व्यवहार) और झेन की देन (टी-सेरेमनी और मानसिक शांति) का दार्शनिक विश्लेषण, सारांश एवं प्रश्नोत्तर।'
    },
    {
        'key': 'cbse_10_hindi_kartoos',
        'title': 'कारतूस (एकांकी)',
        'author': 'हबीब तनवीर',
        'book': 'स्पर्श (भाग-2)',
        'book_en': 'Sparsh Part 2',
        'num': 14,
        'type': 'गद्य खंड',
        'slug': 'kartoos',
        'board': 'CBSE',
        'desc': 'वज़ीर अली की जांबाजी पर आधारित एकांकी कारतूस (हबीब तनवीर) का सारांश, संवाद, चरित्र-चित्रण, प्रश्न-उत्तर और बोर्ड परीक्षा नोट्स।'
    },
    {
        'key': 'cbse_10_hindi_harihar',
        'title': 'हरिहर काका',
        'author': 'मिथिलेश्वर',
        'book': 'संचयन (भाग-2)',
        'book_en': 'Sanchayan Part 2',
        'num': 1,
        'type': 'पूरक पाठ्यपुस्तक',
        'slug': 'harihar-kaka',
        'board': 'CBSE',
        'desc': 'वृद्धावस्था, पारिवारिक स्वार्थ और धर्म के नाम पर पाखंड की मार्मिक कहानी हरिहर काका का विस्तृत सारांश, प्रश्नोत्तर एवं नोट्स।'
    },
    {
        'key': 'cbse_10_hindi_sapno',
        'title': 'सपनों के-से दिन',
        'author': 'गुरदयाल सिंह',
        'book': 'संचयन (भाग-2)',
        'book_en': 'Sanchayan Part 2',
        'num': 2,
        'type': 'पूरक पाठ्यपुस्तक',
        'slug': 'sapno-ke-se-din',
        'board': 'CBSE',
        'desc': 'बचपन की स्मृतियों और स्कूल के दिनों पर आधारित आत्मकथात्मक संस्मरण सपनों के-से दिन का संपूर्ण सारांश, प्रश्न-उत्तर व व्याख्या।'
    },
    {
        'key': 'cbse_10_hindi_topi',
        'title': 'टोपी शुक्ला',
        'author': 'राही मासूम रज़ा',
        'book': 'संचयन (भाग-2)',
        'book_en': 'Sanchayan Part 2',
        'num': 3,
        'type': 'पूरक पाठ्यपुस्तक',
        'slug': 'topi-shukla',
        'board': 'CBSE',
        'desc': 'दो अलग धर्मों के परिवारों के बच्चों के बीच भावनात्मक मित्रता की दिल छू लेने वाली कहानी टोपी शुक्ला का सार, चरित्र-चित्रण और प्रश्नोत्तर।'
    },
]

ICSE_CHAPTERS = [
    {
        'key': 'icse_10_hindi_badeghar',
        'title': 'बड़े घर की बेटी',
        'author': 'प्रेमचंद',
        'book': 'साहित्य सागर: गद्य',
        'book_en': 'Sahitya Sagar',
        'num': 1,
        'type': 'गद्य खंड',
        'slug': 'bade-ghar-ki-beti',
        'board': 'ICSE',
        'desc': 'ICSE कक्षा 10 हिंदी साहित्य सागर की प्रसिद्ध कहानी बड़े घर की बेटी (आनंदी और श्रीकंठ) का संपूर्ण सारांश, चरित्र-चित्रण व महत्वपूर्ण प्रश्नोत्तर।'
    },
    {
        'key': 'icse_10_hindi_bheed',
        'title': 'भीड़ में खोया आदमी',
        'author': 'लीलाधर शर्मा पर्वतीय',
        'book': 'साहित्य सागर: गद्य',
        'book_en': 'Sahitya Sagar',
        'num': 2,
        'type': 'गद्य खंड',
        'slug': 'bheed-mein-khoya-aadmi',
        'board': 'ICSE',
        'desc': 'जनसंख्या वृद्धि और उससे उत्पन्न सामाजिक समस्याओं पर आधारित कहानी भीड़ में खोया आदमी का सरल सारांश, विश्लेषण और प्रश्न-उत्तर।'
    },
    {
        'key': 'icse_10_hindi_bhedein',
        'title': 'भेड़ें और भेड़िए',
        'author': 'हरिशंकर परसाई',
        'book': 'साहित्य सागर: गद्य',
        'book_en': 'Sahitya Sagar',
        'num': 3,
        'type': 'गद्य खंड',
        'slug': 'bhedein-aur-bhediye',
        'board': 'ICSE',
        'desc': 'हरिशंकर परसाई द्वारा रचित प्रसिद्ध राजनीतिक व्यंग्य भेड़ें और भेड़िए का विस्तृत सारांश, प्रतीकार्थ, मुहावरे एवं महत्वपूर्ण प्रश्नोत्तर।'
    },
    {
        'key': 'icse_10_hindi_dokalakar',
        'title': 'दो कलाकार',
        'author': 'मन्नू भंडारी',
        'book': 'साहित्य सागर: गद्य',
        'book_en': 'Sahitya Sagar',
        'num': 4,
        'type': 'गद्य खंड',
        'slug': 'do-kalakar',
        'board': 'ICSE',
        'desc': 'चित्रा और अरुणा की मित्रता और सच्ची कला के अर्थ पर केंद्रित कहानी दो कलाकार (मन्नू भंडारी) का सारांश, चरित्र-चित्रण और प्रश्नोत्तर।'
    },
    {
        'key': 'icse_10_hindi_sandeh',
        'title': 'संदेह',
        'author': 'जयशंकर प्रसाद',
        'book': 'साहित्य सागर: गद्य',
        'book_en': 'Sahitya Sagar',
        'num': 5,
        'type': 'गद्य खंड',
        'slug': 'sandeh',
        'board': 'ICSE',
        'desc': 'ICSE कक्षा 10 हिंदी साहित्य सागर की प्रसिद्ध कहानी संदेह (रामनिहाल, श्यामा, मनोरमा और मोहन बाबू) का संपूर्ण सारांश, चरित्र-चित्रण व महत्वपूर्ण प्रश्नोत्तर।'
    },
    {
        'key': 'icse_10_hindi_sukhidaali',
        'title': 'सूखी डाली',
        'author': 'उपेंद्रनाथ अश्क',
        'book': 'एकांकी संचय',
        'book_en': 'Ekanki Sanchay',
        'num': 1,
        'type': 'एकांकी',
        'slug': 'sukhi-daali',
        'board': 'ICSE',
        'desc': 'संयुक्त परिवार की एकता और आपसी समझ पर आधारित प्रसिद्ध एकांकी सूखी डाली (दादाजी, बेला और परेश) का संपूर्ण सारांश और प्रश्न-उत्तर।'
    },
    {
        'key': 'icse_10_hindi_deepdan',
        'title': 'दीपदान',
        'author': 'डॉ. रामकुमार वर्मा',
        'book': 'एकांकी संचय',
        'book_en': 'Ekanki Sanchay',
        'num': 2,
        'type': 'एकांकी',
        'slug': 'deepdan',
        'board': 'ICSE',
        'desc': 'मेवाड़ के इतिहास में पन्ना धाय के अद्वितीय त्याग और बलिदान पर आधारित ऐतिहासिक एकांकी दीपदान का सारांश, संवाद और बोर्ड प्रश्न-उत्तर।'
    },
    {
        'key': 'icse_10_hindi_mahabharat',
        'title': 'महाभारत की एक साँझ',
        'author': 'विष्णु प्रभाकर',
        'book': 'एकांकी संचय',
        'book_en': 'Ekanki Sanchay',
        'num': 3,
        'type': 'एकांकी',
        'slug': 'mahabharat-ki-ek-saanjh',
        'board': 'ICSE',
        'desc': 'महाभारत युद्ध के अंतिम क्षणों में दुर्योधन और युधिष्ठिर के संवाद पर आधारित एकांकी महाभारत की एक साँझ का सारांश, युद्ध की व्यर्थता व प्रश्नोत्तर।'
    },
    {
        'key': 'icse_10_hindi_naya_rasta_ch14',
        'title': 'नया रास्ता: अध्याय 14',
        'subtitle': 'आशा का रिश्ता तय होना और मीनू की उलझन',
        'author': 'सुषमा अग्रवाल',
        'book': 'नया रास्ता (उपन्यास)',
        'book_en': 'Naya Raasta',
        'num': 14,
        'type': 'उपन्यास',
        'slug': 'naya-rasta-chapter-14',
        'board': 'ICSE',
        'desc': 'ICSE कक्षा 10 हिंदी उपन्यास नया रास्ता (सुषमा अग्रवाल) अध्याय 14 का संपूर्ण सारांश (हिंदी व अंग्रेजी), चरित्र-चित्रण व महत्वपूर्ण अवतरण-आधारित प्रश्नोत्तर।'
    },
    {
        'key': 'icse_10_hindi_naya_rasta_ch15',
        'title': 'नया रास्ता: अध्याय 15',
        'subtitle': 'अमित से अनायास भेंट',
        'author': 'सुषमा अग्रवाल',
        'book': 'नया रास्ता (उपन्यास)',
        'book_en': 'Naya Raasta',
        'num': 15,
        'type': 'उपन्यास',
        'slug': 'naya-rasta-chapter-15',
        'board': 'ICSE',
        'desc': 'ICSE कक्षा 10 हिंदी उपन्यास नया रास्ता अध्याय 15 (अमित से अनायास भेंट) का विस्तृत सारांश एवं महत्वपूर्ण अवतरण-आधारित प्रश्न-उत्तर।'
    },
    {
        'key': 'icse_10_hindi_naya_rasta_ch16',
        'title': 'नया रास्ता: अध्याय 16',
        'subtitle': 'आशा का विवाह',
        'author': 'सुषमा अग्रवाल',
        'book': 'नया रास्ता (उपन्यास)',
        'book_en': 'Naya Raasta',
        'num': 16,
        'type': 'उपन्यास',
        'slug': 'naya-rasta-chapter-16',
        'board': 'ICSE',
        'desc': 'ICSE कक्षा 10 हिंदी उपन्यास नया रास्ता अध्याय 16 (आशा का विवाह) का संपूर्ण सारांश, मीनू के विचार व बोर्ड परीक्षा हेतु अवतरण आधारित प्रश्नोत्तर।'
    },
    {
        'key': 'icse_10_hindi_naya_rasta_ch17',
        'title': 'नया रास्ता: अध्याय 17',
        'subtitle': 'नीलिमा के घर अमित से पुनः भेंट',
        'author': 'सुषमा अग्रवाल',
        'book': 'नया रास्ता (उपन्यास)',
        'book_en': 'Naya Raasta',
        'num': 17,
        'type': 'उपन्यास',
        'slug': 'naya-rasta-chapter-17',
        'board': 'ICSE',
        'desc': 'ICSE कक्षा 10 हिंदी उपन्यास नया रास्ता अध्याय 17 (नीलिमा के घर अमित से पुनः भेंट) का सारांश, चरित्र-चित्रण और महत्वपूर्ण अवतरण प्रश्नोत्तर।'
    },
    {
        'key': 'icse_10_hindi_naya_rasta_ch18',
        'title': 'नया रास्ता: अध्याय 18',
        'subtitle': 'नीलिमा के घर मीनू के विचार',
        'author': 'सुषमा अग्रवाल',
        'book': 'नया रास्ता (उपन्यास)',
        'book_en': 'Naya Raasta',
        'num': 18,
        'type': 'उपन्यास',
        'slug': 'naya-rasta-chapter-18',
        'board': 'ICSE',
        'desc': 'ICSE कक्षा 10 हिंदी उपन्यास नया रास्ता अध्याय 18 (नीलिमा के घर मीनू के विचार) का सारांश, देश-प्रेम व स्वावलंबन पर विचार और प्रश्नोत्तर।'
    },
    {
        'key': 'icse_10_hindi_naya_rasta_ch19',
        'title': 'नया रास्ता: अध्याय 19',
        'subtitle': 'अमित के घर में उदासी',
        'author': 'सुषमा अग्रवाल',
        'book': 'नया रास्ता (उपन्यास)',
        'book_en': 'Naya Raasta',
        'num': 19,
        'type': 'उपन्यास',
        'slug': 'naya-rasta-chapter-19',
        'board': 'ICSE',
        'desc': 'ICSE कक्षा 10 हिंदी उपन्यास नया रास्ता अध्याय 19 (अमित के घर में उदासी) का संपूर्ण सारांश और महत्वपूर्ण अवतरण आधारित प्रश्नोत्तर।'
    },
    {
        'key': 'icse_10_hindi_naya_rasta_ch20',
        'title': 'नया रास्ता: अध्याय 20',
        'subtitle': 'अमित की दुर्घटना और क्षमा-याचना',
        'author': 'सुषमा अग्रवाल',
        'book': 'नया रास्ता (उपन्यास)',
        'book_en': 'Naya Raasta',
        'num': 20,
        'type': 'उपन्यास',
        'slug': 'naya-rasta-chapter-20',
        'board': 'ICSE',
        'desc': 'ICSE कक्षा 10 हिंदी उपन्यास नया रास्ता अध्याय 20 (अमित की दुर्घटना और क्षमा-याचना) का मार्मिक सारांश और बोर्ड परीक्षा हेतु विस्तृत प्रश्नोत्तर।'
    },
]

ALL_CHAPTERS = CBSE_CHAPTERS + ICSE_CHAPTERS
ALL_CANONICAL_URLS = []

def write_html_file(rel_dir, html_content):
    target_dir = os.path.join(PUBLIC_DIR, rel_dir)
    os.makedirs(target_dir, exist_ok=True)
    target_file = os.path.join(target_dir, 'index.html')
    with open(target_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    print(f"  ✓ Generated: {rel_dir}/index.html ({len(html_content):,} bytes)")

def get_common_head(title, description, canonical_url, schema_json_ld, og_image="https://ekshala.in/logo-preview.png"):
    return f"""<!DOCTYPE html>
<html lang="hi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="index, follow" />
  <title>{title}</title>
  <meta name="description" content="{description}" />
  <link rel="canonical" href="{canonical_url}" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="article" />
  <meta property="og:url" content="{canonical_url}" />
  <meta property="og:title" content="{title}" />
  <meta property="og:description" content="{description}" />
  <meta property="og:image" content="{og_image}" />
  <meta property="og:site_name" content="EkShala" />

  <!-- Twitter / X Card -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="{canonical_url}" />
  <meta property="twitter:title" content="{title}" />
  <meta property="twitter:description" content="{description}" />
  <meta property="twitter:image" content="{og_image}" />

  <!-- Schema.org JSON-LD -->
  <script type="application/ld+json">
{schema_json_ld}
  </script>

  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%233A7BD5'/><path d='M9 10h14M9 16h9M9 22h12' stroke='white' stroke-width='2' stroke-linecap='round'/></svg>" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/style.css?v=108.0.0" />

  <style>
    /* ─── Global SEO Layout & Typography Enhancements ─── */
    .seo-page-body {{
      background: #F8FAFC;
      color: #1A2740;
      font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
    }}
    .seo-breadcrumb-bar {{
      background: #FFFFFF;
      border-bottom: 1px solid #E2E8F0;
      padding: 0.85rem 0;
      font-size: 0.88rem;
    }}
    .seo-breadcrumbs {{
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
      list-style: none;
      padding: 0;
      margin: 0;
      color: #64748B;
    }}
    .seo-breadcrumbs a {{
      color: #156082;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.15s ease;
    }}
    .seo-breadcrumbs a:hover {{
      color: #3A7BD5;
      text-decoration: underline;
    }}
    .seo-breadcrumbs .sep {{
      color: #94A3B8;
    }}
    .seo-breadcrumbs .current {{
      color: #0F172A;
      font-weight: 600;
    }}

    /* Hero Header - Light & Student Friendly */
    .seo-hero {{
      background: linear-gradient(135deg, #F0F6FD 0%, #E8F2FC 60%, #F5F9FD 100%);
      border-bottom: 1px solid #D6E4F0;
      color: #1A2740;
      padding: 3.25rem 0 2.75rem;
      position: relative;
    }}
    .seo-hero-badge {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 9999px;
      background: #E0EFFE;
      border: 1px solid #BAE0FD;
      color: #0369A1;
      font-size: 0.84rem;
      font-weight: 700;
      letter-spacing: 0.3px;
      margin-bottom: 1rem;
    }}
    .seo-hero h1 {{
      font-size: clamp(1.85rem, 3.5vw, 2.6rem);
      font-weight: 800;
      line-height: 1.25;
      margin-bottom: 0.85rem;
      color: #0F2B48 !important;
      font-family: 'Plus Jakarta Sans', 'Inter', 'Noto Sans Devanagari', sans-serif;
    }}
    .seo-hero p.lead {{
      font-size: 1.12rem;
      line-height: 1.7;
      color: #334E68;
      max-width: 860px;
      margin-bottom: 1.5rem;
    }}
    .seo-hero-meta {{
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      font-size: 0.88rem;
    }}
    .seo-hero-meta span {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #FFFFFF;
      border: 1px solid #DCE7F3;
      box-shadow: 0 1px 3px rgba(15, 43, 72, 0.05);
      color: #1E3A5F;
      font-weight: 500;
      padding: 6px 14px;
      border-radius: 10px;
    }}
    .seo-hero-meta span strong {{
      color: #0F2B48;
    }}

    /* Chapter Quick Nav Pills */
    .seo-quick-nav {{
      position: sticky;
      top: 70px;
      z-index: 40;
      background: #FFFFFF;
      border-bottom: 1px solid #E2E8F0;
      box-shadow: 0 4px 12px rgba(15, 43, 72, 0.04);
      padding: 0.75rem 0;
    }}
    .seo-pill-list {{
      display: flex;
      gap: 0.6rem;
      overflow-x: auto;
      padding-bottom: 2px;
      scrollbar-width: thin;
    }}
    .seo-pill {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 9999px;
      background: #FFFFFF;
      color: #334E68;
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 600;
      white-space: nowrap;
      transition: all 0.2s ease;
      border: 1px solid #DCE7F3;
      box-shadow: 0 1px 2px rgba(15, 43, 72, 0.03);
    }}
    .seo-pill:hover, .seo-pill.active {{
      background: #2563EB;
      color: #FFFFFF;
      border-color: #2563EB;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.28);
      transform: translateY(-1px);
    }}

    /* Chapter Interactive Tabs System */
    .seo-tab-pane {{
      display: none;
    }}
    .seo-tab-pane.active {{
      display: block;
      animation: tabFadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    }}
    @keyframes tabFadeIn {{
      from {{ opacity: 0; transform: translateY(6px); }}
      to {{ opacity: 1; transform: translateY(0); }}
    }}

    /* Summary Content Styles (matching docx formatting) */
    .chapter-summary-wrap {{
      font-family: 'Noto Sans Devanagari', 'Hind', 'Arial', sans-serif;
      line-height: 1.9;
      color: #1a2740;
    }}
    .summary-author {{
      font-size: 0.95rem;
      font-weight: 700;
      color: #3A7BD5;
      background: #EBF3FD;
      border-left: 4px solid #3A7BD5;
      padding: 0.6rem 1rem;
      border-radius: 0 8px 8px 0;
      margin-bottom: 1.2rem;
    }}
    .summary-heading {{
      font-size: 1.12rem;
      font-weight: 700;
      color: #0F172A;
      margin: 1.6rem 0 0.6rem;
      padding-bottom: 0.35rem;
      border-bottom: 2px solid #E2E8F0;
    }}
    .summary-para {{
      font-size: 1.02rem;
      line-height: 1.85;
      color: #374151;
      margin-bottom: 0.9rem;
      text-align: justify;
    }}
    .summary-para strong {{
      color: #1a2740;
      font-weight: 700;
    }}
    .summary-spacer {{
      height: 0.5rem;
    }}
    .tab-nav-footer {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      margin-top: 2.25rem;
      padding-top: 1.5rem;
      border-top: 1px solid #E2E8F0;
      flex-wrap: wrap;
    }}
    .tab-nav-btn {{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 0.65rem 1.25rem;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.92rem;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid #CBD5E1;
      background: #FFFFFF;
      color: #1E293B;
      text-decoration: none;
    }}
    .tab-nav-btn:hover {{
      background: #F1F5F9;
      border-color: #94A3B8;
      color: #0F172A;
    }}
    .tab-nav-btn.primary {{
      background: #2563EB;
      color: #FFFFFF;
      border-color: #2563EB;
      box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
    }}
    .tab-nav-btn.primary:hover {{
      background: #1D4ED8;
      border-color: #1D4ED8;
      box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
      transform: translateY(-1px);
    }}

    /* Main Content Container */
    .seo-content-wrap {{
      padding: 2.75rem 0 4rem;
    }}
    .seo-section-card {{
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 18px;
      padding: 2.25rem 2.5rem;
      margin-bottom: 2.25rem;
      box-shadow: 0 4px 20px rgba(0,0,0,0.03);
      scroll-margin-top: 135px;
    }}
    @media (max-width: 768px) {{
      .seo-section-card {{ padding: 1.5rem 1.15rem; }}
    }}
    .seo-section-header {{
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.5rem;
      border-bottom: 2px solid #F1F5F9;
      padding-bottom: 0.85rem;
    }}
    .seo-section-header h2 {{
      font-size: 1.45rem;
      font-weight: 800;
      color: #0F172A;
      margin: 0;
      font-family: 'Plus Jakarta Sans', 'Inter', 'Noto Sans Devanagari', sans-serif;
    }}
    .seo-section-icon {{
      font-size: 1.5rem;
    }}

    /* Content Typography inside exact container */
    .docx-exact-container {{
      line-height: 1.85 !important;
      font-size: 1.05rem !important;
    }}
    .docx-exact-container h1, .docx-exact-container h2, .docx-exact-container h3 {{
      font-family: 'Plus Jakarta Sans', 'Inter', 'Noto Sans Devanagari', sans-serif !important;
      color: #0F172A !important;
    }}
    .docx-exact-container p {{
      margin-bottom: 1rem !important;
      color: #334155 !important;
    }}

    /* Hub & Related Grid */
    .seo-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.25rem;
      margin-top: 1.25rem;
    }}
    .seo-card {{
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 14px;
      padding: 1.35rem;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-decoration: none;
      color: inherit;
      box-shadow: 0 2px 8px rgba(0,0,0,0.02);
    }}
    .seo-card:hover {{
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(21, 96, 130, 0.12);
      border-color: #3A7BD5;
    }}
    .seo-card-badge {{
      display: inline-block;
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 6px;
      background: #EBF3FD;
      color: #156082;
      margin-bottom: 0.5rem;
      width: fit-content;
    }}
    .seo-card h3 {{
      font-size: 1.15rem;
      font-weight: 700;
      color: #0F172A;
      margin: 0 0 0.4rem;
      font-family: 'Plus Jakarta Sans', 'Inter', 'Noto Sans Devanagari', sans-serif;
    }}
    .seo-card p {{
      font-size: 0.88rem;
      color: #64748B;
      line-height: 1.55;
      margin: 0 0 1rem;
    }}
    .seo-card-cta {{
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.85rem;
      font-weight: 600;
      color: #156082;
    }}

    /* EkShala Comprehensive Footer */
    .ek-footer {{
      background: #0B132B;
      color: #94A3B8;
      padding: 4.5rem 0 2rem;
      border-top: 1px solid #1E293B;
      font-size: 0.92rem;
    }}
    .ek-footer-grid {{
      display: grid;
      grid-template-columns: 1.8fr 1.2fr 1.2fr 1.2fr;
      gap: 2.5rem;
      margin-bottom: 3.5rem;
    }}
    @media (max-width: 992px) {{
      .ek-footer-grid {{ grid-template-columns: 1fr 1fr; gap: 2rem; }}
    }}
    @media (max-width: 600px) {{
      .ek-footer-grid {{ grid-template-columns: 1fr; gap: 2rem; }}
    }}
    .ek-footer h4 {{
      color: #FFFFFF;
      font-size: 1.05rem;
      font-weight: 700;
      margin-bottom: 1.25rem;
      letter-spacing: 0.3px;
    }}
    .ek-footer ul {{
      list-style: none;
      padding: 0;
      margin: 0;
    }}
    .ek-footer ul li {{
      margin-bottom: 0.65rem;
    }}
    .ek-footer ul li a {{
      color: #94A3B8;
      text-decoration: none;
      transition: color 0.15s ease;
    }}
    .ek-footer ul li a:hover {{
      color: #38BDF8;
      text-decoration: underline;
    }}
    .ek-footer-bottom {{
      border-top: 1px solid #1E293B;
      padding-top: 2rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      font-size: 0.85rem;
    }}
    .ek-footer-bottom a {{
      color: #64748B;
      text-decoration: none;
    }}
    .ek-footer-bottom a:hover {{
      color: #94A3B8;
    }}

    /* Robust Nav Dropdown & Mobile Accordion Styles */
    .nav-dropdown-wrapper {{
      position: relative;
    }}
    .dropdown-trigger {{
      display: inline-flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      background: none;
      border: none;
      font-family: inherit;
    }}
    .chevron-icon {{
      transition: transform 0.2s ease;
      flex-shrink: 0;
    }}
    .nav-dropdown-wrapper.open .chevron-icon {{
      transform: rotate(180deg);
    }}
    .nav-dropdown-menu {{
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      background: #FFFFFF;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
      min-width: 220px;
      overflow: hidden;
      opacity: 0;
      transform: translateY(6px);
      pointer-events: none;
      transition: opacity 0.2s ease, transform 0.2s ease;
      z-index: 1005 !important;
      padding: 0.35rem 0;
    }}
    .nav-dropdown-menu::before {{
      content: '';
      position: absolute;
      top: -12px;
      left: 0;
      right: 0;
      height: 12px;
    }}
    .nav-dropdown-wrapper.open .nav-dropdown-menu {{
      opacity: 1 !important;
      transform: translateY(0) !important;
      pointer-events: auto !important;
    }}
    @media (hover: hover) and (pointer: fine) {{
      .nav-dropdown-wrapper:hover .nav-dropdown-menu {{
        opacity: 1 !important;
        transform: translateY(0) !important;
        pointer-events: auto !important;
      }}
    }}
    .dropdown-item {{
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem 1rem;
      font-size: 0.88rem;
      font-weight: 500;
      color: #334155;
      text-decoration: none;
      transition: background 0.15s ease, color 0.15s ease;
    }}
    .dropdown-item:hover {{
      background: #F1F5F9;
      color: #0F172A;
    }}
    .di-tag {{
      width: 24px;
      height: 24px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      color: #FFFFFF;
      flex-shrink: 0;
    }}
    .di-tag.cbse {{ background: #2563EB; }}
    .di-tag.icse {{ background: #059669; }}

    /* Mobile Accordion */
    @media (max-width: 900px) {{
      .nav-dropdown-wrapper {{
        border-bottom: 1px solid #E2E8F0;
        width: 100%;
      }}
      .dropdown-trigger {{
        width: 100%;
        justify-content: space-between;
        padding: 0.85rem 0.5rem;
      }}
      .nav-dropdown-menu {{
        position: static !important;
        box-shadow: none !important;
        border: none !important;
        border-top: 1px solid #E2E8F0 !important;
        border-radius: 0 !important;
        background: #F8FAFC !important;
        padding: 0 !important;
        transform: none !important;
        display: none !important;
        opacity: 0;
      }}
      .nav-dropdown-wrapper.open .nav-dropdown-menu {{
        display: block !important;
        opacity: 1 !important;
        pointer-events: auto !important;
        padding: 0.35rem 0 !important;
      }}
      .dropdown-item {{
        padding: 0.7rem 1.25rem !important;
      }}
    }}
  </style>
  <noscript>
    <style>
      .seo-tab-pane {{ display: block !important; }}
    </style>
  </noscript>
</head>
<body class="seo-page-body">
"""

def get_navbar(active_link=''):
    return f"""<header class="navbar" id="navbar" role="banner">
  <div class="container nav-inner">
    <a href="/" class="nav-logo" aria-label="EkShala Home">
      <span class="logo-icon" aria-hidden="true">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect width="32" height="32" rx="8" fill="#3A7BD5"/>
          <path d="M9 10h14M9 16h9M9 22h12" stroke="white" stroke-width="2" stroke-linecap="round"/>
          <circle cx="24" cy="22" r="4" fill="#90BEF0" stroke="white" stroke-width="1.5"/>
        </svg>
      </span>
      <span class="logo-text">Ek<span>Shala</span></span>
    </a>

    <nav class="nav-links" id="nav-links" role="navigation" aria-label="Main navigation">
      <a href="/" class="nav-link {'active' if active_link=='home' else ''}">Home</a>

      <!-- School Boards dropdown -->
      <div class="nav-dropdown-wrapper">
        <button class="nav-link dropdown-trigger {'active' if active_link in ['cbse', 'icse'] else ''}" aria-haspopup="true" aria-expanded="false" id="boards-trigger">
          School Boards
          <svg class="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="nav-dropdown-menu" id="boards-dropdown" role="menu">
          <a href="/cbse/class-10/hindi/" class="dropdown-item" role="menuitem">
            <span class="di-tag cbse">C</span> CBSE Class 10 Hindi
          </a>
          <a href="/icse/class-10/hindi/" class="dropdown-item" role="menuitem">
            <span class="di-tag icse">I</span> ICSE Class 10 Hindi
          </a>
          <a href="/worksheets/" class="dropdown-item" role="menuitem">
            <span class="di-tag" style="background:#E8F8F6; color:#2BA899;">W</span> Practice Worksheets
          </a>
          <a href="/hindi-grammar/" class="dropdown-item" role="menuitem">
            <span class="di-tag" style="background:#FFF4E0; color:#E8900A;">G</span> Hindi Grammar Hub
          </a>
          <a href="/#school-boards" class="dropdown-item" role="menuitem" style="border-top:1px solid #E2E8F0; font-weight:600;">
            <span class="di-tag" style="background:#EFF6FF; color:#2563EB;">🏛️</span> All School Boards
          </a>
        </div>
      </div>

      <!-- Worksheets dropdown -->
      <div class="nav-dropdown-wrapper">
        <button class="nav-link dropdown-trigger {'active' if active_link=='worksheets' else ''}" aria-haspopup="true" aria-expanded="false" id="worksheets-trigger">
          Worksheets
          <svg class="chevron-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="nav-dropdown-menu" id="worksheets-dropdown" role="menu">
          <a href="/worksheets/#cbse-worksheets" class="dropdown-item" role="menuitem">
            <span class="di-tag cbse">C</span> CBSE Worksheets
          </a>
          <a href="/worksheets/#icse-worksheets" class="dropdown-item" role="menuitem">
            <span class="di-tag icse">I</span> ICSE Worksheets
          </a>
          <a href="/worksheets/#grammar-worksheets" class="dropdown-item" role="menuitem">
            <span class="di-tag" style="background:#FFF4E0; color:#E8900A;">G</span> Grammar Worksheets
          </a>
          <a href="/worksheets/" class="dropdown-item" role="menuitem" style="border-top:1px solid var(--border); font-weight:600;">
            <span class="di-tag" style="background:#E8F8F6; color:#2BA899;">All</span> All 18 Worksheets
          </a>
        </div>
      </div>

      <a href="/hindi-grammar/" class="nav-link {'active' if active_link=='grammar' else ''}">Hindi Grammar</a>

      <a href="/about/" class="nav-link {'active' if active_link=='about' else ''}">About Us</a>
      <a href="/login.html" class="nav-link nav-cta-login" id="nav-login-btn">Login</a>

      <div class="nav-profile-chip" id="nav-profile-chip" hidden>
        <div class="nav-avatar" id="nav-avatar-letter">S</div>
        <span id="nav-profile-name">Student</span>
        <svg class="chip-chevron" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>
        <div class="nav-profile-dropdown">
          <a href="/login.html" class="npd-item" id="nav-dashboard-link">My Dashboard</a>
          <button class="npd-item npd-logout" id="nav-logout-btn">Logout</button>
        </div>
      </div>
      <a href="/contact/" class="nav-link nav-cta">Contact</a>
    </nav>

    <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-expanded="false" aria-controls="nav-links">
      <span class="bar"></span>
      <span class="bar"></span>
      <span class="bar"></span>
    </button>
  </div>
</header>
"""

def get_footer(extra_html="", extra_scripts=""):
    return f"""<footer class="ek-footer" role="contentinfo">
  <div class="container">
    <div class="ek-footer-grid">
      <div>
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:1rem;">
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#3A7BD5"/>
            <path d="M9 10h14M9 16h9M9 22h12" stroke="white" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <span style="font-size:1.4rem; font-weight:800; color:#FFFFFF;">Ek<span style="color:#38BDF8;">Shala</span></span>
        </div>
        <p style="line-height:1.7; margin-bottom:1.25rem; color:#94A3B8;">
          EkShala is a dedicated educational platform providing 100% free, high-quality study material for Class 10 Hindi students across CBSE and ICSE boards. Chapter summaries, deep revision notes, competency questions, and practice worksheets.
        </p>
        <p style="font-size:0.85rem; color:#64748B;">
          Email: <a href="mailto:ektaverma09.work@gmail.com" style="color:#94A3B8;">ektaverma09.work@gmail.com</a> | Mentor Support: +91-99722-47410
        </p>
      </div>

      <div>
        <h4>CBSE Class 10 Hindi</h4>
        <ul>
          <li><a href="/cbse/class-10/hindi/">CBSE Class 10 Hindi Hub</a></li>
          <li><a href="/cbse/class-10/hindi/bade-bhai-sahab/">बड़े भाई साहब – प्रेमचंद</a></li>
          <li><a href="/cbse/class-10/hindi/sakhi-kabir/">साखी – कबीरदास</a></li>
          <li><a href="/cbse/class-10/hindi/pad-meera/">पद – मीराबाई</a></li>
          <li><a href="/cbse/class-10/hindi/harihar-kaka/">हरिहर काका – मिथिलेश्वर</a></li>
          <li><a href="/cbse/class-10/hindi/topi-shukla/">टोपी शुक्ला – राही मासूम रज़ा</a></li>
        </ul>
      </div>

      <div>
        <h4>ICSE Class 10 Hindi</h4>
        <ul>
          <li><a href="/icse/class-10/hindi/">ICSE Class 10 Hindi Hub</a></li>
          <li><a href="/icse/class-10/hindi/bhedein-aur-bhediye/">भेड़ें और भेड़िए – हरिशंकर परसाई</a></li>
          <li><a href="/icse/class-10/hindi/bade-ghar-ki-beti/">बड़े घर की बेटी – प्रेमचंद</a></li>
          <li><a href="/icse/class-10/hindi/do-kalakar/">दो कलाकार – मन्नू भंडारी</a></li>
          <li><a href="/icse/class-10/hindi/sukhi-daali/">सूखी डाली – उपेंद्रनाथ अश्क</a></li>
          <li><a href="/icse/class-10/hindi/deepdan/">दीपदान – डॉ. रामकुमार वर्मा</a></li>
        </ul>
      </div>

      <div>
        <h4>Grammar & Resources</h4>
        <ul>
          <li><a href="/worksheets/">Class 10 Hindi Worksheets</a></li>
          <li><a href="/hindi-grammar/">Hindi Grammar Hub</a></li>
          <li><a href="/hindi-grammar/muhavare/">मुहावरे (Idioms & Expressions)</a></li>
          <li><a href="/hindi-grammar/padbandh/">पदबंध (Padbandh Practice)</a></li>
          <li><a href="/about/">About EkShala</a></li>
          <li><a href="/contact/">Contact Us & Mentorship</a></li>
        </ul>
      </div>
    </div>

    <div class="ek-footer-bottom">
      <div>&copy; 2026 EkShala. All rights reserved. Free Educational Resource for School Students.</div>
      <div style="display:flex; gap:1.25rem;">
        <a href="/about/">About</a>
        <a href="/contact/">Contact</a>
        <a href="/privacy-policy/">Privacy Policy</a>
        <a href="/terms-and-conditions/">Terms &amp; Conditions</a>
      </div>
    </div>
  </div>
</footer>

{extra_html}

<script src="/auth.js?v=1.0"></script>
{extra_scripts}
<script>
  // Mobile hamburger toggle
  const ham = document.getElementById('hamburger');
  const nav = document.getElementById('nav-links');
  if (ham && nav && !ham.dataset.bound) {{
    ham.dataset.bound = 'true';
    ham.addEventListener('click', () => {{
      const open = nav.classList.toggle('open');
      ham.classList.toggle('open', open);
      ham.setAttribute('aria-expanded', String(open));
    }});
  }}

  // Dropdown menus
  document.querySelectorAll('.dropdown-trigger').forEach(trig => {{
    if (trig.dataset.dropdownBound) return;
    trig.dataset.dropdownBound = 'true';
    const wrap = trig.closest('.nav-dropdown-wrapper');
    if (!wrap) return;

    trig.addEventListener('click', (e) => {{
      e.stopPropagation();
      const isMobile = window.innerWidth <= 900;
      const isOpen = wrap.classList.contains('open');

      document.querySelectorAll('.nav-dropdown-wrapper').forEach(w => {{
        if (w !== wrap) {{
          w.classList.remove('open');
          const otherTrig = w.querySelector('.dropdown-trigger');
          if (otherTrig) otherTrig.setAttribute('aria-expanded', 'false');
        }}
      }});

      wrap.classList.toggle('open', !isOpen);
      trig.setAttribute('aria-expanded', String(!isOpen));
    }});
  }});

  document.addEventListener('click', (e) => {{
    document.querySelectorAll('.nav-dropdown-wrapper').forEach(wrap => {{
      if (!wrap.contains(e.target)) {{
        wrap.classList.remove('open');
        const trig = wrap.querySelector('.dropdown-trigger');
        if (trig) trig.setAttribute('aria-expanded', 'false');
      }}
    }});
  }});
</script>
</body>
</html>
"""

# ==============================================================================
# 1. GENERATE CHAPTER PAGES
# ==============================================================================
def generate_chapter_pages():
    print("\n--- Generating Individual Chapter Pages ---")
    for ch in ALL_CHAPTERS:
        key = ch['key']
        board = ch['board']
        slug = ch['slug']
        title = ch['title']
        author = ch['author']
        book = ch['book']
        num = ch['num']
        desc = ch['desc']

        # Determine board rel path
        board_lower = board.lower()
        rel_dir = f"{board_lower}/class-10/hindi/{slug}"
        canonical_url = f"{BASE_URL}/{rel_dir}/"
        ALL_CANONICAL_URLS.append(canonical_url)

        # Page Title: बड़े भाई साहब Class 10 | Summary, Questions & Answers
        seo_title = f"{title} Class 10 Hindi ({book}) | Summary, Notes & Question Answers | EkShala"

        # Content categories from JSON
        ch_content = CHAPTERS_DATA.get(key, {})
        summary_html = ch_content.get('summary', '')
        notes_html = ch_content.get('notes', '')
        competency_html = ch_content.get('competency', '')
        additional_html = ch_content.get('additional', '')
        muhavre_html = ch_content.get('muhavre', '')

        # Build Breadcrumbs HTML
        board_hub_url = f"/{board_lower}/class-10/hindi/"
        breadcrumbs_html = f"""<div class="seo-breadcrumb-bar">
  <div class="container">
    <ol class="seo-breadcrumbs" itemscope itemtype="https://schema.org/BreadcrumbList">
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a href="/" itemprop="item"><span itemprop="name">Home</span></a>
        <meta itemprop="position" content="1" />
      </li>
      <li class="sep">&rsaquo;</li>
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a href="{board_hub_url}" itemprop="item"><span itemprop="name">{board} Class 10 Hindi</span></a>
        <meta itemprop="position" content="2" />
      </li>
      <li class="sep">&rsaquo;</li>
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span class="current" itemprop="name">{title}</span>
        <meta itemprop="position" content="3" />
      </li>
    </ol>
  </div>
</div>"""

        # Schema JSON-LD
        schema_dict = {
            "@context": "https://schema.org",
            "@graph": [
                {
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "Home", "item": f"{BASE_URL}/" },
                        { "@type": "ListItem", "position": 2, "name": f"{board} Class 10 Hindi", "item": f"{BASE_URL}{board_hub_url}" },
                        { "@type": "ListItem", "position": 3, "name": title, "item": canonical_url }
                    ]
                },
                {
                    "@type": "Article",
                    "headline": f"{title} – Class 10 Hindi {book} Notes & Question Answers",
                    "description": desc,
                    "inLanguage": "hi",
                    "author": { "@type": "Organization", "name": "EkShala Hindi Faculty", "url": BASE_URL },
                    "publisher": {
                        "@type": "Organization",
                        "name": "EkShala",
                        "url": BASE_URL,
                        "logo": { "@type": "ImageObject", "url": f"{BASE_URL}/logo-preview.png" }
                    },
                    "mainEntityOfPage": canonical_url,
                    "datePublished": "2026-09-10",
                    "dateModified": datetime.now().strftime("%Y-%m-%d"),
                    "educationalLevel": "Class 10",
                    "about": [
                        { "@type": "Thing", "name": f"{board} Class 10 Hindi" },
                        { "@type": "Thing", "name": book },
                        { "@type": "Thing", "name": title },
                        { "@type": "Person", "name": author }
                    ]
                }
            ]
        }
        schema_json_ld = json.dumps(schema_dict, ensure_ascii=False, indent=2)

        # Related Chapters in same board (prioritizing same book)
        if board == 'ICSE':
            same_book = [c for c in ICSE_CHAPTERS if c['book'] == book and c['key'] != key]
            other_books = [c for c in ICSE_CHAPTERS if c['book'] != book and c['key'] != key]
            related_list = (same_book + other_books)[:6]
        else:
            related_list = [c for c in CBSE_CHAPTERS if c['key'] != key][:6]
        related_cards_html = ""
        for rc in related_list:
            rc_url = f"/{board_lower}/class-10/hindi/{rc['slug']}/"
            related_cards_html += f"""<a href="{rc_url}" class="seo-card">
  <div>
    <span class="seo-card-badge">{rc['book']}</span>
    <h3>{rc['title']}</h3>
    <p>Author/Poet: {rc['author']} &bull; {rc['type']}</p>
  </div>
  <span class="seo-card-cta">Read Chapter &rarr;</span>
</a>"""

        # Available study tab definitions in order:
        pyq_slugs = ['sukhi-daali', 'deepdan', 'mahabharat-ki-ek-saanjh']
        cbq_title = 'PYQs Based Questions' if slug in pyq_slugs else 'Competency Based Questions'

        tab_defs = []
        if summary_html:
            tab_defs.append(('summary', 'Chapter Summary', '📜'))
        if notes_html:
            tab_defs.append(('notes', 'Questions and Answers', '📝'))
        if competency_html and additional_html:
            tab_defs.append(('competency', cbq_title, '🎯'))
            tab_defs.append(('additional', 'Additional Questions', '⭐'))
        elif competency_html:
            tab_defs.append(('competency', cbq_title, '🎯'))
        elif additional_html:
            tab_defs.append(('additional', 'Additional Questions', '⭐'))
        if muhavre_html:
            tab_defs.append(('muhavre', 'Idioms', '📖'))
        tab_defs.append(('worksheets', 'Practice Worksheets', '📄'))

        # Navigation Pills (English tab navigation)
        pills = []
        for t_id, t_label, t_icon in tab_defs:
            pills.append((t_id, f'{t_icon} {t_label}'))
        pills.append(('related', '🔗 Related Chapters'))

        first_tab_id = tab_defs[0][0] if tab_defs else 'summary'
        pills_html = "".join([f'<a href="#{p[0]}" class="seo-pill {"active" if p[0] == first_tab_id else ""}">{p[1]}</a>' for p in pills])

        def get_tab_footer(t_id):
            ids = [t[0] for t in tab_defs]
            if t_id not in ids:
                return ""
            idx = ids.index(t_id)
            prev_t = tab_defs[idx - 1] if idx > 0 else None
            next_t = tab_defs[idx + 1] if idx < len(tab_defs) - 1 else None
            prev_btn = f'<button type="button" class="tab-nav-btn" data-switch-tab="{prev_t[0]}">&larr; {prev_t[2]} {prev_t[1]}</button>' if prev_t else '<div></div>'
            next_btn = f'<button type="button" class="tab-nav-btn primary" data-switch-tab="{next_t[0]}">{next_t[2]} {next_t[1]} &rarr;</button>' if next_t else '<div></div>'
            return f'<div class="tab-nav-footer">{prev_btn}{next_btn}</div>'

        # Content Sections (Interactive Tab Panes)
        sections_html = ""
        if summary_html:
            is_act = " active" if first_tab_id == "summary" else ""
            sections_html += f"""<section id="summary" class="seo-section-card seo-tab-pane{is_act}" data-tab-id="summary">
  <div class="seo-section-header">
    <span class="seo-section-icon">📜</span>
    <h2>Chapter Summary (पाठ का सार एवं परिचय)</h2>
  </div>
  <div class="seo-section-body">
    {summary_html}
  </div>
  {get_tab_footer('summary')}
</section>"""

        if notes_html:
            is_act = " active" if first_tab_id == "notes" else ""
            sections_html += f"""<section id="notes" class="seo-section-card seo-tab-pane{is_act}" data-tab-id="notes">
  <div class="seo-section-header">
    <span class="seo-section-icon">📝</span>
    <h2>Questions and Answers (प्रश्नोत्तर)</h2>
  </div>
  <div class="seo-section-body">
    {notes_html}
  </div>
  {get_tab_footer('notes')}
</section>"""

        if competency_html:
            cbq_label = f"{cbq_title} (विगत वर्षों के बोर्ड प्रश्नोत्तर)" if slug in pyq_slugs else "Competency Based Questions (योग्यता-आधारित प्रश्नोत्तर)"
            is_act = " active" if first_tab_id == "competency" else ""
            sections_html += f"""<section id="competency" class="seo-section-card seo-tab-pane{is_act}" data-tab-id="competency">
  <div class="seo-section-header">
    <span class="seo-section-icon">🎯</span>
    <h2>{cbq_label}</h2>
  </div>
  <div class="seo-section-body">
    {competency_html}
  </div>
  {get_tab_footer('competency')}
</section>"""

        if additional_html:
            is_act = " active" if first_tab_id == "additional" else ""
            sections_html += f"""<section id="additional" class="seo-section-card seo-tab-pane{is_act}" data-tab-id="additional">
  <div class="seo-section-header">
    <span class="seo-section-icon">⭐</span>
    <h2>Additional Questions (अतिरिक्त प्रश्नोत्तर)</h2>
  </div>
  <div class="seo-section-body">
    {additional_html}
  </div>
  {get_tab_footer('additional')}
</section>"""

        if muhavre_html:
            is_act = " active" if first_tab_id == "muhavre" else ""
            sections_html += f"""<section id="muhavre" class="seo-section-card seo-tab-pane{is_act}" data-tab-id="muhavre">
  <div class="seo-section-header">
    <span class="seo-section-icon">📖</span>
    <h2>Idioms (मुहावरे एवं शब्दार्थ)</h2>
  </div>
  <div class="seo-section-body">
    {muhavre_html}
  </div>
  {get_tab_footer('muhavre')}
</section>"""

        # Worksheet Card in chapter
        is_act = " active" if first_tab_id == "worksheets" else ""
        sections_html += f"""<section id="worksheets" class="seo-section-card seo-tab-pane{is_act}" data-tab-id="worksheets">
  <div class="seo-section-header">
    <span class="seo-section-icon">📄</span>
    <h2>Practice Worksheets &amp; Evaluation (अभ्यास वर्कशीट)</h2>
  </div>
  <div class="seo-section-body" style="background:#F8FAFC; padding:1.75rem; border-radius:14px; border:1px solid #E2E8F0;">
    <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:1.25rem;">
      <div>
        <h3 style="font-size:1.2rem; margin:0 0 0.5rem; color:#0F172A;">{title} – Class 10 Hindi Practice Worksheet</h3>
        <p style="margin:0; color:#64748B; font-size:0.95rem;">Download or practice online to get your answers evaluated by teachers.</p>
      </div>
      <div style="display:flex; gap:0.75rem;">
        <a href="/worksheets/" class="btn btn-primary" style="padding:0.7rem 1.4rem;">View All Worksheets &rarr;</a>
        <a href="/hindi-grammar/" class="btn btn-outline" style="padding:0.7rem 1.4rem;">Hindi Grammar</a>
      </div>
    </div>
  </div>
  {get_tab_footer('worksheets')}
</section>"""

        # Related Chapters Section (permanent at bottom of main content container)
        sections_html += f"""<section id="related" class="seo-section-card">
  <div class="seo-section-header">
    <span class="seo-section-icon">🔗</span>
    <h2>Related Chapters ({board} Class 10 Hindi)</h2>
  </div>
  <div class="seo-grid">
    {related_cards_html}
  </div>
</section>"""

        # Hero Header HTML
        hero_html = f"""<header class="seo-hero">
  <div class="container">
    <span class="seo-hero-badge">{board} Class 10 Hindi &bull; {book}</span>
    <h1>{title} – Class 10 Hindi Summary, Notes &amp; Question Answers</h1>
    <p class="lead">{desc}</p>
    <div class="seo-hero-meta">
      <span>✍️ <strong>Author:</strong> {author}</span>
      <span>📖 <strong>Book:</strong> {book}</span>
      <span>🏷️ <strong>Chapter:</strong> {num} ({ch['type']})</span>
      <span>🎓 <strong>Board:</strong> {board} Class 10</span>
      <span>✓ <strong>100% Free</strong></span>
    </div>
  </div>
</header>"""

        chapter_tab_script = """<script>
(function() {
  const pills = Array.from(document.querySelectorAll('.seo-quick-nav .seo-pill'));
  const panes = Array.from(document.querySelectorAll('.seo-tab-pane'));
  const quickNav = document.querySelector('.seo-quick-nav');

  if (!pills.length || !panes.length) return;

  function activateTab(tabId, shouldScroll) {
    if (!tabId) return false;
    const cleanId = tabId.replace(/^#/, '');

    if (cleanId === 'related') {
      const relSec = document.getElementById('related');
      if (relSec) {
        relSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        pills.forEach(p => {
          if ((p.getAttribute('href') || '') === '#related') p.classList.add('active');
          else p.classList.remove('active');
        });
        return true;
      }
    }

    const targetPane = document.getElementById(cleanId);
    if (!targetPane || !targetPane.classList.contains('seo-tab-pane')) {
      return false;
    }

    panes.forEach(pane => pane.classList.remove('active'));
    targetPane.classList.add('active');

    pills.forEach(pill => {
      const href = pill.getAttribute('href') || '';
      if (href === '#' + cleanId) {
        pill.classList.add('active');
        pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        pill.classList.remove('active');
      }
    });

    if (shouldScroll && quickNav) {
      const navRect = quickNav.getBoundingClientRect();
      const targetScroll = window.pageYOffset + navRect.top - 70;
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }

    return true;
  }

  pills.forEach(pill => {
    pill.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        if (targetId !== 'related') {
          e.preventDefault();
          activateTab(targetId, true);
          if (history.replaceState) {
            history.replaceState(null, null, href);
          } else {
            location.hash = href;
          }
        }
      }
    });
  });

  document.querySelectorAll('[data-switch-tab]').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('data-switch-tab');
      if (targetId) {
        activateTab(targetId, true);
        if (history.replaceState) {
          history.replaceState(null, null, '#' + targetId);
        }
      }
    });
  });

  window.addEventListener('hashchange', function() {
    if (location.hash) {
      activateTab(location.hash, false);
    }
  });

  let activated = false;
  if (window.location.hash) {
    activated = activateTab(window.location.hash, false);
  }
  if (!activated && panes.length > 0) {
    activateTab(panes[0].id, false);
  }
})();
</script>"""

        # Assemble Full Page
        full_page = get_common_head(seo_title, desc, canonical_url, schema_json_ld)
        full_page += get_navbar(active_link=board_lower)
        full_page += breadcrumbs_html
        full_page += hero_html
        full_page += f"""<nav class="seo-quick-nav" aria-label="Chapter quick navigation">
  <div class="container">
    <div class="seo-pill-list">
      {pills_html}
    </div>
  </div>
</nav>
<main class="seo-content-wrap">
  <div class="container">
    {sections_html}
  </div>
</main>
{chapter_tab_script}"""
        full_page += get_footer()

        write_html_file(rel_dir, full_page)


# ==============================================================================
# 2. GENERATE CBSE LANDING PAGE
# ==============================================================================
def generate_cbse_landing_page():
    print("\n--- Generating CBSE Class 10 Hindi Landing Page ---")
    rel_dir = "cbse/class-10/hindi"
    canonical_url = f"{BASE_URL}/{rel_dir}/"
    ALL_CANONICAL_URLS.append(canonical_url)

    seo_title = "CBSE Class 10 Hindi Study Material | Notes & Worksheets | EkShala"
    desc = "Complete CBSE Class 10 Hindi (Course B) study material. Sparsh & Sanchayan chapter-wise summaries, deep notes, competency question answers, worksheets, and grammar tutorials."

    sparsh_chapters = [c for c in CBSE_CHAPTERS if 'स्पर्श' in c['book']]
    sanchayan_chapters = [c for c in CBSE_CHAPTERS if 'संचयन' in c['book']]

    sparsh_cards = "".join([f"""<a href="/cbse/class-10/hindi/{c['slug']}/" class="seo-card">
  <div>
    <span class="seo-card-badge">अध्याय {c['num']} &bull; {c['type']}</span>
    <h3>{c['title']}</h3>
    <p>रचनाकार: {c['author']} &bull; संपूर्ण व्याख्या, नोट्स एवं प्रश्नोत्तर</p>
  </div>
  <span class="seo-card-cta">अध्याय खोलें &rarr;</span>
</a>""" for c in sparsh_chapters])

    sanchayan_cards = "".join([f"""<a href="/cbse/class-10/hindi/{c['slug']}/" class="seo-card">
  <div>
    <span class="seo-card-badge">अध्याय {c['num']} &bull; पूरक पुस्तक</span>
    <h3>{c['title']}</h3>
    <p>रचनाकार: {c['author']} &bull; संपूर्ण कहानी सार एवं प्रश्नोत्तर</p>
  </div>
  <span class="seo-card-cta">अध्याय खोलें &rarr;</span>
</a>""" for c in sanchayan_chapters])

    schema_dict = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "होम", "item": f"{BASE_URL}/" },
                    { "@type": "ListItem", "position": 2, "name": "CBSE Class 10 Hindi", "item": canonical_url }
                ]
            },
            {
                "@type": "Course",
                "name": "CBSE Class 10 Hindi Course B Study Material",
                "description": desc,
                "provider": { "@type": "Organization", "name": "EkShala", "url": BASE_URL },
                "educationalLevel": "Class 10",
                "inLanguage": "hi"
            }
        ]
    }

    breadcrumbs_html = f"""<div class="seo-breadcrumb-bar">
  <div class="container">
    <ol class="seo-breadcrumbs" itemscope itemtype="https://schema.org/BreadcrumbList">
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a href="/" itemprop="item"><span itemprop="name">होम</span></a>
        <meta itemprop="position" content="1" />
      </li>
      <li class="sep">&rsaquo;</li>
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span class="current" itemprop="name">CBSE Class 10 Hindi</span>
        <meta itemprop="position" content="2" />
      </li>
    </ol>
  </div>
</div>"""

    hero_html = f"""<header class="seo-hero">
  <div class="container">
    <span class="seo-hero-badge">CBSE Board Exam 2026-27 &bull; Hindi Course B</span>
    <h1>CBSE Class 10 Hindi Study Material</h1>
    <p class="lead">एनसीईआरटी स्पर्श (भाग-2) एवं संचयन (भाग-2) के सभी अध्यायों के विस्तृत सारांश, सप्रसंग व्याख्या, योग्यता-आधारित प्रश्न (CBQ), व्याकरण एवं अभ्यास वर्कशीट।</p>
    <div class="seo-hero-meta">
      <span>📚 <strong>17 संपूर्ण अध्याय</strong></span>
      <span>📝 <strong>स्पर्श एवं संचयन भाग-2</strong></span>
      <span>🎯 <strong>CBSE Board Pattern</strong></span>
      <span>📄 <strong>प्रैक्टिस वर्कशीट उपलब्ध</strong></span>
    </div>
  </div>
</header>"""

    body_html = f"""<main class="seo-content-wrap">
  <div class="container">
    <!-- Course Info Section -->
    <section class="seo-section-card">
      <div class="seo-section-header">
        <span class="seo-section-icon">📖</span>
        <h2>सीबीएसई कक्षा 10 हिंदी (कोर्स बी) पाठ्यक्रम रूपरेखा</h2>
      </div>
      <p style="font-size:1.05rem; line-height:1.75; color:#334155;">
        CBSE Class 10 Hindi Course B में मुख्य रूप से दो पाठ्यपुस्तकें शामिल हैं: <strong>स्पर्श भाग-2</strong> (गद्य और पद्य खंड) तथा <strong>संचयन भाग-2</strong> (पूरक पाठ्यपुस्तक)। बोर्ड परीक्षा में उच्च अंक प्राप्त करने के लिए प्रत्येक पाठ के केंद्रीय भाव, लेखक के दृष्टिकोण, कठिन शब्दार्थ, तथा योग्यता-आधारित प्रश्नों (Competency Based Questions) की गहरी समझ अत्यंत आवश्यक है। नीचे दोनों पुस्तकों के सभी 17 अध्यायों के अध्ययन संसाधन उपलब्ध हैं:
      </p>
    </section>

    <!-- Syllabus & Marking Scheme Section -->
    <section class="seo-section-card" id="syllabus-marking-scheme" style="background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);">
      <div class="seo-section-header">
        <span class="seo-section-icon">📑</span>
        <h2>पाठ्यक्रम एवं अंक योजना (Syllabus &amp; Marking Scheme 2026-27)</h2>
      </div>
      <p style="font-size:1.02rem; line-height:1.75; color:#334155; margin-bottom:1.5rem;">
        सीबीएसई बोर्ड परीक्षा 2026-27 के लिए कक्षा 10 हिंदी कोर्स 'बी' का आधिकारिक पाठ्यक्रम, प्रश्न-पत्र का प्रारूप और अंक विभाजन (Blueprint) यहाँ सीधे देखें व डाउनलोड करें:
      </p>
      <div class="seo-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
        <!-- Syllabus Card -->
        <div style="background:#FFFFFF; border:1px solid #BAE6FD; border-radius:14px; padding:1.5rem; box-shadow:0 2px 10px rgba(14,165,233,0.06); display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
              <span style="background:#E0F2FE; color:#0284C7; font-size:0.75rem; font-weight:700; padding:4px 10px; border-radius:6px; text-transform:uppercase;">CBSE Official</span>
              <span style="font-size:1.4rem;">📘</span>
            </div>
            <h3 style="font-size:1.2rem; font-weight:700; color:#0F172A; margin:0 0 0.5rem; font-family:'Plus Jakarta Sans','Inter','Noto Sans Devanagari',sans-serif;">CBSE Class 10 Hindi Syllabus 2026-27</h3>
            <p style="font-size:0.88rem; color:#64748B; line-height:1.6; margin-bottom:1.25rem;">
              कोर्स 'बी' का संपूर्ण पाठ्य विवरण: अपठित गद्यांश (14 अंक), व्यावहारिक व्याकरण (16 अंक), पाठ्यपुस्तकें स्पर्श व संचयन (28 अंक), और रचनात्मक लेखन (22 अंक)।
            </p>
          </div>
          <div style="display:flex; gap:0.75rem; flex-wrap:wrap; border-top:1px solid #F1F5F9; padding-top:1rem;">
            <a href="/pdf/cbse/class10/hindi/class_10_hindi_syllabus_cbse.pdf" target="_blank" rel="noopener" class="btn btn-primary" style="flex:1; justify-content:center; padding:0.6rem 1rem; font-size:0.88rem; border-radius:8px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              View Syllabus
            </a>
            <a href="/pdf/cbse/class10/hindi/class_10_hindi_syllabus_cbse.pdf" download="class_10_hindi_syllabus_cbse.pdf" class="btn btn-outline" style="padding:0.6rem 0.9rem; font-size:0.88rem; border-radius:8px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              PDF
            </a>
          </div>
        </div>

        <!-- Marking Scheme Card -->
        <div style="background:#FFFFFF; border:1px solid #BBF7D0; border-radius:14px; padding:1.5rem; box-shadow:0 2px 10px rgba(22,163,74,0.06); display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
              <span style="background:#DCFCE7; color:#15803D; font-size:0.75rem; font-weight:700; padding:4px 10px; border-radius:6px; text-transform:uppercase;">Blueprint &amp; Schema</span>
              <span style="font-size:1.4rem;">📊</span>
            </div>
            <h3 style="font-size:1.2rem; font-weight:700; color:#0F172A; margin:0 0 0.5rem; font-family:'Plus Jakarta Sans','Inter','Noto Sans Devanagari',sans-serif;">CBSE Hindi Marking Scheme &amp; Blueprint</h3>
            <p style="font-size:0.88rem; color:#64748B; line-height:1.6; margin-bottom:1.25rem;">
              80 अंकों का विस्तृत प्रश्नवार अंक विभाजन, स्टेप-मार्किंग नियम, बहुविकल्पीय प्रश्न (MCQ) व वर्णनात्मक प्रश्नों की आधिकारिक उत्तर गाइड।
            </p>
          </div>
          <div style="display:flex; gap:0.75rem; flex-wrap:wrap; border-top:1px solid #F1F5F9; padding-top:1rem;">
            <a href="/pdf/cbse/class10/hindi/class_10_hindi_marking_schema_cbse.pdf" target="_blank" rel="noopener" class="btn btn-primary" style="flex:1; justify-content:center; padding:0.6rem 1rem; font-size:0.88rem; border-radius:8px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:6px; background:#16A34A; border-color:#16A34A;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              View Marking Scheme
            </a>
            <a href="/pdf/cbse/class10/hindi/class_10_hindi_marking_schema_cbse.pdf" download="class_10_hindi_marking_schema_cbse.pdf" class="btn btn-outline" style="padding:0.6rem 0.9rem; font-size:0.88rem; border-radius:8px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              PDF
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Sparsh Chapters -->
    <section class="seo-section-card">
      <div class="seo-section-header">
        <span class="seo-section-icon">📘</span>
        <h2>स्पर्श (भाग-2) – सभी अध्याय (Sparsh Part 2)</h2>
      </div>
      <div class="seo-grid">
        {sparsh_cards}
      </div>
    </section>

    <!-- Sanchayan Chapters -->
    <section class="seo-section-card">
      <div class="seo-section-header">
        <span class="seo-section-icon">📗</span>
        <h2>संचयन (भाग-2) – पूरक पाठ्यपुस्तक (Sanchayan Part 2)</h2>
      </div>
      <div class="seo-grid">
        {sanchayan_cards}
      </div>
    </section>

    <!-- Quick Links Grid -->
    <section class="seo-section-card">
      <div class="seo-section-header">
        <span class="seo-section-icon">⚡</span>
        <h2>व्याकरण, वर्कशीट एवं बोर्ड प्रश्न-पत्र (Related Resources)</h2>
      </div>
      <div class="seo-grid">
        <a href="/worksheets/" class="seo-card">
          <div>
            <span class="seo-card-badge">अभ्यास कार्य</span>
            <h3>Class 10 Hindi Worksheets</h3>
            <p>कक्षा 10 हिंदी के सभी 20 अभ्यास प्रश्न-पत्र एवं उत्तर कुंजी।</p>
          </div>
          <span class="seo-card-cta">वर्कशीट देखें &rarr;</span>
        </a>
        <a href="/hindi-grammar/" class="seo-card">
          <div>
            <span class="seo-card-badge">व्याकरण</span>
            <h3>Hindi Grammar Hub</h3>
            <p>पदबंध, मुहावरे, समास एवं रचना के आधार पर वाक्य रूपांतरण।</p>
          </div>
          <span class="seo-card-cta">व्याकरण पढ़ें &rarr;</span>
        </a>
        <a href="/worksheets/#cbse-worksheets" class="seo-card">
          <div>
            <span class="seo-card-badge">अभ्यास पत्रक</span>
            <h3>CBSE अभ्यास वर्कशीट्स</h3>
            <p>पाठ आधारित 40 अंक एवं 80 अंक के अभ्यास प्रश्न-पत्र एवं आदर्श उत्तर।</p>
          </div>
          <span class="seo-card-cta">वर्कशीट देखें &rarr;</span>
        </a>
      </div>
    </section>
  </div>
</main>"""

    full_page = get_common_head(seo_title, desc, canonical_url, json.dumps(schema_dict, ensure_ascii=False, indent=2))
    full_page += get_navbar(active_link='cbse')
    full_page += breadcrumbs_html
    full_page += hero_html
    full_page += body_html
    full_page += get_footer()
    write_html_file(rel_dir, full_page)


# ==============================================================================
# 3. GENERATE ICSE LANDING PAGE
# ==============================================================================
def generate_icse_landing_page():
    print("\n--- Generating ICSE Class 10 Hindi Landing Page ---")
    rel_dir = "icse/class-10/hindi"
    canonical_url = f"{BASE_URL}/{rel_dir}/"
    ALL_CANONICAL_URLS.append(canonical_url)

    seo_title = "ICSE Class 10 Hindi Study Material | Notes, Worksheets & Exam Preparation | EkShala"
    desc = "Free ICSE Class 10 Hindi study material. Sahitya Sagar (Prose), Ekanki Sanchay & Naya Raasta (Novel) chapter-wise summaries, deep notes, important questions, character sketches, worksheets & grammar."

    sahitya_chapters = [c for c in ICSE_CHAPTERS if 'साहित्य सागर' in c['book']]
    ekanki_chapters = [c for c in ICSE_CHAPTERS if 'एकांकी' in c['book']]
    naya_rasta_chapters = [c for c in ICSE_CHAPTERS if 'नया रास्ता' in c['book']]

    sahitya_cards = "".join([f"""<a href="/icse/class-10/hindi/{c['slug']}/" class="seo-card">
  <div>
    <span class="seo-card-badge">कहानी {c['num']} &bull; गद्य खंड</span>
    <h3>{c['title']}</h3>
    <p>लेखक: {c['author']} &bull; कथा-सार, चरित्र-चित्रण व प्रश्नोत्तर</p>
  </div>
  <span class="seo-card-cta">कहानी पढ़ें &rarr;</span>
</a>""" for c in sahitya_chapters])

    ekanki_cards = "".join([f"""<a href="/icse/class-10/hindi/{c['slug']}/" class="seo-card">
  <div>
    <span class="seo-card-badge">एकांकी {c['num']} &bull; एक-अंकी नाटक</span>
    <h3>{c['title']}</h3>
    <p>नाटककार: {c['author']} &bull; संवाद व्याख्या, संदेश व प्रश्नोत्तर</p>
  </div>
  <span class="seo-card-cta">एकांकी पढ़ें &rarr;</span>
</a>""" for c in ekanki_chapters])

    naya_rasta_cards = "".join([f"""<a href="/icse/class-10/hindi/{c['slug']}/" class="seo-card">
  <div>
    <span class="seo-card-badge">अध्याय {c['num']} &bull; उपन्यास</span>
    <h3>{c['title']}</h3>
    <p>{c.get('subtitle', '')} &bull; बोर्ड परीक्षा अवतरण-आधारित प्रश्नोत्तर</p>
  </div>
  <span class="seo-card-cta">प्रश्नोत्तर पढ़ें &rarr;</span>
</a>""" for c in naya_rasta_chapters])

    schema_dict = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "होम", "item": f"{BASE_URL}/" },
                    { "@type": "ListItem", "position": 2, "name": "ICSE Class 10 Hindi", "item": canonical_url }
                ]
            },
            {
                "@type": "Course",
                "name": "ICSE Class 10 Hindi Study Material",
                "description": desc,
                "provider": { "@type": "Organization", "name": "EkShala", "url": BASE_URL },
                "educationalLevel": "Class 10",
                "inLanguage": "hi"
            }
        ]
    }

    breadcrumbs_html = f"""<div class="seo-breadcrumb-bar">
  <div class="container">
    <ol class="seo-breadcrumbs" itemscope itemtype="https://schema.org/BreadcrumbList">
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a href="/" itemprop="item"><span itemprop="name">होम</span></a>
        <meta itemprop="position" content="1" />
      </li>
      <li class="sep">&rsaquo;</li>
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span class="current" itemprop="name">ICSE Class 10 Hindi</span>
        <meta itemprop="position" content="2" />
      </li>
    </ol>
  </div>
</div>"""

    hero_html = f"""<header class="seo-hero">
  <div class="container">
    <span class="seo-hero-badge">ICSE Board Exam 2026-27 &bull; Hindi Literature</span>
    <h1>ICSE Class 10 Hindi Study Material</h1>
    <p class="lead">साहित्य सागर (गद्य खंड), एकांकी संचय एवं नया रास्ता (उपन्यास) के सभी अध्यायों के प्रामाणिक सारांश, चरित्र-चित्रण, अवतरण-आधारित प्रश्न (Reference to Context), मुहावरे एवं बोर्ड परीक्षा अभ्यास वर्कशीट।</p>
    <div class="seo-hero-meta">
      <span>📚 <strong>साहित्य सागर, एकांकी संचय व नया रास्ता</strong></span>
      <span>✍️ <strong>चरित्र-चित्रण एवं व्याख्या</strong></span>
      <span>🎯 <strong>ICSE Board Pattern</strong></span>
      <span>📄 <strong>अभ्यास पत्र उपलब्ध</strong></span>
    </div>
  </div>
</header>"""

    body_html = f"""<main class="seo-content-wrap">
  <div class="container">
    <section class="seo-section-card">
      <div class="seo-section-header">
        <span class="seo-section-icon">📖</span>
        <h2>आईसीएसई कक्षा 10 हिंदी साहित्य पाठ्यक्रम</h2>
      </div>
      <p style="font-size:1.05rem; line-height:1.75; color:#334155;">
        ICSE कक्षा 10 हिंदी साहित्य प्रश्न-पत्र में अवतरण-आधारित प्रश्नों (Reference to Context) का विशेष महत्व होता है। इसमें पात्रों के कथन का संदर्भ, वक्ता-श्रोता का संबंध, कहानी का उद्देश्य और पात्रों का चरित्र-चित्रण पूछा जाता है। EkShala पर इन सभी कहानियों व एकांकियों के विस्तृत नोट्स सटीक रूप से तैयार किए गए हैं:
      </p>
    </section>

    <!-- Syllabus & Marking Scheme Section -->
    <section class="seo-section-card" id="syllabus-marking-scheme" style="background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);">
      <div class="seo-section-header">
        <span class="seo-section-icon">📑</span>
        <h2>पाठ्यक्रम एवं अंक योजना (Syllabus &amp; Marking Scheme 2026-27)</h2>
      </div>
      <p style="font-size:1.02rem; line-height:1.75; color:#334155; margin-bottom:1.5rem;">
        ICSE बोर्ड परीक्षा 2026-27 के लिए कक्षा 10 सेकंड लैंग्वेज हिंदी का आधिकारिक पाठ्यक्रम प्रारूप एवं अंक वितरण (Paper Pattern &amp; Blueprint):
      </p>
      <div class="seo-grid" style="grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));">
        <!-- ICSE Syllabus Card -->
        <div style="background:#FFFFFF; border:1px solid #BAE6FD; border-radius:14px; padding:1.5rem; box-shadow:0 2px 10px rgba(14,165,233,0.06); display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
              <span style="background:#E0F2FE; color:#0284C7; font-size:0.75rem; font-weight:700; padding:4px 10px; border-radius:6px; text-transform:uppercase;">ICSE Official 2026-27</span>
              <span style="font-size:1.4rem;">📘</span>
            </div>
            <h3 style="font-size:1.2rem; font-weight:700; color:#0F172A; margin:0; font-family:'Plus Jakarta Sans','Inter','Noto Sans Devanagari',sans-serif;">ICSE Class 10 Hindi Syllabus 2026-27</h3>
          </div>
          <div style="display:flex; gap:0.6rem; flex-wrap:wrap; border-top:1px solid #F1F5F9; padding-top:1.15rem; margin-top:1.25rem;">
            <a href="/pdf/icse/class10/hindi/class_10_hindi_syllabus_icse.pdf" target="_blank" rel="noopener" class="btn btn-primary" style="flex:1; min-width:140px; justify-content:center; padding:0.6rem 0.85rem; font-size:0.86rem; border-radius:8px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              View Syllabus
            </a>
            <a href="/pdf/icse/class10/hindi/class_10_hindi_syllabus_icse.pdf" download="ICSE_Hindi_Class_10_Latest_Syllabus_2026.pdf" class="btn btn-outline" style="padding:0.6rem 0.75rem; font-size:0.86rem; border-radius:8px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:4px;" title="Download PDF">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              PDF
            </a>
            <a href="/documents/icse/class10/hindi/ICSE_Hindi_Class_10_Latest_Syllabus_2026.docx" download="ICSE_Hindi_Class_10_Latest_Syllabus_2026.docx" class="btn btn-outline" style="padding:0.6rem 0.75rem; font-size:0.86rem; border-radius:8px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:4px; color:#0284C7; border-color:#BAE6FD;" title="Download Word DOCX">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              DOCX
            </a>
          </div>
        </div>

        <!-- ICSE Marking Scheme Card -->
        <div style="background:#FFFFFF; border:1px solid #BBF7D0; border-radius:14px; padding:1.5rem; box-shadow:0 2px 10px rgba(22,163,74,0.06); display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
              <span style="background:#DCFCE7; color:#15803D; font-size:0.75rem; font-weight:700; padding:4px 10px; border-radius:6px; text-transform:uppercase;">Blueprint &amp; Marks Weightage</span>
              <span style="font-size:1.4rem;">📊</span>
            </div>
            <h3 style="font-size:1.2rem; font-weight:700; color:#0F172A; margin:0; font-family:'Plus Jakarta Sans','Inter','Noto Sans Devanagari',sans-serif;">ICSE Hindi Marking Scheme &amp; Blueprint</h3>
          </div>
          <div style="display:flex; gap:0.6rem; flex-wrap:wrap; border-top:1px solid #F1F5F9; padding-top:1.15rem; margin-top:1.25rem;">
            <a href="/pdf/icse/class10/hindi/class_10_hindi_marking_schema_icse.pdf" target="_blank" rel="noopener" class="btn btn-primary" style="flex:1; min-width:140px; justify-content:center; padding:0.6rem 0.85rem; font-size:0.86rem; border-radius:8px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:6px; background:#16A34A; border-color:#16A34A;">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              View Marking Scheme
            </a>
            <a href="/pdf/icse/class10/hindi/class_10_hindi_marking_schema_icse.pdf" download="ICSE_Class10_Hindi_Marks_Weightage.pdf" class="btn btn-outline" style="padding:0.6rem 0.75rem; font-size:0.86rem; border-radius:8px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:4px;" title="Download PDF">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              PDF
            </a>
            <a href="/documents/icse/class10/hindi/ICSE_Class10_Hindi_Marks_Weightage.docx" download="ICSE_Class10_Hindi_Marks_Weightage.docx" class="btn btn-outline" style="padding:0.6rem 0.75rem; font-size:0.86rem; border-radius:8px; font-weight:600; text-decoration:none; display:inline-flex; align-items:center; gap:4px; color:#16A34A; border-color:#BBF7D0;" title="Download Word DOCX">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              DOCX
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Sahitya Sagar Section -->
    <section class="seo-section-card">
      <div class="seo-section-header">
        <span class="seo-section-icon">📘</span>
        <h2>साहित्य सागर: गद्य खंड (Sahitya Sagar Prose)</h2>
      </div>
      <div class="seo-grid">
        {sahitya_cards}
      </div>
    </section>

    <!-- Ekanki Sanchay Section -->
    <section class="seo-section-card">
      <div class="seo-section-header">
        <span class="seo-section-icon">🎭</span>
        <h2>एकांकी संचय – एक-अंकी नाटक (Ekanki Sanchay)</h2>
      </div>
      <div class="seo-grid">
        {ekanki_cards}
      </div>
    </section>

    <!-- Naya Raasta Section -->
    <section class="seo-section-card">
      <div class="seo-section-header">
        <span class="seo-section-icon">📕</span>
        <h2>नया रास्ता – सामाजिक उपन्यास (Naya Raasta Novel by सुषमा अग्रवाल)</h2>
      </div>
      <div class="seo-grid">
        {naya_rasta_cards}
      </div>
    </section>

    <!-- Quick Links Grid -->
    <section class="seo-section-card">
      <div class="seo-section-header">
        <span class="seo-section-icon">⚡</span>
        <h2>अभ्यास वर्कशीट एवं व्याकरण (Related ICSE Resources)</h2>
      </div>
      <div class="seo-grid">
        <a href="/worksheets/" class="seo-card">
          <div>
            <span class="seo-card-badge">अभ्यास पत्र</span>
            <h3>ICSE Hindi Worksheets</h3>
            <p>ICSE मुहावरे एवं साहित्य सागर के विशेष अभ्यास प्रश्न-पत्र।</p>
          </div>
          <span class="seo-card-cta">वर्कशीट देखें &rarr;</span>
        </a>
        <a href="/hindi-grammar/muhavare/" class="seo-card">
          <div>
            <span class="seo-card-badge">व्याकरण</span>
            <h3>ICSE मुहावरे अभ्यास (6 सेट्स)</h3>
            <p>विगत वर्षों में पूछे गए महत्वपूर्ण मुहावरों का वाक्य प्रयोग सहित संकलन।</p>
          </div>
          <span class="seo-card-cta">मुहावरे पढ़ें &rarr;</span>
        </a>
        <a href="/worksheets/#icse-worksheets" class="seo-card">
          <div>
            <span class="seo-card-badge">अभ्यास पत्रक</span>
            <h3>ICSE अभ्यास वर्कशीट्स</h3>
            <p>साहित्य सागर और एकांकी संचय के अवतरण-आधारित अभ्यास प्रश्न-पत्र।</p>
          </div>
          <span class="seo-card-cta">वर्कशीट देखें &rarr;</span>
        </a>
      </div>
    </section>
  </div>
</main>"""

    full_page = get_common_head(seo_title, desc, canonical_url, json.dumps(schema_dict, ensure_ascii=False, indent=2))
    full_page += get_navbar(active_link='icse')
    full_page += breadcrumbs_html
    full_page += hero_html
    full_page += body_html
    full_page += get_footer()
    write_html_file(rel_dir, full_page)


# ==============================================================================
# 4. GENERATE WORKSHEETS HUB
# ==============================================================================
def generate_worksheets_hub():
    print("\n--- Generating Worksheets Hub ---")
    rel_dir = "worksheets"
    canonical_url = f"{BASE_URL}/{rel_dir}/"
    ALL_CANONICAL_URLS.append(canonical_url)

    seo_title = "Class 10 Hindi Worksheets | CBSE, ICSE & Grammar Practice Papers | EkShala"
    desc = "18 free Class 10 Hindi worksheets for CBSE, ICSE, and Hindi Grammar. Solved practice sheets, Muhavare, and Padbandh with instant online view and Word downloads."

    # Categorize worksheets into 3 distinct partitions
    cbse_keys = [
        ('WS_CBSE_10_01', 'अभ्यास पत्रक 1'),
        ('WS_CBSE_10_02', 'अभ्यास पत्रक 2'),
        ('WS_CBSE_10_03', 'अभ्यास पत्रक 3'),
        ('WS_CBSE_10_04', 'अभ्यास पत्रक 4'),
    ]

    icse_keys = [
        ('WS_ICSE_10_01', 'ICSE अभ्यास 1'),
        ('WS_ICSE_10_02', 'ICSE अभ्यास 2')
    ]

    grammar_keys = [
        ('WS_CBSE_10_MUH_01', 'CBSE मुहावरे 1'),
        ('WS_CBSE_10_MUH_01_ANS', 'उत्तर कुंजी (Key)'),
        ('WS_CBSE_10_MUH_02', 'CBSE मुहावरे 2'),
        ('WS_CBSE_10_MUH_02_ANS', 'उत्तर कुंजी (Key)'),
        ('WS_CBSE_10_PAD_01', 'CBSE पदबंध 1'),
        ('WS_CBSE_10_PAD_02', 'CBSE पदबंध 2'),
        ('WS_ICSE_10_MUH_01', 'ICSE मुहावरे 1'),
        ('WS_ICSE_10_MUH_02', 'ICSE मुहावरे 2'),
        ('WS_ICSE_10_MUH_03', 'ICSE मुहावरे 3'),
        ('WS_ICSE_10_MUH_04', 'ICSE मुहावरे 4'),
        ('WS_ICSE_10_MUH_05', 'ICSE मुहावरे 5'),
        ('WS_ICSE_10_MUH_06', 'ICSE मुहावरे 6')
    ]

    def render_card(k, badge_category):
        v = WORKSHEETS_DATA.get(k, {})
        title = v.get('title', k)
        safe_title = title.replace("'", "\\'").replace('"', '&quot;')
        subtitle = v.get('subtitle', '')
        marks = v.get('marks', '40 Marks')
        time_limit = v.get('time', '60 Mins')
        file_url = v.get('file_url', '')
        safe_url = file_url.replace("'", "\\'")
        is_ans_key = 'ANS' in k

        badge_bg = '#DCFCE7' if is_ans_key else '#EFF6FF'
        badge_color = '#15803D' if is_ans_key else '#1D4ED8'
        badge_border = '#BBF7D0' if is_ans_key else '#BFDBFE'

        return f"""<div class="seo-card ws-card" id="card-{k}" style="background:#FFFFFF; border-radius:16px; border:1px solid #E2E8F0; padding:1.4rem; display:flex; flex-direction:column; justify-content:space-between; box-shadow:0 3px 12px rgba(15,43,72,0.03); transition:transform 0.2s, box-shadow 0.2s;">
  <div>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.65rem; gap:0.5rem; flex-wrap:wrap;">
      <span class="seo-card-badge" style="background:{badge_bg}; color:{badge_color}; font-weight:700; border:1px solid {badge_border}; font-size:0.76rem; padding:3px 10px; border-radius:50px; margin-bottom:0;">{marks} &bull; {time_limit}</span>
      <span style="font-size:0.74rem; font-weight:700; color:#475569; background:#F1F5F9; padding:3px 9px; border-radius:6px;">{badge_category}</span>
    </div>
    <h3 style="font-size:1.15rem; font-weight:700; color:#0F172A; margin:0.4rem 0 0.45rem; line-height:1.4; font-family:'Plus Jakarta Sans','Inter','Noto Sans Devanagari',sans-serif;">{title}</h3>
    <p style="font-size:0.88rem; color:#64748B; line-height:1.6; margin:0 0 1.15rem;">{subtitle}</p>
  </div>
  <div style="display:flex; flex-direction:column; gap:0.55rem; border-top:1px solid #F1F5F9; padding-top:0.85rem;">
    <div style="display:flex; gap:0.5rem;">
      <button class="btn btn-primary" onclick="openWorksheetViewer('{k}', '{safe_title}', '{safe_url}')" style="flex:1; padding:0.55rem 0.9rem; font-size:0.88rem; border-radius:8px; display:inline-flex; align-items:center; justify-content:center; gap:0.4rem; font-weight:700; cursor:pointer;">
        👁️ हल करें (View)
      </button>
      {f'<a href="{file_url}" download class="btn btn-outline" style="padding:0.55rem 0.9rem; font-size:0.88rem; border-radius:8px; display:inline-flex; align-items:center; justify-content:center; gap:0.4rem; font-weight:600; text-decoration:none;" title="Download Word Document">📥 DOCX</a>' if file_url else ''}
    </div>
    <button class="btn btn-ghost" onclick="openUploadModal('{k}', '{safe_title}')" style="width:100%; padding:0.5rem 0.75rem; font-size:0.82rem; border-radius:8px; border:1px dashed #CBD5E1; color:#1E3A5F; background:#F8FAFC; display:inline-flex; align-items:center; justify-content:center; gap:0.4rem; font-weight:600; cursor:pointer;">
      📤 उत्तर पुस्तिका सबमिट करें (Evaluation)
    </button>
  </div>
</div>"""

    cbse_cards = [render_card(k, cat) for k, cat in cbse_keys]
    icse_cards = [render_card(k, cat) for k, cat in icse_keys]
    grammar_cards = [render_card(k, cat) for k, cat in grammar_keys]

    schema_dict = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "होम", "item": f"{BASE_URL}/" },
                    { "@type": "ListItem", "position": 2, "name": "Worksheets", "item": canonical_url }
                ]
            },
            {
                "@type": "Course",
                "name": "Class 10 Hindi Practice Worksheets & Mock Papers",
                "description": desc,
                "provider": { "@type": "Organization", "name": "EkShala", "url": BASE_URL }
            }
        ]
    }

    breadcrumbs_html = f"""<div class="seo-breadcrumb-bar">
  <div class="container">
    <ol class="seo-breadcrumbs" itemscope itemtype="https://schema.org/BreadcrumbList">
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a href="/" itemprop="item"><span itemprop="name">होम</span></a>
        <meta itemprop="position" content="1" />
      </li>
      <li class="sep">&rsaquo;</li>
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span class="current" itemprop="name">Worksheets (अभ्यास पत्रक)</span>
        <meta itemprop="position" content="2" />
      </li>
    </ol>
  </div>
</div>"""

    hero_html = f"""<header class="seo-hero">
  <div class="container">
    <span class="seo-hero-badge">CBSE &bull; ICSE &bull; व्याकरण खंड &bull; 20 Worksheets</span>
    <h1>Class 10 Hindi Practice Worksheets</h1>
    <p class="lead">कक्षा 10 हिंदी (सीबीएसई एवं आईसीएसई) के सभी 20 उच्च-गुणवत्ता वाले अभ्यास पत्रक। अब 3 अलग-अलग पार्टिशन्स में उपलब्ध: ऑनलाइन हल करें, Word फ़ाइल डाउनलोड करें और उत्तर पुस्तिका सबमिट करके मेंटर मूल्यांकन प्राप्त करें।</p>
    <div class="seo-hero-meta">
      <span>📘 <strong>6 CBSE Worksheets</strong></span>
      <span>📗 <strong>2 ICSE Worksheets</strong></span>
      <span>📙 <strong>12 Grammar Worksheets</strong></span>
      <span>✓ <strong>उत्तर कुंजी व शिक्षक मूल्यांकन</strong></span>
    </div>
  </div>
</header>"""

    body_html = f"""<main class="seo-content-wrap">
  <div class="container">
    <!-- Partition Switcher Toolbar -->
    <div class="ws-partition-nav" style="display:flex; gap:0.6rem; justify-content:center; flex-wrap:wrap; margin-bottom:2.25rem; position:sticky; top:70px; z-index:40; background:#FFFFFF; padding:0.85rem 1.25rem; border-radius:100px; box-shadow:0 4px 16px rgba(15,43,72,0.06); border:1px solid #E2E8F0; width:fit-content; margin-left:auto; margin-right:auto;">
      <button class="ws-partition-btn active" data-partition="all" onclick="filterPartition('all')" style="display:inline-flex; align-items:center; gap:0.4rem; padding:0.5rem 1.25rem; border-radius:100px; font-weight:700; font-size:0.88rem; cursor:pointer; border:1.5px solid #3A7BD5; background:#3A7BD5; color:#FFFFFF; transition:all 0.2s;">
        <span>🌟 All Worksheets</span> <span style="background:rgba(255,255,255,0.25); padding:0.1rem 0.5rem; border-radius:50px; font-size:0.75rem;">20</span>
      </button>
      <button class="ws-partition-btn" data-partition="cbse" onclick="filterPartition('cbse')" style="display:inline-flex; align-items:center; gap:0.4rem; padding:0.5rem 1.25rem; border-radius:100px; font-weight:600; font-size:0.88rem; cursor:pointer; border:1.5px solid #DCE7F3; background:#FFFFFF; color:#1E3A5F; transition:all 0.2s;">
        <span>📘 CBSE Worksheets</span> <span style="background:#EBF3FD; color:#156082; padding:0.1rem 0.5rem; border-radius:50px; font-size:0.75rem; font-weight:700;">6</span>
      </button>
      <button class="ws-partition-btn" data-partition="icse" onclick="filterPartition('icse')" style="display:inline-flex; align-items:center; gap:0.4rem; padding:0.5rem 1.25rem; border-radius:100px; font-weight:600; font-size:0.88rem; cursor:pointer; border:1.5px solid #DCE7F3; background:#FFFFFF; color:#1E3A5F; transition:all 0.2s;">
        <span>📗 ICSE Worksheets</span> <span style="background:#EBF3FD; color:#156082; padding:0.1rem 0.5rem; border-radius:50px; font-size:0.75rem; font-weight:700;">2</span>
      </button>
      <button class="ws-partition-btn" data-partition="grammar" onclick="filterPartition('grammar')" style="display:inline-flex; align-items:center; gap:0.4rem; padding:0.5rem 1.25rem; border-radius:100px; font-weight:600; font-size:0.88rem; cursor:pointer; border:1.5px solid #DCE7F3; background:#FFFFFF; color:#1E3A5F; transition:all 0.2s;">
        <span>📙 Grammar Worksheets (व्याकरण)</span> <span style="background:#EBF3FD; color:#156082; padding:0.1rem 0.5rem; border-radius:50px; font-size:0.75rem; font-weight:700;">12</span>
      </button>
    </div>

    <!-- PARTITION 1: CBSE Worksheets -->
    <section class="seo-section-card ws-partition-block" id="cbse-worksheets" data-partition="cbse" style="margin-bottom:2.5rem; scroll-margin-top:140px;">
      <div class="seo-section-header" style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <span style="width:40px; height:40px; border-radius:10px; background:#EFF6FF; color:#2563EB; display:flex; align-items:center; justify-content:center; font-size:1.4rem;">📘</span>
          <div>
            <h2 style="font-size:1.4rem; font-weight:800; color:#0F172A; margin:0;">CBSE Class 10 Hindi Worksheets</h2>
            <p style="color:#64748B; font-size:0.88rem; margin:0.25rem 0 0;">स्पर्श भाग-2, संचयन भाग-2 एवं विगत वर्षों के बोर्ड परीक्षा प्रश्नों पर आधारित 6 अभ्यास प्रश्न-पत्र।</p>
          </div>
        </div>
        <span style="background:#EFF6FF; color:#1D4ED8; font-size:0.8rem; font-weight:700; padding:0.35rem 0.9rem; border-radius:50px; border:1px solid #BFDBFE;">
          6 Worksheets Active
        </span>
      </div>
      <div class="seo-grid">
        {"".join(cbse_cards)}
      </div>
    </section>

    <!-- PARTITION 2: ICSE Worksheets -->
    <section class="seo-section-card ws-partition-block" id="icse-worksheets" data-partition="icse" style="margin-bottom:2.5rem; scroll-margin-top:140px;">
      <div class="seo-section-header" style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <span style="width:40px; height:40px; border-radius:10px; background:#F0FDF4; color:#16A34A; display:flex; align-items:center; justify-content:center; font-size:1.4rem;">📗</span>
          <div>
            <h2 style="font-size:1.4rem; font-weight:800; color:#0F172A; margin:0;">ICSE Class 10 Hindi Worksheets</h2>
            <p style="color:#64748B; font-size:0.88rem; margin:0.25rem 0 0;">साहित्य सागर (गद्य व पद्य खंड) एवं एकांकी संचय के अवतरण-आधारित प्रश्न (RTC) एवं संपूर्ण अभ्यास पत्र।</p>
          </div>
        </div>
        <span style="background:#F0FDF4; color:#15803D; font-size:0.8rem; font-weight:700; padding:0.35rem 0.9rem; border-radius:50px; border:1px solid #BBF7D0;">
          2 Worksheets Active
        </span>
      </div>
      <div class="seo-grid">
        {"".join(icse_cards)}
      </div>
    </section>

    <!-- PARTITION 3: Grammar Worksheets -->
    <section class="seo-section-card ws-partition-block" id="grammar-worksheets" data-partition="grammar" style="margin-bottom:2.5rem; scroll-margin-top:140px;">
      <div class="seo-section-header" style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
        <div style="display:flex; align-items:center; gap:0.75rem;">
          <span style="width:40px; height:40px; border-radius:10px; background:#FEF3C7; color:#D97706; display:flex; align-items:center; justify-content:center; font-size:1.4rem;">📙</span>
          <div>
            <h2 style="font-size:1.4rem; font-weight:800; color:#0F172A; margin:0;">Class 10 Hindi Grammar Worksheets (व्याकरण कार्यपत्रिकाएँ)</h2>
            <p style="color:#64748B; font-size:0.88rem; margin:0.25rem 0 0;">मुहावरे (10 अभ्यास पत्रक + व्याख्या सहित उत्तर कुंजियाँ) एवं पदबंध (2 अभ्यास पत्रक) के संपूर्ण 40-40 अंकों के पत्र।</p>
          </div>
        </div>
        <span style="background:#FEF3C7; color:#B45309; font-size:0.8rem; font-weight:700; padding:0.35rem 0.9rem; border-radius:50px; border:1px solid #FDE68A;">
          12 Worksheets Active
        </span>
      </div>
      <div class="seo-grid">
        {"".join(grammar_cards)}
      </div>
    </section>
  </div>
</main>"""

    upload_modal_html = """
<!-- Upload Answer Sheet Modal -->
<div class="modal-overlay" id="upload-modal" role="dialog" aria-modal="true" aria-labelledby="upload-modal-title" hidden>
  <div class="modal-box upload-modal-box">
    <div class="modal-header">
      <h3 id="upload-modal-title">Upload Answer Sheet</h3>
      <button class="modal-close-btn" id="upload-modal-close" aria-label="Close upload">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <p class="upload-subtitle" id="upload-for-label">Upload your completed answer sheet for evaluation.</p>
    <label class="upload-drop-area" id="upload-drop-area" for="answer-file-input">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
      <span class="drop-text">Drag &amp; drop your PDF here</span>
      <span class="drop-subtext">or click to browse (PDF, JPG, PNG)</span>
      <input type="file" id="answer-file-input" accept=".pdf,.jpg,.jpeg,.png" aria-label="Choose answer sheet file" />
    </label>
    <div class="upload-file-selected" id="upload-file-selected" hidden>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      <span id="upload-filename">filename.pdf</span>
      <button class="remove-file" id="remove-file" aria-label="Remove selected file">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div style="margin: 0.85rem 0; display: flex; flex-direction: column; gap: 0.5rem;">
      <input type="text" id="upload-student-name" placeholder="विद्यार्थी का नाम (Student Name) *" style="width:100%; padding:0.65rem 0.85rem; border:1px solid #CBD5E1; border-radius:8px; font-size:0.9rem;" required />
      <input type="text" id="upload-student-contact" placeholder="फ़ोन नंबर या ईमेल (Phone / Email for Feedback)" style="width:100%; padding:0.65rem 0.85rem; border:1px solid #CBD5E1; border-radius:8px; font-size:0.9rem;" />
    </div>
    <button class="btn btn-primary upload-submit-btn" id="upload-submit-btn" disabled>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
      Submit for Evaluation
    </button>
    <p class="upload-note">We will evaluate your answers and share feedback within 48 hours via email or WhatsApp.</p>
    <p class="upload-success" id="upload-success" role="status"></p>
  </div>
</div>
"""

    extra_scripts = """
<script src="/script.js?v=108.0.0"></script>
<script>
function filterPartition(p) {
  document.querySelectorAll('.ws-partition-btn').forEach(function(btn) {
    var active = btn.dataset.partition === p;
    btn.classList.toggle('active', active);
    btn.style.background = active ? '#3A7BD5' : '#FFFFFF';
    btn.style.color = active ? '#FFFFFF' : '#1E3A5F';
    btn.style.borderColor = active ? '#3A7BD5' : '#DCE7F3';
    btn.style.boxShadow = active ? '0 3px 10px rgba(58,123,213,0.25)' : 'none';
  });

  document.querySelectorAll('.ws-partition-block').forEach(function(sec) {
    if (p === 'all' || sec.dataset.partition === p) {
      sec.style.display = 'block';
    } else {
      sec.style.display = 'none';
    }
  });

  if (p !== 'all') {
    var target = document.getElementById(p + '-worksheets');
    if (target) {
      var navOffset = 135;
      var top = target.getBoundingClientRect().top + window.pageYOffset - navOffset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  }
}
window.filterPartition = filterPartition;

document.addEventListener('DOMContentLoaded', function() {
  var hash = window.location.hash.replace('#', '').replace('-worksheets', '');
  if (['cbse', 'icse', 'grammar'].indexOf(hash) !== -1) {
    filterPartition(hash);
  }
});
</script>
"""

    full_page = get_common_head(seo_title, desc, canonical_url, json.dumps(schema_dict, ensure_ascii=False, indent=2))
    full_page += get_navbar(active_link='worksheets')
    full_page += breadcrumbs_html
    full_page += hero_html
    full_page += body_html
    full_page += get_footer(extra_html=upload_modal_html, extra_scripts=extra_scripts)
    write_html_file(rel_dir, full_page)



# ==============================================================================
# 5. GENERATE HINDI GRAMMAR HUB & TOPIC PAGES
# ==============================================================================
def generate_grammar_pages():
    print("\n--- Generating Hindi Grammar Hub & Topic Pages ---")
    
    # Hub
    rel_dir = "hindi-grammar"
    canonical_url = f"{BASE_URL}/{rel_dir}/"
    ALL_CANONICAL_URLS.append(canonical_url)

    seo_title = "Class 10 Hindi Grammar | Notes, Practice & Worksheets | EkShala"
    desc = "Class 10 Hindi Grammar (व्याकरण) study material for CBSE and ICSE boards. Detailed notes, rules, and practice worksheets for Muhavare (मुहावरे) and Padbandh (पदबंध)."

    schema_dict = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "होम", "item": f"{BASE_URL}/" },
                    { "@type": "ListItem", "position": 2, "name": "Hindi Grammar", "item": canonical_url }
                ]
            },
            {
                "@type": "Course",
                "name": "Class 10 Hindi Grammar (हिंदी व्याकरण)",
                "description": desc,
                "provider": { "@type": "Organization", "name": "EkShala", "url": BASE_URL }
            }
        ]
    }

    breadcrumbs_html = f"""<div class="seo-breadcrumb-bar">
  <div class="container">
    <ol class="seo-breadcrumbs" itemscope itemtype="https://schema.org/BreadcrumbList">
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <a href="/" itemprop="item"><span itemprop="name">होम</span></a>
        <meta itemprop="position" content="1" />
      </li>
      <li class="sep">&rsaquo;</li>
      <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
        <span class="current" itemprop="name">हिंदी व्याकरण (Hindi Grammar)</span>
        <meta itemprop="position" content="2" />
      </li>
    </ol>
  </div>
</div>"""

    hero_html = f"""<header class="seo-hero">
  <div class="container">
    <span class="seo-hero-badge">CBSE &bull; ICSE &bull; कक्षा 10 व्याकरण</span>
    <h1>Class 10 Hindi Grammar (हिंदी व्याकरण)</h1>
    <p class="lead">कक्षा 10 बोर्ड परीक्षा के लिए संपूर्ण हिंदी व्याकरण: मुहावरे, पदबंध, समास, वाक्य रूपांतरण और अभ्यास प्रश्न-पत्र। 16 में से 16 अंक सुनिश्चित करने के लिए प्रामाणिक नियम एवं उदाहरण।</p>
    <div class="seo-hero-meta">
      <span>📖 <strong>मुहावरे (Muhavare)</strong></span>
      <span>🔗 <strong>पदबंध (Padbandh)</strong></span>
      <span>📄 <strong>अभ्यास वर्कशीट एवं उत्तर कुंजी</strong></span>
      <span>🎯 <strong>100% बोर्ड आधारित</strong></span>
    </div>
  </div>
</header>"""

    body_html = f"""<main class="seo-content-wrap">
  <div class="container">
    <section class="seo-section-card">
      <div class="seo-section-header">
        <span class="seo-section-icon">📖</span>
        <h2>व्याकरण विषय एवं विस्तृत अभ्यास (Grammar Topics)</h2>
      </div>
      <div class="seo-grid">
        <a href="/hindi-grammar/muhavare/" class="seo-card">
          <div>
            <span class="seo-card-badge">विषय 1 &bull; 4 अंक</span>
            <h3>मुहावरे (Muhavare)</h3>
            <p>स्पर्श, साखी, बड़े भाई साहब आदि से जुड़े महत्वपूर्ण मुहावरों का अर्थ, वाक्य प्रयोग एवं बहुविकल्पीय प्रश्न (MCQs)।</p>
          </div>
          <span class="seo-card-cta">मुहावरे पढ़ें &rarr;</span>
        </a>

        <a href="/hindi-grammar/padbandh/" class="seo-card">
          <div>
            <span class="seo-card-badge">विषय 2 &bull; 4 अंक</span>
            <h3>पदबंध (Padbandh)</h3>
            <p>संज्ञा, सर्वनाम, विशेषण, क्रिया एवं क्रियाविशेषण पदबंध के नियम, पहचान की विधियां एवं 80+ अभ्यास प्रश्न।</p>
          </div>
          <span class="seo-card-cta">पदबंध पढ़ें &rarr;</span>
        </a>

        <a href="/worksheets/" class="seo-card">
          <div>
            <span class="seo-card-badge">वर्कशीट</span>
            <h3>व्याकरण अभ्यास प्रश्न-पत्र</h3>
            <p>मुहावरे और पदबंध की हल सहित 40-40 अंकों की मॉडल टेस्ट शीट्स।</p>
          </div>
          <span class="seo-card-cta">वर्कशीट हल करें &rarr;</span>
        </a>
      </div>
    </section>
  </div>
</main>"""

    full_page = get_common_head(seo_title, desc, canonical_url, json.dumps(schema_dict, ensure_ascii=False, indent=2))
    full_page += get_navbar(active_link='grammar')
    full_page += breadcrumbs_html
    full_page += hero_html
    full_page += body_html
    full_page += get_footer()
    write_html_file(rel_dir, full_page)

    # Topic 1: Muhavare
    rel_dir_muh = "hindi-grammar/muhavare"
    can_muh = f"{BASE_URL}/{rel_dir_muh}/"
    ALL_CANONICAL_URLS.append(can_muh)
    
    # Extract muhavare content from worksheets
    ws_muh_1 = WORKSHEETS_DATA.get('WS_CBSE_10_MUH_01', {}).get('html', '')
    ws_muh_ans = WORKSHEETS_DATA.get('WS_CBSE_10_MUH_01_ANS', {}).get('html', '')

    muh_page = get_common_head("Class 10 Hindi Muhavare (मुहावरे) | अर्थ, वाक्य प्रयोग एवं अभ्यास | EkShala", 
        "Class 10 Hindi Muhavare (मुहावरे) notes, important list with meanings and sentences, CBSE & ICSE board practice worksheets and questions.", 
        can_muh, json.dumps({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Class 10 Hindi Muhavare Notes & Practice Worksheets",
            "description": "Comprehensive list and practice exercises for Hindi Muhavare for Class 10 board exams.",
            "mainEntityOfPage": can_muh,
            "inLanguage": "hi"
        }))
    muh_page += get_navbar(active_link='grammar')
    muh_page += f"""<div class="seo-breadcrumb-bar"><div class="container">
  <ol class="seo-breadcrumbs"><li itemprop="itemListElement"><a href="/">होम</a></li><li class="sep">&rsaquo;</li><li><a href="/hindi-grammar/">हिंदी व्याकरण</a></li><li class="sep">&rsaquo;</li><li class="current">मुहावरे (Muhavare)</li></ol>
</div></div>
<header class="seo-hero"><div class="container">
  <span class="seo-hero-badge">व्याकरण &bull; 4 अंक अनिवार्य</span>
  <h1>Class 10 Hindi मुहावरे (Muhavare)</h1>
  <p class="lead">पाठ्यपुस्तक आधारित सभी महत्वपूर्ण मुहावरों का अर्थ, वाक्य प्रयोग, बोर्ड परीक्षा में पूछे जाने वाले प्रश्न एवं अभ्यास पत्र।</p>
</div></header>
<main class="seo-content-wrap"><div class="container">
  <section class="seo-section-card">
    <div class="seo-section-header"><span class="seo-section-icon">📖</span><h2>मुहावरे अभ्यास प्रश्न-पत्र (40 अंक)</h2></div>
    {ws_muh_1}
  </section>
  <section class="seo-section-card">
    <div class="seo-section-header"><span class="seo-section-icon">✓</span><h2>उत्तर कुंजी एवं व्याख्या सहित स्पष्टीकरण (Answer Key)</h2></div>
    {ws_muh_ans}
  </section>
</div></main>"""
    muh_page += get_footer()
    write_html_file(rel_dir_muh, muh_page)

    # Topic 2: Padbandh
    rel_dir_pad = "hindi-grammar/padbandh"
    can_pad = f"{BASE_URL}/{rel_dir_pad}/"
    ALL_CANONICAL_URLS.append(can_pad)
    
    ws_pad_1 = WORKSHEETS_DATA.get('WS_CBSE_10_PAD_01', {}).get('html', '')
    ws_pad_2 = WORKSHEETS_DATA.get('WS_CBSE_10_PAD_02', {}).get('html', '')

    pad_page = get_common_head("Class 10 Hindi Padbandh (पदबंध) | भेद, नियम एवं अभ्यास प्रश्न | EkShala",
        "Class 10 Hindi Padbandh (पदबंध) notes, types (संज्ञा, सर्वनाम, विशेषण, क्रिया, क्रियाविशेषण), identification rules and practice worksheets.",
        can_pad, json.dumps({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Class 10 Hindi Padbandh Rules, Notes & Worksheets",
            "description": "Rules, examples, and worksheets for Padbandh in Class 10 Hindi.",
            "mainEntityOfPage": can_pad,
            "inLanguage": "hi"
        }))
    pad_page += get_navbar(active_link='grammar')
    pad_page += f"""<div class="seo-breadcrumb-bar"><div class="container">
  <ol class="seo-breadcrumbs"><li itemprop="itemListElement"><a href="/">होम</a></li><li class="sep">&rsaquo;</li><li><a href="/hindi-grammar/">हिंदी व्याकरण</a></li><li class="sep">&rsaquo;</li><li class="current">पदबंध (Padbandh)</li></ol>
</div></div>
<header class="seo-hero"><div class="container">
  <span class="seo-hero-badge">व्याकरण &bull; 4 अंक अनिवार्य</span>
  <h1>Class 10 Hindi पदबंध (Padbandh)</h1>
  <p class="lead">पदबंध के पांचों भेदों (संज्ञा, सर्वनाम, विशेषण, क्रिया, क्रियाविशेषण पदबंध) के नियम, पहचानने की आसान ट्रिक्स और अभ्यास प्रश्न-पत्र।</p>
</div></header>
<main class="seo-content-wrap"><div class="container">
  <section class="seo-section-card">
    <div class="seo-section-header"><span class="seo-section-icon">🔗</span><h2>पदबंध अभ्यास प्रश्न-पत्र 1 (40 अंक)</h2></div>
    {ws_pad_1}
  </section>
  <section class="seo-section-card">
    <div class="seo-section-header"><span class="seo-section-icon">📝</span><h2>पदबंध अभ्यास प्रश्न-पत्र 2 (40 अंक)</h2></div>
    {ws_pad_2}
  </section>
</div></main>"""
    pad_page += get_footer()
    write_html_file(rel_dir_pad, pad_page)


# ==============================================================================

# ==============================================================================
# 7. GENERATE TRUST & LEGAL PAGES (About, Contact, Privacy, Terms, 404)
# ==============================================================================
def generate_trust_and_legal_pages():
    print("\n--- Generating Trust & Legal Pages ---")

    # About Page
    can_about = f"{BASE_URL}/about/"
    ALL_CANONICAL_URLS.append(can_about)
    about_page = get_common_head("About EkShala | Empowering Class 10 Hindi Students Across India",
        "Learn about EkShala's mission to provide 100% free, high-quality Class 10 Hindi study material, worksheets, and personal mentor guidance for CBSE & ICSE boards.",
        can_about, json.dumps({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About EkShala",
            "description": "About EkShala Educational Platform",
            "mainEntityOfPage": can_about
        }))
    about_page += get_navbar(active_link='about')
    about_page += f"""<div class="seo-breadcrumb-bar"><div class="container">
  <ol class="seo-breadcrumbs"><li><a href="/">होम</a></li><li class="sep">&rsaquo;</li><li class="current">About Us</li></ol>
</div></div>
<header class="seo-hero"><div class="container">
  <span class="seo-hero-badge">Our Educational Mission</span>
  <h1>About EkShala (एकशाला)</h1>
  <p class="lead">Empowering Class 10 students across India with completely free, ad-free, high-quality Hindi literature and grammar resources, curated by dedicated educators.</p>
</div></header>
<main class="seo-content-wrap"><div class="container">
  <section class="seo-section-card">
    <div class="seo-section-header"><span class="seo-section-icon">🎯</span><h2>Our Vision &amp; Pedagogy</h2></div>
    <p style="font-size:1.05rem; line-height:1.8; color:#334155;">
      EkShala was founded with a singular purpose: to make Hindi learning intuitive, engaging, and deeply fulfilling for secondary school students. Hindi is often seen as a scoring yet challenging subject due to strict spelling standards, complex literary expressions, and subjective evaluation. EkShala bridges this gap by offering:
    </p>
    <ul style="font-size:1.02rem; line-height:1.8; color:#334155; margin-left:1.5rem;">
      <li><strong>Authentic NCERT &amp; ICSE Alignment:</strong> Word-by-word fidelity to board curriculum (Sparsh, Sanchayan, Sahitya Sagar, Ekanki Sanchay).</li>
      <li><strong>Structured Learning:</strong> Chapter summary, word meanings, revision notes, competency questions, and practice worksheets in one cohesive flow.</li>
      <li><strong>100% Free Access:</strong> No hidden paywalls, subscriptions, or intrusive advertisements.</li>
      <li><strong>Mentor Feedback:</strong> Direct answer evaluation and guidance from experienced Hindi educators.</li>
    </ul>
  </section>
</div></main>"""
    about_page += get_footer()
    write_html_file("about", about_page)

    # Contact Page
    can_contact = f"{BASE_URL}/contact/"
    ALL_CANONICAL_URLS.append(can_contact)
    contact_page = get_common_head("Contact EkShala | Mentor Support & Student Guidance",
        "Get in touch with EkShala mentors for Class 10 Hindi guidance, answer evaluation, worksheet feedback, or technical queries.",
        can_contact, json.dumps({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            "name": "Contact EkShala",
            "mainEntityOfPage": can_contact
        }))
    contact_page += get_navbar(active_link='contact')
    contact_page += f"""<div class="seo-breadcrumb-bar"><div class="container">
  <ol class="seo-breadcrumbs"><li><a href="/">होम</a></li><li class="sep">&rsaquo;</li><li class="current">Contact Us</li></ol>
</div></div>
<header class="seo-hero"><div class="container">
  <span class="seo-hero-badge">We're Here to Help</span>
  <h1>Contact EkShala</h1>
  <p class="lead">Have a doubt in a chapter? Need answer sheet feedback? Reach out to our dedicated Hindi academic mentors.</p>
</div></header>
<main class="seo-content-wrap"><div class="container">
  <section class="seo-section-card" style="max-width:800px; margin:0 auto;">
    <div class="seo-section-header"><span class="seo-section-icon">💬</span><h2>Get in Touch with Our Mentors</h2></div>
    <div style="font-size:1.05rem; line-height:1.8; color:#334155;">
      <p><strong>Email:</strong> <a href="mailto:ektaverma09.work@gmail.com" style="color:#156082;">ektaverma09.work@gmail.com</a></p>
      <p><strong>WhatsApp / Helpline:</strong> <a href="tel:+919972247410" style="color:#156082;">+91-99722-47410</a></p>
      <p><strong>Address:</strong> EkShala Academic Resource Center, Bangalore, Karnataka, India</p>
      <p><strong>Working Hours:</strong> Monday – Saturday: 9:00 AM – 7:00 PM IST</p>
      <div style="margin-top:2rem; padding:1.5rem; background:#F8FAFC; border-radius:12px; border:1px solid #E2E8F0;">
        <h3 style="font-size:1.15rem; margin-top:0;">Need Answer Sheet Evaluation?</h3>
        <p style="margin-bottom:1rem; font-size:0.95rem; color:#64748B;">Upload your solved worksheet through the student portal, and our teachers will evaluate your answers within 48 hours.</p>
        <a href="/login.html" class="btn btn-primary" style="padding:0.6rem 1.25rem;">Go to Student Portal &rarr;</a>
      </div>
    </div>
  </section>
</div></main>"""
    contact_page += get_footer()
    write_html_file("contact", contact_page)

    # Privacy Policy
    can_privacy = f"{BASE_URL}/privacy-policy/"
    ALL_CANONICAL_URLS.append(can_privacy)
    priv_page = get_common_head("Privacy Policy | EkShala",
        "EkShala student privacy policy: How we collect, safeguard, and respect student and parent data.",
        can_privacy, json.dumps({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Privacy Policy"
        }))
    priv_page += get_navbar()
    priv_page += f"""<div class="seo-breadcrumb-bar"><div class="container">
  <ol class="seo-breadcrumbs"><li><a href="/">होम</a></li><li class="sep">&rsaquo;</li><li class="current">Privacy Policy</li></ol>
</div></div>
<header class="seo-hero"><div class="container">
  <h1>Privacy Policy</h1>
  <p class="lead">Your privacy is fundamental to our educational mission. Read how EkShala safeguards student information.</p>
</div></header>
<main class="seo-content-wrap"><div class="container">
  <section class="seo-section-card" style="max-width:860px; margin:0 auto; line-height:1.8; color:#334155;">
    <h2>1. Student Data Protection</h2>
    <p>EkShala is designed for school students. We strictly minimize data collection. We only collect names, phone numbers, or email addresses when voluntarily submitted for mentor feedback, answer sheet review, or account creation.</p>
    <h2>2. Non-Commercialization of Data</h2>
    <p>We do NOT sell, rent, monetize, or share student personal information, answer sheets, or contact data with any third-party advertisers or commercial entities.</p>
    <h2>3. Search Engine Safety</h2>
    <p>All private student records, submissions, passwords, and evaluation reports are protected by authentication and strictly configured with <code>noindex</code> directives, ensuring search engines never index private student data.</p>
    <h2>4. Contact</h2>
    <p>For any privacy inquiries, please contact our data grievance officer at <a href="mailto:ektaverma09.work@gmail.com">ektaverma09.work@gmail.com</a>.</p>
  </section>
</div></main>"""
    priv_page += get_footer()
    write_html_file("privacy-policy", priv_page)

    # Terms and Conditions
    can_terms = f"{BASE_URL}/terms-and-conditions/"
    ALL_CANONICAL_URLS.append(can_terms)
    terms_page = get_common_head("Terms and Conditions | EkShala",
        "Terms and conditions for using EkShala free educational resources, worksheets, and study material.",
        can_terms, json.dumps({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Terms and Conditions"
        }))
    terms_page += get_navbar()
    terms_page += f"""<div class="seo-breadcrumb-bar"><div class="container">
  <ol class="seo-breadcrumbs"><li><a href="/">होम</a></li><li class="sep">&rsaquo;</li><li class="current">Terms &amp; Conditions</li></ol>
</div></div>
<header class="seo-hero"><div class="container">
  <h1>Terms and Conditions</h1>
  <p class="lead">Rules and guidelines for accessing EkShala educational materials.</p>
</div></header>
<main class="seo-content-wrap"><div class="container">
  <section class="seo-section-card" style="max-width:860px; margin:0 auto; line-height:1.8; color:#334155;">
    <h2>1. Educational Use Only</h2>
    <p>All study materials, summaries, notes, worksheets, and sample papers available on EkShala are provided solely for non-commercial personal education and board examination preparation.</p>
    <h2>2. Intellectual Property</h2>
    <p>Content created by EkShala is copyrighted. Students and teachers may download and print worksheets for personal classroom study, but unauthorized commercial republication or resale is strictly prohibited.</p>
    <h2>3. Accuracy &amp; Board Syllabi</h2>
    <p>We strive to keep all materials aligned with the latest CBSE and ICSE syllabus guidelines for Class 10 Hindi.</p>
  </section>
</div></main>"""
    terms_page += get_footer()
    write_html_file("terms-and-conditions", terms_page)

    # Custom 404 Page
    four_o_four = get_common_head("404: Page Not Found | EkShala",
        "The page you are looking for does not exist on EkShala. Explore CBSE Class 10 Hindi, ICSE Class 10 Hindi, worksheets, or grammar.",
        f"{BASE_URL}/404.html", json.dumps({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "404 Page Not Found"
        }))
    four_o_four += get_navbar()
    four_o_four += f"""<main class="seo-content-wrap" style="text-align:center; padding:5rem 0;">
  <div class="container" style="max-width:680px;">
    <div style="font-size:5rem; font-weight:900; color:#156082; line-height:1; margin-bottom:1rem;">404</div>
    <h1 style="font-size:2rem; font-weight:800; color:#0F172A; margin-bottom:1rem;">पृष्ठ नहीं मिला (Page Not Found)</h1>
    <p style="font-size:1.1rem; color:#64748B; line-height:1.7; margin-bottom:2.5rem;">
      माफ़ कीजिए, जिस पृष्ठ की आप खोज कर रहे हैं वह उपलब्ध नहीं है या उसका पता बदल गया है। कृपया नीचे दिए गए मुख्य लिंक देखें:
    </p>
    <div style="display:flex; flex-wrap:wrap; justify-content:center; gap:1rem; margin-bottom:3rem;">
      <a href="/" class="btn btn-primary">मुख्य पृष्ठ (Home)</a>
      <a href="/cbse/class-10/hindi/" class="btn btn-outline">CBSE Class 10</a>
      <a href="/icse/class-10/hindi/" class="btn btn-outline">ICSE Class 10</a>
      <a href="/worksheets/" class="btn btn-outline">Worksheets</a>
      <a href="/hindi-grammar/" class="btn btn-outline">Hindi Grammar</a>
    </div>
  </div>
</main>"""
    four_o_four += get_footer()
    with open(os.path.join(PUBLIC_DIR, '404.html'), 'w', encoding='utf-8') as f:
        f.write(four_o_four)
    print(f"  ✓ Generated: 404.html ({len(four_o_four):,} bytes)")


# ==============================================================================
# 8. GENERATE SITEMAP.XML & ROBOTS.TXT
# ==============================================================================
def generate_sitemap_and_robots():
    print("\n--- Generating Clean XML Sitemap & Robots.txt ---")
    
    # Add root URL
    root_urls = [
        f"{BASE_URL}/",
        f"{BASE_URL}/cbse/class-10/hindi/",
        f"{BASE_URL}/icse/class-10/hindi/",
        f"{BASE_URL}/worksheets/",
        f"{BASE_URL}/hindi-grammar/",
        f"{BASE_URL}/hindi-grammar/muhavare/",
        f"{BASE_URL}/hindi-grammar/padbandh/",
        f"{BASE_URL}/about/",
        f"{BASE_URL}/contact/",
        f"{BASE_URL}/privacy-policy/",
        f"{BASE_URL}/terms-and-conditions/"
    ]

    all_sitemap_urls = list(dict.fromkeys(root_urls + ALL_CANONICAL_URLS))
    today_iso = datetime.now().strftime("%Y-%m-%d")

    sitemap_entries = []
    for u in all_sitemap_urls:
        priority = "1.0" if u == f"{BASE_URL}/" else ("0.9" if "/hindi/" in u and u.count('/') == 6 else "0.8")
        freq = "weekly" if u == f"{BASE_URL}/" else "monthly"
        sitemap_entries.append(f"""  <url>
    <loc>{u}</loc>
    <lastmod>{today_iso}</lastmod>
    <changefreq>{freq}</changefreq>
    <priority>{priority}</priority>
  </url>""")

    sitemap_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{chr(10).join(sitemap_entries)}
</urlset>
"""
    with open(os.path.join(PUBLIC_DIR, 'sitemap.xml'), 'w', encoding='utf-8') as f:
        f.write(sitemap_xml.strip())
    print(f"  ✓ Generated sitemap.xml with {len(all_sitemap_urls)} verified canonical URLs!")

    # Robots.txt
    robots_txt = f"""# EkShala Robots.txt
User-agent: *
Allow: /

# Sitemap
Sitemap: {BASE_URL}/sitemap.xml

# Disallow Private & Application Internal Routes
Disallow: /admin.html
Disallow: /admin-dashboard.html
Disallow: /login.html
Disallow: /api/
Disallow: /uploads/
"""
    with open(os.path.join(PUBLIC_DIR, 'robots.txt'), 'w', encoding='utf-8') as f:
        f.write(robots_txt.strip() + "\n")
    print("  ✓ Updated robots.txt pointing to sitemap.xml")


# ==============================================================================
# MAIN EXECUTION
# ==============================================================================
if __name__ == '__main__':
    print("🚀 Starting EkShala Master SEO SSG...")
    generate_chapter_pages()
    generate_cbse_landing_page()
    generate_icse_landing_page()
    generate_worksheets_hub()
    generate_grammar_pages()
    generate_trust_and_legal_pages()
    generate_sitemap_and_robots()
    print("\n🎉 ALL EKSHALA SEO PAGES GENERATED SUCCESSFULLY!")
