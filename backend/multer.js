import mongoose from "mongoose";
import dotenv from "dotenv";
import SchemeModel from "./models/SchemeModels.js";

const schemes = [
    {
      state: "All India",
      title: "Pradhan Mantri Jan Dhan Yojana",
      description: "A national mission for financial inclusion to ensure access to financial services.",
      steps: "Open a bank account with zero balance.",
      tags: ["Financial Inclusion", "Banking", "PMJDY"],
      link: "https://pmjdy.gov.in"
    },
    {
      state: "All India",
      title: "Swachh Bharat Mission",
      description: "Aims to clean streets, roads, and infrastructure of cities, towns, and rural areas.",
      steps: "Participate in cleanliness drives and promote sanitation.",
      tags: ["Cleanliness", "Sanitation", "Swachh Bharat"],
      link: "https://swachhbharatmission.gov.in"
    },
    {
      state: "All India",
      title: "PM Kisan Samman Nidhi",
      description: "Provides income support to farmers for their agricultural needs.",
      steps: "Register through the PM Kisan portal.",
      tags: ["Agriculture", "Farmer Support", "PM Kisan"],
      link: "https://pmkisan.gov.in"
    },
    {
      state: "All India",
      title: "Atal Pension Yojana",
      description: "A pension scheme for workers in the unorganised sector.",
      steps: "Enroll through authorized banks.",
      tags: ["Pension", "Financial Security", "Atal Pension"],
      link: "https://www.npscra.nsdl.co.in"
    },
    {
      state: "All India",
      title: "PM Jeevan Jyoti Bima Yojana",
      description: "Provides life insurance coverage to individuals.",
      steps: "Enroll via participating banks.",
      tags: ["Insurance", "Life Coverage", "PMJJBY"],
      link: "https://jansuraksha.gov.in"
    },
    {
      state: "All India",
      title: "PM Suraksha Bima Yojana",
      description: "Accidental death and disability insurance scheme.",
      steps: "Sign up through banks.",
      tags: ["Insurance", "Accident Coverage", "PMSBY"],
      link: "https://jansuraksha.gov.in"
    },
    {
      state: "All India",
      title: "PM Awas Yojana (Urban)",
      description: "Provides affordable housing to urban poor.",
      steps: "Apply through the PMAY portal.",
      tags: ["Housing", "Urban Development", "PMAY"],
      link: "https://pmaymis.gov.in"
    },
    {
      state: "All India",
      title: "PM Awas Yojana (Gramin)",
      description: "Affordable housing for rural poor.",
      steps: "Apply via the PMAY Gramin portal.",
      tags: ["Housing", "Rural Development", "PMAY Gramin"],
      link: "https://pmayg.nic.in"
    },
    {
      state: "All India",
      title: "Pradhan Mantri Fasal Bima Yojana",
      description: "Crop insurance scheme for farmers.",
      steps: "Enroll through the PMFBY portal or banks.",
      tags: ["Agriculture", "Crop Insurance", "PMFBY"],
      link: "https://pmfby.gov.in"
    },
    {
      state: "All India",
      title: "National Rural Employment Guarantee Act (MGNREGA)",
      description: "Provides 100 days of wage employment in a financial year to rural households.",
      steps: "Register at local gram panchayat to get work.",
      tags: ["Employment", "Rural Development", "MGNREGA"],
      link: "https://nrega.nic.in"
    },
    {
      state: "All India",
      title: "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana",
      description: "Health insurance scheme covering medical treatment for poor families.",
      steps: "Register via the official portal to get a health card.",
      tags: ["Health", "Insurance", "Ayushman Bharat"],
      link: "https://pmjay.gov.in"
    },
    {
      state: "All India",
      title: "National Education Mission (Samagra Shiksha Abhiyan)",
      description: "Integrates various educational schemes to improve school education.",
      steps: "Enroll students and avail quality education programs.",
      tags: ["Education", "School", "Samagra Shiksha"],
      link: "https://samagra.education.gov.in"
    },
    {
      state: "All India",
      title: "Skill India / Pradhan Mantri Kaushal Vikas Yojana",
      description: "Provides skill training and development to youth.",
      steps: "Register on PMKVY portal to get certified training.",
      tags: ["Skill Development", "Youth", "PMKVY"],
      link: "https://pmkvy.officialsite.in"
    },
    {
      state: "All India",
      title: "Stand Up India Scheme",
      description: "Facilitates bank loans between 10 lakhs and 1 crore to SC/ST and women entrepreneurs.",
      steps: "Apply via the Stand Up India portal.",
      tags: ["Entrepreneurship", "Loans", "Stand Up India"],
      link: "https://www.standupmitra.in"
    },
    {
      state: "All India",
      title: "Deen Dayal Upadhyaya Grameen Kaushalya Yojana",
      description: "Skill development program for rural youth.",
      steps: "Register at the nearest training center.",
      tags: ["Skill Development", "Rural", "DDU-GKY"],
      link: "https://ddugky.gov.in"
    },
    {
      state: "All India",
      title: "National Health Mission",
      description: "Improves healthcare services in rural and urban areas.",
      steps: "Enroll at local health centers for health services.",
      tags: ["Health", "Government Hospitals", "NHM"],
      link: "https://nhm.gov.in"
    },
    {
      state: "All India",
      title: "Pradhan Mantri Ujjwala Yojana",
      description: "Provides LPG connections to women from below poverty line households.",
      steps: "Apply online or via local distributors for LPG connection.",
      tags: ["Energy", "LPG", "Ujjwala Yojana"],
      link: "https://www.pmuy.gov.in"
    },
    {
      state: "All India",
      title: "Beti Bachao Beti Padhao",
      description: "Promotes girl child education and combats female foeticide.",
      steps: "Participate in awareness programs and enroll girls in school.",
      tags: ["Education", "Girl Child", "BBBP"],
      link: "https://betibachao.gov.in"
    },
    {
      state: "All India",
      title: "Digital India",
      description: "Transform India into a digitally empowered society.",
      steps: "Participate in digital literacy programs and services.",
      tags: ["Digital", "Governance", "Technology"],
      link: "https://digitalindia.gov.in"
    },
    {
      state: "All India",
      title: "Pradhan Mantri Gram Sadak Yojana",
      description: "Provides all-weather road connectivity to unconnected villages.",
      steps: "Application through local gram panchayat.",
      tags: ["Infrastructure", "Rural Development", "PMGSY"],
      link: "https://pmgsy.nic.in"
    },
    {
      state: "All India",
      title: "National Social Assistance Program",
      description: "Provides social security benefits to elderly, widows, and disabled.",
      steps: "Apply through local government offices.",
      tags: ["Social Welfare", "Assistance", "NSAP"],
      link: "https://nsap.nic.in"
    },
    {
      state: "All India",
      title: "Pradhan Mantri Shram Yogi Maan-dhan",
      description: "Pension scheme for unorganized workers.",
      steps: "Enroll via authorized banks.",
      tags: ["Pension", "Unorganized Workers", "PM-SYM"],
      link: "https://maandhan.in"
    },
    {
      state: "All India",
      title: "National Nutrition Mission (POSHAN Abhiyaan)",
      description: "Improves nutritional outcomes for children, pregnant women, and lactating mothers.",
      steps: "Participate in health and nutrition programs at local centers.",
      tags: ["Nutrition", "Health", "POSHAN Abhiyaan"],
      link: "https://poshan.abhiyaan.gov.in"
    },
    {
      state: "All India",
      title: "National Rural Health Mission",
      description: "Strengthening healthcare services in rural areas.",
      steps: "Register at primary health centers for services.",
      tags: ["Health", "Rural", "NRHM"],
      link: "https://nhm.gov.in"
    },
    {
      state: "All India",
      title: "Pradhan Mantri Matru Vandana Yojana",
      description: "Maternity benefit program for pregnant and lactating women.",
      steps: "Apply through Anganwadi centers.",
      tags: ["Health", "Maternity", "PMMVY"],
      link: "https://pmgsy.nic.in"
    },
    {
      state: "All India",
      title: "Rashtriya Swasthya Bima Yojana",
      description: "Health insurance coverage for below poverty line families.",
      steps: "Enroll via authorized insurance providers.",
      tags: ["Health", "Insurance", "RSBY"],
      link: "https://rsby.gov.in"
    },
    {
      state: "All India",
      title: "National Apprenticeship Scheme",
      description: "Promotes apprenticeship training for youth.",
      steps: "Register at the official portal and join training programs.",
      tags: ["Skill Development", "Youth", "Apprenticeship"],
      link: "https://www.apprenticeshipindia.gov.in"
    },
    {
      state: "All India",
      title: "Janani Suraksha Yojana",
      description: "Promotes institutional deliveries among pregnant women.",
      steps: "Enroll at local health centers to receive benefits.",
      tags: ["Health", "Maternity", "JSY"],
      link: "https://nhm.gov.in"
    },
    {
      state: "All India",
      title: "National Rural Livelihood Mission",
      description: "Promotes self-employment and organization of rural poor.",
      steps: "Register via SHG groups or local offices.",
      tags: ["Employment", "Rural", "NRLM"],
      link: "https://aajeevika.gov.in"
    },
    {
      state: "All India",
      title: "Kisan Credit Card",
      description: "Provides short-term credit to farmers.",
      steps: "Apply at authorized banks to get a KCC.",
      tags: ["Agriculture", "Credit", "Farmers"],
      link: "https://www.kisancreditcard.com"
    },
    {
      state: "All India",
      title: "Rashtriya Bal Swasthya Karyakram",
      description: "Health screening and early intervention for children.",
      steps: "Enroll children at local health centers.",
      tags: ["Health", "Child Welfare", "RBSK"],
      link: "https://nhm.gov.in"
    },
    {
      state: "All India",
      title: "Pradhan Mantri Sahaj Bijli Har Ghar Yojana (Saubhagya)",
      description: "Provides electricity connections to all households.",
      steps: "Apply via the Saubhagya portal.",
      tags: ["Energy", "Electricity", "Saubhagya"],
      link: "https://saubhagya.gov.in"
    },
    {
      state: "All India",
      title: "National Clean Energy Fund",
      description: "Promotes clean energy technologies.",
      steps: "Participate in renewable energy programs and initiatives.",
      tags: ["Energy", "Renewable", "Clean Energy"],
      link: "https://www.mnre.gov.in"
    },
    {
      state: "All India",
      title: "National Pension Scheme",
      description: "Voluntary, defined contribution retirement savings scheme.",
      steps: "Enroll via banks or online portal.",
      tags: ["Pension", "Retirement", "NPS"],
      link: "https://www.npscra.nsdl.co.in"
    },
    {
      state: "All India",
      title: "Pradhan Mantri Gram Sadak Yojana (PMGSY)",
      description: "Provides all-weather road connectivity to unconnected villages.",
      steps: "Application through local gram panchayat.",
      tags: ["Infrastructure", "Rural Development", "PMGSY"],
      link: "https://pmgsy.nic.in"
    }
  ];

dotenv.config(); // Load .env variables


mongoose.connect(process.env.MONGO_URL)
.then(async () => {
    console.log("MongoDB connected");
    await SchemeModel.insertMany(schemes);
    console.log("Schemes inserted successfully!");
    mongoose.disconnect();
})
.catch(err => console.error("MongoDB connection error:", err));
