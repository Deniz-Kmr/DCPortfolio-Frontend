Kral elle tek tek yazmayacaksın. **Frontend repo içindeyken** aşağıdaki komutu komple yapıştır; dosyanın içini otomatik dolduracak. Bu içerik backend controller/DTO çıktılarından hazırlandı.  

````bash
mkdir -p docs

cat > docs/backend-contract-audit.md <<'EOF'
# Backend Contract Audit

## Scope

This document records backend API contracts verified for frontend type and service mapping.

This audit is for frontend contract/type/service foundation only. No backend code changes are included.

## Verified Sources

- Backend controllers:
  - `DCPortfolio.API/Controllers/AuthController.cs`
  - `DCPortfolio.API/Controllers/Public/*`
  - `DCPortfolio.API/Controllers/Admin/*`
- Backend DTO folders:
  - `DCPortfolio.Shared/DTOs/Auth`
  - `DCPortfolio.Shared/DTOs/Public`
  - `DCPortfolio.Shared/DTOs/Admin`
- Backend response wrapper:
  - `DCPortfolio.Shared/ApiResponse.cs`
- Backend enum files:
  - `DCPortfolio.Core/Entities/TodoStatus.cs`
  - `DCPortfolio.Core/Entities/TodoPriority.cs`
  - `DCPortfolio.Core/Entities/RoadmapStatus.cs`

## ApiResponse Contract

Backend uses a generic response wrapper:

| Field | Type | Notes |
| --- | --- | --- |
| success | boolean | Standard success flag |
| message | string \| null | Nullable response message |
| data | T \| null | Nullable response payload |

Frontend mapping:

```ts
export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T | null;
}
````

## Auth Endpoints

`AuthController` uses `[Route("api/[controller]")]`.

| Method | Route                    | Request              | Response                    | Auth       |
| ------ | ------------------------ | -------------------- | --------------------------- | ---------- |
| POST   | `/api/auth/create-admin` | `CreateAdminRequest` | `ApiResponse<AuthResponse>` | Anonymous  |
| POST   | `/api/auth/login`        | `LoginRequest`       | `ApiResponse<AuthResponse>` | Anonymous  |
| GET    | `/api/auth/me`           | none                 | `ApiResponse<AuthUserDto>`  | Authorized |

## Public Endpoints

| Method | Route                              | Request             | Response                                  | Auth      |
| ------ | ---------------------------------- | ------------------- | ----------------------------------------- | --------- |
| GET    | `/api/public/projects`             | none                | `ApiResponse<PublicProjectListDto[]>`     | Anonymous |
| GET    | `/api/public/projects/featured`    | none                | `ApiResponse<PublicProjectListDto[]>`     | Anonymous |
| GET    | `/api/public/projects/{slug}`      | route param: `slug` | `ApiResponse<PublicProjectDetailDto>`     | Anonymous |
| GET    | `/api/public/technologies`         | none                | `ApiResponse<PublicTechnologyDto[]>`      | Anonymous |
| GET    | `/api/public/technologies/grouped` | none                | `ApiResponse<PublicTechnologyGroupDto[]>` | Anonymous |
| GET    | `/api/public/cv`                   | none                | `ApiResponse<PublicCvDto>`                | Anonymous |
| GET    | `/api/public/experiences`          | none                | `ApiResponse<PublicExperienceDto[]>`      | Anonymous |
| GET    | `/api/public/certificates`         | none                | `ApiResponse<PublicCertificateDto[]>`     | Anonymous |

## Admin Endpoints

All admin endpoints use `[Authorize(Roles = "Admin")]`.

| Method | Route                               | Request                        | Response                                     | Auth  |
| ------ | ----------------------------------- | ------------------------------ | -------------------------------------------- | ----- |
| GET    | `/api/admin/dashboard`              | none                           | `ApiResponse<AdminDashboardDto>`             | Admin |
| GET    | `/api/admin/projects`               | none                           | `ApiResponse<AdminProjectListDto[]>`         | Admin |
| GET    | `/api/admin/projects/{id}`          | route param: `id`              | `ApiResponse<AdminProjectDetailDto>`         | Admin |
| POST   | `/api/admin/projects`               | `CreateProjectRequest`         | `ApiResponse<AdminProjectDetailDto>`         | Admin |
| PUT    | `/api/admin/projects/{id}`          | `UpdateProjectRequest`         | `ApiResponse<AdminProjectDetailDto>`         | Admin |
| DELETE | `/api/admin/projects/{id}`          | route param: `id`              | `ApiResponse<boolean>`                       | Admin |
| GET    | `/api/admin/technologies`           | none                           | `ApiResponse<AdminTechnologyListDto[]>`      | Admin |
| GET    | `/api/admin/technologies/{id}`      | route param: `id`              | `ApiResponse<AdminTechnologyDetailDto>`      | Admin |
| POST   | `/api/admin/technologies`           | `CreateTechnologyRequest`      | `ApiResponse<AdminTechnologyDetailDto>`      | Admin |
| PUT    | `/api/admin/technologies/{id}`      | `UpdateTechnologyRequest`      | `ApiResponse<AdminTechnologyDetailDto>`      | Admin |
| DELETE | `/api/admin/technologies/{id}`      | route param: `id`              | `ApiResponse<boolean>`                       | Admin |
| GET    | `/api/admin/cv-profiles`            | none                           | `ApiResponse<AdminCvProfileDto[]>`           | Admin |
| GET    | `/api/admin/cv-profiles/{id}`       | route param: `id`              | `ApiResponse<AdminCvProfileDto>`             | Admin |
| POST   | `/api/admin/cv-profiles`            | `CreateCvProfileRequest`       | `ApiResponse<AdminCvProfileDto>`             | Admin |
| PUT    | `/api/admin/cv-profiles/{id}`       | `UpdateCvProfileRequest`       | `ApiResponse<AdminCvProfileDto>`             | Admin |
| DELETE | `/api/admin/cv-profiles/{id}`       | route param: `id`              | `ApiResponse<boolean>`                       | Admin |
| GET    | `/api/admin/experiences`            | none                           | `ApiResponse<AdminExperienceListDto[]>`      | Admin |
| GET    | `/api/admin/experiences/{id}`       | route param: `id`              | `ApiResponse<AdminExperienceDetailDto>`      | Admin |
| POST   | `/api/admin/experiences`            | `CreateExperienceRequest`      | `ApiResponse<AdminExperienceDetailDto>`      | Admin |
| PUT    | `/api/admin/experiences/{id}`       | `UpdateExperienceRequest`      | `ApiResponse<AdminExperienceDetailDto>`      | Admin |
| DELETE | `/api/admin/experiences/{id}`       | route param: `id`              | `ApiResponse<boolean>`                       | Admin |
| GET    | `/api/admin/certificates`           | none                           | `ApiResponse<AdminCertificateListDto[]>`     | Admin |
| GET    | `/api/admin/certificates/{id}`      | route param: `id`              | `ApiResponse<AdminCertificateDetailDto>`     | Admin |
| POST   | `/api/admin/certificates`           | `CreateCertificateRequest`     | `ApiResponse<AdminCertificateDetailDto>`     | Admin |
| PUT    | `/api/admin/certificates/{id}`      | `UpdateCertificateRequest`     | `ApiResponse<AdminCertificateDetailDto>`     | Admin |
| DELETE | `/api/admin/certificates/{id}`      | route param: `id`              | `ApiResponse<boolean>`                       | Admin |
| GET    | `/api/admin/dev-logs`               | none                           | `ApiResponse<AdminDevLogListDto[]>`          | Admin |
| GET    | `/api/admin/dev-logs/{id}`          | route param: `id`              | `ApiResponse<AdminDevLogDetailDto>`          | Admin |
| POST   | `/api/admin/dev-logs`               | `CreateDevLogRequest`          | `ApiResponse<AdminDevLogDetailDto>`          | Admin |
| PUT    | `/api/admin/dev-logs/{id}`          | `UpdateDevLogRequest`          | `ApiResponse<AdminDevLogDetailDto>`          | Admin |
| DELETE | `/api/admin/dev-logs/{id}`          | route param: `id`              | `ApiResponse<boolean>`                       | Admin |
| GET    | `/api/admin/todos`                  | none                           | `ApiResponse<AdminTodoListDto[]>`            | Admin |
| GET    | `/api/admin/todos/{id}`             | route param: `id`              | `ApiResponse<AdminTodoDetailDto>`            | Admin |
| POST   | `/api/admin/todos`                  | `CreateTodoRequest`            | `ApiResponse<AdminTodoDetailDto>`            | Admin |
| PUT    | `/api/admin/todos/{id}`             | `UpdateTodoRequest`            | `ApiResponse<AdminTodoDetailDto>`            | Admin |
| DELETE | `/api/admin/todos/{id}`             | route param: `id`              | `ApiResponse<boolean>`                       | Admin |
| GET    | `/api/admin/lessons`                | none                           | `ApiResponse<AdminLessonListDto[]>`          | Admin |
| GET    | `/api/admin/lessons/{id}`           | route param: `id`              | `ApiResponse<AdminLessonDetailDto>`          | Admin |
| POST   | `/api/admin/lessons`                | `CreateLessonRequest`          | `ApiResponse<AdminLessonDetailDto>`          | Admin |
| PUT    | `/api/admin/lessons/{id}`           | `UpdateLessonRequest`          | `ApiResponse<AdminLessonDetailDto>`          | Admin |
| DELETE | `/api/admin/lessons/{id}`           | route param: `id`              | `ApiResponse<boolean>`                       | Admin |
| GET    | `/api/admin/english-plans`          | none                           | `ApiResponse<AdminEnglishPlanListDto[]>`     | Admin |
| GET    | `/api/admin/english-plans/{id}`     | route param: `id`              | `ApiResponse<AdminEnglishPlanDetailDto>`     | Admin |
| POST   | `/api/admin/english-plans`          | `CreateEnglishPlanRequest`     | `ApiResponse<AdminEnglishPlanDetailDto>`     | Admin |
| PUT    | `/api/admin/english-plans/{id}`     | `UpdateEnglishPlanRequest`     | `ApiResponse<AdminEnglishPlanDetailDto>`     | Admin |
| DELETE | `/api/admin/english-plans/{id}`     | route param: `id`              | `ApiResponse<boolean>`                       | Admin |
| GET    | `/api/admin/learning-roadmaps`      | none                           | `ApiResponse<AdminLearningRoadmapListDto[]>` | Admin |
| GET    | `/api/admin/learning-roadmaps/{id}` | route param: `id`              | `ApiResponse<AdminLearningRoadmapDetailDto>` | Admin |
| POST   | `/api/admin/learning-roadmaps`      | `CreateLearningRoadmapRequest` | `ApiResponse<AdminLearningRoadmapDetailDto>` | Admin |
| PUT    | `/api/admin/learning-roadmaps/{id}` | `UpdateLearningRoadmapRequest` | `ApiResponse<AdminLearningRoadmapDetailDto>` | Admin |
| DELETE | `/api/admin/learning-roadmaps/{id}` | route param: `id`              | `ApiResponse<boolean>`                       | Admin |

## Dashboard Contract

`AdminDashboardDto` fields:

* `portfolioSummary`
* `trackingSummary`
* `todoSummary`
* `roadmapSummary`
* `recentDevLogs`
* `recentTodos`
* `recentLessons`
* `activeEnglishPlans`
* `generatedAt`

Nested DTOs:

* `AdminPortfolioSummaryDto`
* `AdminTrackingSummaryDto`
* `AdminTodoSummaryDto`
* `AdminRoadmapSummaryDto`
* `AdminRecentDevLogDto`
* `AdminRecentTodoDto`
* `AdminRecentLessonDto`
* `AdminActiveEnglishPlanDto`

## Public DTO Mapping Notes

Public project contracts:

* `PublicProjectListDto`
* `PublicProjectDetailDto`
* `PublicProjectTechnologyDto`

Public technology contracts:

* `PublicTechnologyDto`
* `PublicTechnologyGroupDto`

Public CV contracts:

* `PublicCvDto`
* `PublicCvProfileDto`
* `PublicExperienceDto`

Public certificate contract:

* `PublicCertificateDto`

Mapping decisions:

* C# PascalCase fields are mapped to camelCase JSON fields in TypeScript.
* `DateTime` maps to `string`.
* `DateTime?` maps to `string | null`.
* Nullable strings map to `string | null`.
* Non-null backend strings map to `string`.
* Public CV profile can be null as `profile: PublicCvProfile | null`.

## Admin DTO Mapping Notes

Admin DTO groups verified:

* Projects
* Technologies
* CV profiles
* Experiences
* Certificates
* DevLogs
* Todos
* Lessons
* EnglishPlans
* LearningRoadmaps
* Dashboard

Mapping decisions:

* Request DTOs and response DTOs are separate.
* Create and update request DTOs are separate.
* Delete endpoints return `ApiResponse<boolean>`.
* No frontend-only fields are added.
* Soft-delete fields are not exposed in verified DTOs, so they are not mapped.

## Enum Mapping Notes

Backend enum declarations:

```csharp
TodoStatus
{
    Todo = 0,
    InProgress = 1,
    Done = 2,
    Cancelled = 3
}

TodoPriority
{
    Low = 0,
    Medium = 1,
    High = 2
}

RoadmapStatus
{
    Planned = 0,
    InProgress = 1,
    Completed = 2,
    Paused = 3
}
```

Verified DTOs expose these values as strings.

Frontend mapping decision:

```ts
export type TodoStatus = 'Todo' | 'InProgress' | 'Done' | 'Cancelled';
export type TodoPriority = 'Low' | 'Medium' | 'High';
export type RoadmapStatus = 'Planned' | 'InProgress' | 'Completed' | 'Paused';
```

Other fields like category, level, skillLevel, topic, focusArea, and tags remain `string` or `string | null`.

## Static CV

Static CV file route:

```text
/files/cv/deniz-celik-cv.pdf
```

This is not an API route and should not be included under `apiRoutes`.

## Open Questions

* Swagger should visually confirm whether `api/[controller]` for `AuthController` is displayed as `/api/auth` or `/api/Auth`. Frontend will use lowercase `/api/auth` because it matches the existing backend route convention.
* No public endpoint was found for lessons, dev logs, todos, English plans, or learning roadmaps. They remain admin-only for this prompt.
  EOF

````