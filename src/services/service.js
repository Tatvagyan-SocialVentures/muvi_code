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

export const columns = [
  {
    title: "Sl",
    dataIndex: "key",
    key: "key",
    width: "5%",
  },
  {
    title: "Movie Name",
    dataIndex: "MovieName",
    key: "MovieName",
    width: "25%",
  },
  {
    title: "Year",
    dataIndex: "Year",
    key: "Year",
    width: "10%",
  },
  {
    title: "Format",
    dataIndex: "Format",
    key: "Format",
    width: "10%",
  },
  {
    title: "Size",
    dataIndex: "Size",
    key: "Size",
    width: "10%",
  },
  {
    title: "File Resolution",
    dataIndex: "FileResolution",
    key: "FileResolution",
    width: "15%",
  },
  {
    title: " Actual Resolution",
    dataIndex: "Resolution",
    key: "Resolution",
    width: "15%",
  },
  {
    title: "Dimension",
    dataIndex: "Dimension",
    key: "Dimension",
    width: "10%",
  },
];
