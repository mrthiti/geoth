import geographies from "../../../data/geographies.json";
import provinces from "../../../data/provinces.json";
import districts from "../../../data/districts.json";
import subdistricts from "../../../data/subDistricts.json";

const GeoName = {
  geographies: "geographies",
  geographiesWithProvinces: "geographies-with-provinces",
  provinces: "provinces",
  provincesWithDistricts: "provinces-with-districts",
  districts: "districts",
  districtsWithSubdistricts: "districts-with-subdistricts",
  subdistricts: "subdistricts",
};

const getAllGeographies = () => {
  return geographies;
};

const getGeographyById = (id: number) => {
  return getAllGeographies().find((it: any) => it.id == id);
};

const getAllGeographiesWithProvinces = () => {
  return geographies.map((geography) => {
    const provinceInGeography = provinces.filter(
      (province) => province.geographyId === geography.id,
    );
    const enrichedProvinces = provinceInGeography.map(
      ({ geographyId, ...province }) => province,
    );
    return {
      ...geography,
      provinces: provinceInGeography ? enrichedProvinces : [],
    };
  });
};

const getGeographyByIdWithProvinces = (id: number) => {
  return getAllGeographiesWithProvinces().find((it) => it.id == id);
};

const getAllProvinces = () => {
  return provinces.map(({ geographyId, ...province }) => province);
};

const getProvinceById = (id: number) => {
  return getAllProvinces().find((it) => it.id == id);
};

const getAllProvincesWithDistricts = () => {
  return provinces.map((province) => {
    const districtInProvince = districts.filter(
      (district) => district.provinceId === province.id,
    );
    const enrichedDistricts = districtInProvince.map(
      ({ provinceId, ...district }) => district,
    );
    return {
      ...province,
      districts: districtInProvince ? enrichedDistricts : [],
    };
  });
};

const getProvinceByIdWithDistricts = (id: number) => {
  return getAllProvincesWithDistricts().find((it) => it.id == id);
};

const getAllDistricts = () => {
  return districts.map(({ provinceId, ...district }) => district);
};

const getDistrictById = (id: number) => {
  return getAllDistricts().find((it) => it.id == id);
};

const getAllDistrictsWithSubdistricts = () => {
  return districts.map((district) => {
    const subDistrictInDistrict = subdistricts.filter(
      (subdistrict) => subdistrict.districtId === district.id,
    );
    const enrichedSubDistricts = subDistrictInDistrict.map(
      ({ districtId, ...subdistrict }) => subdistrict,
    );
    return {
      ...district,
      subdistricts: subDistrictInDistrict ? enrichedSubDistricts : [],
    };
  });
};

const getDistrictByIdWithSubdistricts = (id: number) => {
  return getAllDistrictsWithSubdistricts().find((it) => it.id == id);
};

const getAllSubdistricts = () => {
  return subdistricts.map(({ districtId, ...subdistrict }) => subdistrict);
};

const getSubdistrictById = (id: number) => {
  return getAllSubdistricts().find((it) => it.id == id);
};

const res = (data: any) => {
  return new Response(JSON.stringify(data), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
};

export function getStaticPaths() {
  const geographiesStaticPaths = geographies.map((geography) => ({
    params: { geo: GeoName.geographies, id: String(geography.id) },
  }));
  const geographiesWithProvincesStaticPaths = geographies.map((geography) => ({
    params: { geo: GeoName.geographiesWithProvinces, id: String(geography.id) },
  }));

  const provincesStaticPaths = provinces.map((province) => ({
    params: { geo: GeoName.provinces, id: String(province.id) },
  }));
  const provincesWithDistrictsStaticPaths = provinces.map((province) => ({
    params: { geo: GeoName.provincesWithDistricts, id: String(province.id) },
  }));

  const districtsStaticPaths = districts.map((district) => ({
    params: { geo: GeoName.districts, id: String(district.id) },
  }));
  const districtsWithSubdistrictsStaticPaths = districts.map((district) => ({
    params: { geo: GeoName.districtsWithSubdistricts, id: String(district.id) },
  }));

  const subdistrictsStaticPaths = subdistricts.map((subdistrict) => ({
    params: { geo: GeoName.subdistricts, id: String(subdistrict.id) },
  }));

  const allStaticPaths = [
    ...geographiesStaticPaths,
    ...geographiesWithProvincesStaticPaths,
    ...[{ params: { geo: GeoName.geographies, id: "all" } }],
    ...[{ params: { geo: GeoName.geographiesWithProvinces, id: "all" } }],
    ...provincesStaticPaths,
    ...provincesWithDistrictsStaticPaths,
    ...[{ params: { geo: GeoName.provinces, id: "all" } }],
    ...[{ params: { geo: GeoName.provincesWithDistricts, id: "all" } }],
    ...districtsStaticPaths,
    ...districtsWithSubdistrictsStaticPaths,
    ...[{ params: { geo: GeoName.districts, id: "all" } }],
    ...[{ params: { geo: GeoName.districtsWithSubdistricts, id: "all" } }],
    ...subdistrictsStaticPaths,
    ...[{ params: { geo: GeoName.subdistricts, id: "all" } }],
  ];

  return allStaticPaths;
}

export async function GET({ params }: any) {
  const { geo, id } = params;

  switch (geo) {
    case GeoName.geographies:
      return res(
        id === "all" ? getAllGeographies() : getGeographyById(Number(id)),
      );
    case GeoName.geographiesWithProvinces:
      return res(
        id === "all"
          ? getAllGeographiesWithProvinces()
          : getGeographyByIdWithProvinces(Number(id)),
      );
    case GeoName.provinces:
      return res(
        id === "all" ? getAllProvinces() : getProvinceById(Number(id)),
      );
    case GeoName.provincesWithDistricts:
      return res(
        id === "all"
          ? getAllProvincesWithDistricts()
          : getProvinceByIdWithDistricts(Number(id)),
      );
    case GeoName.districts:
      return res(
        id === "all" ? getAllDistricts() : getDistrictById(Number(id)),
      );
    case GeoName.districtsWithSubdistricts:
      return res(
        id === "all"
          ? getAllDistrictsWithSubdistricts()
          : getDistrictByIdWithSubdistricts(Number(id)),
      );
    case GeoName.subdistricts:
      return res(
        id === "all" ? getAllSubdistricts() : getSubdistrictById(Number(id)),
      );
  }
}
