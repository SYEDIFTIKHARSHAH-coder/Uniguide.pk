$clientFolders = @('assets', 'components\ui', 'pages', 'layouts', 'routes', 'hooks', 'context', 'services', 'api', 'firebase', 'utils', 'constants', 'styles', 'lib')
foreach ($f in $clientFolders) { New-Item -ItemType Directory -Path "client\src\$f" -Force | Out-Null }

$serverFolders = @('controllers', 'routes', 'middleware', 'services', 'repositories', 'validators', 'config', 'firebase', 'utils')
foreach ($f in $serverFolders) { New-Item -ItemType Directory -Path "server\$f" -Force | Out-Null }
Write-Host "Folders created." -ForegroundColor Green
