import React, { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { Table, Dropdown, Input, Grid, Row, Col, Card, Button } from "antd";
import { ControlOutlined } from "@ant-design/icons";
import { getMoviesData, columns } from "../services/service";
const { useBreakpoint } = Grid;

const ListMovies = () => {
  const screens = useBreakpoint();
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterString, setFilterString] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const movieData = await getMoviesData();
    const transformedData = await transformData(movieData);
    setOriginalData(transformedData);
    setFilteredData(transformedData);
  };

  const transformData = async (movieData) => {
    const transformedData = await Promise.all(
      movieData.map((item, index) => {
        let MovieName = "#";
        let Year = "#";
        let FileResolution = "#";
        let Format = "#";

        if (item.Type === "FILE" && item.Name) {
          const nameParts = item.Name.split("-");
          if (nameParts.length === 3) {
            MovieName = nameParts[0];
            Year = nameParts[1];
            const rawFormat = nameParts[2];
            if (rawFormat) {
              const [resolution, format] = rawFormat.split(".");
              FileResolution = `${resolution}p` || "#";
              Format = format || "#";
            }
          }
        }

        return {
          key: index + 1, // Ant Design requires a key for each row
          ...item,
          MovieName,
          Year,
          FileResolution,
          Format,
        };
      })
    );

    return transformedData;
  };

  const search_input_onchange = (e) => {
    setSearchQuery(e.target.value);
    handleSearch(e.target.value);
  };

  const handleSearch = useMemo(
    () =>
      debounce((value) => {
        const filtered_data = originalData.filter((item) => item.MovieName.toLowerCase().includes(value.toLowerCase()));
        setFilteredData(filtered_data);
        setFilterString("");
      }, 300), // 300ms delay
    [originalData]
  );

  const handleFilter = ({ key }) => {
    setFilterString(key);
    const filters = {
      "<480p": (item) => parseInt(item.FileResolution) < 480,
      "480p": (item) => item.FileResolution === "480p",
      "720p": (item) => item.FileResolution === "720p",
      "1080p": (item) => item.FileResolution === "1080p",
      ">1080p": (item) => parseInt(item.FileResolution) > 1080,
    };
    setFilteredData(originalData.filter(filters[key]));
  };

  const menu = {
    items: [
      { label: <span style={{ fontWeight: "bold" }}>less than 480p</span>, key: "<480p" },
      { label: <span style={{ fontWeight: "bold" }}>480p</span>, key: "480p" },
      { label: <span style={{ fontWeight: "bold" }}>720p</span>, key: "720p" },
      { label: <span style={{ fontWeight: "bold" }}>1080p</span>, key: "1080p" },
      { label: <span style={{ fontWeight: "bold" }}>more than 1080p</span>, key: ">1080p" },
    ],
    onClick: handleFilter,
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 13, backgroundColor: "#006dff", color: "white" }}>
        <div>
          Search: <Input placeholder="Search by Movie Name" value={searchQuery} onChange={search_input_onchange} style={{ marginBottom: "10px", width: "70%" }} />
        </div>
        <div>
          <Dropdown menu={menu}>
            <Button>
              <ControlOutlined />
            </Button>
          </Dropdown>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 10 }}>
        <strong>
          {filteredData.length} | {filterString} file(s) found.{" "}
        </strong>
      </div>

      {screens.lg ? (
        // if screen size is md or large
        <div>
          <div style={{ padding: "20px" }}>
            <Table columns={columns} dataSource={filteredData} pagination={false} scroll={{ y: 300 }} bordered />
          </div>
        </div>
      ) : (
        // if screen size is small
        <div style={{ padding: 20, backgroundColor: "#eeecec" }}>
          <div style={{ height: "70vh", overflowX: "hidden", overflowY: "auto" }}>
            <Row gutter={[16, 16]}>
              {filteredData.map((item, i) => (
                <Col span={24} key={item.key}>
                  <Card
                    //title={item.MovieName}
                    bordered
                    style={{
                      marginBottom: "16px",
                      border: "1px solid gray",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#006dff",
                        color: "white",
                        padding: "10px",
                        borderBottom: "1px solid gray",
                      }}
                    >
                      {item.key}) <strong>{item.MovieName}</strong>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 5, border: "1px solid #e5e5e5" }}>
                      Year:
                      <strong>{item.Year}</strong>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 5, border: "1px solid #e5e5e5" }}>
                      Format: <strong>{item.Format}</strong>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 5, border: "1px solid #e5e5e5" }}>
                      Size: <strong>{item.Size}</strong>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 5, border: "1px solid #e5e5e5" }}>
                      Mentioned Resolution: <strong>{item.FileResolution}</strong>
                    </div>

                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 5, border: "1px solid #e5e5e5" }}>
                      Actual Resolution: <strong>{item.Resolution}</strong>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 5, border: "1px solid #e5e5e5" }}>
                      Dimension: <strong>{item.Dimension}</strong>
                    </div>
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
