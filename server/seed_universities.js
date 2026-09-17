/**
 * UniGuid.pk — Complete HEC-Recognized University Seed Script
 * Provinces: Federal/Islamabad, Punjab, KPK, Sindh (main)
 * Run with: node seed_universities.js
 */
import "dotenv/config";
import admin from "./firebase/admin.js";
import { FieldValue } from "firebase-admin/firestore";

const db = admin.firestore();

const UNIVERSITIES = [

  // ════════════════════════════════════════════════════════════
  // FEDERAL / ISLAMABAD
  // ════════════════════════════════════════════════════════════
  {
    name: "National University of Sciences & Technology (NUST)",
    shortName: "NUST",
    city: "Islamabad", province: "Federal", sector: "Public",
    type: "Research University", founded: 1991,
    officialWebsite: "https://www.nust.edu.pk",
    admissionPortal: "https://nust.edu.pk/admissions",
    email: "admission@nust.edu.pk", phone: "+92-51-90855555",
    description: "Pakistan's top-ranked public research university offering programmes in engineering, science, business and social sciences. HEC ranked #1.",
    programs: ["Engineering", "Computer Science", "Business", "Social Sciences", "Medical"],
    campuses: ["Islamabad (Main)", "Rawalpindi", "Karachi", "Peshawar"],
    hecRecognized: true, hecRanking: 1
  },
  {
    name: "COMSATS University Islamabad (CUI)",
    shortName: "COMSATS",
    city: "Islamabad", province: "Federal", sector: "Public",
    type: "University", founded: 1998,
    officialWebsite: "https://www.comsats.edu.pk",
    admissionPortal: "https://admission.comsats.edu.pk",
    email: "admission@comsats.edu.pk", phone: "+92-51-9049660",
    description: "A leading public sector multi-campus university known for computing, engineering and business sciences. Campuses across 6 cities.",
    programs: ["Computer Science", "Engineering", "Business", "Pharmacy", "Biosciences"],
    campuses: ["Islamabad", "Lahore", "Abbottabad", "Attock", "Sahiwal", "Wah", "Vehari"],
    hecRecognized: true, hecRanking: 5
  },
  {
    name: "Quaid-i-Azam University (QAU)",
    shortName: "QAU",
    city: "Islamabad", province: "Federal", sector: "Public",
    type: "Research University", founded: 1967,
    officialWebsite: "https://www.qau.edu.pk",
    admissionPortal: "https://qau.edu.pk/admissions",
    email: "admissions@qau.edu.pk", phone: "+92-51-9064-0000",
    description: "One of Pakistan's premier public research universities, renowned for natural sciences, social sciences and international relations.",
    programs: ["Natural Sciences", "Social Sciences", "International Relations", "Law", "Pharmacy"],
    campuses: ["Islamabad"],
    hecRecognized: true, hecRanking: 3
  },
  {
    name: "International Islamic University Islamabad (IIUI)",
    shortName: "IIUI",
    city: "Islamabad", province: "Federal", sector: "Public",
    type: "Islamic University", founded: 1980,
    officialWebsite: "https://www.iiu.edu.pk",
    admissionPortal: "https://iiu.edu.pk/admissions",
    email: "admission@iiu.edu.pk", phone: "+92-51-9019140",
    description: "A public international university integrating Islamic values with modern education in law, management, engineering and Islamic studies.",
    programs: ["Islamic Studies", "Law", "Management", "Engineering", "Languages", "Sciences"],
    campuses: ["Islamabad"],
    hecRecognized: true, hecRanking: 10
  },
  {
    name: "Air University",
    shortName: "AU",
    city: "Islamabad", province: "Federal", sector: "Public",
    type: "University", founded: 2002,
    officialWebsite: "https://www.au.edu.pk",
    admissionPortal: "https://au.edu.pk/admissions",
    email: "info@au.edu.pk", phone: "+92-51-9262557",
    description: "Sponsored by the Pakistan Air Force, Air University offers quality education in aerospace engineering, computing, management and social sciences.",
    programs: ["Aerospace Engineering", "Computer Science", "Business", "Electrical Engineering", "Social Sciences"],
    campuses: ["Islamabad", "Multan", "Kamra"],
    hecRecognized: true, hecRanking: 15
  },
  {
    name: "Pakistan Institute of Engineering & Applied Sciences (PIEAS)",
    shortName: "PIEAS",
    city: "Islamabad", province: "Federal", sector: "Public",
    type: "Research Institute/University", founded: 1967,
    officialWebsite: "https://www.pieas.edu.pk",
    admissionPortal: "https://pieas.edu.pk/admissions",
    email: "admissions@pieas.edu.pk", phone: "+92-51-2207380",
    description: "A highly selective federal research university under Pakistan Atomic Energy Commission, ranked among Asia's best in engineering and nuclear sciences.",
    programs: ["Nuclear Engineering", "Electrical Engineering", "Computer Science", "Mechanical Engineering", "Physics"],
    campuses: ["Islamabad"],
    hecRecognized: true, hecRanking: 2
  },
  {
    name: "National Defence University (NDU)",
    shortName: "NDU",
    city: "Islamabad", province: "Federal", sector: "Public",
    type: "University", founded: 1971,
    officialWebsite: "https://www.ndu.edu.pk",
    admissionPortal: "https://ndu.edu.pk/admissions",
    email: "info@ndu.edu.pk", phone: "+92-51-9246300",
    description: "NDU is a premier institution for higher education in defence, strategic studies, war studies and security policy in Pakistan.",
    programs: ["War Studies", "Strategic Studies", "Security Policy", "Leadership", "Peace & Conflict"],
    campuses: ["Islamabad"],
    hecRecognized: true, hecRanking: 20
  },
  {
    name: "Allama Iqbal Open University (AIOU)",
    shortName: "AIOU",
    city: "Islamabad", province: "Federal", sector: "Public",
    type: "Distance Learning University", founded: 1974,
    officialWebsite: "https://www.aiou.edu.pk",
    admissionPortal: "https://admission.aiou.edu.pk",
    email: "info@aiou.edu.pk", phone: "+92-51-9057611",
    description: "Pakistan's largest university by enrolment, offering distance and flexible education from Matric to PhD accessible across the country.",
    programs: ["Education", "Business", "Computer Science", "Social Sciences", "Humanities"],
    campuses: ["Islamabad (HQ)", "Regional Centres Nationwide"],
    hecRecognized: true, hecRanking: 25
  },
  {
    name: "Bahria University",
    shortName: "BU",
    city: "Islamabad", province: "Federal", sector: "Public",
    type: "University", founded: 2000,
    officialWebsite: "https://www.bahria.edu.pk",
    admissionPortal: "https://bahria.edu.pk/admissions",
    email: "admissions@bahria.edu.pk", phone: "+92-51-9260002",
    description: "Sponsored by the Pakistan Navy, Bahria University provides quality education in engineering, computing, management and maritime sciences.",
    programs: ["Computer Science", "Engineering", "Business", "Medical", "Maritime Sciences"],
    campuses: ["Islamabad", "Karachi", "Lahore"],
    hecRecognized: true, hecRanking: 18
  },
  {
    name: "Riphah International University",
    shortName: "Riphah",
    city: "Islamabad", province: "Federal", sector: "Private",
    type: "University", founded: 2002,
    officialWebsite: "https://www.riphah.edu.pk",
    admissionPortal: "https://riphah.edu.pk/admissions",
    email: "info@riphah.edu.pk", phone: "+92-51-2895444",
    description: "An Islamic-values based private university offering programmes in health sciences, engineering, business, and arts across multiple campuses.",
    programs: ["Medicine", "Pharmacy", "Dentistry", "Engineering", "Business", "Psychology"],
    campuses: ["Islamabad", "Lahore", "Faisalabad", "Rawalpindi", "Multan"],
    hecRecognized: true, hecRanking: 22
  },
  {
    name: "Capital University of Science & Technology (CUST)",
    shortName: "CUST",
    city: "Islamabad", province: "Federal", sector: "Private",
    type: "University", founded: 2000,
    officialWebsite: "https://www.cust.edu.pk",
    admissionPortal: "https://cust.edu.pk/admissions",
    email: "info@cust.edu.pk", phone: "+92-51-4486400",
    description: "CUST is an HEC-recognized private university in Islamabad offering competitive programmes in engineering, computing and management.",
    programs: ["Computer Science", "Electrical Engineering", "Business", "Mechanical Engineering"],
    campuses: ["Islamabad"],
    hecRecognized: true, hecRanking: 35
  },
  {
    name: "Federal Urdu University of Arts, Science & Technology (FUUAST)",
    shortName: "FUUAST",
    city: "Islamabad", province: "Federal", sector: "Public",
    type: "University", founded: 2002,
    officialWebsite: "https://www.fuuast.edu.pk",
    admissionPortal: "https://fuuast.edu.pk/admissions",
    email: "info@fuuast.edu.pk", phone: "+92-21-99244100",
    description: "A federal public university promoting Urdu as medium of instruction, with campuses in Islamabad and Karachi offering diverse programmes.",
    programs: ["Sciences", "Arts", "Social Sciences", "Business", "Computer Science"],
    campuses: ["Islamabad", "Karachi"],
    hecRecognized: true, hecRanking: 40
  },
  {
    name: "Fatima Jinnah Women University (FJWU)",
    shortName: "FJWU",
    city: "Rawalpindi", province: "Federal", sector: "Public",
    type: "Women's University", founded: 1998,
    officialWebsite: "https://www.fjwu.edu.pk",
    admissionPortal: "https://fjwu.edu.pk/admissions",
    email: "info@fjwu.edu.pk", phone: "+92-51-9292900",
    description: "A dedicated public women's university offering quality education to female students in sciences, arts, business and technology.",
    programs: ["Sciences", "Arts & Humanities", "Business", "Computer Science", "Social Sciences"],
    campuses: ["Rawalpindi"],
    hecRecognized: true, hecRanking: 30
  },
  {
    name: "Foundation University Islamabad (FUI)",
    shortName: "FUI",
    city: "Islamabad", province: "Federal", sector: "Private",
    type: "University", founded: 2002,
    officialWebsite: "https://www.fui.edu.pk",
    admissionPortal: "https://fui.edu.pk/admissions",
    email: "info@fui.edu.pk", phone: "+92-51-5788002",
    description: "Foundation University Islamabad, sponsored by the Fauji Foundation, offers programmes in engineering, business, medicine and IT.",
    programs: ["Medicine", "Business", "Computer Science", "Engineering"],
    campuses: ["Islamabad", "Rawalpindi", "Lahore"],
    hecRecognized: true, hecRanking: 38
  },
  {
    name: "PMAS Arid Agriculture University Rawalpindi",
    shortName: "UAAR",
    city: "Rawalpindi", province: "Federal", sector: "Public",
    type: "Agriculture University", founded: 1994,
    officialWebsite: "https://www.uaar.edu.pk",
    admissionPortal: "https://uaar.edu.pk/admissions",
    email: "admissions@uaar.edu.pk", phone: "+92-51-9290547",
    description: "Pakistan's only university dedicated to arid agriculture sciences, offering programmes tailored to dryland farming research and agricultural development.",
    programs: ["Agriculture", "Food Sciences", "Veterinary Science", "Business", "Environmental Sciences"],
    campuses: ["Rawalpindi", "Attock", "Rawala Kot"],
    hecRecognized: true, hecRanking: 28
  },
  {
    name: "HITEC University Taxila",
    shortName: "HITEC",
    city: "Taxila", province: "Federal", sector: "Private",
    type: "University", founded: 2008,
    officialWebsite: "https://www.hitecuni.edu.pk",
    admissionPortal: "https://hitecuni.edu.pk/admissions",
    email: "info@hitecuni.edu.pk", phone: "+92-51-9314501",
    description: "HITEC University, sponsored by HIT (Heavy Industries Taxila), offers high-quality engineering and management programmes near Islamabad.",
    programs: ["Mechanical Engineering", "Electrical Engineering", "Computer Science", "Business"],
    campuses: ["Taxila"],
    hecRecognized: true, hecRanking: 45
  },
  {
    name: "Shifa Tameer-e-Millat University (STMU)",
    shortName: "STMU",
    city: "Islamabad", province: "Federal", sector: "Private",
    type: "Health Sciences University", founded: 2012,
    officialWebsite: "https://www.stmu.edu.pk",
    admissionPortal: "https://stmu.edu.pk/admissions",
    email: "info@stmu.edu.pk", phone: "+92-51-2896061",
    description: "A private health sciences university affiliated with Shifa International Hospital, offering medical, dental and allied health sciences.",
    programs: ["Medicine (MBBS)", "Dentistry (BDS)", "Pharmacy", "Nursing", "Allied Health Sciences"],
    campuses: ["Islamabad"],
    hecRecognized: true, hecRanking: 42
  },
  {
    name: "SZABIST Islamabad",
    shortName: "SZABIST ISB",
    city: "Islamabad", province: "Federal", sector: "Private",
    type: "University", founded: 1995,
    officialWebsite: "https://www.szabist-isb.edu.pk",
    admissionPortal: "https://szabist-isb.edu.pk/admissions",
    email: "info@szabist-isb.edu.pk", phone: "+92-51-4863363",
    description: "A top-ranked private university in Islamabad offering programmes in computer science, business and media sciences.",
    programs: ["Computer Science", "Business", "Media Sciences", "Social Sciences", "Engineering"],
    campuses: ["Islamabad"],
    hecRecognized: true, hecRanking: 32
  },
  {
    name: "Virtual University of Pakistan (VU)",
    shortName: "VU",
    city: "Lahore", province: "Punjab", sector: "Public",
    type: "Online University", founded: 2002,
    officialWebsite: "https://www.vu.edu.pk",
    admissionPortal: "https://admissions.vu.edu.pk",
    email: "info@vu.edu.pk", phone: "+92-42-111-880-880",
    description: "Pakistan's fully online public university, delivering education via internet and TV making higher education accessible to every corner of the country.",
    programs: ["Computer Science", "Business", "Education", "Accounting & Finance", "Software Engineering"],
    campuses: ["Online (HQ Lahore)"],
    hecRecognized: true, hecRanking: 26
  },

  // ════════════════════════════════════════════════════════════
  // PUNJAB
  // ════════════════════════════════════════════════════════════
  {
    name: "Lahore University of Management Sciences (LUMS)",
    shortName: "LUMS",
    city: "Lahore", province: "Punjab", sector: "Private",
    type: "Research University", founded: 1984,
    officialWebsite: "https://www.lums.edu.pk",
    admissionPortal: "https://lums.edu.pk/admissions",
    email: "admissions@lums.edu.pk", phone: "+92-42-35608000",
    description: "Pakistan's most prestigious private research university, renowned for its schools of business, law, sciences, social sciences and engineering.",
    programs: ["Business", "Law", "Computer Science", "Economics", "Mathematics", "Social Sciences", "Engineering"],
    campuses: ["Lahore"],
    hecRecognized: true, hecRanking: 2
  },
  {
    name: "FAST National University of Computer & Emerging Sciences (FAST-NUCES)",
    shortName: "FAST-NUCES",
    city: "Lahore", province: "Punjab", sector: "Private",
    type: "University", founded: 2000,
    officialWebsite: "https://www.nu.edu.pk",
    admissionPortal: "https://nu.edu.pk/Admissions/Schedule",
    email: "admissions@nu.edu.pk", phone: "+92-42-111-128-128",
    description: "Pakistan's leading private university specializing in computer science, software engineering and emerging technology disciplines.",
    programs: ["Computer Science", "Software Engineering", "Electrical Engineering", "Data Science", "Business"],
    campuses: ["Lahore", "Islamabad", "Karachi", "Peshawar", "Faisalabad", "Chiniot"],
    hecRecognized: true, hecRanking: 4
  },
  {
    name: "University of Engineering & Technology Lahore (UET Lahore)",
    shortName: "UET Lahore",
    city: "Lahore", province: "Punjab", sector: "Public",
    type: "Engineering University", founded: 1921,
    officialWebsite: "https://www.uet.edu.pk",
    admissionPortal: "https://uet.edu.pk/admissions",
    email: "info@uet.edu.pk", phone: "+92-42-99029200",
    description: "One of Pakistan's oldest and most prestigious engineering institutions, producing world-class engineers since 1921.",
    programs: ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Chemical Engineering", "Computer Science"],
    campuses: ["Lahore", "Faisalabad", "Gujranwala", "Narowal", "Kala Shah Kaku"],
    hecRecognized: true, hecRanking: 6
  },
  {
    name: "University of the Punjab (PU)",
    shortName: "PU",
    city: "Lahore", province: "Punjab", sector: "Public",
    type: "Research University", founded: 1882,
    officialWebsite: "https://www.pu.edu.pk",
    admissionPortal: "https://pu.edu.pk/admissions",
    email: "vc@pu.edu.pk", phone: "+92-42-99231101",
    description: "One of South Asia's oldest universities, established in 1882, offering a comprehensive range of programmes across arts, sciences and professional fields.",
    programs: ["Arts & Humanities", "Sciences", "Business", "Law", "Engineering", "IT", "Pharmacy"],
    campuses: ["Lahore", "Gujranwala", "Jhelum"],
    hecRecognized: true, hecRanking: 8
  },
  {
    name: "Government College University Lahore (GCU)",
    shortName: "GCU Lahore",
    city: "Lahore", province: "Punjab", sector: "Public",
    type: "University", founded: 1864,
    officialWebsite: "https://www.gcu.edu.pk",
    admissionPortal: "https://gcu.edu.pk/admissions",
    email: "admissions@gcu.edu.pk", phone: "+92-42-99213351",
    description: "Established in 1864, GCU Lahore is one of Pakistan's oldest and most respected institutions with a rich tradition of academic excellence.",
    programs: ["Sciences", "Arts & Humanities", "Business", "Social Sciences", "Engineering"],
    campuses: ["Lahore"],
    hecRecognized: true, hecRanking: 12
  },
  {
    name: "Government College University Faisalabad (GCUF)",
    shortName: "GCUF",
    city: "Faisalabad", province: "Punjab", sector: "Public",
    type: "University", founded: 1897,
    officialWebsite: "https://www.gcuf.edu.pk",
    admissionPortal: "https://gcuf.edu.pk/admissions",
    email: "info@gcuf.edu.pk", phone: "+92-41-9200800",
    description: "GCUF is a leading public university in Faisalabad offering programmes in sciences, arts, business and applied sciences.",
    programs: ["Sciences", "Arts", "Business", "Applied Sciences", "Computer Science"],
    campuses: ["Faisalabad", "Chiniot", "Jhang", "Layyah", "Toba Tek Singh"],
    hecRecognized: true, hecRanking: 19
  },
  {
    name: "University of Agriculture Faisalabad (UAF)",
    shortName: "UAF",
    city: "Faisalabad", province: "Punjab", sector: "Public",
    type: "Agriculture University", founded: 1961,
    officialWebsite: "https://www.uaf.edu.pk",
    admissionPortal: "https://uaf.edu.pk/admissions",
    email: "vc@uaf.edu.pk", phone: "+92-41-9200161",
    description: "Pakistan's premier agriculture university, a globally recognized centre of excellence in agricultural sciences, food technology and rural development.",
    programs: ["Agriculture", "Food Science & Technology", "Veterinary Science", "Business", "Engineering"],
    campuses: ["Faisalabad", "Burewala", "Toba Tek Singh", "Jhang", "Depalpur"],
    hecRecognized: true, hecRanking: 13
  },
  {
    name: "Bahauddin Zakariya University (BZU)",
    shortName: "BZU",
    city: "Multan", province: "Punjab", sector: "Public",
    type: "University", founded: 1975,
    officialWebsite: "https://www.bzu.edu.pk",
    admissionPortal: "https://bzu.edu.pk/admissions",
    email: "vc@bzu.edu.pk", phone: "+92-61-9210099",
    description: "A major public university in southern Punjab serving students across multiple campuses with a wide range of academic programmes.",
    programs: ["Sciences", "Arts", "Business", "Engineering", "Social Sciences", "Law"],
    campuses: ["Multan", "Sahiwal", "Layyah"],
    hecRecognized: true, hecRanking: 16
  },
  {
    name: "Islamia University of Bahawalpur (IUB)",
    shortName: "IUB",
    city: "Bahawalpur", province: "Punjab", sector: "Public",
    type: "University", founded: 1975,
    officialWebsite: "https://www.iub.edu.pk",
    admissionPortal: "https://iub.edu.pk/admissions",
    email: "vc@iub.edu.pk", phone: "+92-62-9255428",
    description: "IUB is a major public university in southern Punjab, rooted in Islamic tradition, offering diverse academic and professional programmes.",
    programs: ["Islamic Studies", "Sciences", "Arts", "Business", "Engineering", "Social Sciences"],
    campuses: ["Bahawalpur", "Rahim Yar Khan", "Bahawalnagar"],
    hecRecognized: true, hecRanking: 23
  },
  {
    name: "University of Health Sciences (UHS) Lahore",
    shortName: "UHS",
    city: "Lahore", province: "Punjab", sector: "Public",
    type: "Health Sciences University", founded: 2002,
    officialWebsite: "https://www.uhs.edu.pk",
    admissionPortal: "https://uhs.edu.pk/admissions",
    email: "vc@uhs.edu.pk", phone: "+92-42-99231301",
    description: "UHS is Punjab's regulatory and degree-awarding body for health sciences, overseeing MBBS, BDS, Pharmacy and allied health admissions across affiliated colleges.",
    programs: ["Medicine (MBBS)", "Dentistry (BDS)", "Pharmacy", "Allied Health Sciences", "Nursing"],
    campuses: ["Lahore"],
    hecRecognized: true, hecRanking: 17
  },
  {
    name: "University of Veterinary & Animal Sciences (UVAS)",
    shortName: "UVAS",
    city: "Lahore", province: "Punjab", sector: "Public",
    type: "Veterinary University", founded: 2002,
    officialWebsite: "https://www.uvas.edu.pk",
    admissionPortal: "https://uvas.edu.pk/admissions",
    email: "vc@uvas.edu.pk", phone: "+92-42-99211490",
    description: "Pakistan's leading veterinary university, producing professionals in animal sciences, biological sciences and food safety.",
    programs: ["Veterinary Science (DVM)", "Animal Sciences", "Food Science", "Biological Sciences"],
    campuses: ["Lahore", "Jhang", "Pattoki"],
    hecRecognized: true, hecRanking: 20
  },
  {
    name: "University of Management & Technology (UMT)",
    shortName: "UMT",
    city: "Lahore", province: "Punjab", sector: "Private",
    type: "University", founded: 1990,
    officialWebsite: "https://www.umt.edu.pk",
    admissionPortal: "https://umt.edu.pk/admissions",
    email: "admission@umt.edu.pk", phone: "+92-42-35212801",
    description: "A private university with strong industry linkages, focused on management sciences, engineering, arts, and social sciences.",
    programs: ["Business", "Engineering", "Computer Science", "Arts & Design", "Social Sciences"],
    campuses: ["Lahore"],
    hecRecognized: true, hecRanking: 24
  },
  {
    name: "Information Technology University (ITU)",
    shortName: "ITU",
    city: "Lahore", province: "Punjab", sector: "Public",
    type: "Technology University", founded: 2012,
    officialWebsite: "https://www.itu.edu.pk",
    admissionPortal: "https://itu.edu.pk/admissions",
    email: "admissions@itu.edu.pk", phone: "+92-42-111-11-00-88",
    description: "A Punjab Government public university dedicated to IT, AI, data science and policy research, producing Pakistan's next generation of tech leaders.",
    programs: ["Computer Science", "Data Science", "Electrical Engineering", "Business Analytics", "Policy Research"],
    campuses: ["Lahore"],
    hecRecognized: true, hecRanking: 27
  },
  {
    name: "University of Central Punjab (UCP)",
    shortName: "UCP",
    city: "Lahore", province: "Punjab", sector: "Private",
    type: "University", founded: 2002,
    officialWebsite: "https://www.ucp.edu.pk",
    admissionPortal: "https://ucp.edu.pk/admissions",
    email: "admissions@ucp.edu.pk", phone: "+92-42-35880007",
    description: "A large private university in Lahore offering programmes in sciences, engineering, business, law and arts.",
    programs: ["Business", "Computer Science", "Engineering", "Law", "Pharmacy", "Arts & Design"],
    campuses: ["Lahore"],
    hecRecognized: true, hecRanking: 29
  },
  {
    name: "Lahore College for Women University (LCWU)",
    shortName: "LCWU",
    city: "Lahore", province: "Punjab", sector: "Public",
    type: "Women's University", founded: 2002,
    officialWebsite: "https://www.lcwu.edu.pk",
    admissionPortal: "https://lcwu.edu.pk/admissions",
    email: "info@lcwu.edu.pk", phone: "+92-42-99203804",
    description: "A prestigious public women's university in Lahore, known for excellence in sciences, arts, social sciences and education.",
    programs: ["Sciences", "Arts & Humanities", "Social Sciences", "Business", "Education", "Computer Science"],
    campuses: ["Lahore"],
    hecRecognized: true, hecRanking: 21
  },
  {
    name: "Forman Christian College University (FCCU)",
    shortName: "FCCU",
    city: "Lahore", province: "Punjab", sector: "Private",
    type: "University", founded: 1864,
    officialWebsite: "https://www.fccollege.edu.pk",
    admissionPortal: "https://fccollege.edu.pk/admissions",
    email: "admission@fccollege.edu.pk", phone: "+92-42-35880007",
    description: "One of Pakistan's oldest private universities with a strong liberal arts tradition and diverse programmes in sciences, social sciences and business.",
    programs: ["Liberal Arts", "Sciences", "Social Sciences", "Business", "Computer Science"],
    campuses: ["Lahore"],
    hecRecognized: true, hecRanking: 30
  },
  {
    name: "Beaconhouse National University (BNU)",
    shortName: "BNU",
    city: "Lahore", province: "Punjab", sector: "Private",
    type: "University", founded: 2003,
    officialWebsite: "https://www.bnu.edu.pk",
    admissionPortal: "https://bnu.edu.pk/admissions",
    email: "info@bnu.edu.pk", phone: "+92-42-35761999",
    description: "BNU is a prestigious private university in Lahore known for its innovative programmes in arts, design, media, liberal arts and social sciences.",
    programs: ["Art & Design", "Media Studies", "Architecture", "Social Sciences", "Business"],
    campuses: ["Lahore"],
    hecRecognized: true, hecRanking: 31
  },
  {
    name: "University of Lahore (UOL)",
    shortName: "UOL",
    city: "Lahore", province: "Punjab", sector: "Private",
    type: "University", founded: 1999,
    officialWebsite: "https://www.uol.edu.pk",
    admissionPortal: "https://uol.edu.pk/admissions",
    email: "info@uol.edu.pk", phone: "+92-42-111-865-865",
    description: "A large private university with multiple faculties offering programmes in medicine, engineering, business and social sciences.",
    programs: ["Medicine (MBBS)", "Engineering", "Computer Science", "Business", "Allied Health Sciences"],
    campuses: ["Lahore", "Islamabad", "Sargodha", "Gujrat", "Pakpattan"],
    hecRecognized: true, hecRanking: 33
  },
  {
    name: "Superior University Lahore",
    shortName: "Superior",
    city: "Lahore", province: "Punjab", sector: "Private",
    type: "University", founded: 2000,
    officialWebsite: "https://www.superior.edu.pk",
    admissionPortal: "https://superior.edu.pk/admissions",
    email: "info@superior.edu.pk", phone: "+92-42-35212066",
    description: "A private university in Lahore offering affordable quality education in business, computing, engineering and arts.",
    programs: ["Computer Science", "Business", "Engineering", "Arts & Design", "Social Sciences"],
    campuses: ["Lahore", "Sialkot"],
    hecRecognized: true, hecRanking: 36
  },
  {
    name: "Minhaj University Lahore (MUL)",
    shortName: "MUL",
    city: "Lahore", province: "Punjab", sector: "Private",
    type: "University", founded: 2005,
    officialWebsite: "https://www.mul.edu.pk",
    admissionPortal: "https://mul.edu.pk/admissions",
    email: "info@mul.edu.pk", phone: "+92-42-37131600",
    description: "MUL is a private university founded by Dr. Tahir-ul-Qadri offering programmes in sciences, business, Islamic studies and education.",
    programs: ["Islamic Studies", "Business", "Computer Science", "Education", "Social Sciences"],
    campuses: ["Lahore"],
    hecRecognized: true, hecRanking: 43
  },
  {
    name: "National College of Arts (NCA)",
    shortName: "NCA",
    city: "Lahore", province: "Punjab", sector: "Public",
    type: "Arts University", founded: 1875,
    officialWebsite: "https://www.nca.edu.pk",
    admissionPortal: "https://nca.edu.pk/admissions",
    email: "info@nca.edu.pk", phone: "+92-42-99201088",
    description: "Established in 1875, NCA is Pakistan's premier public fine arts and design university producing the country's finest artists, designers and architects.",
    programs: ["Fine Arts", "Graphic Design", "Architecture", "Textile Design", "Film & TV"],
    campuses: ["Lahore", "Rawalpindi"],
    hecRecognized: true, hecRanking: 22
  },
  {
    name: "University of Education Lahore (UE)",
    shortName: "UE",
    city: "Lahore", province: "Punjab", sector: "Public",
    type: "Education University", founded: 2002,
    officialWebsite: "https://www.ue.edu.pk",
    admissionPortal: "https://ue.edu.pk/admissions",
    email: "info@ue.edu.pk", phone: "+92-42-99262274",
    description: "A dedicated public education university producing trained teachers and education professionals with campuses across Punjab.",
    programs: ["Education (B.Ed/M.Ed)", "Sciences", "Computer Science", "Social Sciences"],
    campuses: ["Lahore", "Multan", "Faisalabad", "DG Khan", "Okara", "Jauharabad", "Attock"],
    hecRecognized: true, hecRanking: 28
  },
  {
    name: "University of Gujrat (UoG)",
    shortName: "UoG",
    city: "Gujrat", province: "Punjab", sector: "Public",
    type: "University", founded: 2004,
    officialWebsite: "https://www.uog.edu.pk",
    admissionPortal: "https://uog.edu.pk/admissions",
    email: "info@uog.edu.pk", phone: "+92-53-3643761",
    description: "A public university serving the students of Gujrat and surrounding districts with programmes in sciences, arts, engineering and management.",
    programs: ["Sciences", "Social Sciences", "Engineering", "Business", "Arts"],
    campuses: ["Gujrat", "Hafizabad"],
    hecRecognized: true, hecRanking: 34
  },
  {
    name: "University of Sargodha (UoS)",
    shortName: "UoS",
    city: "Sargodha", province: "Punjab", sector: "Public",
    type: "University", founded: 2002,
    officialWebsite: "https://www.uos.edu.pk",
    admissionPortal: "https://uos.edu.pk/admissions",
    email: "info@uos.edu.pk", phone: "+92-48-3725857",
    description: "A public sector university with campuses across central Punjab offering a wide variety of academic programmes.",
    programs: ["Sciences", "Arts", "Business", "Engineering", "Social Sciences", "Pharmacy"],
    campuses: ["Sargodha", "Bhakkar", "Mianwali", "Khushab"],
    hecRecognized: true, hecRanking: 37
  },
  {
    name: "Kinnaird College for Women University",
    shortName: "Kinnaird",
    city: "Lahore", province: "Punjab", sector: "Private",
    type: "Women's University", founded: 1913,
    officialWebsite: "https://www.kinnaird.edu.pk",
    admissionPortal: "https://kinnaird.edu.pk/admissions",
    email: "info@kinnaird.edu.pk", phone: "+92-42-35761169",
    description: "One of Pakistan's oldest women's colleges, now a chartered university offering quality liberal arts, sciences and professional education for women.",
    programs: ["Sciences", "Arts & Humanities", "Social Sciences", "Business", "Computer Science"],
    campuses: ["Lahore"],
    hecRecognized: true, hecRanking: 35
  },

  // ════════════════════════════════════════════════════════════
  // KPK (KHYBER PAKHTUNKHWA)
  // ════════════════════════════════════════════════════════════
  {
    name: "University of Engineering & Technology Peshawar (UET Peshawar)",
    shortName: "UET Peshawar",
    city: "Peshawar", province: "KPK", sector: "Public",
    type: "Engineering University", founded: 1980,
    officialWebsite: "https://www.uetpeshawar.edu.pk",
    admissionPortal: "https://uetpeshawar.edu.pk/admissions",
    email: "info@uetpeshawar.edu.pk", phone: "+92-91-9218170",
    description: "The leading public engineering university in KPK, producing skilled engineers in civil, mechanical, electrical and computer science disciplines.",
    programs: ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Computer Science", "Industrial Engineering"],
    campuses: ["Peshawar", "Bannu", "Kohat", "Mardan", "Abbottabad"],
    hecRecognized: true, hecRanking: 17
  },
  {
    name: "University of Peshawar (UoP)",
    shortName: "UoP",
    city: "Peshawar", province: "KPK", sector: "Public",
    type: "University", founded: 1950,
    officialWebsite: "https://www.uop.edu.pk",
    admissionPortal: "https://uop.edu.pk/admissions",
    email: "info@uop.edu.pk", phone: "+92-91-9216720",
    description: "One of the oldest universities in the northwest, offering a comprehensive range of programmes in natural sciences, social sciences and humanities.",
    programs: ["Sciences", "Social Sciences", "Arts", "Business", "Law", "Pharmacy"],
    campuses: ["Peshawar"],
    hecRecognized: true, hecRanking: 21
  },
  {
    name: "Islamia College Peshawar (ICP)",
    shortName: "ICP",
    city: "Peshawar", province: "KPK", sector: "Public",
    type: "University", founded: 1913,
    officialWebsite: "https://www.icp.edu.pk",
    admissionPortal: "https://icp.edu.pk/admissions",
    email: "info@icp.edu.pk", phone: "+92-91-9216488",
    description: "A historic public university founded in 1913, offering quality education in sciences, arts and social sciences from the heart of Peshawar.",
    programs: ["Sciences", "Arts & Humanities", "Social Sciences", "Business", "IT"],
    campuses: ["Peshawar"],
    hecRecognized: true, hecRanking: 29
  },
  {
    name: "Khyber Medical University (KMU)",
    shortName: "KMU",
    city: "Peshawar", province: "KPK", sector: "Public",
    type: "Medical University", founded: 2007,
    officialWebsite: "https://www.kmu.edu.pk",
    admissionPortal: "https://kmu.edu.pk/admissions",
    email: "info@kmu.edu.pk", phone: "+92-91-9217689",
    description: "KMU is KPK's premier medical university, the regulatory and degree-awarding body for all medical and allied health sciences colleges in the province.",
    programs: ["Medicine (MBBS)", "Dentistry (BDS)", "Pharmacy", "Allied Health Sciences", "Nursing"],
    campuses: ["Peshawar"],
    hecRecognized: true, hecRanking: 22
  },
  {
    name: "Agricultural University Peshawar (AUP)",
    shortName: "AUP",
    city: "Peshawar", province: "KPK", sector: "Public",
    type: "Agriculture University", founded: 1981,
    officialWebsite: "https://www.aup.edu.pk",
    admissionPortal: "https://aup.edu.pk/admissions",
    email: "info@aup.edu.pk", phone: "+92-91-9216520",
    description: "AUP is the leading agriculture university in KPK, focused on agricultural sciences, food technology and environmental sciences.",
    programs: ["Agriculture", "Food Sciences", "Veterinary Science", "Environmental Sciences", "Biotechnology"],
    campuses: ["Peshawar"],
    hecRecognized: true, hecRanking: 26
  },
  {
    name: "Abdul Wali Khan University Mardan (AWKUM)",
    shortName: "AWKUM",
    city: "Mardan", province: "KPK", sector: "Public",
    type: "University", founded: 2009,
    officialWebsite: "https://www.awkum.edu.pk",
    admissionPortal: "https://awkum.edu.pk/admissions",
    email: "info@awkum.edu.pk", phone: "+92-937-843082",
    description: "A public university serving the students of Mardan and surrounding districts with quality education in sciences, engineering, business and social sciences.",
    programs: ["Sciences", "Engineering", "Business", "Social Sciences", "Law", "Computer Science"],
    campuses: ["Mardan", "Charsadda"],
    hecRecognized: true, hecRanking: 32
  },
  {
    name: "Hazara University Mansehra (HU)",
    shortName: "HU",
    city: "Mansehra", province: "KPK", sector: "Public",
    type: "University", founded: 2001,
    officialWebsite: "https://www.hu.edu.pk",
    admissionPortal: "https://hu.edu.pk/admissions",
    email: "info@hu.edu.pk", phone: "+92-997-530127",
    description: "Hazara University serves the students of Hazara Division with quality higher education in sciences, social sciences, arts and management.",
    programs: ["Sciences", "Social Sciences", "Arts", "Business", "Computer Science", "Engineering"],
    campuses: ["Mansehra", "Dodhial", "Havelian"],
    hecRecognized: true, hecRanking: 35
  },
  {
    name: "University of Malakand",
    shortName: "UoM",
    city: "Chakdara", province: "KPK", sector: "Public",
    type: "University", founded: 2001,
    officialWebsite: "https://www.uom.edu.pk",
    admissionPortal: "https://uom.edu.pk/admissions",
    email: "info@uom.edu.pk", phone: "+92-945-763372",
    description: "University of Malakand provides higher education to students of Malakand Division and surrounding tribal districts.",
    programs: ["Sciences", "Social Sciences", "Business", "Engineering", "Computer Science"],
    campuses: ["Chakdara"],
    hecRecognized: true, hecRanking: 38
  },
  {
    name: "Gomal University (GU)",
    shortName: "GU",
    city: "D.I. Khan", province: "KPK", sector: "Public",
    type: "University", founded: 1974,
    officialWebsite: "https://www.gu.edu.pk",
    admissionPortal: "https://gu.edu.pk/admissions",
    email: "info@gu.edu.pk", phone: "+92-966-9280061",
    description: "Gomal University, established in 1974, is a public university serving the students of southern KPK (D.I. Khan, Tank, Lakki Marwat areas).",
    programs: ["Sciences", "Arts", "Social Sciences", "Business", "Computer Science", "Pharmacy"],
    campuses: ["D.I. Khan"],
    hecRecognized: true, hecRanking: 39
  },
  {
    name: "Bacha Khan University Charsadda (BKUC)",
    shortName: "BKUC",
    city: "Charsadda", province: "KPK", sector: "Public",
    type: "University", founded: 2012,
    officialWebsite: "https://www.bkuc.edu.pk",
    admissionPortal: "https://bkuc.edu.pk/admissions",
    email: "info@bkuc.edu.pk", phone: "+92-91-6100570",
    description: "BKUC is a public university in Charsadda offering quality higher education named after the great Pakhtun leader Khan Abdul Ghaffar Khan.",
    programs: ["Sciences", "Social Sciences", "Arts", "Business", "Computer Science"],
    campuses: ["Charsadda"],
    hecRecognized: true, hecRanking: 46
  },
  {
    name: "University of Haripur (UoH)",
    shortName: "UoH",
    city: "Haripur", province: "KPK", sector: "Public",
    type: "University", founded: 2012,
    officialWebsite: "https://www.uoh.edu.pk",
    admissionPortal: "https://uoh.edu.pk/admissions",
    email: "info@uoh.edu.pk", phone: "+92-995-620000",
    description: "A public university in Haripur providing quality education in sciences, engineering, social sciences and business to the students of Hazara region.",
    programs: ["Chemical Engineering", "Computer Science", "Business", "Biochemistry", "Social Sciences"],
    campuses: ["Haripur"],
    hecRecognized: true, hecRanking: 44
  },
  {
    name: "University of Swat",
    shortName: "UoSwat",
    city: "Swat", province: "KPK", sector: "Public",
    type: "University", founded: 2010,
    officialWebsite: "https://www.uswat.edu.pk",
    admissionPortal: "https://uswat.edu.pk/admissions",
    email: "info@uswat.edu.pk", phone: "+92-946-710003",
    description: "University of Swat provides accessible quality education to the students of Swat Valley and surrounding areas in diverse academic disciplines.",
    programs: ["Sciences", "Arts", "Social Sciences", "Business", "Computer Science"],
    campuses: ["Swat"],
    hecRecognized: true, hecRanking: 47
  },

  // ════════════════════════════════════════════════════════════
  // SINDH — MAIN / KARACHI
  // ════════════════════════════════════════════════════════════
  {
    name: "Institute of Business Administration Karachi (IBA)",
    shortName: "IBA",
    city: "Karachi", province: "Sindh", sector: "Public",
    type: "Business School", founded: 1955,
    officialWebsite: "https://www.iba.edu.pk",
    admissionPortal: "https://iba.edu.pk/admissions",
    email: "admissions@iba.edu.pk", phone: "+92-21-38104700",
    description: "The oldest business school in Asia outside the USA, IBA Karachi produces Pakistan's most sought-after business and tech graduates.",
    programs: ["Business Administration", "Computer Science", "Economics", "Social Sciences", "Accounting & Finance"],
    campuses: ["Karachi"],
    hecRecognized: true, hecRanking: 7
  },
  {
    name: "University of Karachi (UoK)",
    shortName: "UoK",
    city: "Karachi", province: "Sindh", sector: "Public",
    type: "Research University", founded: 1951,
    officialWebsite: "https://www.uok.edu.pk",
    admissionPortal: "https://uok.edu.pk/admissions",
    email: "vc@uok.edu.pk", phone: "+92-21-99261340",
    description: "Sindh's largest public university, offering a vast range of undergraduate, graduate and doctoral programmes across all disciplines.",
    programs: ["Sciences", "Arts & Humanities", "Business", "Law", "Social Sciences", "Pharmacy"],
    campuses: ["Karachi"],
    hecRecognized: true, hecRanking: 9
  },
  {
    name: "NED University of Engineering & Technology",
    shortName: "NED",
    city: "Karachi", province: "Sindh", sector: "Public",
    type: "Engineering University", founded: 1921,
    officialWebsite: "https://www.neduet.edu.pk",
    admissionPortal: "https://neduet.edu.pk/admissions",
    email: "vc@neduet.edu.pk", phone: "+92-21-99261261",
    description: "One of Pakistan's oldest engineering universities, renowned for producing highly skilled engineers and researchers since 1921.",
    programs: ["Civil Engineering", "Mechanical Engineering", "Electrical Engineering", "Computer Engineering", "Architecture"],
    campuses: ["Karachi"],
    hecRecognized: true, hecRanking: 11
  },
  {
    name: "Mehran University of Engineering & Technology (MUET)",
    shortName: "MUET",
    city: "Jamshoro", province: "Sindh", sector: "Public",
    type: "Engineering University", founded: 1963,
    officialWebsite: "https://www.muet.edu.pk",
    admissionPortal: "https://muet.edu.pk/admissions",
    email: "vc@muet.edu.pk", phone: "+92-22-2772250",
    description: "Sindh's premier engineering university, offering high-quality technical education and research in engineering and technology.",
    programs: ["Civil Engineering", "Electronics Engineering", "Mechanical Engineering", "Computer Systems Engineering", "Software Engineering"],
    campuses: ["Jamshoro", "Khairpur", "Shaheed Benazirabad"],
    hecRecognized: true, hecRanking: 14
  },
  {
    name: "University of Sindh (SU)",
    shortName: "SU",
    city: "Jamshoro", province: "Sindh", sector: "Public",
    type: "Research University", founded: 1947,
    officialWebsite: "https://www.usindh.edu.pk",
    admissionPortal: "https://usindh.edu.pk/admissions",
    email: "vc@usindh.edu.pk", phone: "+92-22-9213102",
    description: "One of Pakistan's oldest universities, the University of Sindh is a comprehensive public university preserving Sindhi culture and education.",
    programs: ["Sciences", "Arts & Humanities", "Social Sciences", "Business", "Law", "Pharmacy", "Engineering"],
    campuses: ["Jamshoro", "Larkana", "Mirpurkhas", "Hyderabad", "Sukkur"],
    hecRecognized: true, hecRanking: 15
  },
  {
    name: "Aga Khan University (AKU)",
    shortName: "AKU",
    city: "Karachi", province: "Sindh", sector: "Private",
    type: "Research University", founded: 1983,
    officialWebsite: "https://www.aku.edu",
    admissionPortal: "https://aku.edu/admissions",
    email: "aku.admissions@aku.edu", phone: "+92-21-34864000",
    description: "A world-class private research university with global campuses, AKU is internationally acclaimed for medicine, nursing, education and development studies.",
    programs: ["Medicine (MBBS)", "Nursing", "Education", "Public Health", "Development Studies"],
    campuses: ["Karachi"],
    hecRecognized: true, hecRanking: 3
  },
  {
    name: "Dow University of Health Sciences (DUHS)",
    shortName: "DUHS",
    city: "Karachi", province: "Sindh", sector: "Public",
    type: "Medical University", founded: 2004,
    officialWebsite: "https://www.duhs.edu.pk",
    admissionPortal: "https://duhs.edu.pk/admissions",
    email: "vc@duhs.edu.pk", phone: "+92-21-99215740",
    description: "Sindh's premier public medical university, the regulatory body for health sciences education in the province, affiliated with Dow Medical College.",
    programs: ["Medicine (MBBS)", "Dentistry (BDS)", "Pharmacy", "Nursing", "Allied Health Sciences"],
    campuses: ["Karachi"],
    hecRecognized: true, hecRanking: 16
  },
  {
    name: "Ziauddin University",
    shortName: "ZU",
    city: "Karachi", province: "Sindh", sector: "Private",
    type: "University", founded: 1995,
    officialWebsite: "https://www.zu.edu.pk",
    admissionPortal: "https://zu.edu.pk/admissions",
    email: "info@zu.edu.pk", phone: "+92-21-111-189-189",
    description: "A leading private university in Karachi specializing in health sciences, business, engineering and social sciences.",
    programs: ["Medicine (MBBS)", "Pharmacy", "Nursing", "Business", "Engineering", "Allied Health Sciences"],
    campuses: ["Karachi"],
    hecRecognized: true, hecRanking: 23
  },
  {
    name: "SZABIST Karachi",
    shortName: "SZABIST",
    city: "Karachi", province: "Sindh", sector: "Private",
    type: "University", founded: 1995,
    officialWebsite: "https://www.szabist.edu.pk",
    admissionPortal: "https://szabist.edu.pk/admissions",
    email: "info@szabist.edu.pk", phone: "+92-21-35640921",
    description: "A leading private university offering internationally recognized programmes in computing, management, media sciences and engineering.",
    programs: ["Computer Science", "Business", "Media Sciences", "Engineering", "Social Sciences"],
    campuses: ["Karachi", "Islamabad", "Larkana", "Hyderabad", "Dubai"],
    hecRecognized: true, hecRanking: 25
  },
  {
    name: "Hamdard University",
    shortName: "Hamdard",
    city: "Karachi", province: "Sindh", sector: "Private",
    type: "University", founded: 1991,
    officialWebsite: "https://www.hamdard.edu.pk",
    admissionPortal: "https://hamdard.edu.pk/admissions",
    email: "info@hamdard.edu.pk", phone: "+92-21-36440053",
    description: "A private university best known for pharmacy, eastern medicine and health sciences, also offering business and engineering programmes.",
    programs: ["Pharmacy", "Eastern Medicine (Tibb)", "Business", "Engineering", "Law"],
    campuses: ["Karachi"],
    hecRecognized: true, hecRanking: 28
  },
  {
    name: "Institute of Business Management (IoBM)",
    shortName: "IoBM",
    city: "Karachi", province: "Sindh", sector: "Private",
    type: "Business University", founded: 1995,
    officialWebsite: "https://www.iobm.edu.pk",
    admissionPortal: "https://iobm.edu.pk/admissions",
    email: "info@iobm.edu.pk", phone: "+92-21-111-002-004",
    description: "IoBM (formerly CBM) is a leading private business school in Karachi, offering internationally recognized business and commerce programmes.",
    programs: ["Business Administration", "Commerce", "Computer Science", "Economics", "Media Sciences"],
    campuses: ["Karachi"],
    hecRecognized: true, hecRanking: 30
  },
  {
    name: "Muhammad Ali Jinnah University (MAJU) Karachi",
    shortName: "MAJU",
    city: "Karachi", province: "Sindh", sector: "Private",
    type: "University", founded: 2000,
    officialWebsite: "https://www.jinnah.edu.pk",
    admissionPortal: "https://jinnah.edu.pk/admissions",
    email: "info@jinnah.edu.pk", phone: "+92-21-111-654-321",
    description: "A private university in Karachi named after Pakistan's founder, offering programmes in engineering, computing, business and social sciences.",
    programs: ["Computer Science", "Electrical Engineering", "Business", "Social Sciences"],
    campuses: ["Karachi", "Islamabad"],
    hecRecognized: true, hecRanking: 33
  },
  {
    name: "Iqra University Karachi",
    shortName: "IU Karachi",
    city: "Karachi", province: "Sindh", sector: "Private",
    type: "University", founded: 1998,
    officialWebsite: "https://www.iqra.edu.pk",
    admissionPortal: "https://iqra.edu.pk/admissions",
    email: "info@iqra.edu.pk", phone: "+92-21-111-264-264",
    description: "A large private university with a reputation for business and computing education, offering a wide range of academic programmes.",
    programs: ["Business", "Computer Science", "Media Sciences", "Engineering", "Education"],
    campuses: ["Karachi", "Islamabad", "Hyderabad", "Quetta"],
    hecRecognized: true, hecRanking: 34
  },
  {
    name: "Greenwich University Karachi",
    shortName: "GU Karachi",
    city: "Karachi", province: "Sindh", sector: "Private",
    type: "University", founded: 2002,
    officialWebsite: "https://www.greenwich.edu.pk",
    admissionPortal: "https://greenwich.edu.pk/admissions",
    email: "info@greenwich.edu.pk", phone: "+92-21-34142220",
    description: "A private university in Karachi providing quality education in business, computing and social sciences at affordable rates.",
    programs: ["Business", "Computer Science", "Social Sciences", "Arts & Design"],
    campuses: ["Karachi"],
    hecRecognized: true, hecRanking: 42
  }
];

// ─────────────────────────────────────────────────────────────
// SEED FUNCTION
// ─────────────────────────────────────────────────────────────
async function seedUniversities() {
  const uniCollection = db.collection("universities");

  // Step 1: Clean up all existing test data
  console.log("\n🧹 Step 1: Cleaning up old/duplicate university data...");
  const existing = await uniCollection.get();
  if (existing.size > 0) {
    const deleteBatch = db.batch();
    existing.docs.forEach(doc => deleteBatch.delete(doc.ref));
    await deleteBatch.commit();
    console.log(`   ✅ Deleted ${existing.size} old entries.`);
  } else {
    console.log("   ℹ️  No existing data to clean.");
  }

  // Step 2: Seed all universities in batches
  console.log(`\n📚 Step 2: Seeding ${UNIVERSITIES.length} HEC-recognized universities...`);
  const BATCH_SIZE = 400;
  for (let i = 0; i < UNIVERSITIES.length; i += BATCH_SIZE) {
    const chunk = UNIVERSITIES.slice(i, i + BATCH_SIZE);
    const batch = db.batch();
    for (const uni of chunk) {
      batch.set(uniCollection.doc(), {
        ...uni,
        status: "approved",
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      });
    }
    await batch.commit();
    console.log(`   ✅ ${Math.min(i + BATCH_SIZE, UNIVERSITIES.length)} / ${UNIVERSITIES.length} committed`);
  }

  // Step 3: Summary
  console.log("\n📊 Summary by Province:");
  const provinces = {};
  UNIVERSITIES.forEach(u => { provinces[u.province] = (provinces[u.province] || 0) + 1; });
  Object.entries(provinces).sort((a,b) => b[1]-a[1]).forEach(([p, c]) => {
    console.log(`   ${p}: ${c} universities`);
  });

  const finalCount = (await uniCollection.count().get()).data().count;
  console.log(`\n✅ Seed complete! Total in Firestore: ${finalCount} universities`);
  process.exit(0);
}

seedUniversities().catch(err => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
