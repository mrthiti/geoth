import { useEffect, useMemo, useState } from "react";

type Province = {
  id: number;
  nameTh?: string;
  nameEn?: string;
};

type ProvinceWithDistricts = Province & {
  districts?: District[];
};

type District = {
  id: number;
  nameTh?: string;
  nameEn?: string;
};

type DistrictWithSubdistricts = District & {
  subdistricts?: Subdistrict[];
};

type Subdistrict = {
  id: number;
  nameTh?: string;
  nameEn?: string;
  zipCode?: number;
};

type StatusMessage = {
  message: string;
  isError: boolean;
};

const BASE_URL = "";

const now = (): number =>
  typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance.now()
    : Date.now();

async function fetchJSON<T>(
  path: string,
  onStatus: (message: StatusMessage) => void,
  loadingMessage?: string,
  successMessage?: string,
): Promise<T> {
  try {
    if (loadingMessage) {
      onStatus({ message: loadingMessage, isError: false });
    }
    const start = now();
    const response = await fetch(`${BASE_URL}${path}`);
    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }
    const data = (await response.json()) as T;
    const duration = Math.round(now() - start);
    if (successMessage) {
      onStatus({
        message: `${successMessage} (${duration} มิลลิวินาที)`,
        isError: false,
      });
    } else {
      onStatus({ message: "", isError: false });
    }
    return data;
  } catch (error) {
    console.error("GeoTH demo error:", error);
    onStatus({
      message: "ไม่สามารถโหลดข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
      isError: true,
    });
    throw error;
  }
}

const Demo = () => {
  const [status, setStatus] = useState<StatusMessage>({
    message: "",
    isError: false,
  });
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [subdistricts, setSubdistricts] = useState<Subdistrict[]>([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSubdistrict, setSelectedSubdistrict] = useState("");

  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingSubdistricts, setLoadingSubdistricts] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoadingProvinces(true);
      try {
        const items = await fetchJSON<Province[]>(
          "/api/provinces/all",
          setStatus,
          "กำลังโหลดรายชื่อจังหวัด...",
          "โหลดรายชื่อจังหวัดสำเร็จ",
        );
        setProvinces(Array.isArray(items) ? items : []);
      } catch {
        setProvinces([]);
      } finally {
        setLoadingProvinces(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    setDistricts([]);
    setSelectedDistrict("");
    setSubdistricts([]);
    setSelectedSubdistrict("");

    if (!selectedProvince) {
      return;
    }

    const loadDistricts = async () => {
      setLoadingDistricts(true);
      try {
        const data = await fetchJSON<ProvinceWithDistricts>(
          `/api/provinces-with-districts/${selectedProvince}`,
          setStatus,
          "กำลังโหลดรายชื่ออำเภอ...",
          "โหลดรายชื่ออำเภอสำเร็จ",
        );
        const districtList = Array.isArray(data?.districts)
          ? (data?.districts ?? [])
          : [];
        setDistricts(districtList);
        if (districtList.length === 0) {
          setStatus({ message: "ไม่พบอำเภอในจังหวัดที่เลือก", isError: true });
        }
      } catch {
        setDistricts([]);
      } finally {
        setLoadingDistricts(false);
      }
    };

    loadDistricts();
  }, [selectedProvince]);

  useEffect(() => {
    setSubdistricts([]);
    setSelectedSubdistrict("");

    if (!selectedDistrict) {
      return;
    }

    const loadSubdistricts = async () => {
      setLoadingSubdistricts(true);
      try {
        const data = await fetchJSON<DistrictWithSubdistricts>(
          `/api/districts-with-subdistricts/${selectedDistrict}`,
          setStatus,
          "กำลังโหลดรายชื่อตำบล...",
          "โหลดรายชื่อตำบลสำเร็จ",
        );
        const subdistrictList = Array.isArray(data?.subdistricts)
          ? (data?.subdistricts ?? [])
          : [];
        setSubdistricts(subdistrictList);
        if (subdistrictList.length === 0) {
          setStatus({ message: "ไม่พบตำบลในอำเภอที่เลือก", isError: true });
        }
      } catch {
        setSubdistricts([]);
      } finally {
        setLoadingSubdistricts(false);
      }
    };

    loadSubdistricts();
  }, [selectedDistrict]);

  const provinceDetail = useMemo(
    () =>
      provinces.find((province) => String(province.id) === selectedProvince),
    [provinces, selectedProvince],
  );

  const districtDetail = useMemo(
    () =>
      districts.find((district) => String(district.id) === selectedDistrict),
    [districts, selectedDistrict],
  );

  const subdistrictDetail = useMemo(
    () =>
      subdistricts.find(
        (subdistrict) => String(subdistrict.id) === selectedSubdistrict,
      ),
    [subdistricts, selectedSubdistrict],
  );

  const resultLines = useMemo(() => {
    if (!provinceDetail) {
      return ["เลือกจังหวัด อำเภอ และตำบล เพื่อดูรายละเอียด"];
    }

    const lines: string[] = [];
    const makeLine = (label: string, nameTh?: string, nameEn?: string) =>
      `${label}: ${nameTh ?? "-"}${nameEn ? ` (${nameEn})` : ""}`;

    lines.push(
      makeLine("จังหวัด", provinceDetail.nameTh, provinceDetail.nameEn),
    );

    if (districtDetail) {
      lines.push(
        makeLine("อำเภอ/เขต", districtDetail.nameTh, districtDetail.nameEn),
      );
    }

    if (subdistrictDetail) {
      const baseLine = makeLine(
        "ตำบล/แขวง",
        subdistrictDetail.nameTh,
        subdistrictDetail.nameEn,
      );
      const zip = subdistrictDetail.zipCode
        ? ` (รหัสไปรษณีย์: ${subdistrictDetail.zipCode})`
        : "";
      lines.push(`${baseLine}${zip}`);
    }

    return lines;
  }, [provinceDetail, districtDetail, subdistrictDetail]);

  return (
    <section className="mx-auto my-10 max-w-[80%] rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold">Demo</h2>
        <p className="text-sm text-slate-600">
          ทดลองเลือกจังหวัด อำเภอ และตำบล โดยใช้ข้อมูลจาก GeoTH API
        </p>
        <div className="mt-3 text-sm text-slate-500">
          <a className="hover:underline" href="/">
            Home
          </a>{" "}
          .{" "}
          <a
            className="hover:underline"
            href="https://github.com/mrthiti/geoth"
            target="_blank"
          >
            Github
          </a>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3" data-role="form">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">จังหวัด</span>
          <select
            value={selectedProvince}
            onChange={(event) => setSelectedProvince(event.target.value)}
            className="rounded border border-slate-300 p-2 text-sm"
            disabled={loadingProvinces && provinces.length === 0}
          >
            <option value="" disabled>
              {loadingProvinces && provinces.length === 0
                ? "กำลังโหลด..."
                : "เลือกจังหวัด"}
            </option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {province.nameTh ?? province.id}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">
            อำเภอ / เขต
          </span>
          <select
            value={selectedDistrict}
            onChange={(event) => setSelectedDistrict(event.target.value)}
            className="rounded border border-slate-300 p-2 text-sm"
            disabled={
              !selectedProvince || loadingDistricts || districts.length === 0
            }
          >
            <option value="" disabled>
              {!selectedProvince
                ? "เลือกจังหวัดก่อน"
                : loadingDistricts
                  ? "กำลังโหลด..."
                  : districts.length === 0
                    ? "ไม่พบอำเภอในจังหวัดนี้"
                    : "เลือกอำเภอ / เขต"}
            </option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.nameTh ?? district.id}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">
            ตำบล / แขวง
          </span>
          <select
            value={selectedSubdistrict}
            onChange={(event) => setSelectedSubdistrict(event.target.value)}
            className="rounded border border-slate-300 p-2 text-sm"
            disabled={
              !selectedDistrict ||
              loadingSubdistricts ||
              subdistricts.length === 0
            }
          >
            <option value="" disabled>
              {!selectedDistrict
                ? "เลือกอำเภอก่อน"
                : loadingSubdistricts
                  ? "กำลังโหลด..."
                  : subdistricts.length === 0
                    ? "ไม่พบตำบลในอำเภอนี้"
                    : "เลือกตำบล / แขวง"}
            </option>
            {subdistricts.map((subdistrict) => (
              <option key={subdistrict.id} value={subdistrict.id}>
                {subdistrict.nameTh ?? subdistrict.id}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p
        className={`mt-4 text-sm ${status.isError ? "text-red-600" : "text-slate-500"}`}
        aria-live="polite"
      >
        {status.message}
      </p>

      <div className="mt-6 rounded border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <ul className="list-disc space-y-1 pl-5">
          {resultLines.map((line, index) => (
            <li key={index}>{line.replace("$$", "")}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Demo;
