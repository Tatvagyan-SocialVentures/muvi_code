import jsonData from "../data/all_file_list.json";

// get data from GitHub
/*
export const getMoviesData = async () => {
  try {
    //const endPoint = "https://raw.githubusercontent.com/nayak001/mymovies/refs/heads/main/all_file_list.json";
    const endPoint = "https://raw.githubusercontent.com/Tatvagyan-SocialVentures/data/refs/heads/main/all_file_list.json";

    const response = await fetch(endPoint);
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};
*/

// get data from local
export const getMoviesData = async () => {
  try {
    return jsonData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};
