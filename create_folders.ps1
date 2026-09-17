$folders = @(
  "frontend\src\components\ui",
  "frontend\src\components\common",
  "frontend\src\components\layout",
  "frontend\src\pages\guest",
  "frontend\src\pages\student",
  "frontend\src\pages\university",
  "frontend\src\pages\admin",
  "frontend\src\hooks",
  "frontend\src\context",
  "frontend\src\services",
  "frontend\src\lib",
  "frontend\src\config",
  "frontend\src\routes",
  "frontend\src\utils",
  "frontend\src\assets\images",
  "frontend\src\assets\icons",
  "backend\src\controllers",
  "backend\src\routes",
  "backend\src\middleware",
  "backend\src\services",
  "backend\src\config",
  "backend\src\utils"
)

foreach ($f in $folders) {
  New-Item -ItemType Directory -Path $f -Force | Out-Null
}

Write-Host "All folders created successfully." -ForegroundColor Green
