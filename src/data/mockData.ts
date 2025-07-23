
import { Scene, Project, CastMember, BudgetItem, ScheduleItem } from '../types';

export const mockProject: Project = {
  name: "Demo: Forrest Gump",
  created: "July 23, 2025",
  scenes: 13
};

export const mockScenes: Scene[] = [
  {
    id: 1,
    number: "1",
    header: "EXT. A SAVANNAH STREET - DAY (1981)",
    pageFrame: "1 4/8",
    content: "A feather floats through the air. The falling feather. A city, Savannah, is revealed in the background. The feather floats down toward the city below. The feather drops down toward the street below, as people walk past and cars drive by, and nearly lands on a man's shoulder. He walks across the street, causing the feather to be whisked back on its journey. The feather floats above a stopped car. The car drives off right as the feather floats down toward the street.",
    breakdown: {
      cast: ["MAN", "FORREST GUMP", "FORREST", "BLACK WOMAN", "NURSE", "WOMAN"],
      props: ["Feather", "Bus bench", "Box of chocolates", "Old suitcase", "Case", "Clothes"],
      locationDetails: ["Street", "Bench", "City"]
    },
    notes: ""
  },
  {
    id: 2,
    number: "2",
    header: "INT. COUNTRY DOCTOR'S OFFICE - GREENBOW, ALABAMA - DAY",
    pageFrame: "5/8",
    content: "A little boy closes his eyes tightly. It is young Forrest as we will see in the next scene. The little boy is quite ill.",
    breakdown: {
      cast: ["FORREST", "DOCTOR"],
      props: ["Medical equipment", "Stethoscope"],
      locationDetails: ["Doctor's office", "Medical room"]
    },
    notes: ""
  },
  {
    id: 3,
    number: "3",
    header: "EXT. GREENBOW, ALABAMA",
    pageFrame: "1/8",
    content: "Mrs. Gump and young Forrest walk across the street. Forrest looks around.",
    breakdown: {
      cast: ["MRS. GUMP", "FORREST"],
      props: [],
      locationDetails: ["Street", "Greenbow"]
    },
    notes: ""
  }
];

export const mockCastData: CastMember[] = [
  { id: 1, tag: "FORREST", dood: 11, scenes: 58, occurrence: 6, pages: "3/8" },
  { id: 2, tag: "MRS. GUMP", dood: 9, scenes: 29, occurrence: 4, pages: "2/8" },
  { id: 3, tag: "PRINCIPAL", dood: 5, scenes: 16, occurrence: 1, pages: "6/8" },
  { id: 4, tag: "DOCTOR", dood: 1, scenes: 5, occurrence: 5, pages: "5/8" }
];

export const mockBudgetData: BudgetItem[] = [
  { id: 1, code: "11-00", name: "STORY & SCENARIO", tagType: "NONE", estimate: 0, fringes: 0 },
  { id: 2, code: "12-00", name: "PRODUCERS UNIT", tagType: "NONE", estimate: 0, fringes: 0 },
  { id: 3, code: "13-00", name: "DIRECTION", tagType: "NONE", estimate: 0, fringes: 0 },
  { id: 4, code: "14-00", name: "CAST", tagType: "Cast", estimate: 0, fringes: 0 },
  { id: 5, code: "15-00", name: "CAST TRAVEL & LIVING", tagType: "NONE", estimate: 0, fringes: 0 },
  { id: 6, code: "20-00", name: "EXTRAS & CROWDS", tagType: "Extras", estimate: 0, fringes: 0 },
  { id: 7, code: "21-00", name: "PRODUCTION STAFF", tagType: "NONE", estimate: 0, fringes: 0 },
  { id: 8, code: "22-00", name: "ART DIRECTION", tagType: "NONE", estimate: 0, fringes: 0 },
  { id: 9, code: "23-00", name: "SET CONSTRUCTION", tagType: "Greenery", estimate: 0, fringes: 0 },
  { id: 10, code: "24-00", name: "SET OPERATIONS", tagType: "NONE", estimate: 0, fringes: 0 },
  { id: 11, code: "25-00", name: "SPECIAL EFFECTS", tagType: "Visual FX", estimate: 0, fringes: 0 }
];

export const mockScheduleData: ScheduleItem[] = [
  {
    id: 1,
    set: "EXT. A SAVANNAH STREET - DAY (1981)",
    castId: "1 4/8",
    pages: "1 4/8",
    unit: "Assign Unit",
    estimation: 15,
    location: "Assign Location",
    description: "A feather floats through the air. The falling feather."
  },
  {
    id: 2,
    set: "EXT. GUMP BOARDING HOUSE - DAY",
    castId: "2/8",
    pages: "2/8",
    unit: "Assign Unit",
    estimation: 0,
    location: "Assign Location",
    description: "A cab driver closes the trunk of the car as two women walk t..."
  },
  {
    id: 3,
    set: "INT. COUNTRY DOCTOR'S OFFICE - GREENBOW, ALABAMA - DAY",
    castId: "5/8",
    pages: "5/8",
    unit: "Assign Unit",
    estimation: 0.5,
    location: "Assign Location",
    description: "(1951) A little boy closes his eyes tightly. It is young For..."
  }
];

export const analysisParameters = [
  "Copyright Clearance",
  "COVID-19",
  "Minors",
  "Stunt Performers",
  "Animal Wranglers",
  "Dialogue Screen Time",
  "Target Audience",
  "Precautions",
  "References",
  "Crew"
];
