import openpyxl
import requests
import re

FILE = r'C:\Users\shubh\Desktop\ipl\siddhar.xlsx'
API  = 'http://localhost:8080/api/players'

# Normalize role names to match backend expectations
def normalize_role(role):
    if not role: return 'Batsman'
    r = str(role).strip()
    if 'Wicket' in r: return 'Wicket Keeper'
    if 'All' in r:    return 'All-Rounder'
    if 'Bowl' in r:   return 'Bowler'
    return 'Batsman'

# Extract jersey size label (e.g. "Size 42 (L)" -> "L")
def normalize_size(size):
    if not size: return ''
    m = re.search(r'\((\w+)\)', str(size))
    return m.group(1) if m else str(size).strip()

# Convert Google Drive share URL to viewable URL
def drive_url(url):
    if not url: return ''
    url = str(url).strip()
    m = re.search(r'id=([^&]+)', url)
    if m: return f'https://drive.google.com/uc?export=view&id={m.group(1)}'
    m = re.search(r'/d/([^/]+)', url)
    if m: return f'https://drive.google.com/uc?export=view&id={m.group(1)}'
    return url

wb = openpyxl.load_workbook(FILE)
ws = wb.active
rows = list(ws.iter_rows(values_only=True))

# Col indices (0-based):
# 0=Timestamp, 1=Full Name, 2=Age, 3=Contact No, 4=Village,
# 5=Role, 6=Batting Style, 7=Bowling Style, 8=Jersey Name,
# 9=Jersey No, 10=Jersey Size, 11=Photograph

success = 0
failed  = 0
skipped = 0

for i, row in enumerate(rows[1:], start=2):
    if i <= 20:   # skip already imported rows
        continue
    name = str(row[1]).strip() if row[1] else ''
    if not name or name.lower() == 'none':
        skipped += 1
        continue

    age = int(float(row[2])) if row[2] else 18
    age = max(5, min(70, age))

    contact_raw = str(row[3]).strip().replace(' ', '') if row[3] else ''
    try:
        contact = str(int(float(contact_raw))) if contact_raw else ''
    except:
        contact = contact_raw
    village  = str(row[4]).strip() if row[4] else ''
    role     = normalize_role(row[5])
    batting  = str(row[6]).strip() if row[6] else ''
    bowling  = str(row[7]).strip() if row[7] else ''
    j_name   = str(row[8]).strip() if row[8] else ''
    j_num    = str(int(float(row[9]))) if row[9] else ''
    j_size   = normalize_size(row[10])
    photo    = drive_url(row[11])

    payload = {
        'playerName':    name,
        'age':           age,
        'role':          role,
        'nativePlace':   village,
        'village':       village,
        'contactNo':     contact,
        'phoneNumber':   contact,
        'battingStyle':  batting,
        'bowlingStyle':  bowling,
        'jerseyName':    j_name,
        'jerseyNumber':  j_num,
        'jerseySize':    j_size,
        'playerImage':   photo,
        'basePrice':     200,
    }

    try:
        res = requests.post(API, json=payload, timeout=10)
        if res.status_code in (200, 201):
            print(f'[OK]  Row {i}: {name}')
            success += 1
        else:
            print(f'[ERR] Row {i}: {name} -> {res.status_code} {res.text[:120]}')
            failed += 1
    except Exception as e:
        print(f'[EXC] Row {i}: {name} -> {e}')
        failed += 1

print(f'\n✅ Imported: {success}  ❌ Failed: {failed}  ⏭ Skipped: {skipped}')
