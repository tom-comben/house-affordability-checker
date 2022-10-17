import countyMockData from "assets/mockData/county.json";
import districtMockData from "assets/mockData/district.json";

const getPriceData = (searchData) => {
  return new Promise((resolve, reject) => {
    if (process.env.DB_CONNECTION === "mysql") {
      fetch("/api", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(searchData),
      })
        .then((res) => {
          resolve(res.json());
        })
        .catch((err) => {
          reject(err);
        });
    } else {
      const priceData =
        searchData.regionSize === "county" ? countyMockData : districtMockData;
      resolve(priceData);
    }
  });
};

export default { getPriceData };
