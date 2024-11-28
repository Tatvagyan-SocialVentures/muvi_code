export const getMoviesData = async () => {
  try {
    const endPoint = "";

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

export const columns = [
  //   {
  //     title: "Sl",
  //     dataIndex: "key",
  //     key: "key",
  //   },
  {
    title: "Movie Name",
    dataIndex: "MovieName",
    key: "MovieName",
  },
  {
    title: "Year",
    dataIndex: "Year",
    key: "Year",
  },
  {
    title: "Format",
    dataIndex: "Format",
    key: "Format",
  },
  {
    title: "Size",
    dataIndex: "Size",
    key: "Size",
  },
  {
    title: "File Resolution",
    dataIndex: "FileResolution",
    key: "FileResolution",
  },
  {
    title: " Actual Resolution",
    dataIndex: "Resolution",
    key: "Resolution",
  },
  {
    title: "Dimension",
    dataIndex: "Dimension",
    key: "Dimension",
  },
];
