const fs = require("fs");
import connectionConfig from "../config/database";

module.exports = function getPriceData(searchData) {
  const connection = connectionConfig();
  return new Promise((resolve, reject) => {
    const countiesPath = "server/counties.json";
    const districtsPath = "server/districts.json";
    let counties = {};
    let districts = {};

    Promise.all([
      connectToServer(connection),
      getRegionObj(counties, countiesPath),
      getRegionObj(districts, districtsPath),
    ])
      .then((res) => {
        counties = res[1];
        districts = res[2];
        return getDistinctRegions(connection, searchData.regionSize);
      })
      .catch((err) => {
        console.error(err);
      })
      .then((regions) => {
        return getRegionData(
          connection,
          searchData,
          regions,
          counties,
          districts
        );
      })
      .catch((err) => {
        console.error(err);
      })
      .then((regionData) => {
        return getDataSummary(searchData, regionData);
      })
      .catch((err) => {
        console.error(err);
      })
      .then((dataSummary) => {
        if (searchData.regionSize == "county") {
        }
        connection.end;
        resolve(dataSummary);
      })
      .catch((err) => {
        console.error(err);
      });
  });
};

async function getDistinctRegions(
  connection,
  identifier,
  callback = (result) => {
    return result.map((item) => item[identifier]);
  }
) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT DISTINCT ?? FROM transactions",
      identifier,
      function (err, result) {
        if (err) reject(err);
        else {
          resolve(callback(result));
        }
      }
    );
  }).catch((err) => console.error(err));
}

async function getRegionData(
  connection,
  searchData,
  regions,
  counties,
  districts
) {
  const sqlQuery =
    "SELECT price, property_type FROM transactions WHERE ?? = ? AND property_type IN (?) AND ((property_type != 'F' AND duration in (?)) OR (property_type = 'F' AND duration IN (?))) AND new_build IN (?)";
  const newBuild = searchData.newBuild;
  const propertyTypes = searchData.propertyTypes;
  const regionData = initialiseRegionData(searchData, counties, districts);
  const promises = [];
  const searchSize = searchData.regionSize;
  for (let i in regions) {
    const region = regions[i];
    let regionSize = "";
    if (region in counties && region in districts) {
      regionSize = searchSize;
    } else if (region in counties) {
      regionSize = "county";
    } else if (region in districts) {
      regionSize = "district";
    } else {
      console.log(
        `Error. Region '${region}' not found in counties or districts`
      );
    }
    promises.push(
      new Promise((resolve, reject) => {
        const sqlValues = [
          searchSize,
          region,
          propertyTypes,
          searchData.duration.house,
          searchData.duration.flat,
          newBuild,
        ];
        connection.query(sqlQuery, sqlValues, (err, result) => {
          if (err) console.error(err);
          else {
            if (regionSize === "county" && searchSize === "county") {
              regionData[counties[region].mapName] = result.reduce(
                (regionObj, item) => {
                  regionObj[item["property_type"]].push(item["price"]);
                  return regionObj;
                },
                regionData[counties[region].mapName]
              );
            } else if (regionSize === "district") {
              if (searchSize === "district") {
                regionData[districts[region].mapName] = result.reduce(
                  (regionObj, item) => {
                    regionObj[item["property_type"]].push(item["price"]);
                    return regionObj;
                  },
                  regionData[districts[region].mapName]
                );
              } else if (searchSize === "county") {
                regionData[districts[region].mapCounty] = result.reduce(
                  (regionObj, item) => {
                    regionObj[item["property_type"]].push(item["price"]);
                    return regionObj;
                  },
                  regionData[districts[region].mapCounty]
                );
              }
            }
            resolve();
          }
        });
      }).catch((err) => console.error(err))
    );
  }
  await Promise.all(promises);
  return regionData;
}

function initialiseRegionData(searchData, counties, districts) {
  const regionData = {};
  const searchSize = searchData.regionSize;
  const propertyTypes = searchData.propertyTypes;
  const propertyTypeObj = { total: [] };
  for (let i in propertyTypes) {
    const propertyType = propertyTypes[i];
    propertyTypeObj[propertyType] = [];
  }
  if (searchSize === "county") {
    for (let i in counties) {
      const county = counties[i].mapName;
      regionData[county] = JSON.parse(JSON.stringify(propertyTypeObj));
    }
  } else if (searchSize === "district") {
    for (let i in districts) {
      const district = districts[i].mapName;
      regionData[district] = JSON.parse(JSON.stringify(propertyTypeObj));
    }
  } else {
    console.error("Invalid search size");
  }
  return regionData;
}

async function getDataSummary(searchData, regionData) {
  const promises = [];
  const regions = Object.keys(regionData);
  const propertyTypes = searchData.propertyTypes;
  const dataSummary = {};
  propertyTypes.unshift("total");
  for (let i in regions) {
    const region = regions[i];
    for (let j = 1; j < propertyTypes.length; j++) {
      const propertyType = propertyTypes[j];
      regionData[region]["total"].push(...regionData[region][propertyType]);
    }
    dataSummary[region] = {};
    for (let j in propertyTypes) {
      promises.push(
        new Promise((resolve, reject) => {
          const propertyType = propertyTypes[j];
          regionData[region][propertyType].sort((a, b) => a - b);
          dataSummary[region][propertyType] = {};
          const quartiles = getQuartiles(regionData[region][propertyType]);
          dataSummary[region][propertyType]["quartiles"] = quartiles;
          const [min, max, outliers] = getMinAndMax(
            regionData[region][propertyType],
            quartiles,
            5
          );
          dataSummary[region][propertyType]["min"] = min;
          dataSummary[region][propertyType]["max"] = max;
          dataSummary[region][propertyType]["outliers"] = outliers;
          resolve();
        }).catch((err) => console.error(err))
      );
    }
  }
  await Promise.all(promises).catch((err) => {
    console.error(err);
  });
  return dataSummary;
}

function getQuartiles(arr) {
  let uqLowerLimit = 0;
  const quartiles = {
    median: "N/A",
    lq: "N/A",
    uq: "N/A",
  };
  if (arr.length === 0) {
    return quartiles;
  }
  const mid = Math.floor(arr.length / 2);
  if (arr.length % 2 === 0) {
    quartiles.median = (arr[mid - 1] + arr[mid]) / 2;
    uqLowerLimit = mid;
  } else {
    quartiles.median = arr[mid];
    uqLowerLimit = mid + 1;
  }
  if (arr.length >= 6) {
    const lqMid = Math.floor(mid / 2);
    const uqMid = arr.length - 1 - lqMid;
    if ((mid + 1) % 2 === 0) {
      quartiles.lq = (arr[lqMid] + arr[lqMid + 1]) / 2;
      quartiles.uq = (arr[uqMid - 1] + arr[uqMid]) / 2;
    } else {
      quartiles.lq = arr[lqMid];
      quartiles.uq = arr[uqMid];
    }
  }
  return quartiles;
}

function getMinAndMax(arr, quartiles, fenceMult) {
  let min = 0;
  let max = 0;
  const outliers = [];
  const iqr = quartiles.uq - quartiles.lq;
  const lGate = quartiles.lq - fenceMult * iqr;
  const uGate = quartiles.uq + fenceMult * iqr;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < lGate || arr[i] > uGate) {
      outliers.push(arr[i]);
    } else if (i === 0) {
      min = arr[i];
    } else if (i === arr.length - 1) {
      max = arr[i];
    } else if (arr[i - 1] < lGate) {
      min = arr[i];
    } else if (arr[i + 1] > uGate) {
      max = arr[i];
    }
  }
  return [min, max, outliers];
}

function getRegionObj(regionObj, objPath) {
  return new Promise((resolve, reject) => {
    fs.readFile(objPath, (err, res) => {
      if (err) reject(err);
      regionObj = JSON.parse(res);
      resolve(regionObj);
    });
  });
}

async function connectToServer(connection) {
  try {
    connection.connect((err) => {
      console.log("Connected to MySQL server!");
      return;
    });
  } catch (err) {
    return err;
  }
}
