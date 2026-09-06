import { Parcel } from '../types/parcel';

export const MOCK_PARCELS: Parcel[] = [
  {
    id: "P-142-3A",
    surveyNo: "142/3A",
    owner: "Ravi Kumar",
    area: "2.4 acres",
    project: "Chennai–Bengaluru Expressway",
    district: "Vellore",
    status: "dispute",
    coordinates: [
      [12.9280, 79.1420],
      [12.9310, 79.1435],
      [12.9302, 79.1470],
      [12.9268, 79.1450]
    ],
    centroid: [12.9290, 79.1444],
    inspection: {
      required: true,
      reason: "Ownership dispute — boundary mismatch reported against NHAI right-of-way",
      priority: "high",
      lastInspectedOn: null,
      assignedOfficer: "Off. Sundarajan (Vellore Circle)",
      dueDate: "2026-09-15"
    }
  },
  {
    id: "P-108-1B",
    surveyNo: "108/1B",
    owner: "Senthil Nathan & Bros",
    area: "3.8 acres",
    project: "Chennai–Bengaluru Expressway",
    district: "Vellore",
    status: "in_progress",
    coordinates: [
      [12.9320, 79.1480],
      [12.9355, 79.1495],
      [12.9340, 79.1538],
      [12.9305, 79.1515]
    ],
    centroid: [12.9330, 79.1507],
    inspection: {
      required: true,
      reason: "Commercial shed structure demolition & standing teak tree valuation check",
      priority: "high",
      lastInspectedOn: null,
      assignedOfficer: "Off. Sundarajan (Vellore Circle)",
      dueDate: "2026-09-12"
    }
  },
  {
    id: "P-89-4C",
    surveyNo: "89/4C",
    owner: "Kaveri Ammal",
    area: "1.1 acres",
    project: "Chennai–Bengaluru Expressway",
    district: "Vellore",
    status: "completed",
    coordinates: [
      [12.9240, 79.1380],
      [12.9270, 79.1390],
      [12.9260, 79.1420],
      [12.9230, 79.1405]
    ],
    centroid: [12.9250, 79.1399],
    inspection: {
      required: false,
      reason: "Final award possession handed over; mutation completed in e-Adangal",
      priority: "low",
      lastInspectedOn: "2026-08-20",
      assignedOfficer: "Off. Sundarajan (Vellore Circle)",
      dueDate: "2026-08-20"
    }
  },
  {
    id: "P-215-2A",
    surveyNo: "215/2A",
    owner: "Dhanalakshmi Trust",
    area: "4.6 acres",
    project: "Chennai–Bengaluru Expressway",
    district: "Ranipet",
    status: "dispute",
    coordinates: [
      [12.9360, 79.3780],
      [12.9395, 79.3800],
      [12.9380, 79.3850],
      [12.9345, 79.3825]
    ],
    centroid: [12.9370, 79.3814],
    inspection: {
      required: true,
      reason: "Religious trust easement claim overlapping proposed toll plaza lane 4",
      priority: "high",
      lastInspectedOn: null,
      assignedOfficer: "Off. Meenakshi K (Ranipet)",
      dueDate: "2026-09-10"
    }
  },
  {
    id: "P-302-1A",
    surveyNo: "302/1A",
    owner: "M. Venkatesan",
    area: "5.2 acres",
    project: "Chennai–Bengaluru Expressway",
    district: "Ranipet",
    status: "in_progress",
    coordinates: [
      [12.9410, 79.3860],
      [12.9450, 79.3880],
      [12.9435, 79.3930],
      [12.9395, 79.3905]
    ],
    centroid: [12.9422, 79.3894],
    inspection: {
      required: true,
      reason: "Paddy crop harvest verification prior to earthwork handover",
      priority: "medium",
      lastInspectedOn: null,
      assignedOfficer: "Off. Meenakshi K (Ranipet)",
      dueDate: "2026-09-18"
    }
  },
  {
    id: "P-305-6B",
    surveyNo: "305/6B",
    owner: "Arulmigu Mariamman Temple Board",
    area: "0.8 acres",
    project: "Chennai–Bengaluru Expressway",
    district: "Ranipet",
    status: "not_started",
    coordinates: [
      [12.9460, 79.3940],
      [12.9485, 79.3955],
      [12.9475, 79.3990],
      [12.9450, 79.3970]
    ],
    centroid: [12.9468, 79.3964],
    inspection: {
      required: true,
      reason: "HR&CE department NOC verification & tree audit pending",
      priority: "medium",
      lastInspectedOn: null,
      assignedOfficer: "Off. Meenakshi K (Ranipet)",
      dueDate: "2026-09-22"
    }
  },
  {
    id: "P-310-4A",
    surveyNo: "310/4A",
    owner: "G. Parthasarathy",
    area: "3.1 acres",
    project: "Chennai–Bengaluru Expressway",
    district: "Ranipet",
    status: "completed",
    coordinates: [
      [12.9490, 79.4010],
      [12.9525, 79.4030],
      [12.9510, 79.4075],
      [12.9475, 79.4050]
    ],
    centroid: [12.9500, 79.4041],
    inspection: {
      required: false,
      reason: "Section 3G compensation award disbursed; fencing completed",
      priority: "low",
      lastInspectedOn: "2026-08-28",
      assignedOfficer: "Off. Meenakshi K (Ranipet)",
      dueDate: "2026-08-28"
    }
  },
  {
    id: "P-412-2B",
    surveyNo: "412/2B",
    owner: "Lakshmi Narayanan",
    area: "2.7 acres",
    project: "Chennai–Bengaluru Expressway",
    district: "Kanchipuram",
    status: "dispute",
    coordinates: [
      [12.8420, 79.7120],
      [12.8455, 79.7140],
      [12.8440, 79.7185],
      [12.8405, 79.7160]
    ],
    centroid: [12.8430, 79.7151],
    inspection: {
      required: true,
      reason: "High Court writ petition filed regarding alignment cutting farm well",
      priority: "high",
      lastInspectedOn: null,
      assignedOfficer: "Off. Anbarasu R (Kanchipuram)",
      dueDate: "2026-09-09"
    }
  },
  {
    id: "P-415-1C",
    surveyNo: "415/1C",
    owner: "K. Balakrishnan",
    area: "1.9 acres",
    project: "Chennai–Bengaluru Expressway",
    district: "Kanchipuram",
    status: "in_progress",
    coordinates: [
      [12.8465, 79.7200],
      [12.8495, 79.7215],
      [12.8480, 79.7260],
      [12.8450, 79.7240]
    ],
    centroid: [12.8472, 79.7229],
    inspection: {
      required: true,
      reason: "Joint measurement pending with village administrative officer (VAO)",
      priority: "medium",
      lastInspectedOn: null,
      assignedOfficer: "Off. Anbarasu R (Kanchipuram)",
      dueDate: "2026-09-17"
    }
  },
  {
    id: "P-419-5D",
    surveyNo: "419/5D",
    owner: "V. Shanthi & Sons",
    area: "4.1 acres",
    project: "Chennai–Bengaluru Expressway",
    district: "Kanchipuram",
    status: "completed",
    coordinates: [
      [12.8510, 79.7280],
      [12.8545, 79.7298],
      [12.8530, 79.7345],
      [12.8495, 79.7320]
    ],
    centroid: [12.8520, 79.7311],
    inspection: {
      required: false,
      reason: "Direct purchase consent signed; compensation ₹1.82 Cr credited",
      priority: "low",
      lastInspectedOn: "2026-08-15",
      assignedOfficer: "Off. Anbarasu R (Kanchipuram)",
      dueDate: "2026-08-15"
    }
  },
  {
    id: "P-422-3A",
    surveyNo: "422/3A",
    owner: "Rajendran Agro Industries",
    area: "6.5 acres",
    project: "Chennai–Bengaluru Industrial Corridor",
    district: "Kanchipuram",
    status: "in_progress",
    coordinates: [
      [12.8560, 79.7360],
      [12.8600, 79.7385],
      [12.8585, 79.7440],
      [12.8540, 79.7410]
    ],
    centroid: [12.8571, 79.7399],
    inspection: {
      required: true,
      reason: "Industrial shed valuation and machine relocation schedule verification",
      priority: "high",
      lastInspectedOn: null,
      assignedOfficer: "Off. Anbarasu R (Kanchipuram)",
      dueDate: "2026-09-14"
    }
  },
  {
    id: "P-501-1A",
    surveyNo: "501/1A",
    owner: "J. Elangovan",
    area: "3.3 acres",
    project: "Chennai–Bengaluru Expressway",
    district: "Sriperumbudur",
    status: "dispute",
    coordinates: [
      [12.9680, 79.9450],
      [12.9715, 79.9470],
      [12.9700, 79.9515],
      [12.9665, 79.9490]
    ],
    centroid: [12.9690, 79.9481],
    inspection: {
      required: true,
      reason: "Encroachment detected on expressway buffer zone; notice served",
      priority: "high",
      lastInspectedOn: null,
      assignedOfficer: "Off. D. Prakash (Sriperumbudur)",
      dueDate: "2026-09-11"
    }
  },
  {
    id: "P-504-2B",
    surveyNo: "504/2B",
    owner: "Sri Venkateswara Brick Works",
    area: "5.8 acres",
    project: "Chennai–Bengaluru Expressway",
    district: "Sriperumbudur",
    status: "in_progress",
    coordinates: [
      [12.9730, 79.9530],
      [12.9770, 79.9555],
      [12.9752, 79.9605],
      [12.9710, 79.9575]
    ],
    centroid: [12.9740, 79.9566],
    inspection: {
      required: true,
      reason: "Excavation depth audit and brick kiln chimney clearance",
      priority: "medium",
      lastInspectedOn: null,
      assignedOfficer: "Off. D. Prakash (Sriperumbudur)",
      dueDate: "2026-09-20"
    }
  },
  {
    id: "P-508-4A",
    surveyNo: "508/4A",
    owner: "Geetha Mohan",
    area: "1.5 acres",
    project: "Chennai–Bengaluru Expressway",
    district: "Sriperumbudur",
    status: "completed",
    coordinates: [
      [12.9785, 79.9620],
      [12.9815, 79.9635],
      [12.9805, 79.9675],
      [12.9770, 79.9655]
    ],
    centroid: [12.9793, 79.9646],
    inspection: {
      required: false,
      reason: "Compensation disbursed; physical boundary stones planted",
      priority: "low",
      lastInspectedOn: "2026-08-25",
      assignedOfficer: "Off. D. Prakash (Sriperumbudur)",
      dueDate: "2026-08-25"
    }
  },
  {
    id: "P-512-3C",
    surveyNo: "512/3C",
    owner: "Padmavathi Real Estates",
    area: "7.2 acres",
    project: "Chennai–Bengaluru Industrial Corridor",
    district: "Sriperumbudur",
    status: "not_started",
    coordinates: [
      [12.9830, 79.9700],
      [12.9875, 79.9725],
      [12.9860, 79.9780],
      [12.9815, 79.9750]
    ],
    centroid: [12.9845, 79.9739],
    inspection: {
      required: true,
      reason: "Unapproved layout sub-division dispute; DTCP sanction check required",
      priority: "high",
      lastInspectedOn: null,
      assignedOfficer: "Off. D. Prakash (Sriperumbudur)",
      dueDate: "2026-09-13"
    }
  },
  {
    id: "P-155-2B",
    surveyNo: "155/2B",
    owner: "C. Muniswamy",
    area: "2.1 acres",
    project: "Chennai–Bengaluru Expressway",
    district: "Vellore",
    status: "in_progress",
    coordinates: [
      [12.9205, 79.1310],
      [12.9235, 79.1325],
      [12.9225, 79.1360],
      [12.9195, 79.1340]
    ],
    centroid: [12.9215, 79.1334],
    inspection: {
      required: true,
      reason: "Borewell replacement compensation estimation verification",
      priority: "medium",
      lastInspectedOn: null,
      assignedOfficer: "Off. Sundarajan (Vellore Circle)",
      dueDate: "2026-09-19"
    }
  },
  {
    id: "P-160-4A",
    surveyNo: "160/4A",
    owner: "A. Rahim & Sons",
    area: "3.4 acres",
    project: "Chennai–Bengaluru Expressway",
    district: "Vellore",
    status: "not_started",
    coordinates: [
      [12.9150, 79.1240],
      [12.9185, 79.1260],
      [12.9170, 79.1300],
      [12.9135, 79.1280]
    ],
    centroid: [12.9160, 79.1270],
    inspection: {
      required: true,
      reason: "Partition deed heir verification and bank account linking",
      priority: "low",
      lastInspectedOn: null,
      assignedOfficer: "Off. Sundarajan (Vellore Circle)",
      dueDate: "2026-09-25"
    }
  },
  {
    id: "P-220-1D",
    surveyNo: "220/1D",
    owner: "G. Vasantha & Nirmala",
    area: "1.7 acres",
    project: "Chennai–Bengaluru Expressway",
    district: "Ranipet",
    status: "completed",
    coordinates: [
      [12.9300, 79.3700],
      [12.9330, 79.3715],
      [12.9320, 79.3755],
      [12.9290, 79.3735]
    ],
    centroid: [12.9310, 79.3726],
    inspection: {
      required: false,
      reason: "Solar fencing alignment approved and token compensation released",
      priority: "low",
      lastInspectedOn: "2026-08-30",
      assignedOfficer: "Off. Meenakshi K (Ranipet)",
      dueDate: "2026-08-30"
    }
  },
  {
    id: "P-225-3C",
    surveyNo: "225/3C",
    owner: "Thirunavukkarasu Pillai",
    area: "4.0 acres",
    project: "Chennai–Bengaluru Expressway",
    district: "Ranipet",
    status: "dispute",
    coordinates: [
      [12.9240, 79.3620],
      [12.9275, 79.3640],
      [12.9260, 79.3685],
      [12.9225, 79.3660]
    ],
    centroid: [12.9250, 79.3651],
    inspection: {
      required: true,
      reason: "Water channel right-of-way blockage objection by adjacent farmers",
      priority: "high",
      lastInspectedOn: null,
      assignedOfficer: "Off. Meenakshi K (Ranipet)",
      dueDate: "2026-09-11"
    }
  },
  {
    id: "P-430-1A",
    surveyNo: "430/1A",
    owner: "K. S. Devarajan",
    area: "2.9 acres",
    project: "Chennai–Bengaluru Expressway",
    district: "Kanchipuram",
    status: "in_progress",
    coordinates: [
      [12.8350, 79.7020],
      [12.8385, 79.7040],
      [12.8370, 79.7085],
      [12.8335, 79.7060]
    ],
    centroid: [12.8360, 79.7051],
    inspection: {
      required: true,
      reason: "Standing sugarcane crop compensation assessment",
      priority: "medium",
      lastInspectedOn: null,
      assignedOfficer: "Off. Anbarasu R (Kanchipuram)",
      dueDate: "2026-09-16"
    }
  },
  {
    id: "P-435-2B",
    surveyNo: "435/2B",
    owner: "N. Loganathan",
    area: "3.6 acres",
    project: "Chennai–Bengaluru Expressway",
    district: "Kanchipuram",
    status: "completed",
    coordinates: [
      [12.8290, 79.6940],
      [12.8325, 79.6960],
      [12.8310, 79.7000],
      [12.8275, 79.6980]
    ],
    centroid: [12.8300, 79.6970],
    inspection: {
      required: false,
      reason: "Possession handover executed with revenue stamp certificate",
      priority: "low",
      lastInspectedOn: "2026-08-18",
      assignedOfficer: "Off. Anbarasu R (Kanchipuram)",
      dueDate: "2026-08-18"
    }
  },
  {
    id: "P-520-1B",
    surveyNo: "520/1B",
    owner: "St. Thomas Education Society",
    area: "5.0 acres",
    project: "Chennai–Bengaluru Industrial Corridor",
    district: "Sriperumbudur",
    status: "dispute",
    coordinates: [
      [12.9600, 79.9320],
      [12.9640, 79.9345],
      [12.9625, 79.9395],
      [12.9585, 79.9365]
    ],
    centroid: [12.9612, 79.9356],
    inspection: {
      required: true,
      reason: "School playground boundary setback alignment conflict",
      priority: "high",
      lastInspectedOn: null,
      assignedOfficer: "Off. D. Prakash (Sriperumbudur)",
      dueDate: "2026-09-08"
    }
  },
  {
    id: "P-525-4C",
    surveyNo: "525/4C",
    owner: "Velu & Saroja",
    area: "1.2 acres",
    project: "Chennai–Bengaluru Expressway",
    district: "Sriperumbudur",
    status: "in_progress",
    coordinates: [
      [12.9540, 79.9240],
      [12.9570, 79.9255],
      [12.9560, 79.9290],
      [12.9530, 79.9270]
    ],
    centroid: [12.9550, 79.9264],
    inspection: {
      required: true,
      reason: "Joint boundary demarcation with DGPS equipment",
      priority: "low",
      lastInspectedOn: null,
      assignedOfficer: "Off. D. Prakash (Sriperumbudur)",
      dueDate: "2026-09-24"
    }
  },
  {
    id: "P-530-2A",
    surveyNo: "530/2A",
    owner: "K. Gunasekaran",
    area: "2.8 acres",
    project: "Chennai–Bengaluru Expressway",
    district: "Sriperumbudur",
    status: "completed",
    coordinates: [
      [12.9480, 79.9160],
      [12.9510, 79.9175],
      [12.9500, 79.9215],
      [12.9470, 79.9195]
    ],
    centroid: [12.9490, 79.9186],
    inspection: {
      required: false,
      reason: "Award declared; DBT compensation credited to Canara Bank account",
      priority: "low",
      lastInspectedOn: "2026-08-22",
      assignedOfficer: "Off. D. Prakash (Sriperumbudur)",
      dueDate: "2026-08-22"
    }
  }
];

export const CORRIDOR_STATS = {
  totalParcels: MOCK_PARCELS.length,
  inspectionsPending: MOCK_PARCELS.filter(p => p.inspection.required).length,
  highPriorityCount: MOCK_PARCELS.filter(p => p.inspection.required && p.inspection.priority === 'high').length,
  disputeCount: MOCK_PARCELS.filter(p => p.status === 'dispute').length,
  completedCount: MOCK_PARCELS.filter(p => p.status === 'completed').length,
  inProgressCount: MOCK_PARCELS.filter(p => p.status === 'in_progress').length,
};
