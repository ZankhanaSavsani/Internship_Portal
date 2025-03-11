import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/guide-allocation";

// Allocate guide to a range of students
export const allocateGuide = async (range, guideId, semester) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/allocate`, {
      range,
      guideId,
      semester,
    });
    return response.data;
  } catch (error) {
    console.error("Error allocating guide:", error);
    throw error;
  }
};

// Fetch all guide allocations
export const getAllGuideAllocations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/allocations`);
    return response.data;
  } catch (error) {
    console.error("Error fetching guide allocations:", error);
    throw error;
  }
};