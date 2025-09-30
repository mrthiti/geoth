# GeoTH 🇹🇭 (API ข้อมูล จังหวัด, อําเภอ, ตำบล และรหัสไปรษณีย์)

Static API ข้อมูล **จังหวัด, อําเภอ, ตำบล และรหัสไปรษณีย์** ทั้งหมดของประเทศไทย เราทําออกมาเป็นแบบ static และ host บน Cloudflare ทําให้ response เร็วมาก รองรับ Concurrent สูงๆ ได้เป็นอย่างดี

### Demo

ลองเข้าไปดู Demo กันก่อนได้ที่นี่ครับ [https://geoth.pages.dev/demo](https://geoth.pages.dev/demo/)

### Quick Start

สําหรับวิธีการใช้งาน GeoTH API ไม่ยากครับ เราจะใช้เฉพาะ **Method GET** เท่านั้น โดยจะแยกเป็น Route ต่างๆดังนี้

**ดึงข้อมูล จังหวัดทั้งหมด**

```text
https://geoth.pages.dev/api/provinces/all
```

**ดึงข้อมูล จังหวัดพร้อมอําเภอในจังหวัดนั้นๆ**

```text
https://geoth.pages.dev/api/provinces-with-districts/all
```

**ดึงข้อมูล จังหวัดโดยระบุรหัสจังหวัด**

```text
https://geoth.pages.dev/api/provinces/[รหัสจังหวัด]
```

**ดึงข้อมูล จังหวัดพร้อมอําเภอในจังหวัดนั้นๆ โดยระบุรหัสจังหวัด**

```text
https://geoth.pages.dev/api/provinces-with-districts/[รหัสจังหวัด]
```

**ดึงข้อมูล อำเภอทั้งหมด**

```text
https://geoth.pages.dev/api/districts/all
```

**ดึงข้อมูล อำเภอพร้อมรายชื่อตําบลในอำเภอนั้นๆ**

```text
https://geoth.pages.dev/api/districts-with-subdistricts/all
```

**ดึงข้อมูล อำเภอ โดยระบุรหัสอำเภอ**

```text
https://geoth.pages.dev/api/districts/[รหัสอำเภอ]
```

**ดึงข้อมูล อำเภอพร้อมรายชื่อตําบลในอำเภอนั้นๆ โดยระบุรหัสอำเภอ**

```text
https://geoth.pages.dev/api/districts-with-subdistricts/[รหัสอำเภอ]
```

**ดึงข้อมูล ตําบลทั้งหมด**

```text
https://geoth.pages.dev/api/subdistricts/all
```

**ดึงข้อมูล ตําบล โดยระบุรหัสตําบล**

```text
https://geoth.pages.dev/api/subdistricts/[รหัสตําบล]
```

**ดึงข้อมูล ภูมิภาค (Geography) ทั้งหมด**

```text
https://geoth.pages.dev/api/geographies/all
```

**ดึงข้อมูล ภูมิภาคพร้อมรายชื่อจังหวัดในภูมิภาคนั้น**

```text
https://geoth.pages.dev/api/geographies-with-provinces/all
```

**ดึงข้อมูล ภูมิภาค โดยระบุรหัสภูมิภาค**

```text
https://geoth.pages.dev/api/geographies/[รหัสภูมิภาค]
```

**ดึงข้อมูล ภูมิภาคพร้อมรายชื่อจังหวัด โดยระบุรหัสภูมิภาค**

```text
https://geoth.pages.dev/api/geographies-with-provinces/[รหัสภูมิภาค]
```

**ตัวอย่างการใช้งานด้วย curl**

```bash
curl -s https://geoth.pages.dev/api/provinces/all
```
