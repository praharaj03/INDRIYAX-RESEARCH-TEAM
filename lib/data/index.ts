import type { Event } from "@/types/event";
import type { News } from "@/types/news";

export const events: Event[] = [
  // ── UPCOMING ──────────────────────────────────────────────────────
  {
    id: "1",
    slug: "myopia-management-2025",
    title: "Myopia Management in Children",
    type: "upcoming",
    thumbnail:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600",
    description:
      "A comprehensive seminar on modern myopia control strategies for pediatric patients, covering orthokeratology, atropine therapy, and lifestyle interventions.",
    speaker: "Dr. Priya Sharma",
    date: "2025-08-15",
    venue: "City Eye Care Centre, Mumbai",
  },
  {
    id: "2",
    slug: "dry-eye-workshop-2025",
    title: "Dry Eye Disease: Diagnosis & Management",
    type: "upcoming",
    thumbnail:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600",
    description:
      "Hands-on workshop covering the latest diagnostic tools including meibography, LipiView, and treatment protocols for evaporative and aqueous-deficient dry eye.",
    speaker: "Dr. Arjun Mehta",
    date: "2025-09-10",
    venue: "National Optometry Institute, Delhi",
  },
  {
    id: "3",
    slug: "pediatric-vision-screening-2025",
    title: "Pediatric Vision Screening Camp",
    type: "upcoming",
    thumbnail:
      "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600",
    description:
      "A community-driven vision screening initiative targeting school-age children across rural Maharashtra. Free eye exams and spectacle distribution included.",
    speaker: "Dr. Sunita Rao",
    date: "2025-09-28",
    venue: "Zilla Parishad School, Nashik",
  },
  {
    id: "4",
    slug: "advanced-contact-lens-fitting-2025",
    title: "Advanced Contact Lens Fitting Masterclass",
    type: "upcoming",
    thumbnail:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600",
    description:
      "Deep dive into scleral lens fitting, specialty lens designs for keratoconus, and post-surgical corneas. Hands-on fitting sessions included.",
    speaker: "Dr. Kavita Nair",
    date: "2025-10-05",
    venue: "LV Prasad Eye Institute, Hyderabad",
  },
  {
    id: "5",
    slug: "ocular-pharmacology-2025",
    title: "Ocular Pharmacology for Optometrists",
    type: "upcoming",
    thumbnail:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600",
    description:
      "Understanding topical and systemic drugs in eye care — from anti-glaucoma agents to anti-VEGF therapy. Includes case-based learning.",
    speaker: "Dr. Ramesh Gupta",
    date: "2025-10-18",
    venue: "Aravind Eye Hospital, Chennai",
  },
  {
    id: "6",
    slug: "low-vision-rehabilitation-2025",
    title: "Low Vision Rehabilitation Workshop",
    type: "upcoming",
    thumbnail:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600",
    description:
      "Practical training on low vision assessment, magnification devices, and patient counselling for practitioners working with visually impaired individuals.",
    speaker: "Dr. Meera Pillai",
    date: "2025-11-02",
    venue: "Sankara Nethralaya, Bangalore",
  },
  {
    id: "7",
    slug: "diabetic-retinopathy-screening-2025",
    title: "Diabetic Retinopathy Screening & Grading",
    type: "upcoming",
    thumbnail:
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600",
    description:
      "Learn systematic fundus examination, retinal photography interpretation, and AI-assisted grading tools for diabetic retinopathy in primary care settings.",
    speaker: "Dr. Vikram Bose",
    date: "2025-11-20",
    venue: "AIIMS, New Delhi",
  },
  {
    id: "8",
    slug: "optometry-entrepreneurship-2025",
    title: "Building Your Optometry Practice",
    type: "upcoming",
    thumbnail:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
    description:
      "A business-focused seminar covering clinic setup, patient acquisition, digital marketing, and financial planning for independent optometrists.",
    speaker: "Dr. Ananya Krishnan",
    date: "2025-12-06",
    venue: "IIM Ahmedabad, Gujarat",
  },

  // ── PAST ──────────────────────────────────────────────────────────
  {
    id: "9",
    slug: "contact-lens-innovations-2024",
    title: "Contact Lens Innovations 2024",
    type: "past",
    thumbnail:
      "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600",
    description:
      "Explored the latest advancements in contact lens technology including smart lenses, drug-eluting lenses, and next-gen orthokeratology designs.",
    speaker: "Dr. Neha Kapoor",
    date: "2024-11-20",
    venue: "Optometry College, Pune",
    summary:
      "The event covered scleral lenses, orthokeratology, and smart contact lens research. Over 200 practitioners attended from 12 states.",
    recordingLink: "https://youtube.com",
  },
  {
    id: "10",
    slug: "glaucoma-awareness-2024",
    title: "Glaucoma Awareness & Early Detection",
    type: "past",
    thumbnail:
      "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=600",
    description:
      "Community outreach event focused on glaucoma screening, IOP measurement techniques, and patient education on the silent thief of sight.",
    speaker: "Dr. Rajesh Iyer",
    date: "2024-09-05",
    venue: "Community Health Centre, Bangalore",
    summary:
      "Free screenings were conducted for 500+ patients. 47 early-stage glaucoma cases were detected and referred for further treatment.",
  },
  {
    id: "11",
    slug: "corneal-topography-masterclass-2024",
    title: "Corneal Topography Masterclass",
    type: "past",
    thumbnail:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600",
    description:
      "Intensive training on Placido disc and Scheimpflug imaging, keratoconus detection indices, and pre-surgical corneal mapping.",
    speaker: "Dr. Suresh Babu",
    date: "2024-07-14",
    venue: "Narayana Nethralaya, Bangalore",
    summary:
      "80 optometrists completed hands-on training on Pentacam and Orbscan systems. Participants reported 40% improvement in keratoconus detection confidence.",
    recordingLink: "https://youtube.com",
  },
  {
    id: "12",
    slug: "vision-therapy-workshop-2024",
    title: "Vision Therapy for Binocular Vision Disorders",
    type: "past",
    thumbnail:
      "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600",
    description:
      "Two-day intensive workshop on diagnosing and treating convergence insufficiency, amblyopia, and strabismus using evidence-based vision therapy protocols.",
    speaker: "Dr. Pooja Desai",
    date: "2024-05-22",
    venue: "Manipal College of Health Professions, Manipal",
    summary:
      "150 participants learned VT protocols for CI, amblyopia, and strabismus. Case presentations and live demonstrations were highlights of the event.",
    recordingLink: "https://youtube.com",
  },
  {
    id: "13",
    slug: "retinal-imaging-symposium-2024",
    title: "Retinal Imaging Symposium",
    type: "past",
    thumbnail:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600",
    description:
      "Symposium on OCT interpretation, wide-field fundus photography, and fluorescein angiography for retinal disease management in optometric practice.",
    speaker: "Dr. Harish Menon",
    date: "2024-03-10",
    venue: "Shankar Netralaya, Chennai",
    summary:
      "300+ attendees explored OCT-A, ultra-widefield imaging, and AI-assisted retinal analysis. Industry partners showcased latest imaging platforms.",
  },
  {
    id: "14",
    slug: "sports-vision-training-2023",
    title: "Sports Vision Training for Athletes",
    type: "past",
    thumbnail:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
    description:
      "Specialized training on visual performance assessment for athletes — dynamic visual acuity, contrast sensitivity, depth perception, and reaction time testing.",
    speaker: "Dr. Aditya Verma",
    date: "2023-12-08",
    venue: "Sports Authority of India, Patiala",
    summary:
      "Collaborated with national-level coaches and sports scientists. 60 optometrists certified in sports vision assessment protocols.",
    recordingLink: "https://youtube.com",
  },
  {
    id: "15",
    slug: "indriyax-annual-conference-2023",
    title: "IndriyaX Annual Conference 2023",
    type: "past",
    thumbnail:
      "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600",
    description:
      "IndriyaX's flagship annual event bringing together 500+ optometrists, researchers, and industry leaders for two days of learning, networking, and innovation.",
    speaker: "Multiple Speakers",
    date: "2023-10-15",
    venue: "Taj Lands End, Mumbai",
    summary:
      "The inaugural IndriyaX Annual Conference saw 500+ attendees, 20 keynote sessions, 8 workshops, and 15 industry exhibitors. A landmark event for Indian optometry.",
    recordingLink: "https://youtube.com",
  },
];

export const news: News[] = [
  {
    id: "1",
    title: "WHO Reports Rising Global Myopia Epidemic",
    description:
      "New WHO data shows nearly 50% of the world's population could be myopic by 2050, urging urgent preventive action in schools and communities.",
    link: "https://www.who.int",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600",
  },
  {
    id: "2",
    title: "AI-Powered Retinal Screening Shows Promise",
    description:
      "A new AI tool can detect diabetic retinopathy with 95% accuracy, potentially transforming rural eye care access across developing nations.",
    link: "https://www.nature.com",
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600",
  },
  {
    id: "3",
    title: "Blue Light Glasses: What the Research Says",
    description:
      "A comprehensive review of clinical studies on blue light filtering lenses and their actual effect on digital eye strain and sleep quality.",
    link: "https://www.aoa.org",
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600",
  },
  {
    id: "4",
    title: "India's National Eye Health Policy 2025 Released",
    description:
      "The Ministry of Health has released a landmark policy targeting elimination of avoidable blindness by 2030, with major focus on optometry infrastructure.",
    link: "https://mohfw.gov.in",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600",
  },
  {
    id: "5",
    title: "Orthokeratology Gains Traction for Myopia Control",
    description:
      "New 5-year longitudinal data confirms orthokeratology reduces axial elongation by up to 45% in children aged 8–14, making it a leading myopia control option.",
    link: "https://www.ncbi.nlm.nih.gov",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=600",
  },
  {
    id: "6",
    title: "Teleoptometry Expanding Access in Rural India",
    description:
      "Pilot programs in Rajasthan and Odisha demonstrate that tele-optometry can deliver quality eye care to remote populations at a fraction of traditional costs.",
    link: "https://www.ijo.in",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
  },
];
