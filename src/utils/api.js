import countyMockData from "assets/mockData/county.json";
import districtMockData from "assets/mockData/district.json";

const getPriceData = (searchData) => {
  return new Promise((resolve, reject) => {
    if (process.env.DB_CONNECTION === "mysql") {
      fetch("/api", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchData),
      })
        .then((res) => {
          if (res.status != 200) {
            reject(res);
          }
          return res.json();
        })
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    } else {
      try {
        resolve(getMockData(searchData));
      } catch (err) {
        reject(err);
      }
    }
  });
};

const getMockData = (searchData) => {
  const priceData =
    searchData.regionSize === "county" ? countyMockData : districtMockData;
  return priceData;
};

export default { getPriceData };
