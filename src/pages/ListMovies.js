import React, { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { Table, Dropdown, Input, Grid, Row, Col, Card, Button, Tag } from "antd";
import { ControlOutlined } from "@ant-design/icons";
import { getMoviesData } from "../services/service";

const { useBreakpoint } = Grid;

const columns = [
  {
    title: "Details",
    dataIndex: "details",
    key: "details",
    width: "40%",
    render: (text, record, index) => (
      <div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ color: "gray", marginRight: 10 }}>{record.slno}. | </div>
          <div style={{ color: "#625c5c", fontWeight: "bold", fontSize: "14px" }}>{record.fileName.toUpperCase()}</div>
        </div>
        <div>
          <Tag>{record.actualFile}</Tag>
        </div>
        <div>
          <Tag color="red">{record.releasedYear}</Tag>
          <Tag color="blue">{record.fileSize.toUpperCase()}</Tag>
          <Tag color="magenta">{record.fileType.toUpperCase()}</Tag>
        </div>
      </div>
    ),
  },
  {
    title: "Audio Tracks",
    dataIndex: "audioTracks",
    key: "audioTracks",
    width: "15%",
    render: (audioTracks) => (
      <div>
        {audioTracks.map((track, i) => (
          <span key={i}>
            <Tag color="purple">{track.toUpperCase()}</Tag>
          </span>
        ))}
      </div>
    ),
  },
  {
    title: "Hindi",
    dataIndex: "hasHindiAudio",
    key: "hasHindiAudio",
    width: "10%",
    render: (hasHindiAudio) => <Tag>{hasHindiAudio ? "✔️" : "❌"}</Tag>,
  },
  {
    title: "Mentioned Resolution",
    dataIndex: "mentionedResolution",
    key: "mentionedResolution",
    width: "10%",
    render: (mentionedResolution) => (
      <div>
        <Tag color="geekblue">{mentionedResolution}</Tag>
      </div>
    ),
  },
  {
    title: "Actual Resolution",
    dataIndex: "actualResolution",
    key: "actualResolution",
    width: "10%",
    render: (actualResolution) => (
      <div>
        <Tag color="blue">{actualResolution}</Tag>
      </div>
    ),
  },
  {
    title: "Resolution Match",
    dataIndex: "isResolutionMatched",
    key: "isResolutionMatched",
    width: "10%",
    render: (isResolutionMatched) => <Tag>{isResolutionMatched ? "✔️" : "❌"}</Tag>,
  },
  {
    title: "Dimension",
    dataIndex: "dimension",
    key: "dimension",
    width: "10%",
    render: (dimension) => (
      <div>
        <Tag>{dimension}</Tag>
      </div>
    ),
  },
];

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
    setOriginalData(movieData);
    setFilteredData(movieData);
  };

  const findDuplicates = () => {
    const seen = new Map();
    const duplicates = [];

    originalData.forEach((item, index) => {
      if (seen.has(item.fileName)) {
        duplicates.push(seen.get(item.fileName), item);
      } else {
        seen.set(item.fileName, item);
      }
    });
    setFilteredData(duplicates);
    return duplicates;
  };

  const search_input_onchange = (e) => {
    setSearchQuery(e.target.value);
    handleSearch(e.target.value);
    // handlePhoneticSearch(e.target.value);
  };

  const handleSearch = useMemo(
    () =>
      debounce((value) => {
        const filtered_data = originalData.filter((item) => item.fileName.toLowerCase().includes(value.toLowerCase()));
        setFilteredData(filtered_data);
        setFilterString("");
      }, 300), // 300ms delay
    [originalData]
  );

  const handlePhoneticSearch = () => {
    const soundex = (name) => {
      const map = {
        a: "",
        e: "",
        i: "",
        o: "",
        u: "",
        y: "",
        h: "",
        w: "",
        b: "1",
        f: "1",
        p: "1",
        v: "1",
        c: "2",
        g: "2",
        j: "2",
        k: "2",
        q: "2",
        s: "2",
        x: "2",
        z: "2",
        d: "3",
        t: "3",
        l: "4",
        m: "5",
        n: "5",
        r: "6",
      };
      const firstLetter = name[0].toUpperCase();
      const tail = name
        .toLowerCase()
        .split("")
        .slice(1)
        .map((char) => map[char] || "")
        .filter((value, index, self) => value !== self[index - 1]) // Remove duplicates
        .join("");
      return (firstLetter + tail + "000").slice(0, 4); // Pad to ensure length 4
    };

    const targetPhonetic = soundex(searchQuery);
    console.log("targetPhonetic: ", targetPhonetic);
    const phoneticMatch = originalData.filter((data) => {
      const namePhonetic = soundex(data.fileName.split(" ")[0]);
      console.log("namePhonetic: ", namePhonetic);
      return namePhonetic === targetPhonetic;
    });
    console.log("phoneticMatch: ", phoneticMatch);
  };

  const handleFilter = ({ key }) => {
    setFilterString(key);
    const filters = {
      "<480": (item) => item.mentionedResolution < 480,
      480: (item) => item.mentionedResolution === 480,
      720: (item) => item.mentionedResolution === 720,
      1080: (item) => item.mentionedResolution === 1080,
      ">1080": (item) => item.mentionedResolution > 1080,
      no_hindi_audio: (item) => !item.hasHindiAudio,
      no_resolution: (item) => item.mentionedResolution <= 0,
      unequal_resolution: (item) => !item.isResolutionMatched,
    };
    setFilteredData(originalData.filter(filters[key]));
  };

  const menu = {
    items: [
      { key: "no_resolution", label: <span style={{ fontWeight: "bold" }}>No Resolution</span> },
      { key: "<480", label: <span style={{ fontWeight: "bold" }}>Less than 480p</span> },
      { key: "480", label: <span style={{ fontWeight: "bold" }}>480p</span> },
      { key: "720", label: <span style={{ fontWeight: "bold" }}>720p</span> },
      { key: "1080", label: <span style={{ fontWeight: "bold" }}>1080p</span> },
      { key: ">1080", label: <span style={{ fontWeight: "bold" }}>More than 1080p</span> },
      { key: "no_hindi_audio", label: <span style={{ fontWeight: "bold" }}>No Hindi Audio</span> },
      { key: "unequal_resolution", label: <span style={{ fontWeight: "bold" }}>Resolution Not Match</span> },
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
          <Button onClick={findDuplicates}>Duplicates</Button>
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
            <Table columns={columns} dataSource={filteredData.map((item, index) => ({ ...item, key: index + 1 }))} pagination={false} scroll={{ y: 300 }} bordered />
          </div>
        </div>
      ) : (
        // if screen size is small
        <div style={{ padding: 20, backgroundColor: "#eeecec" }}>
          <div style={{ height: "70vh", overflowX: "hidden", overflowY: "auto" }}>
            <Row gutter={[16, 16]}>
              {filteredData.map((item, i) => (
                <Col span={24} key={item.slno}>
                  <Card
                    //title={item.fileName}
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
                      {item.slno}) <strong>{item.fileName.toUpperCase()}</strong>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 5, border: "1px solid #e5e5e5" }}>
                      <Tag>{item.actualFile}</Tag>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 5, border: "1px solid #e5e5e5" }}>
                      Year:
                      <Tag color="red">{item.releasedYear}</Tag>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 5, border: "1px solid #e5e5e5" }}>
                      Format: <Tag color="blue">{item.fileType.toUpperCase()}</Tag>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 5, border: "1px solid #e5e5e5" }}>
                      Size: <Tag color="magenta">{item.fileSize.toUpperCase()}</Tag>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 5, border: "1px solid #e5e5e5" }}>
                      Audio Tracks:
                      <div>
                        {item.audioTracks.map((track, i) => (
                          <span key={i}>
                            <Tag color="purple">{track.toUpperCase()}</Tag>
                          </span>
                        ))}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 5, border: "1px solid #e5e5e5" }}>
                      Has Hindi Audio: <Tag>{item.hasHindiAudio ? "✔️" : "❌"}</Tag>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 5, border: "1px solid #e5e5e5" }}>
                      Mentioned Resolution: <Tag color="blue">{item.mentionedResolution}</Tag>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 5, border: "1px solid #e5e5e5" }}>
                      Actual Resolution: <Tag color="geekblue">{item.actualResolution}</Tag>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 5, border: "1px solid #e5e5e5" }}>
                      Resolution Match: <Tag>{item.isResolutionMatched ? "✔️" : "❌"}</Tag>
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: 5, border: "1px solid #e5e5e5" }}>
                      Dimension: <Tag>{item.dimension}</Tag>
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
