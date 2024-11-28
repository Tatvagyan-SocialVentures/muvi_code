import React, { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { Table, Input, Grid, Row, Col, Card } from "antd";
import { getMoviesData, columns } from "../services/service";
const { useBreakpoint } = Grid;

const ListMovies = () => {
  const screens = useBreakpoint();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const movieData = await getMoviesData();
    const transformedData = movieData.map((item, index) => {
      let MovieName = "N/A";
      let Year = "N/A";
      let FileResolution = "N/A";
      let Format = "N/A";

      if (item.Type === "FILE" && item.Name) {
        const nameParts = item.Name.split("-");
        if (nameParts.length === 3) {
          MovieName = nameParts[0];
          Year = nameParts[1];
          const rawFormat = nameParts[2];
          if (rawFormat) {
            const [resolution, format] = rawFormat.split(".");
            FileResolution = `${resolution}p` || "N/A";
            Format = format || "N/A";
          }
        }
      }

      return {
        key: index, // Ant Design requires a key for each row
        ...item,
        MovieName,
        Year,
        FileResolution,
        Format,
      };
    });
    setData(transformedData);
    setFilteredData(transformedData);
  };

  const search_input_onchange = (e) => {
    setSearchQuery(e.target.value);
    handleSearch(e.target.value);
  };

  const handleSearch = useMemo(
    () =>
      debounce((value) => {
        const filtered_data = data.filter((item) => item.MovieName.toLowerCase().includes(value.toLowerCase()));
        setFilteredData(filtered_data);
      }, 300), // 300ms delay
    [data]
  );

  return (
    <>
      {screens.md ? (
        // if screen size is md or large
        <div>
          <div style={{ padding: "20px" }}>
            Search movie: <Input placeholder="Search by Movie Name" value={searchQuery} onChange={search_input_onchange} style={{ marginBottom: "10px", width: "300px" }} />
            {filteredData.length} file(s) found
            <Table
              columns={columns}
              dataSource={filteredData}
              pagination={false} // Remove pagination
              scroll={{ y: 300 }} // Fixed height for the table
            />
          </div>
        </div>
      ) : (
        // if screen size is small
        <div style={{ padding: 20, backgroundColor: "#eeecec" }}>
          <div>
            Search movie: <Input placeholder="Search by Movie Name" value={searchQuery} onChange={search_input_onchange} style={{ marginBottom: "10px" }} />
            {filteredData.length} file(s) found
          </div>
          <div style={{ height: "70vh", overflowX: "hidden", overflowY: "auto" }}>
            <Row gutter={[16, 16]}>
              {filteredData.map((item) => (
                <Col span={24} key={item.key}>
                  <Card title={item.MovieName} bordered={false}>
                    <p>
                      <strong>Year:</strong> {item.Year}
                    </p>
                    <p>
                      <strong>Format:</strong> {item.Format}
                    </p>
                    <p>
                      <strong>Size:</strong> {item.Size}
                    </p>
                    <p>
                      <strong>File Resolution:</strong> {item.FileResolution}
                    </p>

                    <p>
                      <strong>Actual Resolution:</strong> {item.Resolution}
                    </p>
                    <p>
                      <strong>Dimension:</strong> {item.Dimension}
                    </p>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      )}
    </>
  );
};

export default ListMovies;
