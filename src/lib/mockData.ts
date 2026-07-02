// Mock Database for PhysioPrep

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  exam: string;
  subject: string;
  topic: string;
  year?: number;
  questionText: string;
  imageUrl?: string;
  options: Option[];
  correctOptionId: string;
  explanation: string;
  referenceBook?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  college: string;
  xp: number;
  solvedCount: number;
  avatarUrl?: string;
  isCurrentUser?: boolean;
}

export interface TestSection {
  id: string;
  title: string;
  description?: string;
  questions: Question[];
}

export interface MockTest {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  totalQuestions: number;
  positiveMarks: number;
  negativeMarks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  sections?: TestSection[];
}

export interface Flashcard {
  id: string;
  subject: string;
  topic: string;
  front: string;
  back: string;
  interval: number; // in days
  easeFactor: number;
  nextReviewDate: string; // ISO string
}

export interface DiscussionThread {
  id: string;
  questionId: string;
  author: string;
  avatarUrl?: string;
  title: string;
  content: string;
  upvotes: number;
  commentsCount: number;
  createdAt: string;
  comments: {
    id: string;
    author: string;
    avatarUrl?: string;
    content: string;
    upvotes: number;
    createdAt: string;
  }[];
}

// 1. Practice / PYQ Questions
export const mockQuestions: Question[] = [
  {
    id: "q1",
    exam: "AIIMS",
    subject: "Anatomy",
    topic: "Shoulder Joint & Rotator Cuff",
    year: 2022,
    questionText: "A 45-year-old patient presents with pain and difficulty in initiating abduction of the shoulder. An MRI reveals a tear in the muscle responsible for initiating this movement. Which of the following muscles is most likely affected?",
    options: [
      { id: "o1_a", text: "Supraspinatus" },
      { id: "o1_b", text: "Infraspinatus" },
      { id: "o1_c", text: "Subscapularis" },
      { id: "o1_d", text: "Deltoid" }
    ],
    correctOptionId: "o1_a",
    explanation: "The supraspinatus muscle initiates the first 15 degrees of shoulder abduction. The deltoid muscle takes over for abduction from 15 to 90 degrees. Pain or inability to initiate abduction points specifically to a supraspinatus pathology or rotator cuff tear.",
    referenceBook: "BD Chaurasia's Human Anatomy, Vol 1 - Upper Limb & Thorax, Chapter 6",
    difficulty: "Easy"
  },
  {
    id: "q2",
    exam: "ESIC",
    subject: "Electrotherapy",
    topic: "Shortwave Diathermy (SWD)",
    year: 2023,
    questionText: "Which of the following electrical currents/waveforms is utilized in Shortwave Diathermy for deep tissue heating?",
    options: [
      { id: "o2_a", text: "High frequency alternating current at 27.12 MHz" },
      { id: "o2_b", text: "Medium frequency interrupted direct current at 4000 Hz" },
      { id: "o2_c", text: "Low frequency direct current" },
      { id: "o2_d", text: "Asymmetrical biphasic pulsed current" }
    ],
    correctOptionId: "o2_a",
    explanation: "Shortwave Diathermy (SWD) operates at a high frequency of 27.12 MHz with a wavelength of 11.06 meters. High-frequency electromagnetic currents pass through tissue, producing heat due to molecular friction and ionic oscillation without stimulating motor or sensory nerves.",
    referenceBook: "Clayton's Electrotherapy, 9th Edition, Chapter 8",
    difficulty: "Medium"
  },
  {
    id: "q3",
    exam: "DSSSB",
    subject: "Kinesiology",
    topic: "Gait & Biomechanics",
    year: 2021,
    questionText: "During the normal gait cycle, which muscle group contract eccentrically immediately after heel strike to prevent the foot from slapping the ground?",
    options: [
      { id: "o3_a", text: "Plantarflexors (Gastrocnemius and Soleus)" },
      { id: "o3_b", text: "Dorsiflexors (Tibialis Anterior)" },
      { id: "o3_c", text: "Knee Extensors (Quadriceps Femoris)" },
      { id: "o3_d", text: "Hip Extensors (Gluteus Maximus)" }
    ],
    correctOptionId: "o3_b",
    explanation: "Immediately after heel strike (initial contact), the dorsiflexors (primarily Tibialis Anterior) contract eccentrically to control the lowering of the foot to the ground (loading response). Weakness of these muscles results in 'foot slap' or 'foot drop'.",
    referenceBook: "Joint Structure and Function by Cynthia Norkin, Chapter 14: Gait",
    difficulty: "Medium"
  },
  {
    id: "q4",
    exam: "AIIMS",
    subject: "Physiology",
    topic: "Nerve Conduction & Muscle Fibers",
    year: 2020,
    questionText: "Which type of nerve fibers has the fastest conduction velocity and is primarily responsible for transmitting proprioceptive information from skeletal muscle spindles?",
    options: [
      { id: "o4_a", text: "Type A-alpha (Ia/Ib)" },
      { id: "o4_b", text: "Type A-beta (II)" },
      { id: "o4_c", text: "Type A-delta (III)" },
      { id: "o4_d", text: "Type C (IV)" }
    ],
    correctOptionId: "o4_a",
    explanation: "Type A-alpha fibers are heavily myelinated, have the largest diameter (12-20 μm), and the fastest conduction velocity (70-120 m/s). They carry proprioceptive impulses from muscle spindles (Ia) and Golgi tendon organs (Ib). In contrast, Type C fibers are unmyelinated and carry slow pain/temperature.",
    referenceBook: "Guyton and Hall Textbook of Medical Physiology, Chapter 46",
    difficulty: "Hard"
  },
  {
    id: "q5",
    exam: "RRB",
    subject: "Orthopedics",
    topic: "Ligamentous Injuries",
    year: 2019,
    questionText: "A football player suffers a twisting injury to the knee. On examination, the therapist performs the Lachman test, which demonstrates significant anterior translation of the tibia. This indicates a tear in which ligament?",
    options: [
      { id: "o5_a", text: "Posterior Cruciate Ligament (PCL)" },
      { id: "o5_b", text: "Medial Collateral Ligament (MCL)" },
      { id: "o5_c", text: "Anterior Cruciate Ligament (ACL)" },
      { id: "o5_d", text: "Lateral Collateral Ligament (LCL)" }
    ],
    correctOptionId: "o5_c",
    explanation: "The Lachman test is the most sensitive clinical test for detecting an Anterior Cruciate Ligament (ACL) tear. It is performed with the knee in 20-30 degrees of flexion, pulling the tibia anteriorly relative to the femur. A soft or mushy end-feel indicates a positive test.",
    referenceBook: "Tidy's Physiotherapy, Chapter 12: Orthopaedics",
    difficulty: "Easy"
  },
  {
    id: "q6",
    exam: "NORCET",
    subject: "Neurology",
    topic: "Stroke Syndromes",
    year: 2022,
    questionText: "A patient presents with contralateral hemiplegia and hemisensory loss, affecting the lower limb significantly more than the upper limb and face. Urinary incontinence is also present. Which cerebral artery is most likely occluded?",
    options: [
      { id: "o6_a", text: "Middle Cerebral Artery (MCA)" },
      { id: "o6_b", text: "Anterior Cerebral Artery (ACA)" },
      { id: "o6_c", text: "Posterior Cerebral Artery (PCA)" },
      { id: "o6_d", text: "Basilar Artery" }
    ],
    correctOptionId: "o6_b",
    explanation: "Anterior Cerebral Artery (ACA) syndrome is characterized by contralateral motor and sensory deficits, with the lower extremity severely affected compared to the upper extremity and face. Urinary incontinence, abulia, and contralateral grasp reflexes are also typical ACA signs.",
    referenceBook: "Physical Rehabilitation by Susan O'Sullivan, 7th Edition, Chapter 18: Stroke",
    difficulty: "Hard"
  },
  {
    id: "q7",
    exam: "State PSC",
    subject: "Cardio-respiratory",
    topic: "Postural Drainage",
    year: 2021,
    questionText: "To perform postural drainage for the lateral basal segment of the left lower lobe, what position should the patient be placed in?",
    options: [
      { id: "o7_a", text: "Right side-lying with foot of bed elevated 18 inches" },
      { id: "o7_b", text: "Left side-lying with foot of bed elevated 18 inches" },
      { id: "o7_c", text: "Prone lying with pillows under hips and bed flat" },
      { id: "o7_d", text: "Supine lying with knees flexed and bed flat" }
    ],
    correctOptionId: "o7_a",
    explanation: "For the lateral basal segment of the left lower lobe, the patient lies on their right side (opposite side) with the foot of the bed elevated 18 inches (approx. 30 degrees). This utilizes gravity to drain secretions from the lateral bronchial branches into the main bronchi.",
    referenceBook: "Cardiopulmonary Physical Therapy by Cash, Chapter 10",
    difficulty: "Medium"
  },
  {
    id: "q8",
    exam: "NHM",
    subject: "Exercise Therapy",
    topic: "Stretching & Range of Motion",
    year: 2022,
    questionText: "During a hamstring stretching program, the therapist asks the patient to contract the hamstrings isometricially against resistance for 6 seconds, relaxes for 2 seconds, and then stretches the hamstrings passively. This PNF stretching technique is known as:",
    options: [
      { id: "o8_a", text: "Contract-Relax" },
      { id: "o8_b", text: "Hold-Relax" },
      { id: "o8_c", text: "Agonist Contraction" },
      { id: "o8_d", text: "Rhythmic Stabilization" }
    ],
    correctOptionId: "o8_b",
    explanation: "Hold-Relax involves bringing the muscle to its end range of motion, performing an isometric contraction of the tight muscle (antagonist) against resistance for 5-10 seconds, relaxing it, and then moving into a deeper passive stretch. It relies on autogenic inhibition of the target muscle.",
    referenceBook: "Therapeutic Exercise by Kisner and Colby, 7th Edition, Chapter 4",
    difficulty: "Easy"
  },
  {
    id: "q9",
    exam: "AIIMS",
    subject: "Pediatrics",
    topic: "Developmental Milestones",
    year: 2023,
    questionText: "At what age does a typically developing infant acquire the ability to sit independently without support for at least 10 seconds?",
    options: [
      { id: "o9_a", text: "3 to 4 months" },
      { id: "o9_b", text: "6 to 7 months" },
      { id: "o9_c", text: "9 to 10 months" },
      { id: "o9_d", text: "11 to 12 months" }
    ],
    correctOptionId: "o9_b",
    explanation: "An infant usually acquires independent sitting (sitting without support for short periods) around 6 to 7 months of age. Propped sitting using hands for balance emerges around 5 months, and stable sitting while playing with toys appears by 8 months.",
    referenceBook: "Tecklin's Pediatric Physical Therapy, 5th Edition, Chapter 2",
    difficulty: "Easy"
  },
  {
    id: "q10",
    exam: "ESIC",
    subject: "Anatomy",
    topic: "Nerve Injuries & Deformities",
    year: 2018,
    questionText: "A patient presents with a 'claw hand' deformity. Physical examination reveals sensory loss over the medial one and a half fingers and wasting of the interossei muscles. Which nerve is compressed?",
    options: [
      { id: "o10_a", text: "Median Nerve" },
      { id: "o10_b", text: "Radial Nerve" },
      { id: "o10_c", text: "Ulnar Nerve" },
      { id: "o10_d", text: "Axillary Nerve" }
    ],
    correctOptionId: "o10_c",
    explanation: "The ulnar nerve supplies the interossei muscles, the medial two lumbricals, and sensory innervation to the medial one and a half fingers. Injury to the ulnar nerve leads to hyperextension at the MCP joints and flexion at the IP joints of the 4th and 5th digits, creating the characteristic claw hand (ulnar claw).",
    referenceBook: "BD Chaurasia's Human Anatomy, Vol 1, Chapter 8",
    difficulty: "Medium"
  },
  {
    id: "q11",
    exam: "AIIMS",
    subject: "Kinesiology",
    topic: "Patellofemoral Biomechanics",
    year: 2021,
    questionText: "Which component of the quadriceps muscle group is crucial for resisting lateral patellar subluxation and must be selectively strengthened in patellofemoral pain syndrome?",
    options: [
      { id: "o11_a", text: "Rectus Femoris" },
      { id: "o11_b", text: "Vastus Lateralis" },
      { id: "o11_c", text: "Vastus Medialis Oblique (VMO)" },
      { id: "o11_d", text: "Vastus Intermedius" }
    ],
    correctOptionId: "o11_c",
    explanation: "The Vastus Medialis Oblique (VMO) fibers run at a 50-55 degree angle medially and act as a dynamic stabilizer to pull the patella medially, offsetting the lateral pull of the Vastus Lateralis and iliotibial band. Selective strengthening of the VMO is key in patellofemoral tracking therapies.",
    referenceBook: "Joint Structure and Function by Cynthia Norkin, Chapter 11",
    difficulty: "Medium"
  },
  {
    id: "q12",
    exam: "DSSSB",
    subject: "Electrotherapy",
    topic: "Iontophoresis",
    year: 2022,
    questionText: "In iontophoretic transdermal drug delivery, which electrode polarity must be used to drive Dexamethasone Sodium Phosphate (a negatively charged anti-inflammatory drug) into the tissues?",
    options: [
      { id: "o12_a", text: "Anode (positive electrode)" },
      { id: "o12_b", text: "Cathode (negative electrode)" },
      { id: "o12_c", text: "Both electrodes alternatively" },
      { id: "o12_d", text: "Ground electrode" }
    ],
    correctOptionId: "o12_b",
    explanation: "Iontophoresis works on the principle that like charges repel. Since Dexamethasone Sodium Phosphate has a negative charge, it must be placed under the Cathode (negative electrode) so that the negative charge of the electrode repels the drug, pushing it through the skin barrier.",
    referenceBook: "Clayton's Electrotherapy, 9th Edition, Chapter 4",
    difficulty: "Hard"
  }
];

// 2. Student Achievements
export const mockAchievements: Achievement[] = [
  {
    id: "streak_3",
    title: "Streak Beginner",
    description: "Maintain a study streak for 3 consecutive days",
    icon: "Flame",
    xpReward: 50,
    unlocked: true,
    unlockedAt: "2026-06-25T14:30:00Z"
  },
  {
    id: "streak_7",
    title: "Streak Master",
    description: "Maintain a study streak for 7 consecutive days",
    icon: "Flame",
    xpReward: 150,
    unlocked: true,
    unlockedAt: "2026-06-27T08:00:00Z"
  },
  {
    id: "first_mock",
    title: "Exam Taker",
    description: "Complete your first full-length Mock Test",
    icon: "Award",
    xpReward: 100,
    unlocked: true,
    unlockedAt: "2026-06-26T18:22:00Z"
  },
  {
    id: "accuracy_90",
    title: "Sniper Accuracy",
    description: "Achieve over 90% accuracy in a practice session of 10+ questions",
    icon: "Target",
    xpReward: 200,
    unlocked: false
  },
  {
    id: "anatomy_ace",
    title: "Anatomy Ace",
    description: "Solve 50 Anatomy questions correctly",
    icon: "ShieldCheck",
    xpReward: 100,
    unlocked: false
  },
  {
    id: "xp_1000",
    title: "XP Collector",
    description: "Amass 1,000 total XP points",
    icon: "Zap",
    xpReward: 250,
    unlocked: false
  }
];

// 3. Leaderboard Users
export const mockLeaderboard: LeaderboardUser[] = [
  { rank: 1, name: "Sneha Sharma", college: "IPGMER, Kolkata", xp: 4520, solvedCount: 380, avatarUrl: "" },
  { rank: 2, name: "Rahul Verma", college: "KEM Hospital, Mumbai", xp: 4180, solvedCount: 345, avatarUrl: "" },
  { rank: 3, name: "Priya Nair", college: "MCOPS, Manipal", xp: 3950, solvedCount: 310, avatarUrl: "" },
  { rank: 4, name: "Arjun Das", college: "NIRTAR, Cuttack", xp: 3710, solvedCount: 298, avatarUrl: "" },
  { rank: 5, name: "Abhishek Yadav", college: "SVNIRTAR, Cuttack", xp: 820, solvedCount: 78, avatarUrl: "", isCurrentUser: true },
  { rank: 6, name: "Meera Patel", college: "MGM Institute, Navi Mumbai", xp: 790, solvedCount: 72, avatarUrl: "" },
  { rank: 7, name: "Karan Johar", college: "DDU Institute, Delhi", xp: 620, solvedCount: 54, avatarUrl: "" }
];

// 4. Mock Tests
export const mockTests: MockTest[] = [
  {
    id: "mock_1",
    title: "AIIMS Physiotherapist Recruitment Test - Mini Mock 1",
    description: "Full syllabus practice test mirroring latest AIIMS physiotherapist pattern. Includes negative markings.",
    durationMinutes: 30,
    totalQuestions: 12,
    positiveMarks: 1,
    negativeMarks: 0.25,
    difficulty: "Medium",
    sections: [
      {
        id: "sec_1",
        title: "Section A: Anatomy & Physiology",
        description: "Core questions covering body systems, pathways, and muscle anatomy.",
        questions: [
          {
            id: "q1",
            exam: "AIIMS",
            subject: "Anatomy",
            topic: "Shoulder Joint & Rotator Cuff",
            year: 2022,
            questionText: "A 45-year-old patient presents with pain and difficulty in initiating abduction of the shoulder. An MRI reveals a tear in the muscle responsible for initiating this movement. Which of the following muscles is most likely affected?",
            options: [
              { id: "o1_a", text: "Supraspinatus" },
              { id: "o1_b", text: "Infraspinatus" },
              { id: "o1_c", text: "Subscapularis" },
              { id: "o1_d", text: "Deltoid" }
            ],
            correctOptionId: "o1_a",
            explanation: "The supraspinatus muscle initiates the first 15 degrees of shoulder abduction. The deltoid muscle takes over for abduction from 15 to 90 degrees. Pain or inability to initiate abduction points specifically to a supraspinatus pathology or rotator cuff tear.",
            referenceBook: "BD Chaurasia's Human Anatomy, Vol 1 - Upper Limb & Thorax, Chapter 6",
            difficulty: "Easy"
          },
          {
            id: "q4",
            exam: "AIIMS",
            subject: "Physiology",
            topic: "Nerve Conduction & Muscle Fibers",
            year: 2020,
            questionText: "Which type of nerve fibers has the fastest conduction velocity and is primarily responsible for transmitting proprioceptive information from skeletal muscle spindles?",
            options: [
              { id: "o4_a", text: "Type A-alpha (Ia/Ib)" },
              { id: "o4_b", text: "Type A-beta (II)" },
              { id: "o4_c", text: "Type A-delta (III)" },
              { id: "o4_d", text: "Type C (IV)" }
            ],
            correctOptionId: "o4_a",
            explanation: "Type A-alpha fibers are heavily myelinated, have the largest diameter (12-20 μm), and the fastest conduction velocity (70-120 m/s). They carry proprioceptive impulses from muscle spindles (Ia) and Golgi tendon organs (Ib). In contrast, Type C fibers are unmyelinated and carry slow pain/temperature.",
            referenceBook: "Guyton and Hall Textbook of Medical Physiology, Chapter 46",
            difficulty: "Hard"
          },
          {
            id: "q9",
            exam: "AIIMS",
            subject: "Pediatrics",
            topic: "Developmental Milestones",
            year: 2023,
            questionText: "At what age does a typically developing infant acquire the ability to sit independently without support for at least 10 seconds?",
            options: [
              { id: "o9_a", text: "3 to 4 months" },
              { id: "o9_b", text: "6 to 7 months" },
              { id: "o9_c", text: "9 to 10 months" },
              { id: "o9_d", text: "11 to 12 months" }
            ],
            correctOptionId: "o9_b",
            explanation: "An infant usually acquires independent sitting (sitting without support for short periods) around 6 to 7 months of age. Propped sitting using hands for balance emerges around 5 months, and stable sitting while playing with toys appears by 8 months.",
            referenceBook: "Tecklin's Pediatric Physical Therapy, 5th Edition, Chapter 2",
            difficulty: "Easy"
          },
          {
            id: "q10",
            exam: "ESIC",
            subject: "Anatomy",
            topic: "Nerve Injuries & Deformities",
            year: 2018,
            questionText: "A patient presents with a 'claw hand' deformity. Physical examination reveals sensory loss over the medial one and a half fingers and wasting of the interossei muscles. Which nerve is compressed?",
            options: [
              { id: "o10_a", text: "Median Nerve" },
              { id: "o10_b", text: "Radial Nerve" },
              { id: "o10_c", text: "Ulnar Nerve" },
              { id: "o10_d", text: "Axillary Nerve" }
            ],
            correctOptionId: "o10_c",
            explanation: "The ulnar nerve supplies the interossei muscles, the medial two lumbricals, and sensory innervation to the medial one and a half fingers. Injury to the ulnar nerve leads to hyperextension at the MCP joints and flexion at the IP joints of the 4th and 5th digits, creating the characteristic claw hand (ulnar claw).",
            referenceBook: "BD Chaurasia's Human Anatomy, Vol 1, Chapter 8",
            difficulty: "Medium"
          }
        ]
      },
      {
        id: "sec_2",
        title: "Section B: Clinical Sciences",
        description: "Applied topics covering Kinesiology, Electrotherapy, and Orthopedics.",
        questions: [
          {
            id: "q2",
            exam: "ESIC",
            subject: "Electrotherapy",
            topic: "Shortwave Diathermy (SWD)",
            year: 2023,
            questionText: "Which of the following electrical currents/waveforms is utilized in Shortwave Diathermy for deep tissue heating?",
            options: [
              { id: "o2_a", text: "High frequency alternating current at 27.12 MHz" },
              { id: "o2_b", text: "Medium frequency interrupted direct current at 4000 Hz" },
              { id: "o2_c", text: "Low frequency direct current" },
              { id: "o2_d", text: "Asymmetrical biphasic pulsed current" }
            ],
            correctOptionId: "o2_a",
            explanation: "Shortwave Diathermy (SWD) operates at a high frequency of 27.12 MHz with a wavelength of 11.06 meters. High-frequency electromagnetic currents pass through tissue, producing heat due to molecular friction and ionic oscillation without stimulating motor or sensory nerves.",
            referenceBook: "Clayton's Electrotherapy, 9th Edition, Chapter 8",
            difficulty: "Medium"
          },
          {
            id: "q3",
            exam: "DSSSB",
            subject: "Kinesiology",
            topic: "Gait & Biomechanics",
            year: 2021,
            questionText: "During the normal gait cycle, which muscle group contract eccentrically immediately after heel strike to prevent the foot from slapping the ground?",
            options: [
              { id: "o3_a", text: "Plantarflexors (Gastrocnemius and Soleus)" },
              { id: "o3_b", text: "Dorsiflexors (Tibialis Anterior)" },
              { id: "o3_c", text: "Knee Extensors (Quadriceps Femoris)" },
              { id: "o3_d", text: "Hip Extensors (Gluteus Maximus)" }
            ],
            correctOptionId: "o3_b",
            explanation: "Immediately after heel strike (initial contact), the dorsiflexors (primarily Tibialis Anterior) contract eccentrically to control the lowering of the foot to the ground (loading response). Weakness of these muscles results in 'foot slap' or 'foot drop'.",
            referenceBook: "Joint Structure and Function by Cynthia Norkin, Chapter 14: Gait",
            difficulty: "Medium"
          },
          {
            id: "q5",
            exam: "RRB",
            subject: "Orthopedics",
            topic: "Ligamentous Injuries",
            year: 2019,
            questionText: "A football player suffers a twisting injury to the knee. On examination, the therapist performs the Lachman test, which demonstrates significant anterior translation of the tibia. This indicates a tear in which ligament?",
            options: [
              { id: "o5_a", text: "Posterior Cruciate Ligament (PCL)" },
              { id: "o5_b", text: "Medial Collateral Ligament (MCL)" },
              { id: "o5_c", text: "Anterior Cruciate Ligament (ACL)" },
              { id: "o5_d", text: "Lateral Collateral Ligament (LCL)" }
            ],
            correctOptionId: "o5_c",
            explanation: "The Lachman test is the most sensitive clinical test for detecting an Anterior Cruciate Ligament (ACL) tear. It is performed with the knee in 20-30 degrees of flexion, pulling the tibia anteriorly relative to the femur. A soft or mushy end-feel indicates a positive test.",
            referenceBook: "Tidy's Physiotherapy, Chapter 12: Orthopaedics",
            difficulty: "Easy"
          },
          {
            id: "q6",
            exam: "NORCET",
            subject: "Neurology",
            topic: "Stroke Syndromes",
            year: 2022,
            questionText: "A patient presents with contralateral hemiplegia and hemisensory loss, affecting the lower limb significantly more than the upper limb and face. Urinary incontinence is also present. Which cerebral artery is most likely occluded?",
            options: [
              { id: "o6_a", text: "Middle Cerebral Artery (MCA)" },
              { id: "o6_b", text: "Anterior Cerebral Artery (ACA)" },
              { id: "o6_c", text: "Posterior Cerebral Artery (PCA)" },
              { id: "o6_d", text: "Basilar Artery" }
            ],
            correctOptionId: "o6_b",
            explanation: "Anterior Cerebral Artery (ACA) syndrome is characterized by contralateral motor and sensory deficits, with the lower extremity severely affected compared to the upper extremity and face. Urinary incontinence, abulia, and contralateral grasp reflexes are also typical ACA signs.",
            referenceBook: "Physical Rehabilitation by Susan O'Sullivan, 7th Edition, Chapter 18: Stroke",
            difficulty: "Hard"
          },
          {
            id: "q7",
            exam: "State PSC",
            subject: "Cardio-respiratory",
            topic: "Postural Drainage",
            year: 2021,
            questionText: "To perform postural drainage for the lateral basal segment of the left lower lobe, what position should the patient be placed in?",
            options: [
              { id: "o7_a", text: "Right side-lying with foot of bed elevated 18 inches" },
              { id: "o7_b", text: "Left side-lying with foot of bed elevated 18 inches" },
              { id: "o7_c", text: "Prone lying with pillows under hips and bed flat" },
              { id: "o7_d", text: "Supine lying with knees flexed and bed flat" }
            ],
            correctOptionId: "o7_a",
            explanation: "For the lateral basal segment of the left lower lobe, the patient lies on their right side (opposite side) with the foot of the bed elevated 18 inches (approx. 30 degrees). This utilizes gravity to drain secretions from the lateral bronchial branches into the main bronchi.",
            referenceBook: "Cardiopulmonary Physical Therapy by Cash, Chapter 10",
            difficulty: "Medium"
          },
          {
            id: "q8",
            exam: "NHM",
            subject: "Exercise Therapy",
            topic: "Stretching & Range of Motion",
            year: 2022,
            questionText: "During a hamstring stretching program, the therapist asks the patient to contract the hamstrings isometricially against resistance for 6 seconds, relaxes for 2 seconds, and then stretches the hamstrings passively. This PNF stretching technique is known as:",
            options: [
              { id: "o8_a", text: "Contract-Relax" },
              { id: "o8_b", text: "Hold-Relax" },
              { id: "o8_c", text: "Agonist Contraction" },
              { id: "o8_d", text: "Rhythmic Stabilization" }
            ],
            correctOptionId: "o8_b",
            explanation: "Hold-Relax involves bringing the muscle to its end range of motion, performing an isometric contraction of the tight muscle (antagonist) against resistance for 5-10 seconds, relaxing it, and then moving into a deeper passive stretch. It relies on autogenic inhibition of the tight muscle.",
            referenceBook: "Therapeutic Exercise by Kisner and Colby, 7th Edition, Chapter 4",
            difficulty: "Easy"
          },
          {
            id: "q11",
            exam: "AIIMS",
            subject: "Kinesiology",
            topic: "Patellofemoral Biomechanics",
            year: 2021,
            questionText: "Which component of the quadriceps muscle group is crucial for resisting lateral patellar subluxation and must be selectively strengthened in patellofemoral pain syndrome?",
            options: [
              { id: "o11_a", text: "Rectus Femoris" },
              { id: "o11_b", text: "Vastus Lateralis" },
              { id: "o11_c", text: "Vastus Medialis Oblique (VMO)" },
              { id: "o11_d", text: "Vastus Intermedius" }
            ],
            correctOptionId: "o11_c",
            explanation: "The Vastus Medialis Oblique (VMO) fibers run at a 50-55 degree angle medially and act as a dynamic stabilizer to pull the patella medially, offsetting the lateral pull of the Vastus Lateralis and iliotibial band. Selective strengthening of the VMO is key in patellofemoral tracking therapies.",
            referenceBook: "Joint Structure and Function by Cynthia Norkin, Chapter 11",
            difficulty: "Medium"
          },
          {
            id: "q12",
            exam: "DSSSB",
            subject: "Electrotherapy",
            topic: "Iontophoresis",
            year: 2022,
            questionText: "In iontophoretic transdermal drug delivery, which electrode polarity must be used to drive Dexamethasone Sodium Phosphate (a negatively charged anti-inflammatory drug) into the tissues?",
            options: [
              { id: "o12_a", text: "Anode (positive electrode)" },
              { id: "o12_b", text: "Cathode (negative electrode)" },
              { id: "o12_c", text: "Both electrodes alternatively" },
              { id: "o12_d", text: "Ground electrode" }
            ],
            correctOptionId: "o12_b",
            explanation: "Iontophoresis works on the principle that like charges repel. Since Dexamethasone Sodium Phosphate has a negative charge, it must be placed under the Cathode (negative electrode) so that the negative charge of the electrode repels the drug, pushing it through the skin barrier.",
            referenceBook: "Clayton's Electrotherapy, 9th Edition, Chapter 4",
            difficulty: "Hard"
          }
        ]
      }
    ]
  },
  {
    id: "mock_2",
    title: "ESIC General Physiotherapy Exam - Paper 2",
    description: "Covers Core Electrotherapy, Exercise Therapy, and Clinical Orthopedics. 1 mark per question.",
    durationMinutes: 45,
    totalQuestions: 30,
    positiveMarks: 1,
    negativeMarks: 0.33,
    difficulty: "Hard"
  },
  {
    id: "mock_3",
    title: "DSSSB Practice Exam - Anatomy & Physiology",
    description: "Focused test covering upper/lower limb anatomy, nerve pathways, and muscle actions.",
    durationMinutes: 20,
    totalQuestions: 15,
    positiveMarks: 1,
    negativeMarks: 0.25,
    difficulty: "Easy"
  }
];

// 5. Flashcards
export const mockFlashcards: Flashcard[] = [
  {
    id: "f1",
    subject: "Anatomy",
    topic: "Nerves",
    front: "What is the nerve root of the Phrenic Nerve?",
    back: "C3, C4, C5 (mainly C4). 'C3, 4, 5 keeps the diaphragm alive.'",
    interval: 3,
    easeFactor: 2.5,
    nextReviewDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "f2",
    subject: "Electrotherapy",
    topic: "SWD",
    front: "What is the standard frequency and wavelength used in Shortwave Diathermy?",
    back: "Frequency: 27.12 MHz. Wavelength: 11.06 meters.",
    interval: 1,
    easeFactor: 2.3,
    nextReviewDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "f3",
    subject: "Kinesiology",
    topic: "Gait",
    front: "What constitutes the 'Double Support' phase in a gait cycle?",
    back: "Double support is the period when both feet are in contact with the ground. It occurs twice in a single gait cycle (initial double support and terminal double support), making up about 20% of the normal gait cycle.",
    interval: 5,
    easeFactor: 2.6,
    nextReviewDate: new Date().toISOString() // Due today
  },
  {
    id: "f4",
    subject: "Orthopedics",
    topic: "Knee",
    front: "What structures are involved in the 'Unhappy Triad' of the knee?",
    back: "1. Anterior Cruciate Ligament (ACL)\n2. Medial Collateral Ligament (MCL)\n3. Medial Meniscus (though lateral meniscus injuries are also common in acute tears).",
    interval: 4,
    easeFactor: 2.4,
    nextReviewDate: new Date().toISOString() // Due today
  },
  {
    id: "f5",
    subject: "Neurology",
    topic: "Reflexes",
    front: "Describe the Babinski Sign and what it indicates.",
    back: "Babinski sign is abnormal extension/dorsiflexion of the big toe and fanning of the other toes upon stroking the lateral sole of the foot. In adults, it indicates an Upper Motor Neuron (UMN) lesion (corticospinal tract damage). It is normal in infants under 1-2 years.",
    interval: 2,
    easeFactor: 2.4,
    nextReviewDate: new Date().toISOString() // Due today
  }
];

// 6. Discussion Threads
export const mockDiscussions: DiscussionThread[] = [
  {
    id: "d1",
    questionId: "q1",
    author: "Amit Patel",
    avatarUrl: "",
    title: "Supraspinatus Abduction Angle Clarification",
    content: "Why is supraspinatus considered the main initiator? Some reference books suggest that deltoid is active from the start, but supraspinatus has a better mechanical advantage in the first 0-15 degrees. Can anyone explain the biomechanics of this?",
    upvotes: 18,
    commentsCount: 2,
    createdAt: "2026-06-25T16:00:00Z",
    comments: [
      {
        id: "dc1",
        author: "Prof. S. R. Iyer",
        content: "Excellent question. The line of action of the deltoid is almost parallel to the humerus when the arm is by the side. Thus, its initial contraction forces the humeral head upwards against the acromion rather than abducting it. The supraspinatus runs horizontally, so its force vector pulls the humeral head medially, seating it in the glenoid fossa and creating a downward glide that allows the deltoid to pull the arm outward. This is called the force couple.",
        upvotes: 15,
        createdAt: "2026-06-25T18:30:00Z"
      },
      {
        id: "dc2",
        author: "Meenakshi K.",
        content: "Yes, Prof. Iyer is correct! Norkin's Joint Structure & Function explains this force couple in detail. Without supraspinatus, the deltoid just causes impingement.",
        upvotes: 4,
        createdAt: "2026-06-26T09:12:00Z"
      }
    ]
  },
  {
    id: "d2",
    questionId: "q2",
    author: "Rohan Verma",
    avatarUrl: "",
    title: "SWD Frequency regulations",
    content: "Why do we only use 27.12 MHz? Are other frequencies allowed in medical diathermy?",
    upvotes: 7,
    commentsCount: 1,
    createdAt: "2026-06-26T14:00:00Z",
    comments: [
      {
        id: "dc3",
        author: "ElectroTherapist_2026",
        content: "Frequencies are allocated globally by the Federal Communications Commission (FCC) to prevent interference with wireless communications. The permitted frequencies for Industrial, Scientific, and Medical (ISM) use are 13.56 MHz, 27.12 MHz, and 40.68 MHz. 27.12 MHz is the easiest to construct and shield, making it the most cost-effective standard.",
        upvotes: 9,
        createdAt: "2026-06-26T15:22:00Z"
      }
    ]
  }
];

// 7. Student Daily Goals & Progress Stats
export const mockUserStats = {
  solvedToday: 4,
  goalToday: 10,
  xp: 820,
  level: 4,
  streak: 7,
  rank: 5,
  overallAccuracy: 78.4,
  questionsAttempted: 102,
  questionsCorrect: 80,
  timeSpentMinutes: 340, // cumulative
  subjectAccuracy: [
    { name: "Anatomy", accuracy: 82, count: 30 },
    { name: "Electrotherapy", accuracy: 70, count: 20 },
    { name: "Kinesiology", accuracy: 75, count: 24 },
    { name: "Physiology", accuracy: 68, count: 12 },
    { name: "Orthopedics", accuracy: 85, count: 16 }
  ],
  weakTopics: [
    { topic: "Nerve Conduction Velocity", subject: "Physiology", accuracy: 55 },
    { topic: "Shortwave Diathermy Electrode Setup", subject: "Electrotherapy", accuracy: 58 },
    { topic: "Stroke Syndromes (Neurology)", subject: "Neurology", accuracy: 60 }
  ],
  recentActivity: [
    { id: "a1", type: "practice", description: "Solved 5 questions in Electrotherapy", time: "2 hours ago", xp: 50 },
    { id: "a2", type: "mock", description: "Completed AIIMS Mini Mock Test 1", time: "Yesterday", xp: 120, result: "Score: 16/20, Accuracy: 80%" },
    { id: "a3", type: "streak", description: "Achieved a 7-day study streak!", time: "Today", xp: 150 },
    { id: "a4", type: "flashcard", description: "Reviewed 12 flashcards", time: "3 days ago", xp: 30 }
  ],
  weeklyActivity: [
    { name: "Mon", questions: 5, xp: 50 },
    { name: "Tue", questions: 12, xp: 120 },
    { name: "Wed", questions: 8, xp: 80 },
    { name: "Thu", questions: 15, xp: 150 },
    { name: "Fri", questions: 4, xp: 40 },
    { name: "Sat", questions: 10, xp: 100 },
    { name: "Sun", questions: 6, xp: 60 }
  ],
  heatmapData: [
    { date: "2026-06-20", count: 2 },
    { date: "2026-06-21", count: 5 },
    { date: "2026-06-22", count: 8 },
    { date: "2026-06-23", count: 12 },
    { date: "2026-06-24", count: 4 },
    { date: "2026-06-25", count: 6 },
    { date: "2026-06-26", count: 15 },
    { date: "2026-06-27", count: 4 }
  ]
};
