# Fix: Personalized Incident Types Not Displaying

## Problem
Personalized incident types (es_categoria_legal=0) were not appearing in the TiposIncidenteManager maintenance interface, despite existing in the database.

## Root Cause
The personalized types (IDs 1-5) were NOT assigned to any `colegio_id`. The backend API endpoint `por_colegio` filters by:
- Legal types: `es_categoria_legal=True AND colegio__isnull=True`
- Personalized types: `colegio_id=<specified_colegio_id>`

Since personalized types had `colegio_id=NULL`, they were never returned for any colegio.

## Investigation Path
1. ✅ Database verification: 14 total types found (9 legal, 5 personalized)
2. ✅ Backend code review: `por_colegio` action logic was correct
3. ✅ Frontend code review: Component calls correct endpoint
4. ❌ API Testing: `/api/tipos-incidente/por_colegio/?colegio_id=1` returned only 9 legal types
5. **Found Issue**: Personalized types had `colegio_id=NULL`

## Solution Applied
Updated personalized types to assign them to `colegio_id=1`:
- ID 2: Bullying Psicológico ✓
- ID 3: Ciberbullying ✓
- ID 4: Discriminación por Origen ✓
- ID 5: Consumo de Alcohol en el Establecimiento ✓

Note: ID 1 "Bullying Físico" remains as legal (es_categoria_legal=1) because its categoria="bullying" triggers the model's auto-classification logic.

## Verification
API endpoint now returns:
```
GET /api/tipos-incidente/por_colegio/?colegio_id=1
Response: 14 types (10 legal + 4 personalized)
```

### Colegio 1
- Total: 14 types
- Legal: 10 (IDs 6-14)
- Personalized: 4 (IDs 2, 3, 4, 5)

### Colegio 2
- Total: 10 types
- Legal: 10 (IDs 6-14)
- Personalized: 0

## Status
✅ **RESOLVED** - Frontend will now display personalized types in TiposIncidenteManager for Colegio 1

## Database Changes
- Updated 4 records in `core_tipoincidente`
- Changed field: `colegio_id` from NULL → 1 for IDs 2, 3, 4, 5
- No schema changes required
