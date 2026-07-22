/**
 * GyanLok — script.js (v2)
 *
 * Sections:
 *  1.  DATA — School Boards (CBSE/ICSE, classes, subjects, books, chapters)
 *  2.  DATA — Test Sheets (UTP, Worksheets, Mock Exam)
 *  3.  SVGS & HELPERS
 *  4.  NAVBAR (hamburger, dropdown, scroll shadow, active link)
 *  5.  FADE-IN (IntersectionObserver)
 *  6.  SCHOOL BOARDS — render logic
 *  7.  TEST SHEETS — render logic
 *  8.  CONTACT FORM — validation
 *  9.  REVISION NOTIFY FORM
 * 10.  DOCUMENT VIEWER MODAL
 * 11.  UPLOAD ANSWER SHEET MODAL
 * 12.  SCROLL-TO-TOP BUTTON
 * 13.  TOAST HELPER
 */

/* ══════════════════════════════════════════
   1. DATA — SCHOOL BOARDS
══════════════════════════════════════════ */
let BOARDS_DATA = {
  CBSE: {
    classes: [6, 7, 8, 9, 10],
    subjectsByClass: {
      6:  ['Hindi', 'Mathematics', 'Science', 'Social Science', 'English', 'Sanskrit'],
      7:  ['Hindi', 'Mathematics', 'Science', 'Social Science', 'English', 'Sanskrit'],
      8:  ['Hindi', 'Mathematics', 'Science', 'Social Science', 'English', 'Sanskrit'],
      9:  ['Hindi', 'Mathematics', 'Science', 'Social Science', 'English', 'Sanskrit'],
      10: ['Hindi', 'Mathematics', 'Science', 'Social Science', 'English'],
    },
    resources: {
      10: {
        Hindi: {
          syllabus:      { title: 'Hindi B Syllabus 2026–27', file_url: '/pdf/cbse/class10/hindi/class_10_hindi_syllabus_cbse.pdf', isNew: true },
          markingScheme: { title: 'Hindi B Marking Scheme 2026', file_url: '/pdf/cbse/class10/hindi/class_10_hindi_marking_schema_cbse.pdf' },
          books: [
            {
              name: 'स्पर्श (भाग-2)',
              subtitle: 'कक्षा 10 हिंदी (कोर्स बी) — मुख्य पाठ्यपुस्तक (NCERT)',
              color: '#3A7BD5',
              file_url: '/pdf/cbse/class10/hindi/class_10_sparsh_complete_book.pdf',
              chapters: [
                { num: 1,  title: 'कबीर — साखी', worksheets: 2, file_url: '/pdf/cbse/class10/hindi/class_10_sparsh_hindi_chapter_1.pdf' },
                { num: 2,  title: 'मीरा — पद', worksheets: 2, file_url: '/pdf/cbse/class10/hindi/class_10_sparsh_hindi_chapter_2.pdf' },
                { num: 3,  title: 'मैथिलीशरण गुप्त — मनुष्यता', worksheets: 2, file_url: '/pdf/cbse/class10/hindi/class_10_sparsh_hindi_chapter_3.pdf' },
                { num: 4,  title: 'सुमित्रानंदन पंत — पर्वत प्रदेश में पावस', worksheets: 2, file_url: '/pdf/cbse/class10/hindi/class_10_sparsh_hindi_chapter_4.pdf' },
                { num: 5,  title: 'वीरेन डंगवाल — तोप', worksheets: 2, file_url: '/pdf/cbse/class10/hindi/class_10_sparsh_hindi_chapter_5.pdf' },
                { num: 6,  title: 'कैफ़ी आज़मी — कर चले हम फ़िदा', worksheets: 2, file_url: '/pdf/cbse/class10/hindi/class_10_sparsh_hindi_chapter_6.pdf' },
                { num: 7,  title: 'रवींद्रनाथ ठाकुर — आत्मत्राण', worksheets: 2, file_url: '/pdf/cbse/class10/hindi/class_10_sparsh_hindi_chapter_7.pdf' },
                { num: 8,  title: 'प्रेमचंद — बड़े भाई साहब', worksheets: 2, file_url: '/pdf/cbse/class10/hindi/class_10_sparsh_hindi_chapter_8.pdf' },
                { num: 9,  title: 'सीताराम सेकसरिया — डायरी का एक पन्ना', worksheets: 2, file_url: '/pdf/cbse/class10/hindi/class_10_sparsh_hindi_chapter_9.pdf' },
                { num: 10, title: 'लीलाधर मंडलोई — तताँरा-वामीरो कथा', worksheets: 2, file_url: '/pdf/cbse/class10/hindi/class_10_sparsh_hindi_chapter_10.pdf' },
                { num: 11, title: 'प्रहलाद अग्रवाल — तीसरी कसम के शिल्पकार शैलेंद्र', worksheets: 2, file_url: '/pdf/cbse/class10/hindi/class_10_sparsh_hindi_chapter_11.pdf' },
                { num: 12, title: 'निदा फ़ाज़ली — अब कहाँ दूसरे के दुख से दुखी होने वाले', worksheets: 2, file_url: '/pdf/cbse/class10/hindi/class_10_sparsh_hindi_chapter_12.pdf' },
                { num: 13, title: 'रवींद्र केलेकर — पतझर में टूटी पत्तियाँ (गिन्नी का सोना / झेन की देन)', worksheets: 2, file_url: '/pdf/cbse/class10/hindi/class_10_sparsh_hindi_chapter_13.pdf' },
                { num: 14, title: 'हबीब तनवीर — कारतूस (एकांकी)', worksheets: 2, file_url: '/pdf/cbse/class10/hindi/class_10_sparsh_hindi_chapter_14.pdf' },
              ]
            },
            {
              name: 'संचयन (भाग-2)',
              subtitle: 'कक्षा 10 हिंदी (कोर्स बी) — पूरक पाठ्यपुस्तक (NCERT)',
              color: '#2BA899',
              file_url: '/pdf/cbse/class10/hindi/class_10_hindi_book_complete_sanchayan.pdf',
              chapters: [
                { num: 1, title: 'मिथिलेश्वर — हरिहर काका', worksheets: 2, file_url: '/pdf/cbse/class10/hindi/class_10_sanchayan_hindi_chapter_1.pdf' },
                { num: 2, title: 'गुरदयाल सिंह — सपनों के-से दिन', worksheets: 2, file_url: '/pdf/cbse/class10/hindi/class_10_sanchayan_hindi_chapter_2.pdf' },
                { num: 3, title: 'राही मासूम रज़ा — टोपी शुक्ला', worksheets: 2, file_url: '/pdf/cbse/class10/hindi/class_10_sanchayan_hindi_chapter_3.pdf' },
              ]
            }
          ]
        },
        Mathematics: {
          syllabus:      { title: 'Mathematics Syllabus 2026–27', isNew: true },
          markingScheme: { title: 'Mathematics Marking Scheme 2026' },
          books: [
            {
              name: 'Mathematics — Standard',
              subtitle: 'Class 10 Mathematics (NCERT)',
              color: '#E05555',
              chapters: [
                { num: 1,  title: 'Real Numbers',                                       worksheets: 2 },
                { num: 2,  title: 'Polynomials',                                        worksheets: 2 },
                { num: 3,  title: 'Pair of Linear Equations in Two Variables',          worksheets: 2 },
                { num: 4,  title: 'Quadratic Equations',                               worksheets: 2 },
                { num: 5,  title: 'Arithmetic Progressions',                           worksheets: 2 },
                { num: 6,  title: 'Triangles',                                         worksheets: 1 },
                { num: 7,  title: 'Coordinate Geometry',                               worksheets: 2 },
                { num: 8,  title: 'Introduction to Trigonometry',                      worksheets: 2 },
                { num: 9,  title: 'Some Applications of Trigonometry',                 worksheets: 1 },
                { num: 10, title: 'Circles',                                           worksheets: 1 },
                { num: 11, title: 'Areas Related to Circles',                          worksheets: 1 },
                { num: 12, title: 'Surface Areas and Volumes',                         worksheets: 2 },
                { num: 13, title: 'Statistics',                                        worksheets: 2 },
                { num: 14, title: 'Probability',                                       worksheets: 1 },
              ]
            }
          ]
        },
        Science: {
          syllabus:      { title: 'Science Syllabus 2026–27', isNew: true },
          markingScheme: { title: 'Science Marking Scheme 2026' },
          books: [
            {
              name: 'Science',
              subtitle: 'Class 10 Science — Physics, Chemistry & Biology (NCERT)',
              color: '#7EC8A4',
              chapters: [
                { num: 1,  title: 'Chemical Reactions and Equations',          worksheets: 2 },
                { num: 2,  title: 'Acids, Bases and Salts',                   worksheets: 2 },
                { num: 3,  title: 'Metals and Non-metals',                     worksheets: 2 },
                { num: 4,  title: 'Carbon and its Compounds',                  worksheets: 2 },
                { num: 6,  title: 'Life Processes',                            worksheets: 2 },
                { num: 7,  title: 'Control and Coordination',                  worksheets: 2 },
                { num: 8,  title: 'How do Organisms Reproduce?',               worksheets: 1 },
                { num: 9,  title: 'Heredity',                                  worksheets: 1 },
                { num: 10, title: 'Light — Reflection and Refraction',         worksheets: 2 },
                { num: 11, title: 'Human Eye and the Colourful World',         worksheets: 1 },
                { num: 12, title: 'Electricity',                               worksheets: 2 },
                { num: 13, title: 'Magnetic Effects of Electric Current',      worksheets: 2 },
                { num: 14, title: 'Sources of Energy',                         worksheets: 1 },
                { num: 15, title: 'Our Environment',                           worksheets: 1 },
              ]
            }
          ]
        },
        'Social Science': {
          syllabus:      { title: 'Social Science Syllabus 2026–27', isNew: true },
          markingScheme: { title: 'Social Science Marking Scheme 2026' },
          books: [
            {
              name: 'India and the Contemporary World — II (History)',
              subtitle: 'Class 10 History',
              color: '#9B59B6',
              chapters: [
                { num: 1, title: 'The Rise of Nationalism in Europe',         worksheets: 2 },
                { num: 2, title: 'Nationalism in India',                      worksheets: 2 },
                { num: 3, title: 'The Making of a Global World',              worksheets: 1 },
                { num: 4, title: 'The Age of Industrialisation',              worksheets: 1 },
                { num: 5, title: 'Print Culture and the Modern World',        worksheets: 1 },
              ]
            },
            {
              name: 'Contemporary India — II (Geography)',
              subtitle: 'Class 10 Geography',
              color: '#27AE60',
              chapters: [
                { num: 1, title: 'Resources and Development',                 worksheets: 2 },
                { num: 2, title: 'Forest and Wildlife Resources',             worksheets: 1 },
                { num: 3, title: 'Water Resources',                           worksheets: 2 },
                { num: 4, title: 'Agriculture',                               worksheets: 2 },
                { num: 5, title: 'Minerals and Energy Resources',             worksheets: 1 },
                { num: 6, title: 'Manufacturing Industries',                  worksheets: 1 },
                { num: 7, title: 'Lifelines of National Economy',             worksheets: 1 },
              ]
            }
          ]
        },
        English: {
          syllabus:      { title: 'English Syllabus 2026–27', isNew: true },
          markingScheme: { title: 'English Marking Scheme 2026' },
          books: [
            {
              name: 'First Flight',
              subtitle: 'Class 10 English — Main Textbook',
              color: '#F5A623',
              chapters: [
                { num: 1,  title: 'A Letter to God',                          worksheets: 2 },
                { num: 2,  title: 'Nelson Mandela: Long Walk to Freedom',     worksheets: 2 },
                { num: 3,  title: 'Two Stories About Flying',                 worksheets: 1 },
                { num: 4,  title: 'From the Diary of Anne Frank',             worksheets: 2 },
                { num: 5,  title: 'The Hundred Dresses — I',                  worksheets: 1 },
                { num: 6,  title: 'The Hundred Dresses — II',                 worksheets: 1 },
                { num: 7,  title: 'Glimpses of India',                        worksheets: 1 },
                { num: 8,  title: 'Mijbil the Otter',                         worksheets: 1 },
                { num: 9,  title: 'Madam Rides the Bus',                      worksheets: 1 },
                { num: 10, title: 'The Sermon at Benares',                    worksheets: 1 },
                { num: 11, title: 'The Proposal',                             worksheets: 2 },
              ]
            },
            {
              name: 'Footprints Without Feet',
              subtitle: 'Class 10 English — Supplementary Reader',
              color: '#E8900A',
              chapters: [
                { num: 1,  title: 'A Triumph of Surgery',                     worksheets: 1 },
                { num: 2,  title: "The Thief's Story",                        worksheets: 1 },
                { num: 3,  title: 'The Midnight Visitor',                     worksheets: 1 },
                { num: 4,  title: 'A Question of Trust',                      worksheets: 1 },
                { num: 5,  title: 'Footprints Without Feet',                  worksheets: 2 },
                { num: 6,  title: 'The Making of a Scientist',                worksheets: 1 },
                { num: 7,  title: 'The Necklace',                             worksheets: 2 },
                { num: 8,  title: 'The Hack Driver',                          worksheets: 1 },
                { num: 9,  title: 'Bholi',                                    worksheets: 2 },
                { num: 10, title: 'The Book That Saved the Earth',            worksheets: 1 },
              ]
            }
          ]
        }
      }
    }
  },

  ICSE: {
    classes: [6, 7, 8, 9, 10],
    subjectsByClass: {
      6:  ['English', 'Mathematics', 'Science', 'History & Civics', 'Geography', 'Hindi'],
      7:  ['English', 'Mathematics', 'Science', 'History & Civics', 'Geography', 'Hindi'],
      8:  ['English', 'Mathematics', 'Science', 'History & Civics', 'Geography', 'Hindi'],
      9:  ['Hindi', 'English Language', 'English Literature', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History & Civics', 'Geography'],
      10: ['Hindi', 'English Language', 'English Literature', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'History & Civics', 'Geography'],
    },
    resources: {
      10: {
        Mathematics: {
          syllabus:      { title: 'ICSE Mathematics Syllabus 2026–27', isNew: true },
          markingScheme: { title: 'ICSE Mathematics Marking Scheme 2026' },
          books: [
            {
              name: 'ICSE Mathematics (Selina / Frank)',
              subtitle: 'Class 10 ICSE Mathematics',
              color: '#E05555',
              chapters: [
                { num: 1, title: 'Commercial Mathematics — GST, Shares, Compound Interest',  worksheets: 2 },
                { num: 2, title: 'Algebra — Polynomials, Quadratic Equations',               worksheets: 2 },
                { num: 3, title: 'Geometry — Similarity, Loci, Tangents to Circles',         worksheets: 2 },
                { num: 4, title: 'Mensuration — Cylinder, Cone, Sphere',                     worksheets: 2 },
                { num: 5, title: 'Trigonometry',                                             worksheets: 2 },
                { num: 6, title: 'Statistics — Mean, Median, Ogive, Histogram',              worksheets: 2 },
                { num: 7, title: 'Probability',                                              worksheets: 1 },
              ]
            }
          ]
        },
        Physics: {
          syllabus:      { title: 'ICSE Physics Syllabus 2026–27', isNew: true },
          markingScheme: { title: 'ICSE Physics Marking Scheme 2026' },
          books: [
            {
              name: 'ICSE Physics (Selina)',
              subtitle: 'Class 10 ICSE Physics',
              color: '#3A7BD5',
              chapters: [
                { num: 1, title: 'Force, Work, Power and Energy',             worksheets: 2 },
                { num: 2, title: 'Light — Refraction and Lenses',             worksheets: 2 },
                { num: 3, title: 'Sound',                                     worksheets: 1 },
                { num: 4, title: 'Electricity and Magnetism',                 worksheets: 2 },
                { num: 5, title: 'Heat',                                      worksheets: 1 },
                { num: 6, title: 'Modern Physics (Radioactivity)',            worksheets: 1 },
              ]
            }
          ]
        },
        Chemistry: {
          syllabus:      { title: 'ICSE Chemistry Syllabus 2026–27', isNew: true },
          markingScheme: { title: 'ICSE Chemistry Marking Scheme 2026' },
          books: [
            {
              name: 'ICSE Chemistry (Selina)',
              subtitle: 'Class 10 ICSE Chemistry',
              color: '#7EC8A4',
              chapters: [
                { num: 1, title: 'Periodic Table',                            worksheets: 2 },
                { num: 2, title: 'Chemical Bonding',                          worksheets: 2 },
                { num: 3, title: 'Acids, Bases and Salts',                   worksheets: 2 },
                { num: 4, title: 'Analytical Chemistry',                      worksheets: 1 },
                { num: 5, title: 'Mole Concept and Stoichiometry',            worksheets: 2 },
                { num: 6, title: 'Electrolysis',                              worksheets: 2 },
                { num: 7, title: 'Metallurgy',                                worksheets: 1 },
                { num: 8, title: 'Organic Chemistry',                         worksheets: 2 },
              ]
            }
          ]
        },
        Hindi: {
          syllabus:      { title: 'ICSE Hindi Syllabus 2026–27', isNew: true },
          markingScheme: { title: 'ICSE Hindi Marking Scheme 2026' },
          books: [
            {
              name: 'साहित्य सागर — गद्य (Prose)',
              subtitle: 'Class 10 ICSE Hindi — Gadya Khand | 10 Kahaniyaan',
              color: '#9B59B6',
              chapters: [
                { num: 1,  title: 'बात अठन्नी की',         worksheets: 2 },
                { num: 2,  title: 'काकी',                   worksheets: 2 },
                { num: 3,  title: 'महायज्ञ का पुरस्कार',    worksheets: 2 },
                { num: 4,  title: 'नेताजी का चश्मा',        worksheets: 2 },
                { num: 5,  title: 'अपना-अपना भाग्य',        worksheets: 2 },
                { num: 6,  title: 'बड़े घर की बेटी',        worksheets: 2 },
                { num: 7,  title: 'संदेह',                  worksheets: 1 },
                { num: 8,  title: 'भीड़ में खोया आदमी',     worksheets: 2 },
                { num: 9,  title: 'भेड़ें और भेड़िए',       worksheets: 1 },
                { num: 10, title: 'दो कलाकार',              worksheets: 2 },
              ]
            },
            {
              name: 'साहित्य सागर — पद्य (Poetry)',
              subtitle: 'Class 10 ICSE Hindi — Padya Khand | 9 Kavitaen',
              color: '#E8900A',
              chapters: [
                { num: 1, title: 'साखी',                    worksheets: 2 },
                { num: 2, title: 'कुंडलियाँ',               worksheets: 2 },
                { num: 3, title: 'स्वर्ग बना सकते हैं',     worksheets: 2 },
                { num: 4, title: 'वह मातृभूमि मेरी',        worksheets: 2 },
                { num: 5, title: 'मेघ आए',                  worksheets: 1 },
                { num: 6, title: 'सूरदास के पद',            worksheets: 2 },
                { num: 7, title: 'विनय के पद',               worksheets: 2 },
                { num: 8, title: 'भिक्षुक',                 worksheets: 1 },
                { num: 9, title: 'चलना हमारा काम है',        worksheets: 2 },
              ]
            },
            {
              name: 'एकांकी संचय',
              subtitle: 'Class 10 ICSE Hindi — Ekanki | 6 One-Act Plays',
              color: '#2BA899',
              chapters: [
                { num: 1, title: 'संस्कार और भावना',        worksheets: 2 },
                { num: 2, title: 'बहू की विदा',             worksheets: 2 },
                { num: 3, title: 'मातृभूमि का मान',         worksheets: 2 },
                { num: 4, title: 'सूखी डाली',               worksheets: 2 },
                { num: 5, title: 'महाभारत की एक साँझ',      worksheets: 2 },
                { num: 6, title: 'दीपदान',                  worksheets: 2 },
              ]
            },
            {
              name: 'नया रास्ता (उपन्यास)',
              subtitle: 'Class 10 ICSE Hindi — Novel | अध्याय क्रमवार (Publisher: Evergreen / Morning Star)',
              color: '#E05555',
              chapters: [
                { num: 1, title: 'अध्याय 1', worksheets: 1 },
                { num: 2, title: 'अध्याय 2', worksheets: 1 },
                { num: 3, title: 'अध्याय 3', worksheets: 1 },
                { num: 4, title: 'अध्याय 4', worksheets: 1 },
                { num: 5, title: 'अध्याय 5', worksheets: 1 },
                { num: 6, title: 'अध्याय 6', worksheets: 1 },
                { num: 7, title: 'अध्याय 7', worksheets: 1 },
                { num: 8, title: 'अध्याय 8', worksheets: 1 },
              ]
            }
          ]
        }
      }
    }
  }
};

/* ══════════════════════════════════════════
   2. DATA — TEST SHEETS
══════════════════════════════════════════ */
const TEST_DATA = {
  UTP: {
    CBSE: {
      10: [
        { id: 'UTP_CBSE_10_01', title: 'Unit Test Paper 1 — Science',       subject: 'Science',       date: 'Jan 2026', pages: 4, color: '#7EC8A4' },
        { id: 'UTP_CBSE_10_02', title: 'Unit Test Paper 2 — Mathematics',   subject: 'Mathematics',   date: 'Mar 2026', pages: 4, color: '#E05555' },
        { id: 'UTP_CBSE_10_03', title: 'Unit Test Paper 3 — Social Science',subject: 'Social Science',date: 'May 2026', pages: 3, color: '#9B59B6' },
        { id: 'UTP_CBSE_10_04', title: 'Unit Test Paper 4 — Hindi',         subject: 'Hindi',         date: 'Jun 2026', pages: 3, color: '#3A7BD5' },
      ],
      9: [
        { id: 'UTP_CBSE_09_01', title: 'Unit Test Paper 1 — Science',       subject: 'Science',       date: 'Feb 2026', pages: 4, color: '#7EC8A4' },
        { id: 'UTP_CBSE_09_02', title: 'Unit Test Paper 2 — Mathematics',   subject: 'Mathematics',   date: 'Apr 2026', pages: 4, color: '#E05555' },
      ],
      8: [
        { id: 'UTP_CBSE_08_01', title: 'Unit Test Paper 1 — Mathematics',   subject: 'Mathematics',   date: 'Feb 2026', pages: 3, color: '#E05555' },
      ],
      7: [],
      6: [],
    },
    ICSE: {
      10: [
        { id: 'UTP_ICSE_10_01', title: 'Unit Test Paper 1 — Mathematics',   subject: 'Mathematics',   date: 'Feb 2026', pages: 4, color: '#E05555' },
        { id: 'UTP_ICSE_10_02', title: 'Unit Test Paper 2 — Physics',       subject: 'Physics',       date: 'Apr 2026', pages: 4, color: '#3A7BD5' },
        { id: 'UTP_ICSE_10_03', title: 'Unit Test Paper 3 — Chemistry',     subject: 'Chemistry',     date: 'Jun 2026', pages: 3, color: '#7EC8A4' },
      ],
      9: [
        { id: 'UTP_ICSE_09_01', title: 'Unit Test Paper 1 — Mathematics',   subject: 'Mathematics',   date: 'Mar 2026', pages: 4, color: '#E05555' },
      ],
      8: [], 7: [], 6: [],
    }
  },
  Worksheets: {
    CBSE: {
      10: [
        { id: 'WS_CBSE_10_01', title: 'Worksheet 1 — Trigonometry',          subject: 'Mathematics', date: 'Jan 2026', pages: 2, color: '#E05555' },
        { id: 'WS_CBSE_10_02', title: 'Worksheet 2 — Chemical Reactions',    subject: 'Science',     date: 'Feb 2026', pages: 3, color: '#7EC8A4' },
        { id: 'WS_CBSE_10_03', title: 'Worksheet 3 — Hindi Grammar',         subject: 'Hindi',       date: 'Mar 2026', pages: 2, color: '#3A7BD5' },
        { id: 'WS_CBSE_10_04', title: 'Worksheet 4 — Electricity',           subject: 'Science',     date: 'Apr 2026', pages: 2, color: '#7EC8A4' },
      ],
      9: [
        { id: 'WS_CBSE_09_01', title: 'Worksheet 1 — Algebra',               subject: 'Mathematics', date: 'Feb 2026', pages: 2, color: '#E05555' },
        { id: 'WS_CBSE_09_02', title: 'Worksheet 2 — Force & Motion',        subject: 'Science',     date: 'Mar 2026', pages: 2, color: '#7EC8A4' },
      ],
      8: [
        { id: 'WS_CBSE_08_01', title: 'Worksheet 1 — Rational Numbers',      subject: 'Mathematics', date: 'Jan 2026', pages: 2, color: '#E05555' },
      ],
      7: [], 6: [],
    },
    ICSE: {
      10: [
        { id: 'WS_ICSE_10_01', title: 'Worksheet 1 — Commercial Maths',      subject: 'Mathematics', date: 'Jan 2026', pages: 3, color: '#E05555' },
        { id: 'WS_ICSE_10_02', title: 'Worksheet 2 — Light (Refraction)',     subject: 'Physics',     date: 'Mar 2026', pages: 2, color: '#3A7BD5' },
      ],
      9: [
        { id: 'WS_ICSE_09_01', title: 'Worksheet 1 — Algebra',               subject: 'Mathematics', date: 'Feb 2026', pages: 2, color: '#E05555' },
      ],
      8: [], 7: [], 6: [],
    }
  },
  MockExam: {
    CBSE: {
      10: [
        { id: 'MOCK_CBSE_10_01', title: 'Mock Exam 1 — Science (Full Paper)',    subject: 'Science',     date: 'Nov 2025', pages: 8, color: '#7EC8A4' },
        { id: 'MOCK_CBSE_10_02', title: 'Mock Exam 2 — Mathematics (Full Paper)',subject: 'Mathematics', date: 'Dec 2025', pages: 7, color: '#E05555' },
        { id: 'MOCK_CBSE_10_03', title: 'Mock Exam 3 — Hindi (Full Paper)',      subject: 'Hindi',       date: 'Dec 2025', pages: 5, color: '#3A7BD5' },
      ],
      9: [
        { id: 'MOCK_CBSE_09_01', title: 'Mock Exam 1 — Annual Paper (All Subjects)', subject: 'All Subjects', date: 'Oct 2025', pages: 10, color: '#9B59B6' },
      ],
      8: [], 7: [], 6: [],
    },
    ICSE: {
      10: [
        { id: 'MOCK_ICSE_10_01', title: 'Mock Exam 1 — Mathematics (Full Paper)', subject: 'Mathematics', date: 'Dec 2025', pages: 7, color: '#E05555' },
        { id: 'MOCK_ICSE_10_02', title: 'Mock Exam 2 — Physics (Full Paper)',      subject: 'Physics',     date: 'Dec 2025', pages: 6, color: '#3A7BD5' },
      ],
      9: [], 8: [], 7: [], 6: [],
    }
  }
};

/* ══════════════════════════════════════════
   3. SVG HELPERS
══════════════════════════════════════════ */
const SVG = {
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  file: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`,
  pencil:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  star:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  dl:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  up:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
  eye:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  send:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
  chevD: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>`,
};

/* ══════════════════════════════════════════
   STATE
══════════════════════════════════════════ */
let state = {
  board: 'CBSE',
  cls:   10,
  subj:  'Hindi',
  testType: 'UTP',
  testBoard: 'CBSE',
};

/* ══════════════════════════════════════════
   DOM READY
══════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFadeIn();
  initBoardsSection();
  initTestSheets();
  initContactForm();
  initRevisionNotify();
  initDocModal();
  initUploadModal();
  initScrollTop();
});

/* ══════════════════════════════════════════
   4. NAVBAR
══════════════════════════════════════════ */
function initNavbar() {
  const hamburger  = document.getElementById('hamburger');
  const navLinks   = document.getElementById('nav-links');
  const navEl      = document.getElementById('navbar');
  const boardsTrig = document.getElementById('boards-trigger');
  const boardsDrop = document.getElementById('boards-dropdown');
  const boardsWrap = boardsTrig ? boardsTrig.closest('.nav-dropdown-wrapper') : null;

  /* Hamburger toggle */
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  /* Close nav on link click */
  navLinks.querySelectorAll('a.nav-link, a.dropdown-item').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* School Boards dropdown */
  if (boardsTrig && boardsWrap) {
    boardsTrig.addEventListener('click', (e) => {
      e.stopPropagation();
      boardsWrap.classList.toggle('open');
      const isOpen = boardsWrap.classList.contains('open');
      boardsTrig.setAttribute('aria-expanded', String(isOpen));
    });

    /* Dropdown item click: pre-select board and scroll */
    boardsDrop.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const board = item.dataset.board;
        if (board) selectBoard(board);
        boardsWrap.classList.remove('open');
      });
    });
  }

  /* Close dropdown/nav on outside click */
  document.addEventListener('click', (e) => {
    if (boardsWrap && !boardsWrap.contains(e.target)) boardsWrap.classList.remove('open');
    if (!navEl.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  /* Scroll shadow */
  const onScroll = () => navEl.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Active nav link on scroll */
  const sections   = document.querySelectorAll('section[id]');
  const navLinkEls = document.querySelectorAll('.nav-link[href^="#"]');
  const secObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkEls.forEach(l => {
          l.classList.remove('active');
          if (l.getAttribute('href') === `#${entry.target.id}`) l.classList.add('active');
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => secObs.observe(s));
}

/* ══════════════════════════════════════════
   5. FADE-IN
══════════════════════════════════════════ */
let fadeObserver;
function initFadeIn() {
  fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sibs = [...entry.target.parentElement.children].filter(c => c.classList.contains('fade-in'));
        const idx  = sibs.indexOf(entry.target);
        entry.target.style.transitionDelay = `${idx * 70}ms`;
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));
}

function observeFade(el) {
  if (fadeObserver) fadeObserver.observe(el);
  else el.classList.add('visible');
}

/* ══════════════════════════════════════════
   6. SCHOOL BOARDS SECTION
══════════════════════════════════════════ */
async function initBoardsSection() {
  /* Board tab clicks */
  document.querySelectorAll('.board-tab').forEach(tab => {
    tab.addEventListener('click', () => selectBoard(tab.dataset.board));
  });

  // Try loading live resources from database
  try {
    const res = await fetch('/api/resources');
    if (res.ok) {
      const dbData = await res.json();
      if (dbData && Object.keys(dbData).length > 0) {
        // Merge database data into BOARDS_DATA
        for (const board in dbData) {
          if (!BOARDS_DATA[board]) {
            BOARDS_DATA[board] = dbData[board];
          } else {
            if (dbData[board].classes && dbData[board].classes.length > 0) {
              dbData[board].classes.forEach(c => {
                if (!BOARDS_DATA[board].classes.includes(c)) {
                  BOARDS_DATA[board].classes.push(c);
                }
              });
              BOARDS_DATA[board].classes.sort((a, b) => a - b);
            }
            if (dbData[board].subjectsByClass && Object.keys(dbData[board].subjectsByClass).length > 0) {
              for (const cls in dbData[board].subjectsByClass) {
                if (!BOARDS_DATA[board].subjectsByClass[cls]) {
                  BOARDS_DATA[board].subjectsByClass[cls] = dbData[board].subjectsByClass[cls];
                } else {
                  dbData[board].subjectsByClass[cls].forEach(s => {
                    if (!BOARDS_DATA[board].subjectsByClass[cls].includes(s)) {
                      BOARDS_DATA[board].subjectsByClass[cls].push(s);
                    }
                  });
                }
              }
            }
            if (dbData[board].resources && Object.keys(dbData[board].resources).length > 0) {
              // Deep merge resources to preserve fallback keys if database has missing sub-keys
              for (const cls in dbData[board].resources) {
                if (!BOARDS_DATA[board].resources[cls]) {
                  BOARDS_DATA[board].resources[cls] = dbData[board].resources[cls];
                } else {
                  for (const subj in dbData[board].resources[cls]) {
                    const dbSubj = dbData[board].resources[cls][subj];
                    const localSubj = BOARDS_DATA[board].resources[cls] && BOARDS_DATA[board].resources[cls][subj];
                    if (!localSubj) {
                      // No local fallback — use database directly
                      if (!BOARDS_DATA[board].resources[cls]) BOARDS_DATA[board].resources[cls] = {};
                      BOARDS_DATA[board].resources[cls][subj] = dbSubj;
                    } else {
                      // Smart merge: update books list from DB but preserve/prefer working file_urls from local fallback
                      if (dbSubj.syllabus) {
                        localSubj.syllabus = {
                          ...dbSubj.syllabus,
                          file_url: (localSubj.syllabus && localSubj.syllabus.file_url) || dbSubj.syllabus.file_url
                        };
                      }
                      if (dbSubj.markingScheme) {
                        localSubj.markingScheme = {
                          ...dbSubj.markingScheme,
                          file_url: (localSubj.markingScheme && localSubj.markingScheme.file_url) || dbSubj.markingScheme.file_url
                        };
                      }
                      if (dbSubj.books && dbSubj.books.length > 0) {
                        localSubj.books = dbSubj.books.map(dbBook => {
                          // Find matching local book by name (case-insensitive)
                          const localBook = (localSubj.books || []).find(lb =>
                            lb.name.toLowerCase().replace(/[^a-z]/g,'').includes(dbBook.name.toLowerCase().replace(/[^a-z]/g,'')) ||
                            dbBook.name.toLowerCase().replace(/[^a-z]/g,'').includes(lb.name.toLowerCase().replace(/[^a-z]/g,''))
                          );
                          return {
                            ...dbBook,
                            // Prefer local Vercel file_url over broken database URL
                            file_url: (localBook && localBook.file_url) || dbBook.file_url || '',
                            chapters: (dbBook.chapters || []).map(dbCh => {
                              const localCh = localBook && (localBook.chapters || []).find(lc => lc.num === dbCh.num);
                              return {
                                ...dbCh,
                                file_url: (localCh && localCh.file_url) || dbCh.file_url || ''
                              };
                            })
                          };
                        });
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.error('Failed to load resources from API:', err);
  }

  renderClassPills();
  renderSubjectPills();
  renderBoardContent();
}

function selectBoard(board) {
  state.board = board;
  state.cls   = BOARDS_DATA[board].classes[BOARDS_DATA[board].classes.length - 1]; // default to highest class
  document.querySelectorAll('.board-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.board === board);
    t.setAttribute('aria-selected', String(t.dataset.board === board));
  });
  renderClassPills();
  renderSubjectPills();
  renderBoardContent();
}

function renderClassPills() {
  const container = document.getElementById('class-pills');
  if (!container) return;
  const classes = BOARDS_DATA[state.board].classes;
  // default state.cls to first available for this board
  if (!classes.includes(state.cls)) state.cls = classes[classes.length - 1];
  container.innerHTML = classes.map(c => `
    <button class="class-pill${c === state.cls ? ' active' : ''}" data-class="${c}">Class ${c}</button>
  `).join('');
  container.querySelectorAll('.class-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      state.cls = parseInt(pill.dataset.class);
      renderClassPills();
      renderSubjectPills();
      renderBoardContent();
    });
  });
}

function renderSubjectPills() {
  const container = document.getElementById('subject-pills');
  if (!container) return;
  const subjects = BOARDS_DATA[state.board].subjectsByClass[state.cls] || [];
  // reset subject if not in new list
  if (!subjects.includes(state.subj)) state.subj = subjects[0] || '';
  container.innerHTML = subjects.map(s => `
    <button class="subject-pill${s === state.subj ? ' active' : ''}" data-subject="${s}">${s}</button>
  `).join('');
  container.querySelectorAll('.subject-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      state.subj = pill.dataset.subject;
      renderSubjectPills();
      renderBoardContent();
    });
  });
}

function renderBoardContent() {
  const panel = document.getElementById('board-content');
  if (!panel) return;

  const boardRes = BOARDS_DATA[state.board].resources;
  const clsRes   = boardRes && boardRes[state.cls];
  const subjRes  = clsRes && clsRes[state.subj];

  if (!subjRes) {
    panel.innerHTML = `
      <div class="resources-coming-soon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-light)" stroke-width="1.5" stroke-linecap="round" style="margin:0 auto var(--sp-sm)" aria-hidden="true">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <h3>${state.subj} — Class ${state.cls} (${state.board})</h3>
        <p>Resources for this subject are being prepared and will be available soon.<br/>
        <a href="#contact" style="color:var(--accent);font-weight:600">Contact a mentor</a> for study material in the meantime.</p>
      </div>`;
    
    // Clear/Reset the right-hand panel view too!
    const rightPanel = document.getElementById('boards-right-panel');
    if (rightPanel) {
      rightPanel.innerHTML = `
        <div class="boards-detail-empty">
          <div class="detail-empty-icon">⏳</div>
          <h3>सामग्री जल्द आ रही है</h3>
          <p>Class ${state.cls} (${state.board}) के लिए <strong>${state.subj}</strong> की अध्ययन सामग्री अभी तैयार की जा रही है।</p>
        </div>`;
    }
    return;
  }

  const { syllabus, markingScheme, books } = subjRes;
  
  // Reset slide position on mobile when subject changes
  const layout = document.querySelector('.boards-split-layout');
  if (layout) layout.classList.remove('show-right');

  /* Subject info banner at the top of chapter navigation */
  let html = `
    <div class="subject-info-banner" onclick="showSubjectDetails()" style="display:flex; align-items:center; justify-content:space-between; background:var(--accent-bg); border:1px solid var(--accent-light); padding:.75rem 1rem; border-radius:var(--r-md); margin-bottom:1.25rem; cursor:pointer;">
      <div style="display:flex; align-items:center; gap:.5rem;">
        <span style="font-size:1.25rem; margin-right:.15rem;">📋</span>
        <div style="text-align:left;">
          <strong style="font-size:.84rem; color:var(--accent-dark); display:block; line-height:1.2;">Syllabus &amp; Full Books</strong>
          <span style="font-size:.72rem; color:var(--text-body); display:block; margin-top:2px;">Syllabus, Marking Scheme aur text books check karein</span>
        </div>
      </div>
      <span style="color:var(--accent); font-weight:700; font-size:.9rem;">&rarr;</span>
    </div>
  `;

  /* Books list on the left side */
  books.forEach(book => {
    html += `
      <div class="book-section">
        <div class="book-header">
          <div class="book-icon" style="background:${book.color}">${SVG.book}</div>
          <div class="book-title-group">
            <h3>${book.name}</h3>
            <span>${book.subtitle}</span>
          </div>
        </div>
        <div class="chapters-list">
          ${book.chapters.map(ch => renderChapter(book, ch)).join('')}
        </div>
      </div>`;
  });

  panel.innerHTML = html;
  
  // Render default right panel content (Syllabus, Marking Scheme, Complete Book) on load
  renderDefaultRightContent(subjRes);
}

function renderDefaultRightContent(subjRes) {
  const panel = document.getElementById('boards-right-panel');
  if (!panel) return;

  const { syllabus, markingScheme, books } = subjRes;
  let html = `
    <div class="rp-default-view">
      <div class="rp-ch-header" style="margin-bottom: 1.25rem;">
        <div class="rp-ch-breadcrumb">${state.board} &rsaquo; Class ${state.cls} &rsaquo; ${state.subj}</div>
        <h2 class="rp-ch-title">विषय सामग्री (Subject Materials)</h2>
      </div>
      
      <div class="rp-intro" style="background:var(--accent-bg); border-left-color:var(--accent); margin-bottom: 1.25rem;">
        <p class="rp-intro-hi">इस विषय का Syllabus, Marking Scheme और Complete Textbook direct यहाँ से देखें या download करें।</p>
      </div>

      <p class="rp-options-label">Syllabus &amp; Marking Scheme:</p>
      <div class="resource-row" style="margin-bottom: 1.5rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1rem;">
  `;

  if (syllabus) {
    html += `
      <div class="resource-card" role="button" tabindex="0" onclick="openDocViewer('${syllabus.title}', '${syllabus.file_url || ''}')">
        <div class="rc-icon" style="background:#3A7BD5">${SVG.file}</div>
        <div class="rc-info">
          <strong>Syllabus</strong>
          <span style="font-size: .78rem; color: var(--text-muted);">${syllabus.title}</span>
        </div>
      </div>`;
  }
  if (markingScheme) {
    html += `
      <div class="resource-card" role="button" tabindex="0" onclick="openDocViewer('${markingScheme.title}', '${markingScheme.file_url || ''}')">
        <div class="rc-icon" style="background:#2BA899">${SVG.check}</div>
        <div class="rc-info">
          <strong>Marking Scheme</strong>
          <span style="font-size: .78rem; color: var(--text-muted);">${markingScheme.title}</span>
        </div>
      </div>`;
  }
  if (!syllabus && !markingScheme) {
    html += `<p style="color:var(--text-muted);font-size:.9rem;padding:0 .5rem;">Syllabus is being uploaded.</p>`;
  }

  html += `
      </div>

      <p class="rp-options-label">Complete Book Download/View:</p>
      <div class="rp-options-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: .8rem;">
  `;

  books.forEach(book => {
    html += `
      <button class="rp-opt-btn" onclick="openDocViewer('${book.name} — Complete Book', '${book.file_url || ''}')">
        <div class="rp-opt-icon" style="background:${book.color || 'var(--accent)'};color:#fff">📚</div>
        <div class="rp-opt-text">
          <span class="rp-opt-name">${book.name}</span>
          <span class="rp-opt-sub">Complete Book PDF</span>
        </div>
      </button>
    `;
  });

  html += `
      </div>
    </div>
  `;

  panel.innerHTML = html;
}

// ─── Chapter intro descriptions ─────────────────────────────────────────────
const CHAPTER_INTROS = {
  'स्पर्श (भाग-2)': {
    1:  { hi: 'कबीर के दोहे (साखी) — संत कबीर द्वारा रचित दोहे जो जीवन की सच्चाई, भक्ति और मानवता का संदेश देते हैं। ये दोहे आज भी उतने ही प्रासंगिक हैं जितने सदियों पहले थे।', en: 'Kabir ke Dohe — Sakhis by Saint Kabir conveying truths of life, devotion and humanity.' },
    2:  { hi: 'मीरा के पद — मीराबाई की कृष्ण-भक्ति की अनूठी अभिव्यक्ति। इन पदों में मीरा ने कृष्ण के प्रति अपनी अनन्य श्रद्धा और प्रेम को व्यक्त किया है।', en: 'Meera ke Pad — Unique expression of Mirabai\'s devotion to Lord Krishna through soulful verses.' },
    3:  { hi: 'मनुष्यता — मैथिलीशरण गुप्त की यह कविता मानवता, परोपकार और एकता का संदेश देती है। कवि कहते हैं कि सच्ची मनुष्यता दूसरों की सेवा में है।', en: 'Manushyata — A poem by Maithilisharan Gupt emphasizing humanity, sacrifice and unity.' },
    4:  { hi: 'पर्वत प्रदेश में पावस — सुमित्रानंदन पंत की यह कविता पहाड़ी क्षेत्र में बरसात के मनोरम दृश्य का अत्यंत सुंदर चित्रण प्रस्तुत करती है।', en: 'Parvat Pradesh Mein Pavas — Sumitranandan Pant\'s vivid description of monsoon in the hills.' },
    5:  { hi: 'तोप — वीरेन डंगवाल की यह व्यंग्यात्मक कविता एक पुरानी तोप के माध्यम से युद्ध, ताकत और इतिहास पर सवाल उठाती है।', en: 'Top — A satirical poem by Viren Dangwal questioning war and power through an old cannon.' },
    6:  { hi: 'कर चले हम फ़िदा — कैफ़ी आज़मी की यह देशभक्ति कविता सैनिकों की वीरता और बलिदान को श्रद्धांजलि देती है।', en: 'Kar Chale Hum Fida — Kaifi Azmi\'s patriotic poem paying tribute to the bravery of soldiers.' },
    7:  { hi: 'आत्मत्राण — रवींद्रनाथ ठाकुर की यह कविता ईश्वर से मुसीबतों को हटाने की नहीं बल्कि उनसे लड़ने की शक्ति माँगती है।', en: 'Aatmtran — Rabindranath Tagore\'s prayer for strength to face difficulties, not to escape them.' },
    8:  { hi: 'बड़े भाई साहब — प्रेमचंद की इस कहानी में छोटे भाई की शरारतें और बड़े भाई के उपदेशों के माध्यम से शिक्षा और जीवन का मार्मिक चित्रण है।', en: 'Bade Bhai Sahab — Premchand\'s story depicting the contrast between bookish education and practical wisdom.' },
    9:  { hi: 'डायरी का एक पन्ना — सीताराम सेकसरिया की डायरी का यह अंश 26 जनवरी 1931 को कलकत्ता में हुए ऐतिहासिक स्वतंत्रता आंदोलन का जीवंत विवरण प्रस्तुत करता है।', en: 'Diary Ka Ek Panna — An eyewitness account of the historic January 26, 1931 freedom movement in Calcutta.' },
    10: { hi: 'तताँरा-वामीरो कथा — अंडमान-निकोबार द्वीप की एक सुंदर लोककथा जो प्रेम, त्याग और सामाजिक बंधनों की कहानी बताती है।', en: 'Tantara-Vamiro Katha — A beautiful folk tale from Andaman-Nicobar islands about love and social constraints.' },
    11: { hi: 'तीसरी कसम के शिल्पकार शैलेंद्र — गीतकार शैलेंद्र के जीवन और उनकी फिल्म "तीसरी कसम" के निर्माण की प्रेरक कहानी।', en: 'Teesri Kasam ke Shilpkar Shailendra — The inspiring story of lyricist Shailendra and the making of the film Teesri Kasam.' },
    12: { hi: 'अब कहाँ दूसरे के दुख से दुखी होने वाले — निदा फ़ाज़ली का यह पाठ पर्यावरण संरक्षण और मानवता के क्षरण पर विचार करता है।', en: 'Ab Kahan Doosre ke Dukh se Dukhi Hone Wale — Nida Fazli\'s reflection on environmental degradation and loss of empathy.' },
    13: { hi: 'पतझर में टूटी पत्तियाँ — रवींद्र केलेकर के दो लघु निबंध: "गिन्नी का सोना" और "झेन की देन" जो जीवन दर्शन की गहरी बातें सरल भाषा में कहते हैं।', en: 'Patahar Mein Tooti Pattiyan — Two short essays on life philosophy: Ginni Ka Sona and Zen Ki Den.' },
    14: { hi: 'कारतूस — हबीब तनवीर का यह एकांकी वज़ीर अली की बहादुरी और अंग्रेजों के विरुद्ध उनके साहस की रोमांचक कहानी प्रस्तुत करता है।', en: 'Kartoos — Habib Tanvir\'s one-act play depicting the bravery of Wazir Ali against the British.' },
  },
  'संचयन (भाग-2)': {
    1: { hi: 'हरिहर काका — मिथिलेश्वर की इस कहानी में एक निःसंतान बुजुर्ग की ज़मीन को लेकर परिवार और ठाकुरबारी के बीच की स्वार्थपूर्ण लड़ाई का मार्मिक चित्रण है।', en: 'Harihar Kaka — A poignant story about an old childless man caught between the greed of his family and a temple.' },
    2: { hi: 'सपनों के-से दिन — गुरदयाल सिंह की यह कहानी बचपन की मासूमियत, स्कूल की यादें और जीवन की पहली सीख को बड़े ही आत्मीय ढंग से प्रस्तुत करती है।', en: 'Sapno ke-se Din — Gurdayal Singh\'s nostalgic story about childhood innocence and school memories.' },
    3: { hi: 'टोपी शुक्ला — राही मासूम रज़ा की यह कहानी हिंदू-मुस्लिम मित्रता के माध्यम से सांप्रदायिक सद्भाव और बचपन की निश्छल दोस्ती का संदेश देती है।', en: 'Topi Shukla — A story about Hindu-Muslim friendship conveying communal harmony through children\'s innocent bond.' },
  }
};

function getIntroData(bookName, chNum) {
  const name = bookName.toLowerCase();
  let bookKey = null;
  if (name.includes('स्पर्श') || name.includes('sparsh')) {
    bookKey = 'स्पर्श (भाग-2)';
  } else if (name.includes('संचयन') || name.includes('sanchayan')) {
    bookKey = 'संचयन (भाग-2)';
  }
  if (!bookKey) return null;
  return (CHAPTER_INTROS[bookKey] || {})[chNum] || null;
}

function renderChapter(book, ch) {
  const chId = `ch-${book.name.replace(/\s/g,'-')}-${ch.num}`;
  const safeBook = book.name.replace(/'/g,"\\'");
  const safeTitle = ch.title.replace(/'/g,"\\'");
  const safeUrl = (ch.file_url || '').replace(/'/g,"\\'");
  return `
    <div class="chapter-item" id="${chId}">
      <div class="chapter-header" role="button" tabindex="0" aria-expanded="false"
           onclick="openRightContent('${safeBook}',${ch.num},'${safeTitle}','summary')">
        <div class="ch-num">${ch.num}</div>
        <div class="ch-title">${ch.title}</div>
        <div class="ch-toggle" style="font-size:.8rem;color:var(--accent);font-weight:600;">पढ़ें &rarr;</div>
      </div>
    </div>`;
}

// Called when user clicks a chapter row — loads details in the right panel
function selectChapter(bookName, chNum, chTitle, fileUrl) {
  openRightContent(bookName, chNum, chTitle, 'summary');
}

// ─── HTML Content Viewer & Editor Helpers ─────────────────────────────────────
let _chapterHtmlCache = null;

async function fetchChapterHtmlContent() {
  if (_chapterHtmlCache) return _chapterHtmlCache;
  try {
    const res = await fetch('/chapter_html_content.json');
    if (!res.ok) throw new Error('Failed to load chapter content');
    _chapterHtmlCache = await res.json();
    return _chapterHtmlCache;
  } catch (err) {
    console.error('Error fetching chapter content:', err);
    return {};
  }
}

// Maps chapter title keywords (English or Hindi) to short key names
const CHAPTER_KEY_MAP = [
  { keys: ['kabir','\u0915\u092C\u0940\u0930'],                                        code: 'kabir'      },
  { keys: ['meera','mira','\u092E\u0940\u0930\u093E'],                                  code: 'meera'      },
  { keys: ['bihari','\u092C\u093F\u0939\u093E\u0930\u0940'],                          code: 'bihari'     },
  { keys: ['manushyata','\u092E\u0928\u0941\u0937\u094D\u092F\u0924\u093E'],         code: 'manushyata' },
  { keys: ['pavas','paavas','parvat','\u092A\u093E\u0935\u0938'],                       code: 'pavas'      },
  { keys: ['madhur','deepak','\u0926\u0940\u092A\u0915'],                               code: 'deepak'     },
  { keys: ['topi','\u091F\u094B\u092A\u0940'],                                         code: 'topi'       },
  { keys: ['top','tope','\u0924\u094B\u092A'],                                          code: 'top'        },
  { keys: ['fida','fidaa','\u0915\u0930 \u091A\u0932\u0947','\u092B\u093C\u093F\u0926\u093E'], code: 'fida' },
  { keys: ['aatmtran','atmtran','\u0906\u0924\u094D\u092E\u0924\u094D\u0930\u093E\u0923'],      code: 'aatmtran'  },
  { keys: ['bade bhai','bade bha','\u092C\u095C\u0947 \u092D\u093E\u0908'],           code: 'badebhai'   },
  { keys: ['diary','\u0921\u093E\u092F\u0930\u094D\u0940'],                                  code: 'diary'      },
  { keys: ['tantara','tatara','\u0924\u0924\u093E\u0901\u0930\u093E'],                code: 'tantara'    },
  { keys: ['shailendra','teesri kasam','\u0936\u0948\u0932\u0947\u0902\u0926\u094D\u0930'], code: 'shailendra' },
  { keys: ['ab kahan','\u0905\u092C \u0915\u0939\u093E\u0901'],                      code: 'abkahan'    },
  { keys: ['patjhar','pattiya','\u092A\u0924\u091D\u0930'],                             code: 'patjhar'    },
  { keys: ['kartoos','\u0915\u093E\u0930\u0924\u0942\u0938'],                         code: 'kartoos'    },
  { keys: ['girgit','\u0917\u093F\u0930\u0917\u093F\u091F'],                         code: 'girgit'     },
  { keys: ['harihar','\u0939\u0930\u093F\u0939\u0930'],                               code: 'harihar'    },
  { keys: ['sapno','sapne','\u0938\u092A\u0928\u094B\u0902'],                          code: 'sapno'      },
];

function getChapterContentKey(bookName, chNum, chTitle) {
  const board = String(state.board || 'CBSE').toLowerCase();
  const cls   = String(state.cls  || '10');
  const subj  = String(state.subj || 'Hindi').toLowerCase();
  const title = String(chTitle || '').toLowerCase();

  let chCode = null;
  for (const entry of CHAPTER_KEY_MAP) {
    for (const kw of entry.keys) {
      if (title.includes(kw.toLowerCase())) { chCode = entry.code; break; }
    }
    if (chCode) break;
  }
  if (!chCode) chCode = 'ch' + chNum;

  return board + '_' + cls + '_' + subj + '_' + chCode;
}

async function openRightContent(bookName, chNum, chTitle, category) {
  const sBook  = bookName.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
  const sTitle = chTitle.replace(/\\/g,'\\\\').replace(/'/g,"\\'");
  const safeCat = category || 'summary';

  const catTabs = [
    { key: 'summary',    icon: '\uD83D\uDCDD', label: '\u092A\u093E\u0920 \u0938\u093E\u0930\u093E\u0902\u0936' },
    { key: 'notes',      icon: '\u2753',       label: '\u0928\u094B\u091F\u094D\u0938' },
    { key: 'muhavre',    icon: '\uD83D\uDCD6', label: '\u092E\u0941\u0939\u093E\u0935\u0930\u0947' },
    { key: 'pyq',        icon: '\uD83D\uDD50', label: 'PYQ' },
    { key: 'additional', icon: '\u2B50',       label: '\u0905\u092D\u094D\u092F\u093E\u0938 \u092A\u094D\u0930\u0936\u094D\u0928' },
  ];

  const tabsHtml = catTabs.map(t => {
    const cls = t.key === safeCat ? 'fs-tab fs-tab--active' : 'fs-tab';
    return '<button class="' + cls + '" onclick="openRightContent(\'' + sBook + '\',' + chNum + ',\'' + sTitle + '\',\'' + t.key + '\')">' + t.icon + ' ' + t.label + '</button>';
  }).join('');

  // Remove existing overlay if any
  const existing = document.getElementById('fs-doc-overlay');
  if (existing) existing.remove();

  // Build full-screen overlay
  const overlay = document.createElement('div');
  overlay.id = 'fs-doc-overlay';
  overlay.className = 'fs-overlay';
  overlay.innerHTML =
    '<div class="fs-header">'
    + '<button class="fs-back-btn" onclick="closeFsOverlay()">&#8592; \u0935\u093E\u092A\u0938</button>'
    + '<div class="fs-breadcrumb">'
    + '<span class="fs-bc-book">' + bookName + '</span>'
    + '<span class="fs-bc-sep">&rsaquo;</span>'
    + '<span class="fs-bc-ch">Ch. ' + chNum + '</span>'
    + '<span class="fs-bc-sep">&rsaquo;</span>'
    + '<span class="fs-bc-title">' + chTitle + '</span>'
    + '</div>'
    + '</div>'
    + '<div class="fs-tabs-bar">' + tabsHtml + '</div>'
    + '<div class="fs-doc-body" id="fs-doc-body">'
    + '<div class="fs-loading"><div class="fs-spinner"></div><span>Content \u0932\u094B\u0921 \u0939\u094B \u0930\u0939\u093E \u0939\u0948...</span></div>'
    + '</div>';

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  // Fetch content
  const key = getChapterContentKey(bookName, chNum, chTitle);
  const store = await fetchChapterHtmlContent();
  const htmlContent = (store && store[key] && store[key][safeCat]) ? store[key][safeCat] : '';

  const docBody = document.getElementById('fs-doc-body');
  if (!docBody) return;

  if (!htmlContent) {
    docBody.innerHTML = '<div class="fs-empty"><div style="font-size:3.5rem;margin-bottom:1rem">\uD83D\uDEA7</div><h3>\u091C\u0932\u094D\u0926 \u0906\u090F\u0917\u093E!</h3><p>\u0907\u0938 section \u0915\u093E content \u0924\u0948\u092F\u093E\u0930 \u0915\u093F\u092F\u093E \u091C\u093E \u0930\u0939\u093E \u0939\u0948\u0964</p></div>';
    return;
  }

  docBody.innerHTML = '<div class="fs-doc-content">' + htmlContent + '</div>';
}

function closeFsOverlay() {
  const overlay = document.getElementById('fs-doc-overlay');
  if (overlay) {
    overlay.classList.add('fs-overlay--exit');
    setTimeout(() => { overlay.remove(); document.body.style.overflow = ''; }, 280);
  }
}

// Close on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeFsOverlay();
});

function openRightComingSoon(type, chTitle) {
  const panel = document.getElementById('boards-right-panel');
  if (!panel) return;
  panel.innerHTML = `
    <div class="rp-summary-wrap">
      <div class="rp-summary-header">
        <span style="font-weight:700;color:var(--text-primary)">${type} — ${chTitle}</span>
      </div>
      <div class="rp-summary-body" style="text-align:center;padding:3rem 2rem">
        <div style="font-size:2.5rem;margin-bottom:1rem">🚧</div>
        <h3 style="color:var(--text-primary);margin-bottom:.5rem">जल्द आएगा!</h3>
        <p style="color:var(--text-muted)">यह सामग्री तैयार की जा रही है।</p>
      </div>
    </div>`;
}

function openRightPDF(bookName, chNum, chTitle, fileUrl) {
  const panel = document.getElementById('boards-right-panel');
  if (!panel) return;
  const url = (fileUrl || '').trim();
  if (!url) { openRightComingSoon('PDF', chTitle); return; }
  const sBook = bookName.replace(/'/g,"\\'");
  const sTitle = chTitle.replace(/'/g,"\\'");
  
  const isAbsoluteUrl = /^https?:\/\//i.test(url);
  const absoluteUrl = isAbsoluteUrl ? url : `${window.location.origin}${url}`;

  panel.innerHTML = `
    <div class="rp-summary-wrap">
      <div class="rp-summary-header">
        <div>
          <div style="font-size:.72rem;color:var(--text-muted);margin-bottom:.15rem">${bookName} &rsaquo; Chapter ${chNum}</div>
          <span style="font-weight:700;font-size:1.05rem;color:var(--text-primary)">${chTitle} — PDF</span>
        </div>
        <button class="rp-summary-back" onclick="selectChapter('${sBook}',${chNum},'${sTitle}','${url.replace(/'/g,"\\'")}')">← वापस</button>
      </div>
      <div style="height:calc(100vh - var(--nav-h) - 180px);background:#fff">
        <iframe src="https://docs.google.com/viewer?url=${encodeURIComponent(absoluteUrl)}&embedded=true"
          style="width:100%;height:100%;border:none" loading="lazy" title="${chTitle} PDF">
        </iframe>
      </div>
    </div>`;
}

// Placeholder: these are no longer needed but kept for backward compat
function _OLD_renderChapter_unused(book, ch) {
  const introData = getIntroData(book.name, ch.num);
  const introHi = introData ? introData.hi : '';
  const introEn = introData ? introData.en : '';
  const quickLinks = [
    { label: `${ch.title.split('—')[1] ? ch.title.split('—')[1].trim() : ch.title} — पाठ PDF`, action: `handleDownload('${book.name} — Chapter ${ch.num}', '${ch.file_url || ''}')`, icon: '📄' },
    { label: 'पाठ सारांश (Summary)', action: `openSummary('${book.name.replace(/'/g, "\\'")}', ${ch.num}, '${ch.title.replace(/'/g, "\\'")}')`, icon: '📝' },
    { label: 'प्रश्न-उत्तर (Q&A)', action: `openDocViewer('${book.name} Ch.${ch.num} — Q&A')`, icon: '❓' },
    { label: 'मुहावरे / शब्द-अर्थ', action: `openDocViewer('${book.name} Ch.${ch.num} — Muhavare')`, icon: '📖' },
    { label: 'पिछले वर्ष के प्रश्न (PYQ)', action: `openDocViewer('${book.name} Ch.${ch.num} — PYQ')`, icon: '🕐' },
    { label: 'अतिरिक्त अभ्यास प्रश्न', action: `openDocViewer('${book.name} Ch.${ch.num} — Additional Qs')`, icon: '⭐' },
  ];

  // Right column: sidebar resource buttons
  const sidebarOptions = [
    { icon: SVG.file,   color: '#2BA899', bg: '#E8F8F6', label: 'Summary',          sublabel: 'पाठ का सार',         action: `openSummary('${book.name.replace(/'/g, "\\'")}', ${ch.num}, '${ch.title.replace(/'/g, "\\'")}')` },
    { icon: SVG.check,  color: '#27AE60', bg: '#EAF7EF', label: 'Q & A',            sublabel: 'प्रश्न-उत्तर',        action: `openDocViewer('${book.name} Ch.${ch.num} — Q&A')` },
    { icon: SVG.pencil, color: '#9B59B6', bg: '#F5EFF9', label: 'Word Meanings',    sublabel: 'शब्द अर्थ',          action: `openDocViewer('${book.name} Ch.${ch.num} — Muhavare')` },
    { icon: SVG.clock,  color: '#E05555', bg: '#FDE8E8', label: 'PYQ',              sublabel: 'पिछले वर्ष प्रश्न',   action: `openDocViewer('${book.name} Ch.${ch.num} — PYQ')` },
    { icon: SVG.star,   color: '#E8900A', bg: '#FFF4E0', label: 'Practice',         sublabel: 'अभ्यास प्रश्न',      action: `openDocViewer('${book.name} Ch.${ch.num} — Additional Qs')` },
    { icon: SVG.dl,     color: '#3A7BD5', bg: '#EBF3FD', label: 'Download PDF',     sublabel: 'पाठ डाउनलोड',       action: `handleDownload('${book.name} — Chapter ${ch.num}', '${ch.file_url || ''}')` },
  ];

  return `
    <div class="chapter-item" id="${chId}">
      <div class="chapter-header" role="button" tabindex="0" aria-expanded="false">
        <div class="ch-num">${ch.num}</div>
        <div class="ch-title">${ch.title}</div>
        <div class="ch-toggle">${SVG.chevD}</div>
      </div>
      <div class="chapter-body">
        <div class="chapter-body-inner">
          <div class="ch-two-col">

            <!-- LEFT: intro + quick links -->
            <div class="ch-left">
              ${introHi ? `
              <div class="ch-intro">
                <p class="ch-intro-hi">${introHi}</p>
                ${introEn ? `<p class="ch-intro-en">${introEn}</p>` : ''}
              </div>` : ''}

              <div class="ch-links-block">
                <p class="ch-links-label">इस अध्याय में:</p>
                <ul class="ch-links-list">
                  ${quickLinks.map(l => `
                    <li>
                      <span class="ch-link-icon">${l.icon}</span>
                      <a href="#" class="ch-link" onclick="event.preventDefault();${l.action}">${l.label}</a>
                    </li>`).join('')}
                </ul>
              </div>

              ${ch.worksheets > 0 ? `
              <div class="ch-ws-block">
                <p class="ch-links-label">अभ्यास पत्रक (Worksheets):</p>
                <div class="ch-ws-row">
                  ${Array.from({ length: ch.worksheets }, (_, i) => `
                    <button class="ws-btn download" onclick="handleDownload('${book.name} Ch.${ch.num} Worksheet ${i+1}')">${SVG.dl} Worksheet ${i+1}</button>
                    <button class="ws-btn upload" onclick="openUploadModal('${book.name} Ch.${ch.num} Worksheet ${i+1}')">${SVG.up} Upload</button>
                  `).join('')}
                </div>
              </div>` : ''}
            </div>

            <!-- RIGHT: option buttons -->
            <div class="ch-right">
              <p class="ch-right-label">Quick Access</p>
              <div class="ch-sidebar-opts">
                ${sidebarOptions.map(r => `
                  <div class="ch-opt-btn" role="button" tabindex="0" onclick="${r.action}">
                    <div class="ch-opt-icon" style="background:${r.bg};color:${r.color}">${r.icon}</div>
                    <div class="ch-opt-text">
                      <span class="ch-opt-label">${r.label}</span>
                      <span class="ch-opt-sub">${r.sublabel}</span>
                    </div>
                    <span class="ch-opt-arrow">→</span>
                  </div>`).join('')}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>`;
}

/* ══════════════════════════════════════════
   7. TEST SHEETS
══════════════════════════════════════════ */
function initTestSheets() {
  /* Category tabs */
  document.querySelectorAll('.test-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      state.testType = tab.dataset.testType;
      document.querySelectorAll('.test-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.testType === state.testType);
        t.setAttribute('aria-selected', String(t.dataset.testType === state.testType));
      });
      renderTestContent();
    });
  });

  /* Board filter */
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      state.testBoard = pill.dataset.filter;
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.toggle('active', p.dataset.filter === state.testBoard));
      renderTestContent();
    });
  });

  renderTestContent();
}

function renderTestContent() {
  const container = document.getElementById('test-content');
  if (!container) return;

  const typeData  = TEST_DATA[state.testType];
  const boardData = typeData && typeData[state.testBoard];

  if (!boardData) { container.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:2rem">No data available.</p>'; return; }

  const classes = BOARDS_DATA[state.testBoard].classes.slice().reverse(); // descending
  let html = '';

  classes.forEach(cls => {
    const papers = boardData[cls] || [];
    html += `
      <div class="test-class-item" data-class="${cls}">
        <div class="test-class-header" role="button">
          <span class="tc-label">Class ${cls}</span>
          <span class="tc-count">${papers.length} ${papers.length === 1 ? 'paper' : 'papers'}</span>
          <span class="tc-toggle">${SVG.chevD}</span>
        </div>
        <div class="test-class-body">
          <div class="test-papers-grid">
            ${papers.length > 0 ? papers.map(p => renderTestPaperCard(p)).join('') : '<p class="no-papers-msg">More papers being added soon. Check back or contact a mentor.</p>'}
          </div>
        </div>
      </div>`;
  });

  container.innerHTML = html;

  /* Class accordion toggle */
  container.querySelectorAll('.test-class-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.test-class-item');
      item.classList.toggle('open');
    });
  });

  /* Auto-open Class 10 */
  const cls10 = container.querySelector('[data-class="10"]');
  if (cls10) cls10.classList.add('open');
}

function renderTestPaperCard(p) {
  return `
    <div class="test-paper-card">
      <div class="tp-header">
        <div class="tp-icon" style="background:${p.color}">${SVG.file}</div>
        <div class="tp-info">
          <div class="tp-title">${p.title}</div>
          <div class="tp-meta">${p.subject} | ${p.pages} pages | ${p.date}</div>
        </div>
      </div>
      <div class="tp-view-mode">
        ${SVG.eye} Default: View Mode
      </div>
      <div class="tp-actions">
        <button class="tp-action-btn view" onclick="openDocViewer('${p.title.replace(/'/g,"\\'")}')">
          ${SVG.eye} View
        </button>
        <button class="tp-action-btn download" onclick="handleDownload('${p.title.replace(/'/g,"\\'")}')">
          ${SVG.dl} Download
        </button>
        <button class="tp-action-btn upload" onclick="openUploadModal('${p.title.replace(/'/g,"\\'")}')">
          ${SVG.up} Upload Answer
        </button>
        <button class="tp-action-btn submit" onclick="simulateSubmit(this, '${p.id}')">
          ${SVG.send} Submit
        </button>
      </div>
    </div>`;
}

/* ══════════════════════════════════════════
   8. CONTACT FORM
══════════════════════════════════════════ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = {
    name:    { el: form.querySelector('#name'),          errId: 'name-error' },
    email:   { el: form.querySelector('#contact-email'), errId: 'email-error' },
    cls:     { el: form.querySelector('#student-class'), errId: 'class-error' },
    message: { el: form.querySelector('#message'),       errId: 'message-error' },
  };

  Object.values(fields).forEach(({ el, errId }) => {
    el.addEventListener('input',  () => clearError(el, errId));
    el.addEventListener('change', () => clearError(el, errId));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;

    const name = fields.name.el.value.trim();
    if (!name || name.length < 2) { showError(fields.name.el, fields.name.errId, 'Please enter your full name (at least 2 characters).'); valid = false; }
    else clearError(fields.name.el, fields.name.errId);

    const emailVal = fields.email.el.value.trim();
    const emailOK  = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
    const phoneOK  = /^[6-9]\d{9}$/.test(emailVal.replace(/\s/g,''));
    if (!emailVal) { showError(fields.email.el, fields.email.errId, 'Please enter your email or phone number.'); valid = false; }
    else if (!emailOK && !phoneOK) { showError(fields.email.el, fields.email.errId, 'Enter a valid email or 10-digit Indian phone number.'); valid = false; }
    else clearError(fields.email.el, fields.email.errId);

    if (!fields.cls.el.value) { showError(fields.cls.el, fields.cls.errId, 'Please select your class.'); valid = false; }
    else clearError(fields.cls.el, fields.cls.errId);

    const msg = fields.message.el.value.trim();
    if (!msg || msg.length < 10) { showError(fields.message.el, fields.message.errId, 'Please write a message (at least 10 characters).'); valid = false; }
    else clearError(fields.message.el, fields.message.errId);

    if (!valid) return;

    const btn = document.getElementById('form-submit');
    const s   = document.getElementById('form-success');
    btn.disabled = true;
    btn.textContent = 'Sending...';

    try {
      const res  = await fetch('/api/mentor-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email_or_phone: emailVal, student_class: fields.cls.el.value, message: msg })
      });
      const data = await res.json();
      if (res.ok) {
        s.textContent = String.fromCharCode(10003) + ' ' + data.message;
        s.style.display = 'block';
        form.reset();
        setTimeout(() => { s.style.display = 'none'; }, 6000);
      } else {
        showToast(data.error || 'Failed to send message. Please try again.');
      }
    } catch (err) {
      showToast('Network error. Please check your connection.');
    } finally {
      btn.disabled = false;
      btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message';
    }
  });
}

/* ══════════════════════════════════════════
   9. REVISION NOTIFY FORM
══════════════════════════════════════════ */
function initRevisionNotify() {
  const form = document.getElementById('notify-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const succ      = document.getElementById('notify-success');
    const nameEl    = document.getElementById('notify-name');
    const contactEl = document.getElementById('notify-contact');
    const classEl   = document.getElementById('notify-class');
    try {
      const res  = await fetch('/api/revision-notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:      nameEl?.value?.trim()    || 'Student',
          contact:   contactEl?.value?.trim() || 'N/A',
          class_num: classEl?.value           || '10'
        })
      });
      const data = await res.json();
      succ.textContent = res.ok
        ? String.fromCharCode(10003) + ' ' + data.message
        : (data.error || 'Registered successfully!');
    } catch (err) {
      succ.textContent = String.fromCharCode(10003) + " You'll be notified when Revision Classes begin!";
    }
    form.reset();
    setTimeout(() => { succ.textContent = ''; }, 5000);
  });
}

/* ══════════════════════════════════════════
   10. DOCUMENT VIEWER MODAL
══════════════════════════════════════════ */
function initDocModal() {
  const modal     = document.getElementById('doc-modal');
  const closeBtn  = document.getElementById('doc-modal-close');
  const dlBtn     = document.getElementById('doc-download-btn');
  if (!modal) return;

  closeBtn.addEventListener('click', () => closeModal(modal));
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(modal); });

  dlBtn.addEventListener('click', () => {
    const title = document.getElementById('doc-modal-title').textContent;
    handleDownload(title);
  });
}

function openDocViewer(title, url) {
  const panel = document.getElementById('boards-right-panel');
  
  // Decide if we should render inline inside right panel or open in modal
  const isBoardsSection = title.includes('Syllabus') || 
                          title.includes('Marking Scheme') || 
                          title.includes('Book') || 
                          title.includes('Ch.') || 
                          title.includes('Chapter') || 
                          title.includes('PDF') ||
                          (panel && document.getElementById('school-boards') && document.getElementById('school-boards').contains(document.activeElement));

  if (panel && isBoardsSection) {
    const cleanUrl = (url || '').trim();
    if (!cleanUrl) {
      panel.innerHTML = `
        <div class="rp-summary-wrap">
          <div class="rp-summary-header">
            <span style="font-weight:700;color:var(--text-primary)">${title}</span>
          </div>
          <div class="rp-summary-body" style="text-align:center;padding:3rem 2rem">
            <div style="font-size:2.5rem;margin-bottom:1rem">🚧</div>
            <h3 style="color:var(--text-primary);margin-bottom:.5rem">जल्द आएगा!</h3>
            <p style="color:var(--text-muted)">यह सामग्री तैयार की जा रही है।</p>
          </div>
        </div>`;
      return;
    }

    const isAbsoluteUrl = /^https?:\/\//i.test(cleanUrl);
    const absoluteUrl = isAbsoluteUrl ? cleanUrl : `${window.location.origin}${cleanUrl}`;

    panel.innerHTML = `
      <div class="rp-summary-wrap">
        <div class="rp-summary-header">
          <div>
            <span style="font-weight:700;color:var(--text-primary)">${title}</span>
          </div>
          <div style="display:flex;gap:.4rem;align-items:center;">
            <button class="rp-summary-back" onclick="handleDownload('${title.replace(/'/g,"\\'")}', '${absoluteUrl}')" style="font-size:.78rem;">
              📥 Download
            </button>
            <button class="rp-summary-back" onclick="window.open('${absoluteUrl}', '_blank')" style="font-size:.78rem;">
              ↗ Open Tab
            </button>
          </div>
        </div>
        <div style="height:calc(100vh - var(--nav-h) - 180px);background:#fff">
          <iframe src="https://docs.google.com/viewer?url=${encodeURIComponent(absoluteUrl)}&embedded=true"
            style="width:100%;height:100%;border:none" loading="lazy" title="${title}">
          </iframe>
        </div>
      </div>`;
    return;
  }

  // Fallback to standard modal behavior for other sections (like Test Sheets)
  const modal    = document.getElementById('doc-modal');
  const titleEl  = document.getElementById('doc-modal-title');
  const bodyEl   = document.getElementById('doc-viewer-body');
  if (!modal) return;

  titleEl.textContent = title;
  if (!window._originalDocViewerHTML) {
    window._originalDocViewerHTML = bodyEl.innerHTML;
  }

  const dlBtn = document.getElementById('doc-download-btn');
  if (dlBtn) {
    dlBtn.style.display = '';
    const newDlBtn = dlBtn.cloneNode(true);
    dlBtn.parentNode.replaceChild(newDlBtn, dlBtn);
    newDlBtn.addEventListener('click', () => handleDownload(title, url));
  }

  if (url) {
    const cleanUrl = url.trim();
    const isAbsoluteUrl = /^https?:\/\//i.test(cleanUrl);
    const absoluteUrl = isAbsoluteUrl ? cleanUrl : `${window.location.origin}${cleanUrl}`;
    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    
    let viewerUrl = absoluteUrl;
    if (isMobile) {
      viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(absoluteUrl)}&embedded=true`;
    }

    bodyEl.innerHTML = `
      <div class="pdf-viewer-wrap">
        <iframe
          src="${viewerUrl}"
          width="100%"
          style="border:none; border-radius:var(--r-md); height: clamp(420px, 75vh, 800px); display:block;"
          title="${title}"
          loading="lazy"
          allowfullscreen
        ></iframe>
        ${isMobile ? `
        <div class="viewer-mobile-hint">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          Document load nahi ho raha?
          <a href="${url}" target="_blank" rel="noopener" class="viewer-open-link">Naye tab mein kholen →</a>
        </div>` : ''}
      </div>`;
  } else {
    bodyEl.innerHTML = window._originalDocViewerHTML;
    const nameEl = document.getElementById('doc-preview-name');
    if (nameEl) nameEl.textContent = title;
  }

  openModal(modal);
}


// ─── Chapter Summary Viewer System ──────────────────────────────────────────
let _summariesCache = null;

async function fetchSummaries() {
  if (_summariesCache) return _summariesCache;
  try {
    const res = await fetch('/summary_content.json');
    if (!res.ok) throw new Error('Failed to load summaries');
    _summariesCache = await res.json();
    return _summariesCache;
  } catch (err) {
    console.error('Error fetching summaries:', err);
    return null;
  }
}

function getSummaryKey(bookName, chNum, chTitle = '') {
  const isSparsh = bookName.includes('स्पर्श') || bookName.toLowerCase().includes('sparsh');
  const isSanchayan = bookName.includes('संचयन') || bookName.toLowerCase().includes('sanchayan');
  const title = (chTitle || '').toLowerCase();
  
  if (isSparsh) {
    if (chNum === 2 || title.includes('मीरा') || title.includes('meera')) return 'meera_ke_pad';
    if (chNum === 9 || chNum === 11 || title.includes('डायरी') || title.includes('diary')) return 'dairy_ke_panne';
  }
  if (isSanchayan) {
    if (chNum === 1 || title.includes('हरिहर') || title.includes('harihar')) return 'harihar_kaka';
  }
  return null;
}

function parseSummaryArray(arr, bookName, chNum, chTitle) {
  if (!arr || arr.length === 0) return null;
  
  let bookTitle = chTitle;
  let classInfo = 'Class 10 - Hindi Course B (' + bookName + ')';
  let author = '';
  let introTitle = '';
  let introText = '';
  let points = [];
  
  let currentIndex = 0;
  
  if (arr[currentIndex] === "पाठ का मुख्य विवरण (Quick Overview)") {
    currentIndex++;
  }
  
  while (currentIndex < arr.length) {
    const line = arr[currentIndex].trim();
    if (line.includes("पाठ का नाम:")) {
      bookTitle = line.replace(/.*पाठ का नाम:\s*/, '').replace(/[•\s]/g, '').trim();
      currentIndex++;
    } else if (line.includes("कक्षा:")) {
      classInfo = line.replace(/.*कक्षा:\s*/, '').replace(/[•\s]/g, '').trim();
      currentIndex++;
    } else if (line.includes("लेखक:")) {
      author = line.replace(/.*लेखक:\s*/, '').replace(/[•\s]/g, '').trim();
      currentIndex++;
    } else if (line === "(SUMMARY)" || line === "SUMMARY") {
      currentIndex++;
    } else {
      break;
    }
  }
  
  if (currentIndex < arr.length && (arr[currentIndex].includes("Introduction") || arr[currentIndex].includes("Overview"))) {
    introTitle = arr[currentIndex];
    introText = arr[currentIndex + 1];
    currentIndex += 2;
  }
  
  let currentPoint = null;
  for (let i = currentIndex; i < arr.length; i++) {
    const text = arr[i].trim();
    if (!text) continue;
    
    if (text.startsWith("हिंदी:") || text.startsWith("हिंदी :")) {
      if (currentPoint) {
        currentPoint.hindi = text.replace(/^हिंदी\s*:\s*/, '').trim();
      }
    } else if (text.startsWith("English:") || text.startsWith("English :")) {
      if (currentPoint) {
        currentPoint.english = text.replace(/^English\s*:\s*/, '').trim();
      }
    } else {
      if (currentPoint) {
        points.push(currentPoint);
      }
      currentPoint = {
        title: text.replace(/^\d+[\.\s\-]+/, '').trim(), // strip leading number like "1. "
        hindi: "",
        english: ""
      };
    }
  }
  if (currentPoint) {
    points.push(currentPoint);
  }
  
  return {
    bookTitle,
    classInfo,
    author,
    introTitle,
    introText,
    points
  };
}

async function openSummary(bookName, chNum, chTitle) {
  const panel = document.getElementById('boards-right-panel');
  if (!panel) return;

  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const sBook  = bookName.replace(/'/g,"\\'");
  const sTitle = chTitle.replace(/'/g,"\\'");

  panel.innerHTML = `
    <div class="rp-summary-wrap">
      <div class="rp-summary-header">
        <span style="font-weight:700;color:var(--text-primary)">${bookName} Ch.${chNum} — Summary</span>
        <button class="rp-summary-back" onclick="selectChapter('${sBook}',${chNum},'${sTitle}','')">← वापस</button>
      </div>
      <div class="rp-summary-body" style="display:flex;align-items:center;gap:.75rem;padding:2rem">
        <div style="width:32px;height:32px;border:3px solid var(--border);border-top:3px solid var(--accent);border-radius:50%;animation:spin 1s linear infinite"></div>
        <p style="color:var(--text-muted);font-weight:500">Summary लोड हो रही है...</p>
      </div>
    </div>`;

  const summaries = await fetchSummaries();
  const summaryKey = getSummaryKey(bookName, chNum, chTitle);

  if (!summaries || !summaryKey || !summaries[summaryKey]) {
    panel.innerHTML = `
      <div class="rp-summary-wrap">
        <div class="rp-summary-header">
          <span style="font-weight:700;color:var(--text-primary)">${chTitle} — Summary</span>
          <button class="rp-summary-back" onclick="selectChapter('${sBook}',${chNum},'${sTitle}','')">← वापस</button>
        </div>
        <div class="rp-summary-body" style="text-align:center;padding:3rem 2rem">
          <div style="font-size:2.5rem;margin-bottom:1rem">📝</div>
          <h3 style="color:var(--text-primary);margin-bottom:.5rem">Summary जल्द आएगी</h3>
          <p style="color:var(--text-muted)"><strong>${chTitle}</strong> का सारांश तैयार किया जा रहा है।</p>
        </div>
      </div>`;
    return;
  }

  const rawData = summaries[summaryKey];
  const data = parseSummaryArray(rawData, bookName, chNum, chTitle);

  let pts = '';
  if (data.introText) {
    pts += `<div class="summary-intro-box"><strong>${data.introTitle || 'अध्याय एक नज़र में'}:</strong><br/>${data.introText}</div>`;
  }
  pts += `<div class="summary-points-list">`;
  data.points.forEach(pt => {
    pts += `<div class="summary-point-item">
      <div class="summary-point-title"><strong>${pt.title}</strong></div>
      ${pt.hindi   ? `<div class="summary-text-hindi">${pt.hindi}</div>` : ''}
      ${pt.english ? `<div class="summary-text-english"><strong>English:</strong> ${pt.english}</div>` : ''}
    </div>`;
  });
  pts += `</div>`;

  panel.innerHTML = `
    <div class="rp-summary-wrap">
      <div class="rp-summary-header">
        <div>
          <div style="font-size:.72rem;color:var(--text-muted);margin-bottom:.15rem">${bookName} › Chapter ${chNum}</div>
          <span style="font-weight:700;font-size:1.05rem;color:var(--text-primary)">${data.bookTitle || chTitle}</span>
        </div>
        <button class="rp-summary-back" onclick="selectChapter('${sBook}',${chNum},'${sTitle}','')">← वापस</button>
      </div>
      <div class="rp-summary-body">
        <div class="summary-viewer-wrap">
          <h3 class="summary-section-title">पाठ का सार (Quick Revision Summary)</h3>
          ${pts}
        </div>
      </div>
    </div>`;
}





/* ══════════════════════════════════════════
   11. UPLOAD ANSWER SHEET MODAL
══════════════════════════════════════════ */
function initUploadModal() {
  const modal      = document.getElementById('upload-modal');
  const closeBtn   = document.getElementById('upload-modal-close');
  const dropArea   = document.getElementById('upload-drop-area');
  const fileInput  = document.getElementById('answer-file-input');
  const fileInfo   = document.getElementById('upload-file-selected');
  const filename   = document.getElementById('upload-filename');
  const removeBtn  = document.getElementById('remove-file');
  const submitBtn  = document.getElementById('upload-submit-btn');
  const successEl  = document.getElementById('upload-success');
  if (!modal) return;

  closeBtn.addEventListener('click', () => closeModal(modal));
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(modal); });

  /* File input change */
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
      filename.textContent = file.name;
      fileInfo.hidden = false;
      submitBtn.disabled = false;
      dropArea.style.display = 'none';
    }
  });

  /* Drag & drop */
  dropArea.addEventListener('dragover', (e) => { e.preventDefault(); dropArea.classList.add('dragover'); });
  dropArea.addEventListener('dragleave', () => dropArea.classList.remove('dragover'));
  dropArea.addEventListener('drop', (e) => {
    e.preventDefault(); dropArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) {
      filename.textContent = file.name;
      fileInfo.hidden = false;
      submitBtn.disabled = false;
      dropArea.style.display = 'none';
    }
  });

  /* Remove file */
  removeBtn.addEventListener('click', () => {
    fileInput.value = '';
    fileInfo.hidden = true;
    submitBtn.disabled = true;
    dropArea.style.display = '';
  });

  /* Submit */
  submitBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];
    if (!file) return;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Uploading...';

    const fd = new FormData();
    fd.append('answer_file',    file);
    fd.append('resource_type', 'worksheet');
    fd.append('resource_id',    window._uploadResourceId   || 'general');
    fd.append('resource_title', window._uploadResourceName || 'Answer Sheet');
    fd.append('student_name',   'Student');

    try {
      const res  = await fetch('/api/student-submit', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        successEl.textContent = String.fromCharCode(10003) + ' ' + data.message;
        fileInput.value = '';
        fileInfo.hidden = true;
        dropArea.style.display = '';
        submitBtn.innerHTML = SVG.send + ' Submit for Evaluation';
        setTimeout(() => {
          closeModal(modal);
          successEl.textContent = '';
          showToast('Answer sheet submitted! Feedback in 48 hours.');
        }, 2000);
      } else {
        showToast(data.error || 'Upload failed. Please try again.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = SVG.send + ' Submit for Evaluation';
      }
    } catch (err) {
      showToast('Network error during upload.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = SVG.send + ' Submit for Evaluation';
    }
  });
}

function openUploadModal(resourceName) {
  const modal    = document.getElementById('upload-modal');
  const label    = document.getElementById('upload-for-label');
  const fileInfo = document.getElementById('upload-file-selected');
  const submitBtn= document.getElementById('upload-submit-btn');
  const fileInput= document.getElementById('answer-file-input');
  const successEl= document.getElementById('upload-success');
  const dropArea = document.getElementById('upload-drop-area');
  if (!modal) return;
  label.textContent = `Upload your answer sheet for: "${resourceName}"`;
  fileInfo.hidden = true;
  submitBtn.disabled = true;
  if (fileInput) fileInput.value = '';
  if (successEl) successEl.textContent = '';
  if (dropArea) dropArea.style.display = '';
  openModal(modal);
}

/* ══════════════════════════════════════════
   12. SCROLL TO TOP
══════════════════════════════════════════ */
function initScrollTop() {
  const btn = document.getElementById('scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ══════════════════════════════════════════
   13. HELPERS
══════════════════════════════════════════ */
function openModal(modal) {
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
  modal.hidden = true;
  document.body.style.overflow = '';
}

function showError(el, errId, msg) {
  el.classList.add('error');
  el.setAttribute('aria-invalid', 'true');
  const err = document.getElementById(errId);
  if (err) err.textContent = msg;
}

function clearError(el, errId) {
  el.classList.remove('error');
  el.removeAttribute('aria-invalid');
  const err = document.getElementById(errId);
  if (err) err.textContent = '';
}

function handleDownload(title, url) {
  if (url) {
    const a = document.createElement('a');
    a.href = url;
    a.download = url.split('/').pop();
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Downloading: "${title}"`);
  } else {
    showToast(`"${title}" — will be available for download soon. Contact a mentor for direct access.`);
  }
}

function simulateSubmit(btn, paperId) {
  btn.disabled = true;
  btn.textContent = String.fromCharCode(10003) + ' Submitted';
  btn.style.background = '#EAF7EF';
  btn.style.color = '#1A7F4E';
  showToast('Paper submitted! Feedback within 48 hours.');
  fetch('/api/student-submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      resource_type:  'test_sheet',
      resource_id:    paperId,
      resource_title: 'Test Sheet ' + paperId,
      student_name:   'Student'
    })
  }).catch(() => {});
  setTimeout(() => {
    btn.disabled = false;
    btn.innerHTML = SVG.send + ' Submit';
    btn.style.background = '';
    btn.style.color = '';
  }, 6000);
}

function showToast(message) {
  const old = document.getElementById('gl-toast');
  if (old) old.remove();

  const toast = document.createElement('div');
  toast.id = 'gl-toast';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  Object.assign(toast.style, {
    position: 'fixed', bottom: '5rem', left: '50%',
    transform: 'translateX(-50%) translateY(20px)',
    background: '#1A2740', color: 'white',
    padding: '.7rem 1.4rem', borderRadius: '100px',
    fontSize: '.86rem', fontFamily: "'Inter', sans-serif", fontWeight: '500',
    boxShadow: '0 8px 24px rgba(0,0,0,.22)', zIndex: '9999',
    whiteSpace: 'nowrap', maxWidth: '90vw', textAlign: 'center',
    opacity: '0', transition: 'opacity .3s ease, transform .3s ease',
    overflow: 'hidden', textOverflow: 'ellipsis',
  });
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

// ─── Mobile Slide Layout helpers ───────────────────────────────────────────
function showSubjectDetails() {
  const layout = document.querySelector('.boards-split-layout');
  if (layout) layout.classList.add('show-right');
}

function goBackToChapters() {
  const layout = document.querySelector('.boards-split-layout');
  if (layout) layout.classList.remove('show-right');
  
  // Clear left highlight when coming back to the list
  document.querySelectorAll('.chapter-item').forEach(el => el.classList.remove('open'));
}
window.openRightContent = openRightContent;
window.closeFsOverlay = closeFsOverlay;
