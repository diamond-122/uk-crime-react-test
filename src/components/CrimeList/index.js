import React, { useEffect, useState } from "react";
import { Table } from "antd";
import axios from "../../api/RequestInterceptor";
import "./styles.css";

const CrimeList = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);
  const date = "2020-01";
  const selectedForce = "surrey";

  useEffect(() => {
    (async () => {
      try {
        const categoriesResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}crime-categories?date=${date}`
        );
        const dataResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}crimes-no-location?category=${categoriesResponse.data[0]?.url || ""}&force=${selectedForce}&date=${date}`
        );

        setData(dataResponse.data);
        setCategories(categoriesResponse.data);
        setSelectedCategory(categoriesResponse.data[0]?.url || "");
      } catch (error) {
        console.error(error);
      }
    })();
  }, [date, selectedCategory, selectedForce]);

  useEffect(() => {
    (async () => {
      try {
        const dataResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}crimes-no-location?category=${selectedCategory}&force=${selectedForce}&date=${date}`
        );

        setData(dataResponse.data);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [selectedCategory, date, selectedForce]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const columns = [
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Month",
      dataIndex: "month",
      key: "month",
    },
    {
      title: "Outcome",
      key: "outcome",
      render: (_, record) => <span>{record.outcome_status.category}</span>,
    },
  ];
  return (
    <div>
      <h2>UK CRIME TRACING APP</h2>
      <select
        className={`select`}
        onChange={handleCategoryChange}
        value={selectedCategory}
      >
        {categories.map((category, categoryIndex) => (
          <option key={categoryIndex} value={category.url}>
            {category.name}
          </option>
        ))}
      </select>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default CrimeList;
